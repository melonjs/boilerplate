melonJS boilerplate
-------------------------------------------------------------------------------

features :
- video autoscaling
- mobile optimized HTML/CSS
- swiping disabled on iOS devices
- debug Panel (if #debug)
- default icons
- distribution build

## To run distribution

To build, be sure you have [node](http://nodejs.org) installed. Clone the project:

    git clone https://github.com/melonjs/boilerplate.git

Then in the cloned directory, simply run:

    npm install

To build:

    grunt


Running the game:

	grunt connect	

And you will have the boilerplate example running on http://localhost:8000


Note that you may have to edit the file `Gruntfile.js` if you need to better dictate the order your files load in. Note how by default the game.js and resources.js are specified in a specific order.

-------------------------------------------------------------------------------
Copyright (C) 2011 - 2014 Olivier Biot, Jason Oster, Aaron McLeod
melonJS is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php)
