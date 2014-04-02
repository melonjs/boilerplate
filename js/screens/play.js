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
