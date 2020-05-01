melonJS boilerplate
-------------------------------------------------------------------------------

Sample project featuring :
- Video autoscaling
- Mobile optimized HTML/CSS
- Swiping disabled on iOS devices
- Debug Panel (if #debug)
- Default icons
- distribution build
- Standalone build for desktop operating systems
- Optional ES5 shim for non ES5 compliant browser (see index.html)

## To run distribution

To build, be sure you have [node](http://nodejs.org) installed. Clone the project:

    git clone https://github.com/melonjs/boilerplate.git

Then in the cloned directory, simply run:

    npm install

You must also have `grunt-cli` installed globally:

    npm install -g grunt-cli

Running the game:

	grunt serve

And you will have the boilerplate example running on http://localhost:8000

## Building Release Versions

To build:

    grunt

This will create a `build` directory containing the files that can be uploaded to a server, or packaged into a mobile app.

----

Building a standalone desktop release:

    grunt dist

Running the desktop release on Windows:

    .\bin\electron.exe

Running the desktop release on macOS:

    open ./bin/Electron.app

Running the desktop release on Linux:

    ./bin/electron

Note that you may have to edit the file `Gruntfile.js` if you need to better dictate the order your files load in. Note how by default the game.js and resources.js are specified in a specific order.

-------------------------------------------------------------------------------
Copyright (C) 2011 - 2020 Olivier Biot
melonJS is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php)
