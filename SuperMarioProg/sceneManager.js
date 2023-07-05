class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.score = 0;
        this.coins = 0;
        this.lives = 3;

        this.gameOver = false;

        this.title = true;
        this.credits = false;
        this.level = null;

        this.menuSelect = {
            mario: false,
            luigi: false,
            credits: false
        }
        this.menuSelectIndex = -10;
        this.creditsLineIndex = 0;
        this.menuButtonTimer = 0.15;
        this.menuButtonCooldown = 0.15;

        this.coinAnimation = new Animator(ASSET_MANAGER.getAsset("./sprites/coins.png"), 0, 160, 8, 8, 4, 0.2, 0, false, true);

        this.mario = new Mario(this.game, 2.5 * PARAMS.BLOCKWIDTH, 0);

        this.loadLevel(levelOne, 2.5 * PARAMS.BLOCKWIDTH, 13 * PARAMS.BLOCKWIDTH, false, true);

    };

    clearEntities() {
        this.game.entities.forEach(function (entity) {
            entity.removeFromWorld = true;
        });
    };

    loadLevel(level, x, y, transition, title) {
        this.title = title;
        this.level = level;
        this.clearEntities();
        this.x = 0;

        
        if (transition) {
            this.game.addEntity(new TransitionScreen(this.game, level, x, y, title));
        } else {
            if (level.bighills) {
                for (let i = 0; i < level.bighills.length; i++) {
                    let hill = level.bighills[i];
                    this.game.addEntity(new BigHill(this.game, hill.x * PARAMS.BLOCKWIDTH, hill.y * PARAMS.BLOCKWIDTH));
                }
            }
            if (level.hills) {
                for (let i = 0; i < level.hills.length; i++) {
                    let hill = level.hills[i];
                    this.game.addEntity(new Hill(this.game, hill.x * PARAMS.BLOCKWIDTH, hill.y * PARAMS.BLOCKWIDTH));
                }
            }
            if (level.bushes) {
                for (let i = 0; i < level.bushes.length; i++) {
                    let bush = level.bushes[i];
                    this.game.addEntity(new Bush(this.game, bush.x * PARAMS.BLOCKWIDTH, bush.y * PARAMS.BLOCKWIDTH, bush.size));
                }
            }
            if (level.clouds) {
                for (let i = 0; i < level.clouds.length; i++) {
                    let cloud = level.clouds[i];
                    this.game.addEntity(new Cloud(this.game, cloud.x * PARAMS.BLOCKWIDTH, cloud.y * PARAMS.BLOCKWIDTH, cloud.size));
                }
            }
            if (level.bigcastles) {
                for (let i = 0; i < level.bigcastles.length; i++) {
                    let castle = level.bigcastles[i];
                    this.game.addEntity(new BigCastle(this.game, castle.x * PARAMS.BLOCKWIDTH, castle.y * PARAMS.BLOCKWIDTH, castle.size));
                }
            }
            if (level.ground) {
                for (let i = 0; i < level.ground.length; i++) {
                    let ground = level.ground[i];
                    this.game.addEntity(new Ground(this.game, ground.x * PARAMS.BLOCKWIDTH, ground.y * PARAMS.BLOCKWIDTH, ground.size * PARAMS.BLOCKWIDTH, level.underground));
                }
            }
            if (level.bricks) {
                for (let i = 0; i < level.bricks.length; i++) {
                    let brick = level.bricks[i];
                    this.game.addEntity(new Brick(this.game, brick.x * PARAMS.BLOCKWIDTH, brick.y * PARAMS.BLOCKWIDTH, brick.type, brick.prize, level.underground));
                }
            }
            if (level.flags) {
                for (let i = 0; i < level.flags.length; i++) {
                    let flag = level.flags[i];
                    this.game.addEntity(new Flag(this.game, flag.x * PARAMS.BLOCKWIDTH, flag.y * PARAMS.BLOCKWIDTH, flag.size * PARAMS.BLOCKWIDTH));
                }
            }
            if (level.blocks) {
                for (let i = 0; i < level.blocks.length; i++) {
                    let block = level.blocks[i];
                    this.game.addEntity(new Block(this.game, block.x * PARAMS.BLOCKWIDTH, block.y * PARAMS.BLOCKWIDTH, block.size * PARAMS.BLOCKWIDTH, level.underground));
                }
            }
            if (level.goombas) {
                for (let i = 0; i < level.goombas.length; i++) {
                    let goomba = level.goombas[i];
                    this.game.addEntity(new Goomba(this.game, goomba.x * PARAMS.BLOCKWIDTH, goomba.y * PARAMS.BLOCKWIDTH));
                }
            }
            if (level.koopas) {
                for (let i = 0; i < level.koopas.length; i++) {
                    let koopa = level.koopas[i];
                    this.game.addEntity(new Koopa(this.game, koopa.x * PARAMS.BLOCKWIDTH, koopa.y * PARAMS.BLOCKWIDTH, koopa.facing));
                }
            }
            if (level.coins) {
                for (let i = 0; i < level.coins.length; i++) {
                    let coin = level.coins[i];
                    this.game.addEntity(new Coin(this.game, coin.x * PARAMS.BLOCKWIDTH, coin.y * PARAMS.BLOCKWIDTH));
                }
            }
            this.mario.x = x;
            this.mario.y = y;
            this.mario.removeFromWorld = false;
            this.mario.velocity = { x: 0, y: 0 };
            this.mario.state = 4

            if (level.music && !this.title) {
                ASSET_MANAGER.pauseBackgroundMusic();
                ASSET_MANAGER.playAsset(level.music);
            }

            const that = this;
            let mario = false;
            this.game.entities.forEach(function(entity) {
                if(that.mario === entity) mario = true;
            });
            if(!mario) this.game.addEntity(this.mario);

            this.time = 400;
            this.game.camera.paused = false;
        }

        this.mario.x = x;
        this.mario.y = y;

    };

    updateAudio() {
        const mute = document.getElementById("mute").checked;
        const volume = document.getElementById("volume").value;

        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);

    };

    update() {
        this.menuButtonTimer += this.game.clockTick;


        if (this.credits && (this.game.A || this.game.B)) {
            this.menuSelectIndex = 0;
        } if (!this.credits && this.menuButtonTimer > this.menuButtonCooldown) {
            if (!this.menuSelect.mario && !this.menuSelect.luigi && !this.menuSelect.credits) {
                if (this.game.up || this.game.down) {
                    this.menuButtonTimer = 0;
                    this.menuSelect.mario = true;
                } 
            } else if (this.menuSelect.mario) {
                if (this.game.up) {
                    this.menuButtonTimer = 0;
                    this.menuSelect.mario = false;
                    this.menuSelect.credits = true;
                } else if (this.game.down) {
                    this.menuButtonTimer = 0;
                    this.menuSelect.mario = false;
                    this.menuSelect.luigi = true;
                }
            } else if (this.menuSelect.luigi) {
                if (this.game.up) {
                    this.menuButtonTimer = 0;
                    this.menuSelect.luigi = false;
                    this.menuSelect.mario = true;
                } else if (this.game.down) {
                    this.menuButtonTimer = 0;
                    this.menuSelect.luigi = false;
                    this.menuSelect.credits = true;
                }
            } else if (this.menuSelect.credits) {
                if (this.game.up) {
                    this.menuButtonTimer = 0;
                    this.menuSelect.credits = false;
                    this.menuSelect.luigi = true;
                } else if (this.game.down) {
                    this.menuButtonTimer = 0;
                    this.menuSelect.credits = false;
                    this.menuSelect.mario = true;
                }
            }
            
        }

        if (this.credits && this.menuButtonTimer > this.menuButtonCooldown) {
            if (this.game.wheel < 0  || this.game.up) {
                if (this.creditsLineIndex <= 0) {
                    this.creditsLineIndex = 0;
                } else {
                    this.creditsLineIndex--;
                }
                this.menuSelectIndex = 0;
                this.menuButtonTimer = 0;
            } 
            else if (this.game.wheel > 0 || this.game.down) {
                if (this.creditsLineIndex >= credits.text.length - 12) {
                    this.creditsLineIndex = credits.text.length - 11;
                } else {
                    this.creditsLineIndex++;
                }
                this.menuSelectIndex = 0;
                this.menuButtonTimer = 0;
            }
        }
        

        if (this.game.mouse && this.game.mouse.y > 9 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 11.5 * PARAMS.BLOCKWIDTH) {
            this.menuSelectIndex = -10;
            this.menuSelect.mario = false;
            this.menuSelect.luigi = false;
            this.menuSelect.credits = false;
        }



        this.updateAudio();


        if (this.title && !this.credits && (this.game.click || this.game.A) && (this.menuButtonTimer > this.menuButtonCooldown)) {
            if (this.menuSelect.mario || (this.game.click && this.game.click.y > 9 * PARAMS.BLOCKWIDTH && this.game.click.y < 9.5 * PARAMS.BLOCKWIDTH)) {
                this.title = false;
                this.mario = new Mario(this.game, 2.5 * PARAMS.BLOCKWIDTH, 0);
                this.loadLevel(levelOne, 2.5 * PARAMS.BLOCKWIDTH, 0, true);
            }
            if (this.menuSelect.luigi || (this.game.click && this.game.click.y > 10 * PARAMS.BLOCKWIDTH && this.game.click.y < 10.5 * PARAMS.BLOCKWIDTH)) {
                this.title = false;
                this.mario = new Mario(this.game, 2.5 * PARAMS.BLOCKWIDTH, 0, true);
                this.loadLevel(levelOne, 2.5 * PARAMS.BLOCKWIDTH, 0, true);
            }
            if (this.menuSelect.credits || (this.game.click && this.game.click.y > 11 * PARAMS.BLOCKWIDTH && this.game.click.y < 11.5 * PARAMS.BLOCKWIDTH)) {
                    this.credits = true;
                    this.menuButtonTimer = 0;
                    this.menuSelect.credits = false;     
            }
        } else if (this.title && this.credits && (this.game.click || this.game.A || this.game.B) && (this.menuButtonTimer > this.menuButtonCooldown)) {
            if (this.game.A || this.game.B || (this.game.click && this.game.click.y > 13.25 * PARAMS.BLOCKWIDTH && this.game.click.y < 13.75 * PARAMS.BLOCKWIDTH)) {
                    this.credits = false;
                    this.menuButtonTimer = 0;
                    this.menuSelect.mario = true;         
            }
        }

        if (this.gameOver) {
            this.gameOver = false;
            this.lives = 3;
            this.score = 0;
            this.coins = 0;
            let x = 2.5 * PARAMS.BLOCKWIDTH;
            let y = 13 * PARAMS.BLOCKWIDTH;
            this.mario = new Mario(this.game, x, y);

            this.clearEntities();

            this.game.addEntity(new TransitionScreen(this.game, levelOne, x, y, true));
        }

        let midpoint = PARAMS.CANVAS_WIDTH/2 - PARAMS.BLOCKWIDTH / 2;

        if (this.x < this.mario.x - midpoint) this.x = this.mario.x - midpoint;

    };

    addCoin() {
        if (this.coins++ === 100) {
            this.coins = 0;
            this.lives++;
        }
    };

    draw(ctx) {
        ctx.font = PARAMS.BLOCKWIDTH / 2 + 'px "Press Start 2P"';
        ctx.fillStyle = "White";

        ctx.fillStyle = "White";
        ctx.fillText("MARIO", 1.5 * PARAMS.BLOCKWIDTH, 1 * PARAMS.BLOCKWIDTH);
        ctx.fillText((this.score + "").padStart(8,"0"), 1.5 * PARAMS.BLOCKWIDTH, 1.5 * PARAMS.BLOCKWIDTH);
        ctx.fillText("x" + (this.coins < 10 ? "0" : "") + this.coins, 6.5 * PARAMS.BLOCKWIDTH, 1.5 * PARAMS.BLOCKWIDTH);
        ctx.fillText("WORLD", 9 * PARAMS.BLOCKWIDTH, 1 * PARAMS.BLOCKWIDTH);
        ctx.fillText(this.level.label, 9.5 * PARAMS.BLOCKWIDTH, 1.5 * PARAMS.BLOCKWIDTH);
        ctx.fillText("TIME", 12.5 * PARAMS.BLOCKWIDTH, 1 * PARAMS.BLOCKWIDTH);
        ctx.fillText(this.time, 13 * PARAMS.BLOCKWIDTH, 1.5 * PARAMS.BLOCKWIDTH);

        if (this.title && !this.credits) {
            let width = 176;
            let height = 88;
            ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/title.png"), 2.5 * PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH, width * PARAMS.SCALE, height * PARAMS.SCALE);
            ctx.fillText("MARIO", 6.75 * PARAMS.BLOCKWIDTH, 9.5 * PARAMS.BLOCKWIDTH);
            ctx.fillText("LUIGI", 6.75 * PARAMS.BLOCKWIDTH, 10.5 * PARAMS.BLOCKWIDTH);
            ctx.fillText("CREDITS", 6.75 * PARAMS.BLOCKWIDTH, 11.5 * PARAMS.BLOCKWIDTH);
        } else if (this.title && this.credits) {
            let width = 176;
            let height = 88;
            ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/title.png"), 4.5 * PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH, width * PARAMS.SCALE / 1.55, height * PARAMS.SCALE / 1.55);
            ctx.fillText("BACK", 7 * PARAMS.BLOCKWIDTH, 13.75 * PARAMS.BLOCKWIDTH);

            ctx.strokeStyle = "Black";
            ctx.lineWidth = 5;
            ctx.strokeRect(4 * PARAMS.BLOCKWIDTH, 5.7 * PARAMS.BLOCKWIDTH, 8 * PARAMS.BLOCKWIDTH, 7.25 * PARAMS.BLOCKWIDTH);
            ctx.lineWidth = 3;
            ctx.strokeRect(4 * PARAMS.BLOCKWIDTH, 6.7 * PARAMS.BLOCKWIDTH, 8 * PARAMS.BLOCKWIDTH, 1)
            ctx.fillText("CREDITS", 5.5 * PARAMS.BLOCKWIDTH, 6.5 * PARAMS.BLOCKWIDTH);


            ctx.font = '15px "Press Start 2P"';
            let j = 0;
            for (let i = this.creditsLineIndex; i < credits.text.length && i < this.creditsLineIndex + 12; i++) {
                let temp = ctx.fillStyle;
                if (credits.text[i].length > 0) {

                    ctx.fillText(credits.text[i], 4.25 * PARAMS.BLOCKWIDTH, (7.25 + 0.5 * j) * PARAMS.BLOCKWIDTH);
                    ctx.fillStyle = temp;
                    j++;
                }
            }
        }

        this.coinAnimation.drawFrame(this.game.clockTick, ctx, 6 * PARAMS.BLOCKWIDTH, 1 * PARAMS.BLOCKWIDTH, 3);


    };
}


