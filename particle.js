var particle = {

  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  ax: 0,
  ay: 0,
  radius: 10,
  mass: 1,
  friction: 1,
  gravity: 0,
  internalTime: 0,

  create: function (x, y, speed, direction, gravity, friction) { //gravity is/should be G * mass of planet/radius of planet (squared)
    var obj = Object.create(this);
    obj.x = x;
    obj.y = y;
    obj.vx = Math.cos(direction) * speed;
    obj.vy = Math.sin(direction) * speed;
    obj.ax = 0;
    obj.ay = 0;
    obj.gravity = gravity || 0;
    obj.friction = friction || 1;
    obj.internalTime = 0;
    return obj;
  },

  getSpeed: function () {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  },

  setSpeed: function (speed) {
    var heading = this.getHeading();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  },

  getHeading: function () {
    return Math.atan2(this.vy, this.vx);
  },

  setHeading: function (heading) {
    var speed = this.getSpeed();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  },

  setSpeedDirection: function (speed, direction) {
    this.vx = Math.cos(direction) * speed;
    this.vy = Math.sin(direction) * speed;
  },

  applyForce: function (ax, ay) {
    //as force is accumalated we will add these forces and
    //we will reset it in last update method
    ax /= this.mass;
    ay /= this.mass;
    this.ax += ax;
    this.ay += ay;
  },

  update: function (deltaTime) {
    // this.handleSprings();
    // this.handleGravity();
    this.ay += this.gravity * this.mass;
    this.ax *= this.friction;
    this.ay *= this.friction;
    this.vx += this.ax * deltaTime;
    this.vy += this.ay * deltaTime;
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    this.ax = 0; this.ay = 0;
  }


};
