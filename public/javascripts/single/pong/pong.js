var pong = function(p){
  let aiNum = 50;
  let distance = 400;
  p.setup = function(){
    p.keyArray = [];
    p.score = p.createDiv('Goodluck!');
    p.score.id = 'score';
    p.score.style('color', 'black');
    p.score.parent('scorecontainer');
    p.createCanvas(500, 500);
    p.xspeedval = Math.round(Math.random());
    if (p.xspeedval === 1) {
      p.xspeedval = Number(Math.random() * 5);
      if (p.xspeedval < 1) {
        p.xspeedval = 1;
      }
    } else if (p.xspeedval === 0) {
      p.xspeedval = Number(Math.random() * -5);
      if (p.xspeedval > -1) {
        p.xspeedval = -1;
      }
    }
    p.Puck = {
      x: p.width/2,
      y: p.height/2,
      xspeed: p.xspeedval,
      yspeed: 4,
      r: 12,
      gameover: false,

      show: function(){
        p.fill(255);
        p.ellipse(this.x, this.y, this.r*2, this.r*2);
      },

      handleAiReaction: function(){
          let puckXRounded = Math.round(this.x);
          aiNum = Math.round(Math.random() * 100);
          distance = (p.PaddleRight.x - p.PaddleRight.w/2) - (p.Puck.x);
        },

      checkPaddle: function(){
        if (this.x + this.r >= p.PaddleRight.x - p.PaddleRight.w/2 &&
            this.y > p.PaddleRight.y - p.PaddleRight.h/2 &&
            this.y < p.PaddleRight.y + p.PaddleRight.h/2) {
          this.xspeed *= -1.05;
        } else if (this.x - this.r <= p.PaddleLeft.x + p.PaddleLeft.w/2 &&
                   this.y > p.PaddleLeft.y - p.PaddleLeft.h/2 &&
                   this.y < p.PaddleLeft.y + p.PaddleLeft.h/2) {
          this.xspeed *= -1.05;
          this.handleAiReaction();
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

      move: function(yval){
        this.y = yval;
      }
    };

    p.draw = function(){

      //4 possibilities
      //~70% perfect
      //~10% on top half
      //~10% on bottom half
      //~10% completely off

      p.checkAiFailure = function(){
        if (aiNum < 70) {
          return p.Puck.y;
        } else if (aiNum  < 80){
          return p.Puck.y + p.getAiPaddleGradualAni(30);
        } else if (aiNum  < 90) {
          return p.Puck.y - p.getAiPaddleGradualAni(30);
        } else if (aiNum <= 100) {
          if (aiNum < 97) {
            return p.Puck.y - p.getAiPaddleGradualAni(60);
          } else {
            return p.Puck.y + p.getAiPaddleGradualAni(60);
          }
        }
      };

      p.getAiPaddleGradualAni = function(endpoint){
        let result = (p.Puck.x/distance) * endpoint;
        return result;
      };

      p.background(0);
      p.left = p.PaddleLeft;
      p.right = p.PaddleRight;
      if (p.Puck.gameover === 'leftwin') {
        p.score.html('Left Wins!');
        return;
      } else if (p.Puck.gameover === 'rightwin') {
        p.score.html('Right Wins!');
        return;
      }
      p.left.createPaddle(true);
      p.right.createPaddle(false);
      p.left.show();
      p.right.show();
      p.left.update();
      p.right.update();
      p.Puck.checkPaddle();
      p.Puck.show();
      p.Puck.update();
      p.Puck.edges();
      p.keyArray.map(function(key) {
        if (key == 65) {
          p.left.move(-10);
        } else if (key == 90) {
          p.left.move(10);
        } else if (key == 's65'){
          p.left.move(0);
        } else if (key == 's90') {
          p.left.move(0);
        }
      });
      p.right.move(p.checkAiFailure());

      p.keyReleased = function() {
        p.keyArray.push('s'+p.keyCode);
      };

      p.keyPressed = function(){
        p.keyArray.push(p.keyCode);
      };
    };
  };
};

var pongGame = new p5(pong, 'scorecontainer');
