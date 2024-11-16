import load_custom_components from './components';
import load_gameplay_restrictions from './gameplay_restrictions'
import load_world_event_handlers from './events';

const guild_id = process.env.GUILD_ID || '0'

// Loading Gameplay Restrictions
load_gameplay_restrictions()

// Loading Custom Component Scripts
load_custom_components()

// Load Event Handlers
load_world_event_handlers(guild_id)