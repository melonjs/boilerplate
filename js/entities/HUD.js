/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

    init: function() {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // give a name
        this.name = "HUD";

        // add our child score object at the top left corner
        //this.addChild(new game.HUD.KeyItem(5, 5));
    }
});

game.HUD.KeyItem = me.Renderable.extend({
    /**
     * constructor
     */
    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        // local copy of the global score
        this.score = -1;
        
        this.font = new me.BitmapFont(me.loader.getBinary('font.fnt'), me.loader.getImage('font.png'));
        
        this.font.textAlign = "right";
        this.font.textBaseline = "bottom";

    },

    /**
     * update function
     */
    update : function () {
        // we don't do anything fancy here, so just
        // return true if the score has been updated
        if (this.score !== game.data.keys) {
            this.score = game.data.keys;
            return true;
        }
        return false;
    },

    /**
     * draw the score
     */
    draw : function (context) {
        this.font.draw (context, game.data.keys, me.game.viewport.width + this.pos.x, me.game.viewport.height + this.pos.y);
    }

});