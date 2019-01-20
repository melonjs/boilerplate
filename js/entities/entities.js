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
        
        this.renderable.addAnimation("stand",  [1]);
        this.renderable.addAnimation("walk",  [1]);
        this.renderable.addAnimation("die",  [3, 1, 3, 1, 3, 1]);
        this.renderable.addAnimation("dead",  [4]);
        
        // set the standing animation as default
        this.renderable.setCurrentAnimation("walk");
    },

    /**
     * update the entity
     */
    update : function (dt) {
        
        if (!this.alive) {
            this.body.vel.y = this.body.vel.x = 0;
            if (!this.renderable.isCurrentAnimation("die") && !this.renderable.isCurrentAnimation("dead")) {
//                this.renderable.setCurrentAnimation("die", "stand");
                this.renderable.setCurrentAnimation("die", "dead");
            }
            if (this.renderable.isCurrentAnimation("dead") && !game.data.wait_for_reload) {
                game.data.wait_for_reload = true;
                setTimeout(()=>{
                    game.data.wait_for_reload = false;
                    if (--game.data.lives == 0) {
                        me.levelDirector.loadLevel("tavern")
                        game.data.lives = 3;
                        game.data.keys = 0;
                    } else {
                        me.levelDirector.reloadLevel();
                    }                    
                }, 3000);

            }
            
            if (this.renderable.isCurrentAnimation("stand")) {
                this.alive = true;
            }
            
            this.body.update(dt);
            
            me.collision.check(this);
            
            return this._super(me.Entity, 'update', [dt]);
        }
        
        if (game.data.frozen) {
            moving = true;

            // update the entity velocity
            if (this.distanceTo(me.game.world.children.find((e)=>{return e.name == 'stopEntity'})) >= 9) { //Return here
                this.body.vel.y = -0.3 * me.timer.tick;
            } else {
                moving = false;
                game.data.flag = true;
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
        if (response.b.body.collisionType == me.collision.types.ENEMY_OBJECT) {
          this.alive = false;
        }
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
    
    // Handle Audio
    me.audio.stopTrack();
    me.audio.setVolume(0.055);
    me.audio.playTrack("cave-audio");

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

game.doorEntity = me.CollectableEntity.extend({
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

game.vampireEntity = me.Entity.extend({ // TODO: Re-add to tiled. AFTER REIGONALS!!! image: vampire, framewidth: 8
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    // call the parent constructor
    this._super(me.Entity, 'init', [x, y , settings]);
    
    // this.renderable.addAnimation("normal",  [0]);
    // this.renderable.setCurrentAnimation("normal");
    
    me.game.world.children.find((e)=>{return e.name == 'Shadow'}).alpha = 0;
    me.game.world.children.find((e)=>{return e.name == 'tobecontinued'}).alpha = 0;
  },
  update : function (dt) {
      if (game.data.flag) {
          me.game.world.children.find((e)=>{return e.name == 'Shadow'}).alpha += 0.01;
          if (me.game.world.children.find((e)=>{return e.name == 'Shadow'}).alpha > 1) {
              me.game.world.children.find((e)=>{return e.name == 'tobecontinued'}).alpha += 0.1;
              me.game.world.children.find((e)=>{return e.name == 'Shadow'}).alpha = 1;
          }
          // this.body.vel.y += 0.5 * me.timer.tick;
          // this.body.update(dt);
          
      }
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
    me.collision.check(this);
  },

  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {    
    return false
  }
});
 
 game.skelespiderEntity = me.Entity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    
    
    // call the parent constructor
    this._super(me.Entity, 'init', [x, y , settings]);
    
    // set the default horizontal & vertical speed (accel vector)
    this.body.setVelocity(0.3, 0.3);    
    this.renderable.addAnimation("stand",  [0]);
    this.renderable.setCurrentAnimation("stand");
  },
  update : function (dt) {
     var player = me.game.world.children.find((e)=>{return e.name == 'mainPlayer'});
     
     if (player.alive) {
         if (this.distanceTo(player) <= 30) {
             var angle = this.angleTo(player)
             this.body.vel.y += Math.sin(angle) * this.body.accel.y * me.timer.tick;
             this.body.vel.x += Math.cos(angle) * this.body.accel.x * me.timer.tick;
             this.body.update(dt);
         } else {
             this.body.vel.y = this.body.vel.x = 0;
             this.body.update(dt)
         }
     }
     
     // handle collisions against other shapes
     me.collision.check(this);
     
     // return true if we moved or if the renderable was updated
     return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);     
  },
  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {
      if (response.b.body.collisionType == me.collision.types.WORLD_SHAPE) {
          return true;
      }
      return false;
  }
});

game.spikesEntity = me.Entity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    // call the parent constructor
    this._super(me.Entity, 'init', [x, y , settings]);
  },

  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {
      return false;
  }
});