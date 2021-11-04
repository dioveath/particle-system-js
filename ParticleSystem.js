var particleEffect = {
  x: 0, y: 0,
  allParticles: [],
  maxParticles: 100,
  duration: 4,
  preFilled: false,
  isLoop: false,

  minSize: 1,
  maxSize: 6,
  minSpeed: 50,
  maxSpeed: 100,
  minAngle: 0,
  maxAngle: Math.PI * 2,

  gravity: 0,
  friction: 1,


  // TODO: BIRTH RATE CAN BE ADDED TOO :D)DF)JD
  // Reminder:: preRandomized
  // create object and set its default or passed value & return
  create: function(x, y, maxParticles, duration, preFilled, isLoop, minSize, maxSize, minSpeed, maxSpeed, minAngle, maxAngle, gravity, friction){
    var pObject = Object.create(this);
    pObject.x = x;
    pObject.y = y;
    pObject.allParticles = [];
    pObject.maxParticles = maxParticles != undefined ? maxParticles : this.maxParticles;
    pObject.duration = duration != undefined ? duration : this.duration;
    pObject.preFilled = preFilled != undefined ? preFilled : this.preFilled;
    pObject.isLoop = isLoop != undefined ? isLoop : this.isLoop;

    pObject.minSize = minSize || this.minSize;
    pObject.maxSize = maxSize || this.maxSize;
    pObject.minSpeed = minSpeed != undefined ? minSpeed : this.minSpeed;
    pObject.maxSpeed = maxSpeed != undefined ? maxSpeed : this.maxSpeed;
    pObject.minAngle = minAngle != undefined ? minAngle : this.minAngle;
    pObject.maxAngle = maxAngle != undefined ? maxAngle : this.maxAngle;

    pObject.gravity = gravity != undefined ? gravity : this.gravity;
    pObject.friction = friction != undefined ? friction : this.friction;

    if(pObject.preFilled){
      for(var i = 0; i < pObject.maxParticles; i++){
        var p = ParticlePool.newParticle();
        var speed = utils.randomRange(pObject.minSpeed, pObject.maxSpeed);
        var direction = utils.randomRange(pObject.minAngle, pObject.maxAngle);

        p.x = pObject.x;
        p.y = pObject.y;
        p.internalTime = 0;

        p.radius = utils.randomRange(pObject.minSize, pObject.maxSize);
        p.mass = p.radius;
        p.setSpeedDirection(speed, direction);

        p.gravity = pObject.gravity;
        p.friction = pObject.friction;

        pObject.allParticles.push(p);
      }
    }


    // for(var i = 0; i < pObject.maxParticles; i++){
    //   var p = ParticlePool.newParticle();
    //   var speed = utils.randomRange(pObject.minSpeed, pObject.maxSpeed);
    //   var direction = utils.randomRange(pObject.minAngle, pObject.maxAngle);
    //
    //   if(pObject.preRandomized){
    //     p.internalTime = utils.randomRange(0, pObject.duration);
    //     p.x = pObject.x + Math.cos(direction) * speed * p.internalTime;
    //     p.y = pObject.y + Math.sin(direction) * speed * p.internalTime;
    //     p.radius = utils.randomRange(pObject.minSize, pObject.maxSize);
    //     p.mass = p.radius;
    //     p.setSpeedDirection(speed, direction);
    //
    //   } else {
    //     p.x = pObject.x;
    //     p.y = pObject.y;
    //     p.internalTime = 0;
    //   }
    //   p.radius = utils.randomRange(pObject.minSize, pObject.maxSize);
    //   p.mass = p.radius;
    //   p.setSpeedDirection(speed, direction);
    //
    //   pObject.allParticles.push(p);
    // }

    return pObject;
  },

  randomize: function(){
    for(var i = this.allParticles.length - 1; i >= 0; i--){
      var p = this.allParticles[i];
      var speed = utils.randomRange(this.minSpeed, this.maxSpeed);
      var direction = utils.randomRange(this.minAngle, this.maxAngle);

      p.gravity = this.gravity;
      p.friction = this.friction;

      p.internalTime = utils.randomRange(0, this.duration);
      p.x = this.x + Math.cos(direction) * speed * p.internalTime * p.friction;
      p.y = this.y + Math.sin(direction) * speed * p.internalTime * p.friction;

      p.radius = utils.randomRange(this.minSize, this.maxSize);
      p.setSpeedDirection(speed, direction);
      p.mass = p.radius;

    }
  },

  update: function(deltaTime){
    for(var i = this.allParticles.length - 1; i >= 0; i--){
      var p = this.allParticles[i];
      p.internalTime += deltaTime;
      p.update(deltaTime);
      var dx = p.x - this.x;
      var dy = p.y - this.y;
      if(p.internalTime > this.duration){
        if(this.isLoop){
          this.resetParticle(p);
        } else {
          ParticlePool.recycleParticle(this.allParticles.splice(i, 1)[0]);
        }
      }
      // To Recycle based on distance
      // if((dx * dx + dy * dy) > this.duration * this.duration){
      //   if(this.isLoop){this.resetParticle(p);} else {
      //     ParticlePool.recycleParticle(this.allParticles.splice(i, 1)[0]);
      //   }
      // }
    }
  },

  applyVortex: function(vortex){
    for(var i = this.allParticles.length - 1; i >= 0; i--){
      var p = this.allParticles[i];
      var dx = p.x - vortex.x;
      var dy = p.y - vortex.y;
      var vx = -dy * 20;
      var vy = dx * 20;
      var factor = 1 / (1 + (dx * dx + dy * dy)/vortex.scale);
      p.vx += (vx - p.vx) * factor;
      p.vy += (vy - p.vy) * factor;
    }
  },

  applyForce: function(ax, ay){
    for(var i = this.allParticles.length -1; i>=0; i--){
      var p = this.allParticles[i];
      p.applyForce(ax, ay);
    }
  },

  setGravity: function(gravity){
    this.gravity = gravity;
    for(var i = this.allParticles.length -1; i>=0; i--){
      var p = this.allParticles[i];
      p.gravity = gravity;
    }
  },

  setFriction: function(friction){
    this.friction = friction;
    for(var i = this.allParticles.length -1; i>=0; i--){
      var p = this.allParticles[i];
      p.friction = friction;
    }
  },

  resetParticle: function(p){
    p.x = this.x;
    p.y = this.y;
    p.setSpeedDirection(utils.randomRange(this.minSpeed, this.maxSpeed),
    utils.randomRange(this.minAngle, this.maxAngle));

    p.internalTime = 0;
    p.radius = utils.randomRange(this.minSize, this.maxSize);
    p.mass = p.radius;

    p.gravity = this.gravity;
    p.friction = this.friction;
  },

  resetEffect: function(x, y){
    this.x = x || this.x;
    this.y = y || this.y;
    for(var currentNumParticles = this.allParticles.length; currentNumParticles < this.maxParticles; currentNumParticles++){
      var p = ParticlePool.newParticle();
      this.allParticles.push(p);
    }
    for(var i = this.allParticles.length - 1; i >= 0; i--){
      this.resetParticle(this.allParticles[i]);
    }
  },

  isFinished: function(){
    if(this.isLoop) return false;
    return (this.allParticles.length == 0);
  }

};


var ParticlePool = {

  allParticles: [],
  freeParticles: [],
  maxSize: 100000,

  init: function(){
    for(var i = 0; i < this.maxSize; i++){
      this.freeParticles.push(particle.create(0, 0, 10, 0));
    }
  },

  newParticle: function(){
    if(this.freeParticles.length > 0){
      return this.freeParticles.pop();
    } else {
      return particle.create();
    }
  },

  recycleParticle: function(p){
    if(this.freeParticles.length < this.maxSize){
      this.freeParticles.push(p);
    }
  }

};
