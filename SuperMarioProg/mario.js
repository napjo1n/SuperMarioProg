class Mario {
    constructor(game, x, y, luigi) {
        Object.assign(this, { game, x, y });

        this.game.mario = this;


        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/mario.png");
        if (luigi) this.spritesheet = ASSET_MANAGER.getAsset("./sprites/luigi.png");


        this.size = 0;
        this.facing = 0;
        this.state = 0;
        this.dead = false;

        // fire mario's state variables
        this.throwFireballTimeElapsed = 0;

        this.velocity = { x: 0, y: 0 };
        this.fallAcc = 562.5;

        this.updateBB();

        // mario's animations
        this.animations = [];
        this.loadAnimations();
    };

    loadAnimations() {
        for (let i = 0; i < 7; i++) { // six states
            this.animations.push([]);
            for (let j = 0; j < 3; j++) { // three sizes (star-power not implemented yet)
                this.animations[i].push([]);
                for (let k = 0; k < 2; k++) { // two directions
                    this.animations[i][j].push([]);
                }
            }
        }

        // стоїть
        // право
        this.animations[0][0][0] = new Animator(this.spritesheet, 210, 0, 16, 16, 1, 0.33, 14, false, true);
        this.animations[0][1][0] = new Animator(this.spritesheet, 209, 52, 16, 32, 1, 0.33, 14, false, true);

        // ліво
        this.animations[0][0][1] = new Animator(this.spritesheet, 179, 0, 16, 16, 1, 0.33, 14, false, true);
        this.animations[0][1][1] = new Animator(this.spritesheet, 180, 52, 16, 32, 1, 0.33, 14, false, true);

        // ходьба
        // право
        this.animations[1][0][0] = new Animator(this.spritesheet, 239, 0, 16, 16, 3, 0.10, 14, false, true);
        this.animations[1][1][0] = new Animator(this.spritesheet, 239, 52, 16, 32, 3, 0.10, 14, true, true);

        // ліво
        this.animations[1][0][1] = new Animator(this.spritesheet, 89, 0, 16, 16, 3, 0.10, 14, true, true);
        this.animations[1][1][1] = new Animator(this.spritesheet, 90, 52, 16, 32, 3, 0.10, 14, false, true);

        // біг
        // право
        this.animations[2][0][0] = new Animator(this.spritesheet, 239, 0, 16, 16, 3, 0.05, 14, false, true);
        this.animations[2][1][0] = new Animator(this.spritesheet, 239, 52, 16, 32, 3, 0.05, 14, true, true);

        // ліво
        this.animations[2][0][1] = new Animator(this.spritesheet, 89, 0, 16, 16, 3, 0.05, 14, true, true);
        this.animations[2][1][1] = new Animator(this.spritesheet, 90, 52, 16, 32, 3, 0.05, 14, false, true);

        // ковзіння
        // право
        this.animations[3][0][0] = new Animator(this.spritesheet, 59, 0, 16, 16, 1, 0.33, 14, false, true);
        this.animations[3][1][0] = new Animator(this.spritesheet, 329, 52, 16, 32, 1, 0.33, 14, false, true);

        // ліво
        this.animations[3][0][1] = new Animator(this.spritesheet, 330, 0, 16, 16, 1, 0.33, 14, false, true);
        this.animations[3][1][1] = new Animator(this.spritesheet, 60, 52, 16, 32, 1, 0.33, 14, false, true);

        // стрибок
        // право
        this.animations[4][0][0] = new Animator(this.spritesheet, 359, 0, 16, 16, 1, 0.33, 14, false, true);
        this.animations[4][1][0] = new Animator(this.spritesheet, 359, 52, 16, 32, 1, 0.33, 14, true, true);

        // ліво
        this.animations[4][0][1] = new Animator(this.spritesheet, 29, 0, 16, 16, 1, 0.33, 14, true, true);
        this.animations[4][1][1] = new Animator(this.spritesheet, 30, 52, 16, 32, 1, 0.33, 14, false, true);

        // присідання
        // право
        this.animations[5][0][0] = new Animator(this.spritesheet, 209, 0, 16, 16, 1, 0.33, 14, false, true);
        this.animations[5][1][0] = new Animator(this.spritesheet, 389, 47, 16, 32, 1, 0.33, 14, false, true);

        // ліво
        this.animations[5][0][1] = new Animator(this.spritesheet, 180, 0, 16, 16, 1, 0.33, 14, false, true);
        this.animations[5][1][1] = new Animator(this.spritesheet, 0, 48, 16, 32, 1, 0.33, 14, false, true);

        // прапорець
        // право
        this.animations[6][0][0] = new Animator(this.spritesheet, 329, 29, 16, 16, 2, 0.12, 14, false, true);
        this.animations[6][1][0] = new Animator(this.spritesheet, 361, 87, 15, 32, 2, 0.12, 14, false, true);

        // ліво
        this.animations[6][0][1] = new Animator(this.spritesheet, 29, 29, 16, 16, 2, 0.12, 14, false, true);
        this.animations[6][1][1] = new Animator(this.spritesheet, 0, 87, 15, 32, 2, 0.12, 14, false, true);

        //смерть
        this.deadAnim = new Animator(this.spritesheet, 0, 16, 16, 16, 1, 0.33, 0, false, true);
    };

    updateBB() {
        if (this.size === 0 || this.size === 3) {
            this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
        }
        else {
            if (this.game.down) // big mario is crouching
                this.BB = new BoundingBox(this.x, this.y + PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
            else 
                this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2);
        }
    };

    updateLastBB() {
        this.lastBB = this.BB;
    };

    die() {
        this.velocity.y = -640;
        this.dead = true;
        ASSET_MANAGER.pauseBackgroundMusic();
    };

    update() {

        const TICK = this.game.clockTick;

        // https://web.archive.org/web/20130807122227/http://i276.photobucket.com/albums/kk21/jdaster64/smb_playerphysics.png
        
        const MIN_WALK = 4;
        const MAX_WALK = 94;
        const MAX_RUN = 154;
        const ACC_WALK = 134;
        const ACC_RUN = 200;
        const DEC_REL = 183;
        const DEC_SKID = 366;

        const STOP_FALL = 1575;
        const WALK_FALL = 1800;
        const RUN_FALL = 2025;
        const STOP_FALL_A = 450;
        const WALK_FALL_A = 422;
        const RUN_FALL_A = 563;

        const MAX_FALL = 270;

        if (this.dead) {
            this.velocity.y += RUN_FALL * TICK;
            this.y += this.velocity.y * TICK * PARAMS.SCALE;
            this.size = 0;

            if (this.y > PARAMS.BLOCKWIDTH * 16) {
                this.dead = false;
                this.game.camera.lives--;
                if (this.game.camera.lives < 0)
                    this.game.camera.gameOver = true;
                else this.game.camera.loadLevel(levelOne, 2.5 * PARAMS.BLOCKWIDTH, 0, true, false);
            }
            
        } else if (this.state === 6) {
            let BLOCK_TOP = 13 * PARAMS.BLOCKWIDTH;
            let MARIO_SLIDE_SPEED = 12;
            let FLAG_WIDTH = PARAMS.BLOCKWIDTH / 7;
            let MARIO_FLIP_DELAY = 1.75;
            let MARIO_JUMP_DELAY = 0.5;
            let BASE_FLAG_HEIGHT = BLOCK_TOP - PARAMS.BLOCKWIDTH;
            //https://mario.fandom.com/wiki/Goal_Pole

            let scoreAdd = 0;

            if (this.size === 0) {
                if (this.y < (BLOCK_TOP - PARAMS.BLOCKWIDTH)) {
                    this.y += PARAMS.BLOCKWIDTH * TICK * MARIO_SLIDE_SPEED;
                } else {
                    if (!this.scored) {
                        if (this.flagTouchedY > BASE_FLAG_HEIGHT - PARAMS.BLOCKWIDTH) {
                            scoreAdd = 100;
                        } else if (this.flagTouchedY > BASE_FLAG_HEIGHT - 3 * PARAMS.BLOCKWIDTH) {
                            scoreAdd = 400;
                        } else if (this.flagTouchedY > BASE_FLAG_HEIGHT - 5 * PARAMS.BLOCKWIDTH) {
                            scoreAdd = 800;
                        } else {
                            scoreAdd = 2000;
                        }
                        this.game.addEntity(new Score(this.game, this.x, this.y, scoreAdd));
                        this.scored = true;
                    }
                    this.doneSliding = true;
                }
            } else {
                if (this.y < (BLOCK_TOP - 2 * PARAMS.BLOCKWIDTH)) {
                    this.y += PARAMS.BLOCKWIDTH * TICK * MARIO_SLIDE_SPEED;
                } else {
                    if (!this.scored) {
                        if (this.flagTouchedY > BASE_FLAG_HEIGHT - PARAMS.BLOCKWIDTH) {
                            scoreAdd = 100;
                        } else if (this.flagTouchedY > BASE_FLAG_HEIGHT - 3 * PARAMS.BLOCKWIDTH) {
                            scoreAdd = 400;
                        } else if (this.flagTouchedY > BASE_FLAG_HEIGHT - 5 * PARAMS.BLOCKWIDTH) {
                            scoreAdd = 800;
                        } else {
                            scoreAdd = 2000;
                        }
                        this.game.addEntity(new Score(this.game, this.x, this.y, scoreAdd));
                        this.scored = true;
                    }
                    this.doneSliding = true;
                }
            } 
            if (this.doneSliding) {
                if (!this.flipped) {
                    if (this.timer === undefined) {
                        this.timer = 0;
                        
                    } else {
                        this.timer += TICK;
                    }
                    if (this.timer && this.timer > MARIO_FLIP_DELAY) {
                        this.facing = 1;
                        this.x += FLAG_WIDTH + PARAMS.BLOCKWIDTH;
                        this.flipped = true;
                        this.timer = undefined;
                    }
                } else {
                    if (this.timer === undefined) {
                        this.timer = 0;
                        
                    } else {
                        this.timer += TICK;
                    }
                    if (this.timer && this.timer > MARIO_JUMP_DELAY) {
                        this.state = 4;
                        this.velocity.x = 240;
                        this.velocity.y = -50;
                        this.facing = 1;
                    }
                    
                }
            }
            
            
        } else {
            if (!this.game.camera.title) {
                if (this.state !== 4) {
                    if (Math.abs(this.velocity.x) < MIN_WALK) {
                        this.velocity.x = 0;
                        this.state = 0;
                        if (this.game.left && !this.game.down) {
                            this.velocity.x -= MIN_WALK;
                        }
                        if (this.game.right && !this.game.down) {
                            this.velocity.x += MIN_WALK;
                        }
                    }
                    else if (Math.abs(this.velocity.x) >= MIN_WALK) {
                        if (this.facing === 0) {
                            if (this.game.right && !this.game.left && !this.game.down) {
                                if (this.game.B) {
                                    this.velocity.x += ACC_RUN * TICK;
                                } else this.velocity.x += ACC_WALK * TICK;
                            } else if (this.game.left && !this.game.right && !this.game.down) {
                                this.velocity.x -= DEC_SKID * TICK;
                                this.state = 3;
                            } else {
                                this.velocity.x -= DEC_REL * TICK;
                            }
                        }
                        if (this.facing === 1) {
                            if (this.game.left && !this.game.right && !this.game.down) {
                                if (this.game.B) {
                                    this.velocity.x -= ACC_RUN * TICK;
                                } else this.velocity.x -= ACC_WALK * TICK;
                            } else if (this.game.right && !this.game.left && !this.game.down) {
                                this.velocity.x += DEC_SKID * TICK;
                                this.state = 3;
                            } else {
                                this.velocity.x += DEC_REL * TICK;
                            }
                        }
                    }

                    this.velocity.y += this.fallAcc * TICK;

                    if (this.game.A) {
                        if (Math.abs(this.velocity.x) < 16) {
                            this.velocity.y = -240;
                            this.fallAcc = STOP_FALL;
                        }
                        else if (Math.abs(this.velocity.x) < 40) {
                            this.velocity.y = -240;
                            this.fallAcc = WALK_FALL;
                        }
                        else {
                            this.velocity.y = -300;
                            this.fallAcc = RUN_FALL;
                        }
                        this.state = 4;

                        if (this.size === 0) {
                            ASSET_MANAGER.playAsset("./audio/small-jump.mp3");
                        } else {
                            ASSET_MANAGER.playAsset("./audio/super-jump.mp3");
                        }
                    }

                } else {
                    if (this.velocity.y < 0 && this.game.A) {
                        if (this.fallAcc === STOP_FALL) this.velocity.y -= (STOP_FALL - STOP_FALL_A) * TICK;
                        if (this.fallAcc === WALK_FALL) this.velocity.y -= (WALK_FALL - WALK_FALL_A) * TICK;
                        if (this.fallAcc === RUN_FALL) this.velocity.y -= (RUN_FALL - RUN_FALL_A) * TICK;
                    }

                    if (this.game.right && !this.game.left) {
                        if (Math.abs(this.velocity.x) > MAX_WALK) {
                            this.velocity.x += ACC_RUN * TICK;
                        } else this.velocity.x += ACC_WALK * TICK;
                    } else if (this.game.left && !this.game.right) {
                        if (Math.abs(this.velocity.x) > MAX_WALK) {
                            this.velocity.x -= ACC_RUN * TICK;
                        } else this.velocity.x -= ACC_WALK * TICK;
                    } else {
                    }
                }
            }

            this.velocity.y += this.fallAcc * TICK;

            if (this.velocity.y >= MAX_FALL) this.velocity.y = MAX_FALL;
            if (this.velocity.y <= -MAX_FALL) this.velocity.y = -MAX_FALL;

            if (this.velocity.x >= MAX_RUN) this.velocity.x = MAX_RUN;
            if (this.velocity.x <= -MAX_RUN) this.velocity.x = -MAX_RUN;
            if (this.velocity.x >= MAX_WALK && !this.game.B) this.velocity.x = MAX_WALK;
            if (this.velocity.x <= -MAX_WALK && !this.game.B) this.velocity.x = -MAX_WALK;


            this.x += this.velocity.x * TICK * PARAMS.SCALE;
            this.y += this.velocity.y * TICK * PARAMS.SCALE;
            this.updateLastBB();
            this.updateBB();

            if (this.y > PARAMS.BLOCKWIDTH * 16) this.die();

            const that = this;
            this.game.entities.forEach(function (entity) {
                if (entity.BB && that.BB.collide(entity.BB)) {
                    if (that.velocity.y > 0) {
                        if ((entity instanceof Ground || entity instanceof Brick || entity instanceof Block)
                            && (that.lastBB.bottom) <= entity.BB.top) {
                            if (that.size === 0 || that.size === 3) {
                                that.y = entity.BB.top - PARAMS.BLOCKWIDTH;
                            } else {
                                that.y = entity.BB.top - 2 * PARAMS.BLOCKWIDTH;
                            }
                            that.velocity.y = 0;

                            if(that.state === 4) that.state = 0;

                        }
                        else if ((entity instanceof Goomba )
                            && (that.lastBB.bottom) <= entity.BB.top
                            && !entity.dead) {
                            entity.dead = true;
                            that.velocity.y = -240;
                            ASSET_MANAGER.playAsset("./audio/stomp.mp3");
                        }
                        else if ((entity instanceof Koopa )
                            && (that.lastBB.bottom) <= entity.BB.top
                            && !entity.dead) {
                            // прописати питання
                        }
                    }
                    else if (that.velocity.y < 0) {
                        if ((entity instanceof Brick)
                            && (that.lastBB.top) >= entity.BB.bottom) {

                            if (that.BB.collide(entity.leftBB) && that.BB.collide(entity.rightBB)) {
                                entity.bounce = true;
                                that.velocity.y = 0;

                                if(entity.type == 1 && that.size != 0 && that.size != 3){
                                    entity.explode();
                                }
                            }
                            else if (that.BB.collide(entity.leftBB)) {
                                that.x = entity.BB.left - PARAMS.BLOCKWIDTH;
                            }
                            else {
                                that.x = entity.BB.right;
                            }
                            
                        }
                    }
                    if ((entity instanceof Brick && entity.type)
                        && that.BB.collide(entity.BB)) {
                        let overlap = that.BB.overlap(entity.BB);
                        if (overlap.y > 2) {
                            if (that.BB.collide(entity.leftBB) && that.lastBB.right <= entity.BB.left) {
                                that.x = entity.BB.left - PARAMS.BLOCKWIDTH;
                                if (that.velocity.x > 0) that.velocity.x = 0;
                            } else if (that.BB.collide(entity.rightBB) && that.lastBB.left >= entity.BB.right) {
                                that.x = entity.BB.right;
                                if (that.velocity.x < 0) that.velocity.x = 0;
                            }
                        }
                    }
                    else if (entity instanceof Ground || entity instanceof Block) {
                        if (that.lastBB.right <= entity.BB.left) {
                            that.x = entity.BB.left - PARAMS.BLOCKWIDTH;
                            if (that.velocity.x > 0) that.velocity.x = 0;
                        } else if (that.lastBB.left >= entity.BB.right) {
                            that.x = entity.BB.right;
                            if (that.velocity.x < 0) that.velocity.x = 0;
                        }
                    }
                    else if (entity instanceof Mushroom && !entity.emerging) {
                        entity.removeFromWorld = true;
                        if (entity.type === 'Growth') {
                            that.y -= PARAMS.BLOCKWIDTH;
                            that.size = 1;
                            that.game.addEntity(new Score(that.game, that.x, that.y, 1000));
                        } else {
                            that.game.camera.lives++;
                        }
                    }
                    else if (entity instanceof Coin) {
                        entity.removeFromWorld = true;
                        that.game.camera.score += 200;
                        that.game.camera.addCoin();
                    }
                    else if (entity instanceof Flag) {
                        that.x = entity.BB.left - PARAMS.BLOCKWIDTH;
                        that.velocity.x = 0;
                        entity.win = true;
                        that.state = 6;
                        that.win = true;
                        if (!that.flagTouchedY) {
                            that.flagTouchedY = that.y;
                        }
                    }
                }

                that.updateBB();
            });

            if (this.state !== 4 && this.state !== 6) {
                if (this.game.down) this.state = 5;
                else if (Math.abs(this.velocity.x) > MAX_WALK) this.state = 2;
                else if (Math.abs(this.velocity.x) >= MIN_WALK) this.state = 1;
                else this.state = 0;
            } else {

            }


            if (this.velocity.x < 0) this.facing = 1;
            if (this.velocity.x > 0) this.facing = 0;

        }
    };


    draw(ctx) {
        if (this.dead) {
            this.deadAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, PARAMS.SCALE);
        } else if (this.size == 2 && this.game.B && this.throwFireballTimeElapsed < 0.1) { // throwing fireballs
            if (this.facing == 0) {
                ctx.drawImage(this.spritesheet, 287, 122, 16, 32, this.x - this.game.camera.x, this.y, PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH);
            } else {
                ctx.drawImage(this.spritesheet, 102, 122, 16, 32, this.x - this.game.camera.x, this.y, PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH);
            }
        } else {
            this.animations[this.state][this.size][this.facing].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, PARAMS.SCALE);
        }
    };
}
