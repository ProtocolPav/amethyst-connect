import { Entity, Block, Player, system, EquipmentSlot, EntityComponentTypes, EntityDamageCause, Dimension } from '@minecraft/server';
import { HttpRequest, HttpHeader, HttpRequestMethod, http } from '@minecraft/server-net';


export function log_block_event(event_type: string, dimension: Dimension, player: Player, block: Block, block_id: string, thorny_id_map: object) {
    const mainhand = player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand)?.typeId ?? null

    const payload = JSON.stringify({
        "thorny_id": thorny_id_map[player.name],
        "type": event_type,
        "position_x": block.x,
        "position_y": block.y,
        "position_z": block.z,
        "reference": block_id,
        "mainhand": mainhand,
        "dimension": dimension.id
      })

      const request = new HttpRequest(`http://nexuscore:8000/api/v0.1/events/interaction`);
      request.method = HttpRequestMethod.Post;
      request.body = payload;
      request.headers = [
          new HttpHeader("Content-Type", "application/json"),
          new HttpHeader("auth", "my-auth-token"),
      ];

      http.request(request);
}


export function log_kill_event(player: Player, killed_entity: Entity, guild_id: string) {
    const mainhand = player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand)
    var mainhand_arg = ''
    if (mainhand) { var mainhand_arg = `&mainhand=${mainhand.typeId}` }
    var event_arg = `type=kill`
    var pos_arg = `posx=${Math.round(killed_entity.location.x)}&posy=${Math.round(killed_entity.location.y)}&posz=${Math.round(killed_entity.location.z)}`

    const request = new HttpRequest(`http://thorny-wbs:8000/player/stats?guild_id=${guild_id}&gamertag=${player.name.replace(' ', '%20')}&${pos_arg}&${event_arg}&ref=${killed_entity.typeId}${mainhand_arg}`);
    request.method = HttpRequestMethod.Post;
    request.body = 'body';
    request.headers = [
        new HttpHeader("Content-Type", "application/json"),
        new HttpHeader("auth", "my-auth-token"),
    ];

    http.request(request);
}


export function log_death_event(player: Player, killer_entity: Entity, guild_id: string) {
    const mainhand = player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand)
    var mainhand_arg = ''
    if (mainhand) { var mainhand_arg = `&mainhand=${mainhand.typeId}` }
    var event_arg = `type=die`
    var pos_arg = `posx=${Math.round(player.location.x)}&posy=${Math.round(player.location.y)}&posz=${Math.round(player.location.z)}`

    const request = new HttpRequest(`http://thorny-wbs:8000/player/stats?guild_id=${guild_id}&gamertag=${player.name.replace(' ', '%20')}&${pos_arg}&${event_arg}&ref=${killer_entity.typeId}${mainhand_arg}`);
    request.method = HttpRequestMethod.Post;
    request.body = 'body';
    request.headers = [
        new HttpHeader("Content-Type", "application/json"),
        new HttpHeader("auth", "my-auth-token"),
    ];

    http.request(request);
}


export function log_self_death_event(player: Player, cause: EntityDamageCause, guild_id: string) {
    const mainhand = player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand)
    var mainhand_arg = ''
    if (mainhand) { var mainhand_arg = `&mainhand=${mainhand.typeId}` }
    var event_arg = `type=die`
    var pos_arg = `posx=${Math.round(player.location.x)}&posy=${Math.round(player.location.y)}&posz=${Math.round(player.location.z)}`

    const request = new HttpRequest(`http://thorny-wbs:8000/player/stats?guild_id=${guild_id}&gamertag=${player.name.replace(' ', '%20')}&${pos_arg}&${event_arg}&ref=${cause}${mainhand_arg}`);
    request.method = HttpRequestMethod.Post;
    request.body = 'body';
    request.headers = [
        new HttpHeader("Content-Type", "application/json"),
        new HttpHeader("auth", "my-auth-token"),
    ];

    http.request(request);
}


export function log_player_death_event(player: Player, killer_player: Player, guild_id: string) {
    var mainhand = player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand)
    var mainhand_arg = ''
    if (mainhand) { var mainhand_arg = `&mainhand=${mainhand.typeId}` }
    var event_arg = `type=die`
    var pos_arg = `posx=${Math.round(player.location.x)}&posy=${Math.round(player.location.y)}&posz=${Math.round(player.location.z)}`

    var request = new HttpRequest(`http://thorny-wbs:8000/player/stats?guild_id=${guild_id}&gamertag=${player.name.replace(' ', '%20')}&${pos_arg}&${event_arg}&ref=${killer_player.name.replace(' ', '%20')}${mainhand_arg}`);
    request.method = HttpRequestMethod.Post;
    request.body = 'body';
    request.headers = [
        new HttpHeader("Content-Type", "application/json"),
        new HttpHeader("auth", "my-auth-token"),
    ];

    http.request(request);

    var mainhand = killer_player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand)
    var mainhand_arg = ''
    if (mainhand) { var mainhand_arg = `&mainhand=${mainhand.typeId}` }
    var event_arg = `type=kill`
    var pos_arg = `posx=${Math.round(killer_player.location.x)}&posy=${Math.round(killer_player.location.y)}&posz=${Math.round(killer_player.location.z)}`

    var request = new HttpRequest(`http://thorny-wbs:8000/player/stats?guild_id=${guild_id}&gamertag=${killer_player.name.replace(' ', '%20')}&${pos_arg}&${event_arg}&ref=${player.name.replace(' ', '%20')}${mainhand_arg}`);
    request.method = HttpRequestMethod.Post;
    request.body = 'body';
    request.headers = [
        new HttpHeader("Content-Type", "application/json"),
        new HttpHeader("auth", "my-auth-token"),
    ];

    http.request(request);
}