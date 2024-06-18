const esbuild = require("esbuild");

const external = [
    "@minecraft/server",
    "@minecraft/server-ui",
    "@minecraft/server-admin",
    "@minecraft/server-gametest",
    "@minecraft/server-net",
    "@minecraft/server-common",
    "@minecraft/server-editor",
    "@minecraft/debug-utilities",
];

esbuild
    .build({
        entryPoints: ["behaviour_pack/scripts-dev/main.ts"],
        outfile: "behaviour_pack/scripts/main.js",
        bundle: true,
        minify: true,
        format: "esm",
        external,
    })
    .then(() => {
        console.log("Bundling finished!");
    })
    .catch((error) => {
        console.error(error);
    });