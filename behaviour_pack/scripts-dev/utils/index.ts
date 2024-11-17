import DeathMessage from './death_messages'
import checks from './checks'
import send_motd from './motd'
import sleep from './sleep'
import commands from './commands'
import convert_seconds_to_hms from './time_string'
import clean_id from './clean_minecraft_ids'
import combine from './combine_two_lists'

const utils = {
    DeathMessage,
    send_motd,
    checks,
    sleep,
    commands,
    convert_seconds_to_hms,
    clean_id,
    combine
}

export default utils