window.onload = function(){

  var canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  width = canvas.width = window.innerWidth,
  height = canvas.height = window.innerHeight;

  var startTime = new Date();

  ParticlePool.init();

  var pEffect = particleEffect.create(width/2, height/2, 2000, 4, true, true, 2, 6, 0, 100, 0, -Math.PI);
  pEffect.randomize();
  // pEffect.numParticles = 1000;
  // pEffect.resetEffect();
  // pEffect.isLoop = true;
  // pEffect.duration = 15;
  pEffect.setGravity(100);
  pEffect.setFriction(0.8);

  var allParticleEffects = [];
  allParticleEffects.push(pEffect);

  var vortex = {
    x: 0, y: 0,
    prevx: 0, prevy: 0,
    scale: 50,

    getSpeed: function(){
      var dx = this.prevx - this.x;
      var dy = this.prevy - this.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  };


  var Wind = {
    x: 0,
    y: 0,
    targetx: 0,
    targety: 0,
    rangeValue: 500,
    tLerpValue: 0,
    tTime: 0,
    timeRange: 1,
    stormRange: 0.05,

    update: function(deltaTime){
      this.tLerpValue += (1/this.tTime) * deltaTime; //1 is the distance of lerp
      if(this.tLerpValue <= 1){
        this.x = utils.lerp(this.tLerpValue, this.x, this.targetx);
        this.y = utils.lerp(this.tLerpValue, this.y, this.targety);
      } else {
        if(Math.random() * 1 < this.stormRange){
          this.targetx = utils.randomRange(-this.rangeValue * 3, this.rangeValue * 3);
          this.targety = utils.randomRange(-this.rangeValue * 3, this.rangeValue * 3);
          this.tLerpValue = 0;
          this.tTime = utils.randomRange(0, this.timeRange/3);
        } else {
          this.targetx = utils.randomRange(-this.rangeValue, this.rangeValue);
          this.targety = utils.randomRange(-this.rangeValue, this.rangeValue);
          this.tLerpValue = 0;
          this.tTime = utils.randomRange(0, this.timeRange);
        }
      }
    }

  };

  var airBlowAngle = Math.PI/2;
  var airBlowThrust = 2000;

  var numTimes = 1;

  update();
  function update(){

    var deltaTime = (new Date() - startTime) /1000;
    startTime = new Date();
    if(deltaTime > 0.1) deltaTime = 0.1;

    Wind.update(deltaTime);

    for(var j = 0; j < numTimes; j++){
      for(var i = allParticleEffects.length - 1; i >= 0; i --){
        allParticleEffects[i].applyVortex(vortex);
        allParticleEffects[i].applyForce(Wind.x, Wind.y);
        allParticleEffects[i].update(deltaTime);
      }
    }

    // pEffect.applyForce(Math.cos(airBlowAngle) * airBlowThrust, Math.sin(airBlowAngle) * airBlowThrust);
    airBlowThrust = 0;
    // pEffect.update(deltaTime);

    context.fillStyle = "rgba(0, 0, 0, 1)";
    context.fillRect(0, 0, width, height);
    for(var j = allParticleEffects.length - 1; j >= 0; j --){
      var effect = allParticleEffects[j];
      for(var i = 0; i < effect.allParticles.length; i++){
        var p = effect.allParticles[i];
        var alpha = p.internalTime/effect.duration;
        var color = "rgba(255, 0, " + Math.floor((1-alpha) * 255) + ", " + (1 - Math.round(alpha*100)/100) + ")";
        context.fillStyle = color;
        context.beginPath();
        context.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
        context.fill();
      }

    }




    requestAnimationFrame(update);
  }



  document.addEventListener("click", function(e){
    if(numTimes == 50){
      numTimes = 1;
    } else {
      numTimes = 50;
    }
  },false);

  document.addEventListener("mousemove", function(e){
    vortex.prevx = vortex.x;
    vortex.prevy = vortex.y;
    vortex.x = e.clientX;
    vortex.y = e.clientY;
  }, false);


};
