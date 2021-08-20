var camera = {
    x: 0, 
    y: 0
}, delta = {
    x: 1,
    y: 7
}

function random (from, to) {
    return Math.floor ( Math.random () * ( to - from ) ) + to;
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
    }
    create () {
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
    }
    update (delta) {
        
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
