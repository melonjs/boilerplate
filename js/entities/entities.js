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

            // update the entity velocity
            if (this.distanceTo(me.game.world.children.find((e)=>{return e.name == 'stopEntity'})) >= 9) { //Return here
                this.body.vel.y = -0.3 * me.timer.tick;
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

                // update the entity velocity
                this.body.vel.y -= this.body.accel.y * me.timer.tick;
                }
            else if (me.input.isKeyPressed('down')) {
                moving = true;

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
    me.game.world.children.find((e)=>{return e.name == 'Shadow'}).alpha = 0.9;

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

/**
 * an enemy Entity
 */
 game.EnemyEntity = me.Sprite.extend(
 {
     init: function (x, y, settings)
     {
         // save the area size as defined in Tiled
         var width = settings.width;

         // define this here instead of tiled
         settings.image = "wheelie_right";

         // adjust the size setting information to match the sprite size
         // so that the entity object is created with the right size
         settings.framewidth = settings.width = 64;
         settings.frameheight = settings.height = 64;

         // call the parent constructor
         this._super(me.Sprite, 'init', [x, y , settings]);

         // add a physic body
         this.body = new me.Body(this);
         // add a default collision shape
         this.body.addShape(new me.Rect(0, 0, this.width, this.height));
         // configure max speed and friction
         this.body.setMaxVelocity(4, 6);
         this.body.setFriction(0.4, 0);
         // enable physic collision (off by default for basic me.Renderable)
         this.isKinematic = false;

         // set start/end position based on the initial area size
         x = this.pos.x;
         this.startX = x;
         this.pos.x = this.endX = x + width - this.width;
         //this.pos.x  = x + width - this.width;

         // to remember which side we were walking
         this.walkLeft = false;

         // make it "alive"
         this.alive = true;
     },

     // manage the enemy movement
     update : function (dt)
     {
         if (this.alive)
         {
             if (this.walkLeft && this.pos.x <= this.startX)
             {
                 this.walkLeft = false;
                 this.body.force.x = this.body.maxVel.x;
             }
             else if (!this.walkLeft && this.pos.x >= this.endX)
             {
                 this.walkLeft = true;
                 this.body.force.x = -this.body.maxVel.x;
             }

             this.flipX(this.walkLeft);
         }
         else
         {
             this.body.force.x = 0;
         }
         // check & update movement
         this.body.update(dt);

         // handle collisions against other shapes
         me.collision.check(this);

         // return true if we moved or if the renderable was updated
         return (this._super(me.Sprite, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
     },

     /**
      * colision handler
      * (called when colliding with other objects)
      */
     onCollision : function (response, other) {
         if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
             // res.y >0 means touched by something on the bottom
             // which mean at top position for this one
             if (this.alive && (response.overlapV.y > 0) && response.a.body.falling) {
                 this.renderable.flicker(750);
             }
             return false;
         }
         // Make all other objects solid
         return true;
     }
 });