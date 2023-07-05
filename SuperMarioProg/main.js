let ASSET_MANAGER = new AssetManager();

// spritesheets
ASSET_MANAGER.queueDownload("./sprites/mario.png");
ASSET_MANAGER.queueDownload("./sprites/luigi.png");
ASSET_MANAGER.queueDownload("./sprites/enemies.png");
ASSET_MANAGER.queueDownload("./sprites/tiles.png");
ASSET_MANAGER.queueDownload("./sprites/ground.png");
ASSET_MANAGER.queueDownload("./sprites/bricks.png");
ASSET_MANAGER.queueDownload("./sprites/items.png");
ASSET_MANAGER.queueDownload("./sprites/coins.png");
ASSET_MANAGER.queueDownload("./sprites/firebar_fire.png");
ASSET_MANAGER.queueDownload("./sprites/title.png");
ASSET_MANAGER.queueDownload("./sprites/underground_stuff.png");
ASSET_MANAGER.queueDownload("./sprites/title_mushroom.png");
ASSET_MANAGER.queueDownload("./sprites/mouse_wheel.png");
ASSET_MANAGER.queueDownload("./sprites/castle_big.png");
ASSET_MANAGER.queueDownload("./sprites/flag.png");

// music
ASSET_MANAGER.queueDownload("./music/overworld.mp3");


// sound effects
ASSET_MANAGER.queueDownload("./audio/small-jump.mp3");
ASSET_MANAGER.queueDownload("./audio/super-jump.mp3");
ASSET_MANAGER.queueDownload("./audio/stomp.mp3");
ASSET_MANAGER.queueDownload("./audio/block.mp3");
ASSET_MANAGER.queueDownload("./audio/bump.wav");

ASSET_MANAGER.downloadAll(function () {
	let gameEngine = new GameEngine();

	ASSET_MANAGER.autoRepeat("./music/overworld.mp3");


	PARAMS.BLOCKWIDTH = PARAMS.BITWIDTH * PARAMS.SCALE;

	let canvas = document.getElementById('gameWorld');
	let ctx = canvas.getContext('2d');

	PARAMS.CANVAS_WIDTH = canvas.width;
	PARAMS.CANVAS_HEIGHT = canvas.height;

	gameEngine.init(ctx);
		
	new SceneManager(gameEngine);

	gameEngine.start();
});
