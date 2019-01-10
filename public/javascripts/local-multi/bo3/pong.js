var pong = function(p){
  p.setup = function(){
    p.noLoop()
    $("#start").unbind().click(function() {
      p.loop()
      $("#start").css('display', 'none')
    })
    p.keyArray = [];
    p.createCanvas(500, 500);
    p.xspeedval = Math.round(Math.random());
    if (p.xspeedval === 1) {
      p.xspeedval = Number(Math.random() * 3);
      if (p.xspeedval < 1 && p.xspeedval > 0) {
        p.xspeedval = 1;
      }
    } else if (p.xspeedval === 0) {
      p.xspeedval = Number(Math.random() * -3);
      if (p.xspeedval > -1 && p.xspeedval < 0) {
        p.xspeedval = -1;
      }
    }
    p.Puck = {
      x: p.width/2,
      y: p.height/2,
      xspeed: p.xspeedval,
      yspeed: 5,
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
          this.xspeed *= -1.1;
        } else if (this.x - this.r <= p.PaddleLeft.x + p.PaddleLeft.w/2 &&
                   this.y > p.PaddleLeft.y - p.PaddleLeft.h/2 &&
                   this.y < p.PaddleLeft.y + p.PaddleLeft.h/2) {
          this.xspeed *= -1.1;
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
        if (this.y - this.r < 0 || this.y + this.r > p.height) {
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

    p.checkGameStatus = function() {
      if (p.Puck.gameover === 'leftwin') {
        p.noLoop()
        runCounter++;
        $(".Lscore").html((Number($(".Lscore").text()) + 1))
        $("#nextRound").css('display', 'block');
        if (runCounter == 3) {
          $("#nextRound").css('display', 'none');
          p.remove()
        }
        $("#nextRound").unbind().click(function() {
          p.remove()
          $("#nextRound").css('display', 'none');
          startNewGame()
        })
      } else if (p.Puck.gameover === 'rightwin') {
        p.noLoop()
        runCounter++;
        $(".Rscore").html((Number($(".Rscore").text()) + 1))
        $("#nextRound").css('display', 'block');
        if (runCounter == 3) {
          $("#nextRound").css('display', 'none');
          p.remove()
        }
        $("#nextRound").unbind().click(function() {
          p.remove()
          $("#nextRound").css('display', 'none');
          startNewGame()
        })
      }
    }

    p.draw = function(){
      p.background(37, 40, 57);
      p.left = p.PaddleLeft;
      p.right = p.PaddleRight;
      p.checkGameStatus()

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
        if (key == 75) {
          p.right.move(-10);
        } else if (key == 77) {
          p.right.move(10);
        } else if (key == 65) {
          p.left.move(-10);
        } else if (key == 90) {
          p.left.move(10);
        } else if (key == 's75'){
          p.right.move(0);
        } else if (key == 's77') {
          p.right.move(0);
        } else if (key == 's65'){
          p.left.move(0);
        } else if (key == 's90') {
          p.left.move(0);
        }
      });

      p.keyReleased = function() {
        p.keyArray.push('s'+p.keyCode);
      };

      p.keyPressed = function(){
        p.keyArray.push(p.keyCode);
      };
    };
  };
};
