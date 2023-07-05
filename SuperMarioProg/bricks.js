class Ground {
    constructor(game, x, y, w, underground) {
        Object.assign(this, { game, x, y, w });

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/bricks.png");

        if (underground) this.spritesheet = ASSET_MANAGER.getAsset("./sprites/underground_stuff.png");


        this.BB = new BoundingBox(this.x, this.y, this.w, PARAMS.BLOCKWIDTH * 2);
    }

    update() {
    }

    draw(ctx) {
        let brickCount = this.w / PARAMS.BLOCKWIDTH;
        for (let i = 0; i < brickCount; i++) {
            ctx.drawImage(this.spritesheet,0,0, 16,16, this.x + i * PARAMS.BLOCKWIDTH - this.game.camera.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
            ctx.drawImage(this.spritesheet, 0,0,16,16, this.x + i * PARAMS.BLOCKWIDTH - this.game.camera.x, this.y + PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
        }
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
        }
    }
}

class Brick {
    constructor(game, x, y, type, prize, underground) {
        Object.assign(this, { game, x, y, prize, type });

        this.bounce = false;

        this.velocity = 0;

        this.startTime = 0;

        this.animation = [];

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/bricks.png");
        if (underground) this.spritesheet = ASSET_MANAGER.getAsset("./sprites/underground_stuff.png");

        this.animation.push(null);
        this.animation.push(new Animator(this.spritesheet, 16, 0, 16, 16, 1, 0.33, 0, false, true));
        this.animation.push(new Animator(ASSET_MANAGER.getAsset("./sprites/coins.png"), 0, 80, 16, 16, 4, 1/8, 0, false, true));
        this.animation.push(new Animator(this.spritesheet, 48, 0, 16, 16, 1, 1, 0, false, true));

        this.BB = new BoundingBox(this.x + PARAMS.BLOCKWIDTH / 8, this.y, PARAMS.BLOCKWIDTH * 3 / 4, PARAMS.BLOCKWIDTH);
        this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH / 2, PARAMS.BLOCKWIDTH);
        this.rightBB = new BoundingBox(this.x + PARAMS.BLOCKWIDTH / 2, this.y, PARAMS.BLOCKWIDTH / 2, PARAMS.BLOCKWIDTH);
    }

    update() {
        const FALL_ACC = 562.5;

        this.velocity += FALL_ACC * this.game.clockTick;
        this.y += this.game.clockTick * this.velocity * PARAMS.SCALE;

        if (this.bounce && this.type < 3) {
            this.bounce = false;
            this.velocity = - 80;

            switch (this.prize) {
                case 'Coins':
                    if (this.startTime === 0) this.startTime = Date.now();
                    if (Date.now() - this.startTime < 3000) { 
                        this.game.addEntity(new CoinPop(this.game, this.x, this.BB.top - PARAMS.BLOCKWIDTH));
                        break;
                    }
                case 'Coin':
                    this.game.addEntity(new CoinPop(this.game, this.x, this.BB.top - PARAMS.BLOCKWIDTH));
                    this.type = 3;
                    break;
                case 'Growth':
                    this.game.addEntity(new Mushroom(this.game, this.x, this.BB.top, this, 'Growth'));
                    this.type = 3;
                    break;
                case '1up':
                    this.game.addEntity(new Mushroom(this.game, this.x, this.BB.top, this, '1up'));
                    this.type = 3;
                    break;
            }
            if (this.type === 1) {
                if (this.game.mario.size === 0) {
                    ASSET_MANAGER.playAsset("./audio/bump.wav");
                } else {
                    ASSET_MANAGER.playAsset("./audio/block.mp3");
                }

            }
        }

        if (this.y > this.BB.top) this.y = this.BB.top;

    }

    draw(ctx) {
        if (this.type) {
            this.animation[this.type].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, PARAMS.SCALE);
        }

    }

    explode(){
        this.removeFromWorld = true;
    }
}

class Block {
    constructor(game, x, y, w, underground) {
        Object.assign(this, { game, x, y, w });

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/bricks.png");
        if (underground) this.spritesheet = ASSET_MANAGER.getAsset("./sprites/underground_stuff.png");
        
        this.BB = new BoundingBox(this.x, this.y, this.w, PARAMS.BLOCKWIDTH);

    }

    update() {
    }

    draw(ctx) {
        let brickCount = this.w / PARAMS.BLOCKWIDTH;
        for (let i = 0; i < brickCount; i++) {
            ctx.drawImage(this.spritesheet, 64, 0, 16, 16, this.x + i * PARAMS.BLOCKWIDTH - this.game.camera.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
        }
    }
}

class Flag {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/flag.png");
        this.flagX = x - 36;
        this.flagY = y + 27;
        this.updateBB();
        this.win = false;
    }
    
    update() {
    }

    draw(ctx) {
        let TICK = this.game.clockTick;

        ctx.drawImage(this.spritesheet, 20, 0, 8, 152, this.x - this.game.camera.x, this.y, PARAMS.BLOCKWIDTH / 2, PARAMS.BLOCKWIDTH * 9.5);
        
        if (this.win) {
            let FLAG_SPEED_SCALE = 6;
            let BLOCK_TOP = 13 * PARAMS.BLOCKWIDTH;
            if (this.flagY < (BLOCK_TOP - PARAMS.BLOCKWIDTH)) {
                this.flagY += PARAMS.BLOCKWIDTH * TICK * FLAG_SPEED_SCALE;
                this.game.disableInput();
                this.game.camera.paused = true;
            }
        }

        ctx.drawImage(this.spritesheet, 2, 1, 16, 16, this.flagX - this.game.camera.x, this.flagY, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);

    }

    updateBB() {
        this.BB = new BoundingBox(this.x + 9, this.y, PARAMS.BLOCKWIDTH / 7, PARAMS.BLOCKWIDTH * 9.5);
    }
}