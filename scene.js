var br = 0, jumps = 2, bullets
function random (from, to) {
    return Math.floor ( Math.random () * ( to - from ) ) + from;
}

function dis (ob1, ob2) {
    return Math.sqrt( (ob1.x - ob2.x) * (ob1.x - ob2.x) + (ob1.y - ob2.y) * (ob1.y - ob2.y) )
}

function callback (b, t) {
    if ( b.active && b.delta > 0 ) {
        switch (b.type) {
            case "pistol":
                t.health.health -= 50;
                break;
            case "shotgun":
                t.health.health -= 100 / 3;
                break;
            case "sniper":
                t.health.health -= 100;
                break;
            case "ar":
                t.health.health -= 25;
                break;
            case "smg":
                t.health.health -= 12.5;
                break;
            case "lmg":
                t.health.health -= 20;
                break;
        }
        b.lives --;

        if ( b.lives <= 0 ) {
            b.setVisible(false);
            b.setActive(false);
        }
    }
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
        this.enemy = []
        this.bullets = []

        this.pause = false;
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
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4, first: 0 }),
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

        // this.physics.add.sprite(100, 100, 'enemy').play('Enemy')

        this.clips = {
            "pistol": 8,
            "shotgun": 7,
            "sniper": 10,
            "ar": 30,
            "smg": 50,
            "lmg": 60
        }
        this.scales = {
            "pistol": 0.05,
            "shotgun": 0.2,
            "sniper": 0.15,
            "ar": 0.2,
            "smg": 0.06,
            "lmg": 0.12
        }
        this.kills = 0
        this.gun = this.add.image(0, 0, "pistol").setScale(0.05)
        this.player = this.physics.add.sprite(window.innerWidth / 2, window.innerHeight - 190, 'player-pistol').play('Pistol').setScale(0.7); //animated player
        this.player.gun = this.gun;
        this.player.gun.name = "pistol"
        this.gun = undefined;
        this.player.gun.ammo = 8;
        this.player.setGravityY(600)
        this.player.health = {
            img: this.add.image(60, 10, "health"),
            health: 100
        }
        this.key = {
            space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE), //key Space
            e: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E), //key E
            r: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R), //key R
            p: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P) //key P
        }
        // this.cameras.main.startFollow(this.player);
        
        for ( let n = 0; n < 5; n ++ ) {
            this.objects.push( this.physics.add.image (0 + 1446 / 2 + n * (1446 / 2), window.innerHeight - 10, `p6`)); //adding platform bottom
            this.physics.add.collider(this.player, this.objects[this.objects.length - 1]);
            this.objects[this.objects.length -1].body.pushable = false
        }
        // this.objects[0].scaleX = 2;
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
                this.speed = 0.75;
            },
    
            shoot: function (x, y, type, delta, ang)
            {
                this.setPosition(x, y);
                this.type = type;
                this.lives = this.type == "sniper" ? 2 : 1;
                this.ang =  (180 / Math.PI) * ang
                this.delta = delta;           
                this.setActive(true);
                this.setVisible(true);
            },
    
            update: function (time, delta)
            {
                if(this.ang){
                    
                    this.x += Math.cos(this.ang) * this.speed * delta * this.delta
                    this.y += Math.sin(this.ang) * this.speed * delta * this.delta
                }else
                {this.x += (this.speed * delta) * this.delta;}

    
                if (this.x - this.width / 2 > window.innerWidth || this.x + this.width / 2 < 0 )
                {
                    this.setActive(false);
                    this.setVisible(false);
                }
            }
    
        });
        bullets = this.physics.add.group({
            classType: Bullet,
            immovable: true,
            allowGravity: false,
            //size
            runChildUpdate: true
        })
        this.key.p.on("up", () => {
            this.pause = !this.pause
            !this.pause ? this.scene.launch("Scene") : this.scene.pause()
        })
        this.key.r.on("up", () => {
            switch ( this.player.gun.name ) {
                case "pistol":
                    var bullet = bullets.get();
                    if (bullet){
                        if ( this.player.gun.ammo > 0 ) {
                            bullet.shoot(this.player.gun.x + 10, this.player.gun.y - 4, "pistol", 1);
                            this.player.gun.ammo--;
                        }
                    }    
                    break;
                case "shotgun":
                    if ( this.player.gun.ammo > 0 ) {
                        for ( let i = 0; i < 3; i ++ ) {
                            var bullet = bullets.get();
                            if (bullet){
                                const angle = [-0.0025, 0, 0.0025]
                                bullet.shoot(this.player.gun.x + 10, this.player.gun.y - 4, "shotgun", 1, angle[i]);
                            }
                        }
                        this.player.gun.ammo--;
                    }  
                    break;
                case "sniper":
                    var bullet = bullets.get();
                    if (bullet){
                        if ( this.player.gun.ammo > 0 ) {
                            bullet.shoot(this.player.gun.x + 10, this.player.gun.y - 4, "sniper", 1);
                            this.player.gun.ammo--;
                        }
                    }
                    break;
                
            }
        }, this)
        this.key.e.on("up", () => {
            let near = this.weapons.filter( (el) => dis(el, this.player) <= 200 && el.y >= this.player.y - this.player.height / 2 )
            if ( near.length > 0 ) {            
                near = near.sort( (a, b) => a.y - b.y )
                this.player.gun.destroy()
                const gun = this.add.image(this.player.gun.x, this.player.gun.y, near[0].texture.key).setScale(this.scales[near[0].texture.key])
                if ( near[0].texture.key != "pistol" && near[0].texture.key != "smg" ) {
                    this.player.setTexture("player")
                    this.player.play("Soldier")
                } else {
                    this.player.setTexture("player-pistol")
                    this.player.play("Pistol")
                }
                this.player.gun = gun
                this.player.gun.name = near[0].texture.key;
                this.player.gun.ammo = this.clips[this.player.gun.name]
                near[0].destroy()
            }
        }, this)
        this.ammo = this.add.text(10, 30, "Ammo " + this.player.gun.ammo, {
            font: "20px monospace", 
            fill: "orange"
        })
        this.k = this.add.text(10, 50, "Kills " + this.kills, {
            font: "20px monospace", 
            fill: "orange"
        })
    }
    update (delta) {
        br++; //counting frames
        switch ( this.player.gun.name ) {
            case "pistol":
                this.player.gun.y = this.player.y - 35;
                this.player.gun.x = this.player.x + 11;    
                break;
            case "shotgun":
                this.player.gun.y = this.player.y - 30;
                this.player.gun.x = this.player.x + 35;    
                break;
            case "sniper":
                this.player.gun.y = this.player.y - 33;
                this.player.gun.x = this.player.x + 26;    
                break;
            case "ar":
                this.player.gun.y = this.player.y - 32;
                this.player.gun.x = this.player.x + 24;    
                break;
            case "smg":
                this.player.gun.y = this.player.y - 35;
                this.player.gun.x = this.player.x + 11;    
                break;
            case "lmg":
                this.player.gun.y = this.player.y - 31;
                this.player.gun.x = this.player.x + 16;    
                break;
        }
        this.player.depth = 1000000;
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

        if (this.key.r.isDown) {
            switch ( this.player.gun.name ) {
                case "ar":
                    var bullet = bullets.get();
                    if (bullet){
                        if ( this.player.gun.ammo > 0 ) {
                            setTimeout(bullet.shoot(this.player.gun.x + 10, this.player.gun.y - 4, "ar", 1), 1000);
                            this.player.gun.ammo--;
                        }
                    }   
                    break;
                case "smg":
                    var bullet = bullets.get();
                    if (bullet){
                        if ( this.player.gun.ammo > 0 ) {
                            setTimeout(bullet.shoot(this.player.gun.x + 10, this.player.gun.y - 4, "smg", 1, random(-2, 2) * 0.0005), 100);
                            this.player.gun.ammo--;
                        }
                    }   
                    break;
                case "lmg":
                    var bullet = bullets.get();
                    if (bullet){
                        if ( this.player.gun.ammo > 0 ) {
                            setTimeout(bullet.shoot(this.player.gun.x + 10, this.player.gun.y - 4, "lmg", 1), 1000);
                            this.player.gun.ammo--;
                        }
                    }   
                    break;
                
            }
        }
        this.ammo.text = "Ammo " + this.player.gun.ammo
        this.k.text = "Kills " + this.kills

        
       if ( br % 100 == 0 ) { //every 100 updates
            //spawning platform from bottom
            const weap = [['pistol', 0.05], ['shotgun', 0.2]]
            const weap2 = [['ar', 0.2]]
            const weap3 = [['sniper', 0.2]]
            const weapE = [ ["smg", 0.06], ["lmg", 0.12], ['ar', 0.2], ['shotgun', 0.2] ]
            const chosen = weap[random(0, weap.length)]
            const chosen2 = weap2[0]
            const chosen3 = weap3[0]
            const chanceEnemy2 = random ( 1, 100) > 20;
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
            if (chanceEnemy2) {
                const c = weapE[random(0, weapE.length)]
                this.enemy.push(this.physics.add.sprite(this.objects[this.objects.length - 1].x, this.objects[this.objects.length - 1].y - 50, 'enemy').play('Enemy').setScale(0.7))
                this.enemy[this.enemy.length - 1].gun = this.add.image(this.enemy[this.enemy.length - 1].x, this.enemy[this.enemy.length - 1].y, c[0]).setScale(c[1])
                this.enemy[this.enemy.length - 1].gun.scaleX = -this.enemy[this.enemy.length - 1].gun.scaleX
                this.enemy[this.enemy.length - 1].gun.name = c[0]
                this.enemy[this.enemy.length - 1].setGravityY(600)
                this.enemy[this.enemy.length - 1].gun.ammo = this.clips[c[0]]
                this.enemy[this.enemy.length - 1].health = {
                    img: this.add.image(this.enemy[this.enemy.length - 1].x - 50, this.enemy[this.enemy.length - 1].y - 100, "health"),
                    health: 100
                }
                
                for ( let n = 0; n < this.objects.length - 1; n++ ) {
                    this.physics.add.collider(this.enemy[this.enemy.length - 1], this.objects[n]);
                }
                for ( let n = 0; n < this.objects2.length - 1; n++ ) {
                    this.physics.add.collider(this.enemy[this.enemy.length - 1], this.objects2[n]);
                }
                this.enemy[this.enemy.length - 1].depth = 1000000;
            }
            for ( let i = 0; i < this.enemy.length; i++) {
                this.physics.add.collider(this.enemy[i], this.objects2[this.objects2.length - 1]);
                this.physics.add.collider(this.enemy[i], this.objects[this.objects.length - 1]);
                for ( let n = 0; n < bullets.children.entries.length; n++ ) {  
                    this.physics.add.collider(bullets.children.entries[n], this.enemy[i], callback);
                }   
            }

           
            if (chance2 < 20){
                this.weapons.push(this.physics.add.image(random(this.objects2[this.objects2.length - 1].x - this.objects2[this.objects2.length - 1].width / 2, 
                this.objects2[this.objects2.length - 1].x + this.objects2[this.objects2.length - 1].width / 2 ), 
                this.objects2[this.objects2.length - 1].y - 50, chosen2[0]).setScale(chosen2[1]))
            } else if (chance2 > 20 && chance2 < 60){
                this.weapons.push(this.physics.add.image(random(this.objects2[this.objects2.length - 1].x - this.objects2[this.objects2.length - 1].width / 2, 
                this.objects2[this.objects2.length - 1].x + this.objects2[this.objects2.length - 1].width / 2 ), 
                this.objects2[this.objects2.length - 1].y - 50, chosen[0]).setScale(chosen[1]))
            } else if (chance2 > 60 && chance2 < 65){
                this.weapons.push(this.physics.add.image(random(this.objects2[this.objects2.length - 1].x - this.objects2[this.objects2.length - 1].width / 2, 
                this.objects2[this.objects2.length - 1].x + this.objects2[this.objects2.length - 1].width / 2 ), 
                this.objects2[this.objects2.length - 1].y - 50, chosen3[0]).setScale(chosen3[1]))
                }

        }

        if (br % 200 == 0 ) { //on every 130 updates
            const weapE = [ ["smg", 0.06], ["lmg", 0.12], ['ar', 0.2], ['shotgun', 0.2] ]
            const chance = random(1, 100) > 20
            this.objects.push ( this.physics.add.image (window.innerWidth + 1446 / 2, window.innerHeight - 10, `p6`) ) //pushing ground
            this.physics.add.collider(this.player, this.objects[this.objects.length - 1]);
            this.objects[this.objects.length -1].body.pushable = false
            if (chance) {
                const c = weapE[random(0, weapE.length)]
                this.enemy.push(this.physics.add.sprite(this.objects[this.objects.length - 1].x, this.objects[this.objects.length - 1].y - 50, 'enemy').play('Enemy').setScale(0.7))
                this.enemy[this.enemy.length - 1].gun = this.add.image(this.enemy[this.enemy.length - 1].x, this.enemy[this.enemy.length - 1].y, c[0]).setScale(c[1])
                this.enemy[this.enemy.length - 1].gun.scaleX = -this.enemy[this.enemy.length - 1].gun.scaleX
                this.enemy[this.enemy.length - 1].setGravityY(600)
                this.enemy[this.enemy.length - 1].gun.ammo = this.clips[c[0]]
                this.enemy[this.enemy.length - 1].gun.name = c[0]
                this.enemy[this.enemy.length - 1].health = {
                    img: this.add.image(this.enemy[this.enemy.length - 1].x - 50, this.enemy[this.enemy.length - 1].y - 100, "health"),
                    health: 100
                }
                for ( let n = 0; n < this.objects.length - 1; n++ ) {
                    this.physics.add.collider(this.enemy[this.enemy.length - 1], this.objects[n]);
                }
                for ( let n = 0; n < this.objects2.length - 1; n++ ) {
                    this.physics.add.collider(this.enemy[this.enemy.length - 1], this.objects2[n]);
                }
                this.enemy[this.enemy.length - 1].depth = 1000000;
            }
            for ( let i = 0; i < this.enemy.length; i++) {
                this.physics.add.collider(this.enemy[i], this.objects2[this.objects2.length - 1]);
                this.physics.add.collider(this.enemy[i], this.objects[this.objects.length - 1]);
                for ( let n = 0; n < bullets.children.entries.length; n++ ) {  
                    this.physics.add.collider(bullets.children.entries[n], this.enemy[i], callback);
                }   
            }
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
        
        for ( let i = 0; i < this.enemy.length; i++ ) { //looping all platforms from top
            if ( this.enemy[i].health.health <= 0 ) this.kills++;
            if ( this.enemy[i].x + this.enemy[i].width <= 0 || this.enemy[i].health.health <= 0 ) { //if platform is out of screen
                this.weapons.push(this.physics.add.image(this.enemy[i].x, this.enemy[i].y + 20, this.enemy[i].gun.texture.key).setScale(this.scales[this.enemy[i].gun.texture.key]))
                this.enemy[i].gun.destroy();
                this.enemy[i].health.img.destroy();
                this.enemy[i].destroy(); //removing image 
                this.enemy[i] = this.enemy[this.enemy.length - 1]; //removing image
                this.enemy.pop() //removing the last platform becouse is duplicated
                break; //skiping movement 
            }

            this.enemy[i].health.img.x = this.enemy[i].x; 
            this.enemy[i].health.img.y = this.enemy[i].y - this.enemy[i].height / 2; 
            this.enemy[i].health.img.scaleX = this.enemy[i].health.health / 100;

            switch ( this.enemy[i].gun.name ) {
                case "pistol":
                    this.enemy[i].gun.y = this.enemy[i].y - 35;
                    this.enemy[i].gun.x = this.enemy[i].x - 11;   
                    if ( this.enemy[i].gun.y <= this.player.y + this.player.height / 2 && this.enemy[i].gun.y >= this.player.y - this.player.height / 2 && this.player.x <= this.enemy[i].gun.x && dis(this.player, this.enemy[i]) <= window.innerWidth / 3 ) {
                        for ( let n = 0; n < this.enemy.length; n++ ) {
                            if ( this.enemy[i].gun.y <= this.enemy[n].y + this.enemy[n].height / 2 && this.enemy[i].gun.y >= this.enemy[n].y - this.enemy[n].height / 2 && this.enemy[n].x <= this.enemy[i].gun.x ) {
                                break;
                            } else {
                                var bullet = bullets.get();
                                if (bullet){
                                    if ( this.player.gun.ammo > 0 ) {
                                        bullet.shoot(this.enemy[i].gun.x - 10, this.enemy[i].gun.y - 4, "pistol", -1);
                                        this.enemy[i].gun.ammo--;
                                    }
                                }   
                            }  
                        }
                    }
                    break;
                case "shotgun":
                    this.enemy[i].gun.y = this.enemy[i].y - 30;
                    this.enemy[i].gun.x = this.enemy[i].x - 35;   
                    if ( this.enemy[i].gun.y <= this.player.y + this.player.height / 2 && this.enemy[i].gun.y >= this.player.y - this.player.height / 2 && this.player.x <= this.enemy[i].gun.x && dis(this.player, this.enemy[i]) <= window.innerWidth / 3 ) {
                        for ( let n = 0; n < this.enemy.length; n++ ) {
                            if ( this.enemy[i].gun.y <= this.enemy[n].y + this.enemy[n].height / 2 && this.enemy[i].gun.y >= this.enemy[n].y - this.enemy[n].height / 2 && this.enemy[n].x <= this.enemy[i].gun.x ) {
                                break;
                            } else {
                                if ( this.enemy[i].gun.ammo > 0 ) {
                                    for ( let m = 0; m < 3; m ++ ) {
                                        var bullet = bullets.get();
                                        if (bullet){
                                            const angle = [-0.0025, 0, 0.0025]
                                            bullet.shoot(this.enemy[i].gun.x - 10, this.enemy[i].gun.y - 4, "shotgun", -1, angle[m]);
                                        }
                                    }
                                    this.enemy[i].gun.ammo--;
                                } 
                            }
                        }   
                    }
                    break;
                case "sniper":
                    this.enemy[i].gun.y = this.enemy[i].y - 33;
                    this.enemy[i].gun.x = this.enemy[i].x - 26;  
                    if ( this.enemy[i].gun.y <= this.player.y + this.player.height / 2 && this.enemy[i].gun.y >= this.player.y - this.player.height / 2 && this.player.x <= this.enemy[i].gun.x && dis(this.player, this.enemy[i]) <= window.innerWidth / 3 ) {
                        for ( let n = 0; n < this.enemy.length; n++ ) {
                            if ( this.enemy[i].gun.y <= this.enemy[n].y + this.enemy[n].height / 2 && this.enemy[i].gun.y >= this.enemy[n].y - this.enemy[n].height / 2 && this.enemy[n].x <= this.enemy[i].gun.x ) {
                                break;
                            } else {
                                var bullet = bullets.get();
                                if (bullet){
                                    if ( this.enemy[i].gun.ammo > 0 ) {
                                        bullet.shoot(this.enemy[i].gun.x - 10, this.enemy[i].gun.y - 4, "sniper", -1);
                                        this.enemy[i].gun.ammo--;
                                    }
                                }  
                            }
                        }
                    }     
                    break;
                case "ar":
                    this.enemy[i].gun.y = this.enemy[i].y - 32;
                    this.enemy[i].gun.x = this.enemy[i].x - 24; 
                    if ( this.enemy[i].gun.y <= this.player.y + this.player.height / 2 && this.enemy[i].gun.y >= this.player.y - this.player.height / 2 && this.player.x <= this.enemy[i].gun.x && dis(this.player, this.enemy[i]) <= window.innerWidth / 3 ) {
                        for ( let n = 0; n < this.enemy.length; n++ ) {
                            if ( this.enemy[i].gun.y <= this.enemy[n].y + this.enemy[n].height / 2 && this.enemy[i].gun.y >= this.enemy[n].y - this.enemy[n].height / 2 && this.enemy[n].x <= this.enemy[i].gun.x ) {
                                break;
                            } else {   
                                var bullet = bullets.get();
                                if (bullet){
                                    if ( this.enemy[i].gun.ammo > 0 ) {
                                        setTimeout(bullet.shoot(this.enemy[i].gun.x - 10, this.enemy[i].gun.y - 4, "ar", -1), 1000);
                                        this.enemy[i].gun.ammo--;
                                    }
                                } 
                            }
                        }
                    }
                    break;
                case "smg":
                    this.enemy[i].gun.y = this.enemy[i].y - 35;
                    this.enemy[i].gun.x = this.enemy[i].x - 35; 
                    if ( this.enemy[i].gun.y <= this.player.y + this.player.height / 2 && this.enemy[i].gun.y >= this.player.y - this.player.height / 2 && this.player.x <= this.enemy[i].gun.x && dis(this.player, this.enemy[i]) <= window.innerWidth / 3 ) {
                        for ( let n = 0; n < this.enemy.length; n++ ) {
                            if ( this.enemy[i].gun.y <= this.enemy[n].y + this.enemy[n].height / 2 && this.enemy[i].gun.y >= this.enemy[n].y - this.enemy[n].height / 2 && this.enemy[n].x <= this.enemy[i].gun.x ) {
                                break;
                            } else {
                                var bullet = bullets.get();
                                if (bullet){
                                    if ( this.enemy[i].gun.ammo > 0 ) {
                                        setTimeout(bullet.shoot(this.enemy[i].gun.x - 10, this.enemy[i].gun.y - 4, "smg", -1, random(-2, 2) * 0.0005), 100);
                                        this.enemy[i].gun.ammo--;
                                    }
                                }
                            }    
                        }
                    }
                    break;
                case "lmg":
                    this.enemy[i].gun.y = this.enemy[i].y - 32;
                    this.enemy[i].gun.x = this.enemy[i].x - 26;    
                    if ( this.enemy[i].gun.y <= this.player.y + this.player.height / 2 && this.enemy[i].gun.y >= this.player.y - this.player.height / 2 && this.player.x <= this.enemy[i].gun.x && dis(this.player, this.enemy[i]) <= window.innerWidth / 3 ) {
                        for ( let n = 0; n < this.enemy.length; n++ ) {
                            if ( this.enemy[i].gun.y <= this.enemy[n].y + this.enemy[n].height / 2 && this.enemy[i].gun.y >= this.enemy[n].y - this.enemy[n].height / 2 && this.enemy[n].x <= this.enemy[i].gun.x ) {
                                break;
                            } else {
                                var bullet = bullets.get();
                                if (bullet){
                                    if ( this.enemy[i].gun.ammo > 0 ) {
                                        setTimeout(bullet.shoot(this.enemy[i].gun.x - 10, this.enemy[i].gun.y - 4, "lmg", -1), 1000);
                                        this.enemy[i].gun.ammo--;
                                    }
                                }  
                            }
                        }
                    }
                    break;
            }
            this.enemy[i].x -= 10; //moving platform
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
            debug: false
        }, 
        gravity: {y: 200}
    },
    scene: [ Scene ]
};

var game = new Phaser.Game(config);
