class Scene exteds Phaser.Scene {
    constructor() {
        super ()
    }
    preload () {
        this.load.spritesheets("assets/")
    }
    create () {
        this.player = this.add.image("")
        this.key = {
            space: this.input.keyboard.addKey(Pasher.Input.Keyboard.KeyCodes.Space),
            e: this.input.keyboard.addKey(Pasher.Input.Keyboard.KeyCodes.E)
        }
    }
    update (delta) {
        
    }
}