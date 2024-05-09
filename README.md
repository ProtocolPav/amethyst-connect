# amethyst-connect
A minecraft bedrock addon designed to be used with Amethyst

## Development of the Addon
The `scripts-dev` directory holds all of the files for development of the addon.
Each plugin should be in its own file. This helps keep things organized.

## Publishing the Addon
1. Always bump the version number to the correct number
    - E.g. if you are working in the `v1.3` branch, when creating a pull request to main, make sure you bump the manifest number.
2. You should have **Node** installed. Run `node esbuild.js` to run the `esbuild` file.
    - This will create a `main.js` script in the `scripts` directory.
    - Minecraft does NOT accept Typescript files, so we MUST convert it to javascript.


There is a chance you may not be able to run esbuild.js. To run it, you need to have esbuild installed.
Install it using
```
npm install --save-dev esbuild
```