window.onload = function(){

  var canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  width = canvas.width = window.innerWidth,
  height = canvas.height = window.innerHeight;

  var startTime = new Date();

  ParticlePool.init();

  var allParticleEffects = [];

  var numParticles = document.getElementById("numParticles");
  var numParticlesOutput = document.getElementById("numParticlesOutput");
  numParticles.oninput = function(){numParticlesOutput.innerHTML = "Number of Particles : " + this.value; resetEffect();};

  var particleMinSize = document.getElementById("particleMinSize");
  var particleMinSizeOutput = document.getElementById("particleMinSizeOutput");
  particleMinSize.oninput = function(){particleMinSizeOutput.innerHTML = "Particle Min Size: " + this.value; resetEffect();};

  var particleMaxSize = document.getElementById("particleMaxSize");
  var particleMaxSizeOutput = document.getElementById("particleMaxSizeOutput");
  particleMaxSize.oninput = function(){particleMaxSizeOutput.innerHTML = "Particle Max Size: " + this.value; resetEffect();};

  var particleMinSpeed = document.getElementById("particleMinSpeed");
  var particleMinSpeedOutput = document.getElementById("particleMinSpeedOutput");
  particleMinSpeed.oninput = function(){particleMinSpeedOutput.innerHTML = "Particle Min Speed: " + this.value; resetEffect();};

  var particleMaxSpeed = document.getElementById("particleMaxSpeed");
  var particleMaxSpeedOutput = document.getElementById("particleMaxSpeedOutput");
  particleMaxSpeed.oninput = function(){particleMaxSpeedOutput.innerHTML = "Particle Max Speed: " + this.value; resetEffect();};

  var particleMinAngle = document.getElementById("particleMinAngle");
  var particleMinAngleOutput = document.getElementById("particleMinAngleOutput");
  particleMinAngle.oninput = function(){particleMinAngleOutput.innerHTML = "Particle Min Angle: " + this.value; resetEffect();};

  var particleMaxAngle = document.getElementById("particleMaxAngle");
  var particleMaxAngleOutput = document.getElementById("particleMaxAngleOutput");
  particleMaxAngle.oninput = function(){particleMaxAngleOutput.innerHTML = "Particle Max Angle: " + this.value; resetEffect();};

  var duration = document.getElementById("duration");
  var durationOutput = document.getElementById("durationOutput");
  duration.oninput = function(){durationOutput.innerHTML = "Particle Duration: " + this.value; resetEffect();};

  var gravity = document.getElementById("gravity");
  var gravityOutput = document.getElementById("gravityOutput");
  gravity.oninput = function(){gravityOutput.innerHTML = "Particle Gravity: " + this.value; resetEffect();};


  var pEffect = particleEffect.create(width/2, height/2, numParticles.value,
    particleMinSize.value,  particleMaxSize.value,
    particleMinSpeed.value, particleMaxSpeed.value,
    particleMinAngle.value/180 * Math.PI, particleMaxAngle.value/180 * Math.PI,
    duration.value, gravity.value, true);

  var len = pEffect.allParticles.length;
  for(var i = 0; i < len; i++){
    pEffect.allParticles[i].color = "rgba(" + Math.floor(Math.random() * 255) + ", " +Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ", " + Math.random() + ")";
  }

  allParticleEffects.push(pEffect);

  update();

  function update(){
    context.clearRect(0, 0, width, height);

    var deltaTime = (new Date() - startTime)/1000;
    startTime = new Date();

    if(deltaTime > 0.1){
      deltaTime = 0.1;
    }

    for(var i = allParticleEffects.length - 1; i >= 0; i--){
      var currentEffect = allParticleEffects[i];
      if(currentEffect.isFinished()){
        allParticleEffects.splice(i, 1);
        continue;
      }
      currentEffect.update(deltaTime);
    }

    for(var i = 0; i < allParticleEffects.length; i++){
      var particleSet = allParticleEffects[i].allParticles;
      for(var j = 0; j < particleSet.length; j++){
        var p = particleSet[j];
        context.fillStyle = p.color;
        context.strokeStyle = p.color;
        context.beginPath();
        // context.rect(p.x-p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
        context.arc(p.x, p.y, p.radius, 0, Math.PI * 2 , true);
        context.fill();
      }
    }

    requestAnimationFrame(update);
  }


  function resetEffect(){
    pEffect.numParticles = numParticles.value;
    pEffect.minSize = particleMinSize.value;
    pEffect.maxSize = particleMaxSize.value;
    pEffect.minSpeed = particleMinSpeed.value;
    pEffect.maxSpeed = particleMaxSpeed.value;
    pEffect.minAngle = particleMinAngle.value/180*Math.PI;
    pEffect.maxAngle = particleMaxAngle.value/180*Math.PI;
    pEffect.duration = duration.value;
    pEffect.gravity = gravity.value;
    pEffect.resetEffect();
    var len = pEffect.allParticles.length;
    for(var i = 0; i < len; i++){
      pEffect.allParticles[i].color = "rgba(" + Math.floor(Math.random() * 255) + ", " +Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ", " + 0.5 + ")";
    }
  }

  document.addEventListener("click", function(e){
    if(e.target != canvas) return;

  }, true);

};
