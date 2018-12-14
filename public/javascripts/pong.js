var pong = function(p){
  p.setup = function(){
    p.createCanvas(500, 500);
    p.score = createDiv('Goodluck!');
    p.score.id = 'score';
    p.score.style('color', 'black');
    p.score.parent('scorecontainer');
    p.Puck = {
      x: p.width/2,
      y: p.height/2,
      xspeed: 5,
      yspeed: 1,
      r: 12,
      gameover: false,

      show: function(){
        p.fill(255);
        p.ellipse(this.x, this.y, this.r*2, this.r*2);
      },

      checkPaddle: function(){
        if (this.x + this.r >= p.PaddleRight.x - p.PaddleRight.w/2 &&
            this.y > p.PaddleRight.y - p.PaddleRight.h/2 &&
            this.y < p.PaddleRight.y + p.PaddleRight.h/2) {
          this.xspeed *= -1;
        } else if (this.x - this.r <= p.PaddleLeft.x + p.PaddleLeft.w/2 &&
                   this.y > p.PaddleLeft.y - p.PaddleLeft.h/2 &&
                   this.y < p.PaddleLeft.y + p.PaddleLeft.h/2) {
          this.xspeed *= -1;
        } else if (this.x + this.r > p.PaddleRight.x - p.PaddleRight.w/2) {
          this.gameover = 'leftwin';
        } else if (this.x - this.r < p.PaddleLeft.x + p.PaddleLeft.w/2){
          this.gameover = 'rightwin';
        }
      },

      update: function(){
        this.x = this.x + this.xspeed;
        this.y = this.y + this.yspeed;
      },

      edges: function(){
        if (this.y < 0 || this.y > p.height) {
          this.yspeed *= -1;
        }
      }
    };

    p.PaddleLeft = {
      x: 0,
      y: p.height/2,
      w: 15,
      h: 100,
      ychange: 0,

      createPaddle: function (boolean){
        if (boolean) {
          this.x = this.w/2 ;
        } else {
          this.x = p.width - this.w/2;
        }
      },

      show: function(){
        p.fill(255);
        p.rect(this.x,this.y-50,this.w,this.h);
      },

      update: function(){
        this.y += this.ychange;
        if (this.y <= 49) {
          this.y = 49;
        } else if (this.y >= 450) {
          this.y = 450;
        }
      },

      move: function(steps){
        this.ychange = steps;
      }
    };

    p.PaddleRight = {
      x: 0,
      y: p.height/2,
      w: 15,
      h: 100,
      ychange: 0,

      createPaddle: function (boolean){
        if (boolean) {
          this.x = this.w ;
        } else {
          this.x = p.width - this.w;
        }
      },

      show: function(){
        p.fill(255);
        p.rect(this.x-8,this.y-50,this.w,this.h);
      },

      update: function(){
        this.y += this.ychange;
        if (this.y <= 49) {
          this.y = 49;
        } else if (this.y >= 450) {
          this.y = 450;
        }
      },

      move: function(steps){
        this.ychange = steps;
      }
    };

    p.draw = function(){
      p.background(0);
      p.left = p.PaddleLeft;
      p.right = p.PaddleRight;
      p.left.createPaddle(true);
      p.right.createPaddle(false);
      p.left.show();
      p.right.show();
      p.left.update();
      p.right.update();

      if (p.Puck.gameover === 'leftwin') {
        p.score.html('Left Wins!');
      } else if (p.Puck.gameover === 'rightwin') {
        p.score.html('Right Wins!');
      } else {
        p.Puck.checkPaddle();
        p.Puck.show();
        p.Puck.update();
        p.Puck.edges();
      }
    };

    p.keyReleased = function() {
      p.left.move(0);
      p.right.move(0);
    };

    p.keyPressed = function(){
      if (p.keyCode == 75) {
        p.right.move(-10);
      } else if (p.keyCode == 77) {
        p.right.move(10);
      } else if (p.keyCode == 65) {
        p.left.move(-10);
      } else if (p.keyCode == 90) {
        p.left.move(10);
      }
    };
  };
};

var pongGame = new p5(pong);
