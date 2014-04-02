var game = {
  data: {
    score: 0
  },

  "onload": function() {
    if (!me.video.init("screen", 800, 600, true, 'auto')) {
      alert("Your browser does not support HTML5 canvas.");
      return;
    }
    /*
    // add "#debug" to the URL to enable the debug Panel
    if (document.location.hash === "#debug") {
      window.onReady(function () {
        me.plugin.register.defer(this, debugPanel, "debug");
      });
    }
    // not working on 1.0
    */
    me.audio.init("mp3,ogg");
    me.loader.onload = this.loaded.bind(this);
    me.loader.preload(game.resources);
    me.state.change(me.state.LOADING);
  },

  "loaded": function() {
    me.state.set(me.state.PLAY, new game.PlayScreen());

    // in melonJS 1.0.0, viewport size is set to Infinity by default
    me.game.viewport.setBounds(0, 0, 800, 600);
    me.state.change(me.state.PLAY);
  }
};
