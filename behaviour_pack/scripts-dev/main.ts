import { world, system } from '@minecraft/server';
import { elytraCheck } from './elytra_plugin';
import { load as chat_link_plugin } from "./chat_link/index";
import {load as border_plugin} from './border/index';
import {load as interactions_plugin} from './interactions/index';

import config from '../amethyst.json';

// Loads the guild ID from the config file,
// but when NexusCore is done, it should check
// if the config file is empty. If it is,
// get the ID from NexusCore.
const guild_id = config.guild_id
const webhook_url = config.webhook_url


// Runs certain functions every second. 1 second = 20 ticks
system.runInterval(() => {
    let playerlist = world.getPlayers();

    playerlist.forEach((player) => {
        elytraCheck(player)
    });
}, 20)

// Loading all plugins.
// This should be done differently, by getting a list
// of all plugins from NexusCore and then importing each
// within a for loop and loading
chat_link_plugin(guild_id, webhook_url)
border_plugin()
interactions_plugin(guild_id)