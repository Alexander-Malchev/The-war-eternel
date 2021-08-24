var br = 0, jumps = 2, bullets
function random (from, to) {
    return Math.floor ( Math.random () * ( to - from ) ) + from;
}

function dis (ob1, ob2) {
    return Math.sqrt( (ob1.x - ob2.x) * (ob1.x - ob2.x) + (ob1.y - ob2.y) * (ob1.y - ob2.y) )
}

class Scene extends Phaser.Scene {
    constructor() {
        super ({key: "Scene"})
    }
    preload () {
        // this.load.spritesheet("player", "assets/pl.png", { frameWidth: 875 / 5, frameHeight: 202 })
        // this.load.spritesheet("player", "assets/player-sheet.png", { frameWidth: 732 / 6, frameHeight: 360 / 2 })
        this.load.spritesheet("enemy", "assets/enemy.png", { frameWidth: 91, frameHeight: 158 })
        this.load.image("health", "assets/bar.png")
        this.load.image("ammo", "assets/ammo.png")
        this.load.image("p0", "assets/platform[0].png")
        this.load.image("p1", "assets/platform[1].png")
        this.load.image("p2", "assets/platform[2].png")
        this.load.image("p3", "assets/platform[3].png")
        this.load.image("p4", "assets/platform[4].png")
        this.load.image("p5", "assets/platform[5].png")
        this.load.image("p6", "assets/platform[6].png")
        this.load.image("bg", "assets/bg.png")
        this.load.image("pistol", "assets/handgun.png")
        this.load.image("ar", "assets/ar.png")
        this.load.image("lmg", "assets/lmg.png")
        this.load.image("shotgun", "assets/shotgun.png")
        this.load.image("sniper", "assets/sniper.png")
        this.load.image("smg", "assets/smg.png")
        this.load.spritesheet("player", "assets/fpl.png", { frameWidth: 91, frameHeight: 158 })
        this.load.spritesheet("player-pistol", "assets/fpl_pistol.png", { frameWidth: 91, frameHeight: 158 })
    }
    
    create () {
        //objects
        this.objects = []
        this.objects2 = []
        this.weapons = []

        //adding background image
        this.bg = this.add.image(window.innerWidth / 2, window.innerHeight / 2, "bg")
        //scaling background
        this.bg.scaleX = window.innerWidth / 1000;
        this.bg.scaleY = window.innerHeight / 527;

        var configPistol = {
            key: 'Pistol',
            frames: this.anims.generateFrameNumbers('player-pistol', { start: 0, end: 4, first: 0 }),
            frameRate: 20,
            repeat: -1
        };
        var configPl = {
            key: 'Soldier',
            frames: this.anims.generateFrameNumbers('player-pistol', { start: 0, end: 4, first: 0 }),
            frameRate: 20,
            repeat: -1
        };

        var configEn = {
            key: 'Enemy',
            frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 4, first: 0 }),
            frameRate: 20,
            repeat: -1
        };
    
        this.anims.create(configPistol);
        this.anims.create(configPl);
        this.anims.create(configEn);

        this.physics.add.sprite(100, 100, 'enemy').play('Enemy')

        this.clips = {
            "pistol": 8,
            "shotgun": 7,
            "sniper": 10,
            "ar": 30,
            "smg": 40,
            "lmg": 100
        }
        this.scales = {
            "pistol": 0.05,
            "shotgun": 0.2,
            "sniper": 0.2,
            "ar": 0.2,
            "smg": 0.2,
            "lmg": 0.2
        }
        this.bullets = []
        this.gun = this.add.image(0, 0, "pistol").setScale(0.05)
        this.player = this.physics.add.sprite(window.innerWidth / 2, window.innerHeight - 190, 'player-pistol').play('Pistol').setScale(0.7); //animated player
        this.player.gun = this.gun;
        this.player.gun.name = "pistol"
        this.gun = undefined;
        this.player.gun.ammo = 8;
        this.player.setGravityY(600)
        this.player.health = {
            img: this.add.image(10, 10, "health"),
            health: 100
        }
        this.key = {
            space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE), //key Space
            e: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E), //key E
            r: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R) //key R
        }
        // this.cameras.main.startFollow(this.player);
        this.objects.push( this.physics.add.image (0 + 1446 / 2, window.innerHeight - 10, `p6`)); //adding platform bottom
        // this.objects[0].scaleX = 2;
        this.physics.add.collider(this.player, this.objects[this.objects.length - 1]);
        this.objects[this.objects.length -1].body.pushable = false
        this.objects2.push( this.add.image (window.innerWidth + 1446 / 2, -100, `p6`)); //adding platform outside the screen

        // this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.body.pushable = true;

        var Bullet = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,
    
            initialize:
    
            function Bullet (scene)
            {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'ammo');
                this.setScale(0.25)
                this.speed = Phaser.Math.GetSpeed(400, 1);
            },
    
            shoot: function (x, y)
            {
                this.setPosition(x, y);
    
                this.setActive(true);
                this.setVisible(true);
            },
    
            update: function (time, delta)
            {
                this.x += this.speed * delta;
    
                if (this.x + this.width / 2 > window.innerWidth)
                {
                    this.setActive(false);
                    this.setVisible(false);
                }
            }
    
        });
        bullets = this.add.group({
            classType: Bullet,
            //size
            runChildUpdate: true
        })
        this.key.r.on("up", () => {
            if ( ["pistol", "sniper", "shotgun"].indexOf(this.player.gun.name) != -1) {            
                var bullet = bullets.get();
                if (bullet){
                    if ( this.player.gun.ammo > 0 ) {
                        bullet.shoot(this.player.gun.x + 10, this.player.gun.y - 4);
                        this.player.gun.ammo--;
                    }
                }
            }
        }, this)
        this.key.e.on("up", () => {
            let near = this.weapons.filter( (el) => dis(el, this.player) <= 200 )
            if ( near.length > 0 ) {            
                near = near.sort( (a, b) => a.y - b.y )
                this.player.gun.destroy()
                this.player.gun = this.add.image(this.player.gun.x, this.player.gun.y, near[0].texture.key).setScale(this.scales[near[0].texture.key])
                this.player.gun.name = near[0].texture.key;
                this.player.gun.ammo = this.clips[this.player.gun.name]
                near[0].destroy()
            }
        }, this)
        this.key.r.on("down", () => {
            if ( ["smg", "ar", "lmg"].indexOf(this.player.gun.name) != -1) {            
                var bullet = bullets.get();
                if (bullet){
                    if ( this.player.gun.ammo > 0 ) {
                        bullet.shoot(this.player.gun.x + 10, this.player.gun.y - 4);
                        this.player.gun.ammo--;
                    }
                }
            }
        }, this)
    }
    update (delta) {
        br++; //counting frames
        this.player.gun.y = this.player.y - 35;
        this.player.gun.x = this.player.x + 11;
        this.player.health.img.width = this.player.health.health
        this.key.space.on("up", (e) => {
            if ( this.player.body.touching.down || this.player.body.onFloor() ) { 
                jumps = 2;
                this.player.setVelocity(0, -600)
                jumps--;
                return;
            } //asd
            if ( jumps > 0 ) {
                this.player.setVelocity(0, -600)
                jumps--;
            }
        })
        
       if ( br % 100 == 0 ) { //every 100 updates
            //spawning platform from bottom
            const weap = [['pistol', 0.05], ['shotgun', 0.2]]
            const weap2 = [['ar', 0.2]]
            const weap3 = [['sniper', 0.2]]
            const chosen = weap[random(0, weap.length)]
            const chosen2 = weap2[0]
            const chosen3 = weap3[0]
            var chance = random(1, 100);
            var chance2 = random(1, 100);
         
            

            var image = this.physics.add.image(100000000, 0, "p" + random(1, 5)), y = this.objects[this.objects.length - 1].y + random (-100, 100)
            image.x = window.innerWidth + image.width;
            image.y = y > window.innerHeight / 2 + 50 && y < window.innerHeight - 200 ? y : window.innerHeight - 200
            this.objects.push( image );
            this.physics.add.collider(this.player, this.objects[this.objects.length - 1]);
            this.objects[this.objects.length -1].body.pushable = false

           if(chance < 40){
            this.weapons.push(this.physics.add.image(random(this.objects[this.objects.length - 1].x - this.objects[this.objects.length - 1].width / 2, 
            this.objects[this.objects.length - 1].x + this.objects[this.objects.length - 1].width / 2 ), 
            this.objects[this.objects.length - 1].y - 50, chosen[0]).setScale(chosen[1]))
           }
            //spawning platform from top
            var image2 = this.physics.add.image(100000000, 0, "p" + random(1, 5)), y2 = this.objects2[this.objects2.length - 1].y + random (-100, 100)
            image2.x = window.innerWidth + image2.width;
            image2.y = y2 > 200 &&  y2 < window.innerHeight / 2 - 50 ? y2 : window.innerHeight / 2 - 100
            this.objects2.push( image2 );
            this.physics.add.collider(this.player, this.objects2[this.objects2.length - 1]);
            this.objects2[this.objects2.length -1].body.pushable = false

           
            if (chance2 < 20 ){
                this.weapons.push(this.physics.add.image(random(this.objects2[this.objects2.length - 1].x - this.objects2[this.objects2.length - 1].width / 2, 
                this.objects2[this.objects2.length - 1].x + this.objects2[this.objects2.length - 1].width / 2 ), 
                this.objects2[this.objects2.length - 1].y - 50, chosen2[0]).setScale(chosen2[1]))
            } else if (chance2 > 20 && chance2 < 60){
                this.weapons.push(this.physics.add.image(random(this.objects2[this.objects2.length - 1].x - this.objects2[this.objects2.length - 1].width / 2, 
                this.objects2[this.objects2.length - 1].x + this.objects2[this.objects2.length - 1].width / 2 ), 
                this.objects2[this.objects2.length - 1].y - 50, chosen[0]).setScale(chosen[1]))
            } else if (chance2 > 60 && chance2 < 70){
                this.weapons.push(this.physics.add.image(random(this.objects2[this.objects2.length - 1].x - this.objects2[this.objects2.length - 1].width / 2, 
                this.objects2[this.objects2.length - 1].x + this.objects2[this.objects2.length - 1].width / 2 ), 
                this.objects2[this.objects2.length - 1].y - 50, chosen3[0]).setScale(chosen3[1]))
                }

        }

        if (br % 200 == 0 ) { //on every 130 updates
            this.objects.push ( this.physics.add.image (window.innerWidth + 1446 / 2, window.innerHeight - 10, `p6`) ) //pushing ground
            this.physics.add.collider(this.player, this.objects[this.objects.length - 1]);
            this.objects[this.objects.length -1].body.pushable = false

        }
        for(let i = 0; i < this.weapons.length; i++ ){
            if(this.weapons[i].x + this.weapons[i].width <= 0){
                this.weapons[i].destroy(); //removing image
                this.weapons[i] = this.weapons[this.weapons.length - 1]; //replacing platform data with last platform's data
                this.weapons.pop()// removing the last platform becouse is duplicated
                continue;            
            }
            this.weapons[i].x -= 7;
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

var game = new Phaser.Game(config);