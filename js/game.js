var game = {

    // an object where to store game information
    data : {
        // score
        score : 0
    },


    // Run on page load.
    "onload" : function () {
        // Initialize the video.
        if (!me.video.init(160, 120, {wrapper : "screen", scale : "auto", scaleMethod : "fit"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // Initialize the audio.
        // Remove .ogg file format later, may increase loading speed.
        me.audio.init("mp3,ogg");

        // set and load all resources.
        // (this will also automatically switch to the loading screen)
        me.loader.preload(game.resources, this.loaded.bind(this));
        
        me.sys.gravity = 0;
    },

    // Run on game resources loaded.
    "loaded" : function () {
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());

        // add our player entity in the entity pool
        me.pool.register("mainPlayer", game.PlayerEntity);
        
        
        // keyboard stuff
        me.input.bindKey(me.input.KEY.UP,  "up");
        me.input.bindKey(me.input.KEY.DOWN, "down");
        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        
        // Start the game.
        me.state.change(me.state.PLAY);
    }
};
