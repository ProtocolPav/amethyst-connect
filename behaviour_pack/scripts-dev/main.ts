import { world, system } from '@minecraft/server';
import { elytraCheck } from './elytra_plugin';
import { load as chat_link_plugin } from "./chat_link";
import {load as border_plugin} from './border';
import {load as logs_plugin} from './logs';

import config from '../amethyst.json';

const guild_id = config.guild_id


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
chat_link_plugin()
border_plugin()
logs_plugin(guild_id)