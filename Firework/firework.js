function Particle(x, y, hu, firework) {
  this.pos = createVector(x, y);
  this.firework = firework;
  this.lifespan = 255;
  this.hu = hu;

  if (this.firework) {
    this.vel = createVector(0, random(-10, -8));
  } else {
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(2, 9));
  }

  this.acc = createVector(0, 0);

  this.applyForce = function(force) {
    this.acc.add(force);
  };

  this.update = function() {
    if (!this.firework) {
      this.vel.mult(0.9);
      this.lifespan -= 4;
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  };

  this.show = function() {
    if (!this.firework) {
      strokeWeight(2);
      stroke(this.hu, 255, 255, this.lifespan);
    } else {
      strokeWeight(4);
      stroke(this.hu, 255, 255);
    }
    color(200, 100, 0);
    point(this.pos);
  };
  this.done = function() {
    if (this.lifespan) {
      return false;
    } else {
      return ture;
    }
  };
}

function Firework() {
  this.hu = random(255);
  this.firework = new Particle(random(width), height, this.hu, true);

  this.exploded = false;
  this.particles = [];

  this.update = function() {
    if (!this.exploded) {
      this.firework.applyForce(gravity);
      this.firework.update();

      if (this.firework.vel.y >= 0) {
        this.exploded = true;
        this.explode();
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(gravity);
      this.particles[i].update();
      if (this.particles[i].done()) {
        this.particles.splice(i, 1);
      }
    }
  };
  this.show = function() {
    if (!this.exploded) {
      this.firework.show();
    }
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].show();
    }
  };
  this.explode = function() {
    for (let i = 0; i < 100; i++) {
      let p = new Particle(
        this.firework.pos.x,
        this.firework.pos.y,
        this.hu,
        false
      );
      this.particles.push(p);
    }
  };
  this.done = function() {
    if (this.exploded && this.particles.length === 0) {
      return true;
    } else {
      return false;
    }
  };
}

let firework = [];
let gravity;

function setup() {
  createCanvas(400, 300);
  resetSketch();
  let button = createButton("reset");
  button.mousePressed(resetSketch);
}

function resetSketch() {
  firework = [];
  gravity = createVector(0, 0.2);
  firework.push(new Firework());
  stroke(255);
  strokeWeight(4);
}

function draw() {
  background(0, 25);
  colorMode(HSB);
  if (random(1) < 0.03) {
    firework.push(new Firework());
  }
  for (let i = firework.length - 1; i >= 0; i--) {
    firework[i].show();
    firework[i].update();
    if (firework[i].done()) {
      firework.splice(i, 1);
    }
  }
}
