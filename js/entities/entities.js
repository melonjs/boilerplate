/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({    
  
    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);
    },

    /**
     * update the entity
     */
    update : function (dt) {
        
        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);
             
        // update animation if required
        if (this.body.vel.x! == 0 || this.body.vel.y !== 0) {
            // update object animation
            this._super(me.Entity, 'update', [dt]);
            return true;
        }
        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;
    },
    
   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        // Make all other objects solid
        return true;
    }
});