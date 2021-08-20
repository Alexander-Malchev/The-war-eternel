var camera = {
    x: 0, 
    y: 0
}, delta = {
    x: 1,
    y: 7
}

function random (from, to) {
    return Math.floor ( Math.random () * ( to - from ) ) + from;
}

class Scene extends Phaser.Scene {
    constructor() {
        super ({key: "Scene"})
    }
    preload () {
        this.load.spritesheet("player", "assets/player-sheet.png", { frameWidth: 122, frameHeight: 160 })
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
        this.objects.push( this.add.image (window.innerWidth + 100, 300, `p${random(1, 6)}`));
    }
    update (delta) {
        if ( this.objects[0].x <= 0 - this.objects[0].width ) {
            this.objects[0].destroy();
            this.objects.shift()
        }
        if ( this.objects[this.objects.length - 1].x + (this.objects[this.objects.length - 1].width + 50) <= window.innerWidth ) {
            const image = this.add.image(100000000, 0, `p${random(1, 6)}`)
            image.x = window.innerWidth + image.width;
            image.y = this.objects[this.objects.length - 1].y + random (-100, 100)
            this.objects.push( image );
        }
        
        for ( let i = 0; i < this.objects.length; i++ ) {
            this.objects[i].x -= 5;
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
