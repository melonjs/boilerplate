melonJS boilerplate
-------------------------------------------------------------------------------

features :
- video autoscaling
- mobile optimized HTML/CSS
- swiping disabled on iOS devices
- debug Panel (if #debug)
- distribution build

## To run distribution

To build, be sure you have [node](http://nodejs.org) installed. Clone the project:

    git clone https://github.com/melonjs/boilerplate.git

Then in the cloned directory, simply run:

    npm install

To build:

    grunt

Note that you may have to edit the file `Gruntfile.js` if you need to better dictate the order your files load in. Note how by default the game.js and resources.js are specified in a specific order. You can also add other files this way. So if you need to copy over jQuery or another file from lib for example.

-------------------------------------------------------------------------------
Copyright (C) 2011 - 2013, Olivier Biot, Jason Oster
melonJS is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php)
