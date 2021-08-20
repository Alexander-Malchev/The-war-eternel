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
        this.load.spritesheet("player", "assets/pl.png", { frameWidth: 875 / 5, frameHeight: 202 })
        this.load.image("p0", "assets/platform[0].png")
        this.load.image("p1", "assets/platform[1].png")
        this.load.image("p2", "assets/platform[2].png")
        this.load.image("p3", "assets/platform[3].png")
        this.load.image("p4", "assets/platform[4].png")
        this.load.image("p5", "assets/platform[5].png")
        this.load.image("p6", "assets/platform[6].png")

    }
    create () {
        this.objects = []
        this.objects2 = []
        var config = {
            key: 'Soudier',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 23, first: 23 }),
            frameRate: 20,
            repeat: -1
        };
    
        this.anims.create(config);
    
        this.player = this.add.sprite(400, 300, 'player').play('Soudier');
        this.key = {
            space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            e: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
        }
        this.objects.push( this.add.image (window.innerWidth + 1446 / 2, window.innerHeight - 50, `p6`));
        this.objects2.push( this.add.image (window.innerWidth + 1446 / 2, 130, `p6`));
    }
    update (delta) {
        br++
        if ( this.objects[0].x <= 0 - this.objects[0].width ) {
            this.objects[0].destroy();
            this.objects.shift()
        }

        if (this.key.space.isDown) {
            console.log(br)
        }
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
            this.objects.push ( this.add.image (window.innerWidth + 1446 / 2, window.innerHeight - 50, `p6`) )
        }

        for ( let i = 0; i < this.objects.length; i++ ) {
            this.objects[i].x -= 7;
        } 
        for ( let i = 0; i < this.objects2.length; i++ ) {
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
        }
    },
    scene: [ Scene ]
};

var game = new Phaser.Game(config);
