var game = {
  data: {
    score: 0
  },

  "onload": function() {
    if (!me.video.init("screen", 800, 600, true, 'auto')) {
      alert("Your browser does not support HTML5 canvas.");
      return;
    }

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

game.resources = [

	 {name: "melonjs", type:"image", src: "data/img/melonjs.png"},
	 {name: "bg", type:"image", src: "data/img/bg.png"},
];
game.PlayScreen = me.ScreenObject.extend({
  onResetEvent: function() {
    var image = me.loader.getImage('melonjs');
    var bgImage = me.loader.getImage('bg');

    this.bg = new me.SpriteObject(0, 0, bgImage);

    this.logo = new me.SpriteObject(
      me.video.getWidth()/2 - image.width/2,
      me.video.getHeight()/2 - image.height/2,
      image
    );

    me.game.world.addChild(this.bg, 1);
    me.game.world.addChild(this.logo, 2);
    
    this.logo.resize(0.1);
    var tween = new me.Tween(this.logo.scale).to({x: 2, y:2}, 3000)
        .repeat( Infinity )
        .yoyo(true)
        .easing(me.Tween.Easing.Cubic.InOut)
        .start();

  },

  onDestroyEvent: function() {
    me.game.world.removeChild(this.logo);
  }
});
