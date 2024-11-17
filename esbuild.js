const esbuild = require("esbuild");

const guildId = process.env.GUILD_ID;

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
        minify: false,
        format: "esm",
        external,
        define: {
            'process.env.GUILD_ID': JSON.stringify(guildId), // Inject GUILD_ID at build time
        },
    })
    .then(() => {
        console.log("Bundling finished!");
    })
    .catch((error) => {
        console.error(error);
    });