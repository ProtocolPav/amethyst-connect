import load_custom_components from './components';
import load_gameplay_restrictions from './gameplay_restrictions'
import load_world_event_handlers from './world_events';

import config from '../amethyst.json';

// Loads the guild ID from the config file,
// but when NexusCore is done, it should check
// if the config file is empty. If it is,
// get the ID from NexusCore.
const guild_id = config.guild_id

// Loading Gameplay Restrictions
load_gameplay_restrictions()

// Loading Custom Component Scripts
load_custom_components()

// Load Event Handlers
load_world_event_handlers(guild_id)