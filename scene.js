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

        // this.bg = this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, "bg").setOrigin(0, 0);
        this.bg = this.add.image(window.innerWidth / 2, window.innerHeight / 2, "bg")
        this.bg.scaleX = window.innerWidth / 1000;
        this.bg.scaleY = window.innerHeight / 527;

        var config = {
            key: 'Soudier',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4, first: 0 }),
            frameRate: 20,
            repeat: -1
        };
    
        this.anims.create(config);
    
        this.player = this.physics.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'player').play('Soudier').setScale(0.5);;
        this.player.setVelocity(0, 0)
        this.player.setWorldBounds = true;
        this.key = {
            space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            e: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
        }
        // this.cameras.main.startFollow(this.player);
        this.objects.push( this.add.image (window.innerWidth + 1446 / 2, window.innerHeight - 50, `p6`));
        this.objects2.push( this.add.image (window.innerWidth + 1446 / 2, 130, `p6`));
    }
    update (delta) {
        br++
       // this.player.x = this.input.mousePointer.x;

        this.input.keyboard.on("keyup_SPACE", function (e) {
            this.player.setVelocity(0, -100);  
            console.log("Space pressed.")          
        }, this)
      if ( br % 100 == 0 ) {
            var image = this.add.image(100000000, 0, "p" + random(1, 5)), y = this.objects[this.objects.length - 1].y + random (-100, 100)
            image.x = window.innerWidth + image.width;
            image.y = y > window.innerHeight / 2 + 50 && y < window.innerHeight - 200 ? y : window.innerHeight - 200
            this.objects.push( image );

            var image2 = this.add.image(100000000, 0, "p" + random(1, 5)), y2 = this.objects2[this.objects2.length - 1].y + random (-100, 100)
            image2.x = window.innerWidth + image2.width;
            image2.y = y2 > 100 &&  y2 < window.innerHeight / 2 - 50 ? y2 : window.innerHeight / 2 - 100
            this.objects2.push( image2 );
        }

        if (br % 130 == 0 ) {
            this.objects.push ( this.add.image (window.innerWidth + 1446 / 2, window.innerHeight - 10, `p6`) )
        }

        for ( let i = 0; i < this.objects.length; i++ ) {
            if ( this.objects[i].x + this.objects[i].width <= 0 ) {
                this.objects[i].destroy();
                this.objects[i] = this.objects[this.objects.length - 1];
                this.objects.pop()
                continue;
            }
            this.objects[i].x -= 7;
        } 
        for ( let i = 0; i < this.objects2.length; i++ ) {
            if ( this.objects2[i].x + this.objects2[i].width <= 0 ) {
                this.objects2[i].destroy();
                this.objects2[i] = this.objects2[this.objects2.length - 1];
                this.objects2.pop()
                continue;
            }
            this.objects2[i].x -= 7;
        } 
    }
}

const config = {
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

var game = new Phaser.Game(config);
