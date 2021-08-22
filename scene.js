var camera = {
    x: 0, 
    y: 0
}, delta = {
    x: 1,
    y: 7
}
   var br = 0
function random (from, to) {
    return Math.floor ( Math.random () * ( to - from ) ) + from;
}

class Scene extends Phaser.Scene {
    constructor() {
        super ({key: "Scene"})
    }
    preload () {
        // this.load.spritesheet("player", "assets/pl.png", { frameWidth: 875 / 5, frameHeight: 202 })
        this.load.spritesheet("player", "assets/player-sheet.png", { frameWidth: 732 / 6, frameHeight: 360 / 2 })
        this.load.image("p0", "assets/platform[0].png")
        this.load.image("p1", "assets/platform[1].png")
        this.load.image("p2", "assets/platform[2].png")
        this.load.image("p3", "assets/platform[3].png")
        this.load.image("p4", "assets/platform[4].png")
        this.load.image("p5", "assets/platform[5].png")
        this.load.image("p6", "assets/platform[6].png")
        this.load.image("bg", "assets/bg.png")

    }
    create () {
        this.objects = []
        this.objects2 = []

        //adding background image
        this.bg = this.add.image(window.innerWidth / 2, window.innerHeight / 2, "bg")
        //scaling background
        this.bg.scaleX = window.innerWidth / 1000;
        this.bg.scaleY = window.innerHeight / 527;

        var config = {
            key: 'Soudier',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4, first: 0 }),
            frameRate: 20,
            repeat: -1
        };
    
        this.anims.create(config);
    
        this.player = this.physics.add.sprite(100, window.innerHeight - 190, 'player').play('Soudier'); //animated player
        this.player.setVelocity(0, 0)
        this.player.setWorldBounds = true;
        this.key = {
            space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE), //key Space
            e: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E) //key E
        }
        // this.cameras.main.startFollow(this.player);
        this.objects.push( this.add.image (window.innerWidth + 1446 / 2, window.innerHeight - 50, `p6`)); //adding platform bottom
        this.objects2.push( this.add.image (window.innerWidth + 1446 / 2, 130, `p6`)); //adding platform top
    }
    update (delta) {
        br++; // counting updates
       // this.player.x = this.input.mousePointer.x;

        this.input.keyboard.on("keyup_SPACE", function (e) { //keyup event for space
            this.player.setVelocity(0, -100);  //jumping
            console.log("Space pressed.")    //debugging
        }, this)
      if ( br % 100 == 0 ) { //every 100 updates
            //spawning platform from bottom
            var image = this.add.image(100000000, 0, "p" + random(1, 5)), y = this.objects[this.objects.length - 1].y + random (-100, 100)
            image.x = window.innerWidth + image.width;
            image.y = y > window.innerHeight / 2 + 50 && y < window.innerHeight - 200 ? y : window.innerHeight - 200
            this.objects.push( image );

            //spawning platform from top
            var image2 = this.add.image(100000000, 0, "p" + random(1, 5)), y2 = this.objects2[this.objects2.length - 1].y + random (-100, 100)
            image2.x = window.innerWidth + image2.width;
            image2.y = y2 > 100 &&  y2 < window.innerHeight / 2 - 50 ? y2 : window.innerHeight / 2 - 100
            this.objects2.push( image2 );
        }

        if (br % 130 == 0 ) { //on every 130 updates
            this.objects.push ( this.add.image (window.innerWidth + 1446 / 2, window.innerHeight - 10, `p6`) ) //pushing ground
        }

        for ( let i = 0; i < this.objects.length; i++ ) { //looping all platforms from bottom
            if ( this.objects[i].x + this.objects[i].width <= 0 ) { //if platform is out of screen
                this.objects[i].destroy(); //removing image
                this.objects[i] = this.objects[this.objects.length - 1]; //replacing platform data with last platform's data
                this.objects.pop()// removing the last platform becouse is duplicated
                continue; //skiping movement
            }
            this.objects[i].x -= 7; //moving platform
        } 
        for ( let i = 0; i < this.objects2.length; i++ ) { //looping all platforms from top
            if ( this.objects2[i].x + this.objects2[i].width <= 0 ) { //if platform is out of screen
                this.objects2[i].destroy(); //removing image 
                this.objects2[i] = this.objects2[this.objects2.length - 1]; //removing image
                this.objects2.pop() //removing the last platform becouse is duplicated
                continue; //skiping movement
            }
            this.objects2[i].x -= 7; //moving platform
        } 
    }
}

const config = { //phaser stuff
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }, 
        gravity: {y: 200}
    },
    scene: [ Scene ]
};

var game = new Phaser.Game(config); //game....
