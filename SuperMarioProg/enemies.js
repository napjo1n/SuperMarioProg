class Goomba {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.velocity = { x: -PARAMS.BITWIDTH, y: 0 };
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemies.png");
        this.animation = new Animator(this.spritesheet, 0, 4, 16, 16, 2, 0.2, 14, false, true);
        this.paused = true;
        this.dead = false;
        this.deadCounter = 0;
        this.flickerFlag = true;
        this.updateBB();
    };

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
    };

    update() {
        const FALL_ACC = 1800;

        if (this.dead) {
            if (this.deadCounter === 0) this.game.addEntity(new Score(this.game, this.x, this.y, 100));
            this.deadCounter += this.game.clockTick;
        }
        if (this.paused && this.game.camera.x > this.x - PARAMS.CANVAS_WIDTH) {
            this.paused = false;
        }
        if (!this.paused && !this.dead) {
            this.velocity.y += FALL_ACC * this.game.clockTick;
            this.x += this.game.clockTick * this.velocity.x * PARAMS.SCALE;
            this.y += this.game.clockTick * this.velocity.y * PARAMS.SCALE;
            this.updateBB();

            let that = this;
            this.game.entities.forEach(function (entity) {
                if (entity.BB && that.BB.collide(entity.BB)) {
                    if (entity instanceof Mario) {
                        entity.die();
                    } else if ((entity instanceof Ground || entity instanceof Brick || entity instanceof Block)
                        && that.lastBB.bottom <= entity.BB.top) {
                        that.y = entity.BB.top - PARAMS.BLOCKWIDTH;
                        that.velocity.y = 0;
                        that.updateBB();
                    } else if (entity !== that) {
                        that.velocity.x = -that.velocity.x;
                    }
                }
            });
       }
     };

    draw(ctx) {
        if (this.dead) {
            if (this.flickerFlag) {
                ctx.drawImage(this.spritesheet,
                    0, 4, //source from sheet
                    16, 16,
                    this.x - this.game.camera.x, this.y + PARAMS.BLOCKWIDTH * 3 / 4,
                    PARAMS.BLOCKWIDTH,
                    PARAMS.BLOCKWIDTH / 4);
            }
            this.flickerFlag = !this.flickerFlag;
        } else {
            this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, PARAMS.SCALE)

       }
    };
}

class Koopa {
    constructor(game, x, y, facing, color) {
        Object.assign(this, { game, x, y, facing, color});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemies.png");
        this.animations = [];
        this.animations.push(new Animator(this.spritesheet, 210, 30, 16, 24, 2, 0.2, 14, false, true));
        this.animations.push(new Animator(this.spritesheet, 150, 30, 16, 24, 2, 0.2, 14, false, true));
        this.paused = true;
        this.dead = false;
        this.deadCounter = 0;
        this.updateBB();
    };

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, (1 + 7/16) * PARAMS.BLOCKWIDTH);
    };

    update() {

        if (this.dead) {
            if (this.deadCounter === 0) this.game.addEntity(new Score(this.game, this.x, this.y, 100));
            this.deadCounter += this.game.clockTick;
            this.removeFromWorld = true;
        }
        if (this.paused && this.game.camera.x > this.x - PARAMS.CANVAS_WIDTH) {
            this.paused = false;
        }
        if (!this.paused && !this.dead) {

        }
    };
    draw(ctx) {
        if (this.dead) {
            
        } else {
            this.animations[this.facing].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, PARAMS.SCALE)
            let that = this;
            this.game.entities.forEach(function (entity) {
                if (entity.BB && that.BB.collide(entity.BB)) {
                    if (entity instanceof Mario) {
                        ctx.font = PARAMS.BLOCKWIDTH / 3 + 'px "Press Start 2P"';

                        ctx.fillText("Що таке цикл?", 6 * PARAMS.BLOCKWIDTH, 5.5 * PARAMS.BLOCKWIDTH);
                        ctx.fillText("повторення дій до виконання умови", 1 * PARAMS.BLOCKWIDTH, 8.5 * PARAMS.BLOCKWIDTH);
                        ctx.fillText("перевірка умови на правдивість", 1 * PARAMS.BLOCKWIDTH, 9.5 * PARAMS.BLOCKWIDTH);
                        ctx.fillText("не знаю", 1 * PARAMS.BLOCKWIDTH, 10.5 * PARAMS.BLOCKWIDTH);
                    }
                }
            });
        }
    };
}
