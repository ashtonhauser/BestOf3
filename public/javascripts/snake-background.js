var sketch = function(bs) {
  bs.numSegments = 10;
  bs.xCor = [];
  bs.yCor = [];

  const Snake = class {
    constructor(x, y, dir) {
      this.startX = x;
    	this.startY = y;
    	this.length = 10;
    	this.cordDiff = 10;
    	this.x = [];
    	this.y = [];
    	this.direction = dir;
    }


  	setup() {
  		for (var o = 0; o < this.length; o++) {
        this.x.push(this.startX - (o * this.length));
        this.y.push(this.startY);
      }
  	}

  	draw() {

	    for (var x = 0; x < this.length - 1; x++) {
        this.x[x] = this.x[x + 1];
        this.y[x] = this.y[x + 1];
      }
      for (var i = 0; i < this.length - 1; i++) {
        bs.line(this.x[i], this.y[i], this.x[i + 1], this.y[i + 1]);
        if (this.x[i + 1] > $(window).width() && this.x[i] > $(window).width()) {
          this.direction = 'left';
        }
        if (this.x[i + 1] < 0 && this.x[i] < 0) {
          this.direction = 'right';
        }
        if (this.y[i + 1] > $('html').height() && this.y[i] > $('html').height()) {
          this.direction = 'up';
        }
        if (this.y[i + 1] < 0 && this.y[i] < 0) {
          this.direction = 'down';
        }
      }

      switch (this.direction) {
        case 'right':
          this.x[this.length - 1] = this.x[this.length - 2] + this.cordDiff;
          this.y[this.length - 1] = this.y[this.length - 2];
          break;
        case 'up':
          this.x[this.length - 1] = this.x[this.length - 2];
          this.y[this.length - 1] = this.y[this.length - 2] - this.cordDiff;
          break;
        case 'left':
          this.x[this.length - 1] = this.x[this.length - 2] - this.cordDiff;
          this.y[this.length - 1] = this.y[this.length - 2];
          break;
        case 'down':
          this.x[this.length - 1] = this.x[this.length - 2];
          this.y[this.length - 1] = this.y[this.length - 2] + this.cordDiff;
          break;
      }
    }
  }

  var randomNum;
  var group1Dir = 'right';
  var group2Dir = 'left';
  var group3Dir = 'up';
  var group4Dir = 'down';
  setInterval(function() {
    randomNum = Math.ceil(Math.random()*4)
    switch (randomNum) {
      case 4:
        group1Dir = 'up';
        group2Dir = 'down';
        group3Dir = 'left';
        group4Dir = 'right';
        break;
      case 3:
        group1Dir = 'right';
        group2Dir = 'left';
        group3Dir = 'up';
        group4Dir = 'down';
        break;
      case 2:
        group1Dir = 'down';
        group2Dir = 'up';
        group3Dir = 'right';
        group4Dir = 'left';
        break;
      case 1:
        group1Dir = 'left';
        group2Dir = 'right';
        group3Dir = 'down';
        group4Dir = 'up';
        break;
    }
  } , 2000)


  var one =  new Snake(0, 150, group1Dir)
  var two =  new Snake($(window).width(), 400, group2Dir)
  var three =  new Snake(0, 1200, group1Dir)
  var four =  new Snake($(window).width()*1.7, 600, group2Dir)
  var five =  new Snake(175, 300, group4Dir)
  var six =  new Snake($(window).width(), 800, group2Dir)
  var seven =  new Snake(0, 1600, group1Dir)
  var eight =  new Snake(0, 1000, group1Dir)
  var nine =  new Snake(200, 1800, group3Dir)
  var ten = new Snake(600, 2200, group3Dir)
  var eleven = new Snake(1400, 300, group3Dir)

  bs.setup = function() {
    bs.cnv = bs.createCanvas($(window).width(), $('html').height()-154);
    bs.cnv.position(0, 0);
    bs.cnv.style('z-index', '0')
    bs.strokeWeight(10);
    bs.frameRate(15);
  };

  bs.draw = function() {
    one.setup()
    two.setup()
    three.setup()
    four.setup()
    five.setup()
    six.setup()
    seven.setup()
    eight.setup()
    nine.setup()
    ten.setup()
    eleven.setup()
    bs.clear()
    one.draw()
    two.draw()
    three.draw()
    four.draw()
    five.draw()
    six.draw()
    seven.draw()
    eight.draw()
    nine.draw()
    ten.draw()
    eleven.draw()
  }

  bs.windowResized = function() {
    bs.resizeCanvas($(window).width(), $('html').height())
  }
};

var snakeBackground = new p5(sketch);
