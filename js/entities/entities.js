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
        
        // set the default horizontal & vertical speed (accel vector)
        this.body.setVelocity(1, 1);

        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        
        // define a basic walking animation (using all frames)
        this.renderable.addAnimation("walk",  [0, 1, 2, 3, 4, 5]);

        // define a standing animation (using the first frame)
        this.renderable.addAnimation("stand",  [0]);

        // set the standing animation as default
        this.renderable.setCurrentAnimation("walk");
    },

    /**
     * update the entity
     */
    update : function (dt) {
        if (game.data.frozen) {
            moving = true;
            // flip the sprite on horizontal axis
            this.renderable.flipY(true);

            // update the entity velocity
            if (this.distanceTo(me.game.world.children.find((e)=>{return e.name == 'stopEntity'})) >= 9) { //Return here
                this.body.vel.y = -0.5 * me.timer.tick;
            } else {
                moving = false;
            }
        } else {
            var moving = false;
            if (me.input.isKeyPressed('left')) {
                moving = true;
                // flip the sprite on horizontal axis
                this.renderable.flipX(true);

                // update the entity velocity
                this.body.vel.x -= this.body.accel.x * me.timer.tick;
                }
            else if (me.input.isKeyPressed('right')) {
                moving = true;
                // unflip the sprite
                this.renderable.flipX(false);

                // update the entity velocity
                this.body.vel.x += this.body.accel.x * me.timer.tick;
            } else {
                  this.body.vel.x = 0;
            }
            if (me.input.isKeyPressed('up')) {
                moving = true;
                // flip the sprite on horizontal axis
                this.renderable.flipY(true);

                // update the entity velocity
                this.body.vel.y -= this.body.accel.y * me.timer.tick;
                }
            else if (me.input.isKeyPressed('down')) {
                moving = true;
                // unflip the sprite
                this.renderable.flipY(false);

                // update the entity velocity
                this.body.vel.y += this.body.accel.y * me.timer.tick;
            } else {
                  this.body.vel.y = 0;
            }
        }
        
        if (moving) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else {
            if (!this.renderable.isCurrentAnimation("stand")) {
                this.renderable.setCurrentAnimation("stand");
            }
        }
        
        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
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

/**
 * a Key entity
 */
game.KeyEntity = me.CollectableEntity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    // call the parent constructor
    this._super(me.CollectableEntity, 'init', [x, y , settings]);

  },

  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {
    // do something when collected

    // make sure it cannot be collected "again"
    this.body.setCollisionMask(me.collision.types.NO_OBJECT);

    // remove it
    me.game.world.removeChild(this);
    
    game.data.keys += 1;

    return false
  }
});

game.unhideEntity = me.Entity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    // call the parent constructor
    this._super(me.CollectableEntity, 'init', [x, y , settings]);
    me.game.world.children.find((e)=>{return e.name == 'Shadow'}).alpha = 0.8;

  },

  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {
    me.game.world.children.find((e)=>{return e.name == 'Shadow'}).alpha = 0;
    // me.game.world.children[1].alpha = 0;
    me.game.world.removeChild(this);
    
    return false
  }
});

game.doorEntity = me.Entity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    // call the parent constructor
    this._super(me.CollectableEntity, 'init', [x, y , settings]);
    
    this.renderable.addAnimation("closed",  [0]);
    this.renderable.addAnimation("open",  [1]);
    this.renderable.setCurrentAnimation("closed");
    
    if (typeof(settings.direction) !== 'undefined') {
        this.renderable.addAnimation("closed",  [1]);
        this.renderable.addAnimation("open",  [0]);
        this.renderable.setCurrentAnimation("closed");
    } else {
        this.renderable.addAnimation("closed",  [0]);
        this.renderable.addAnimation("open",  [1]);
        this.renderable.setCurrentAnimation("closed");
    }
  },

  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {
      if (this.renderable.isCurrentAnimation("closed")) {
        if (game.data.keys > 0) {
            game.data.keys--;
            this.renderable.setCurrentAnimation("open");
            this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        } else {
            console.log("The door remains stubbornly shut")
        }
      }
      return false;
  }
});

game.vampireEntity = me.Entity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    // call the parent constructor
    this._super(me.CollectableEntity, 'init', [x, y , settings]);
    
    this.renderable.addAnimation("normal",  [0]);
    this.renderable.setCurrentAnimation("normal");
  },

  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {
      return false;
  }
});

game.stopEntity = me.Entity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    // call the parent constructor
    this._super(me.CollectableEntity, 'init', [x, y , settings]);
    game.data.frozen = true;
  },

  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {    
    return false
  }
});