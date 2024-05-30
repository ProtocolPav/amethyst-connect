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


export function log_kill_event(dimension: Dimension, player: Player, killed_entity: Entity, thorny_id_map: object) {
    const mainhand = player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand)?.typeId ?? null

    const payload = JSON.stringify({
        "thorny_id": thorny_id_map[player.name],
        "type": "kill",
        "position_x": Math.round(killed_entity.location.x),
        "position_y": Math.round(killed_entity.location.y),
        "position_z": Math.round(killed_entity.location.z),
        "reference": killed_entity.typeId,
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


export function log_death_event(dimension: Dimension, player: Player, killer_entity: Entity, thorny_id_map: object) {
    const mainhand = player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand)?.typeId ?? null

    const payload = JSON.stringify({
        "thorny_id": thorny_id_map[player.name],
        "type": "die",
        "position_x": Math.round(player.location.x),
        "position_y": Math.round(player.location.y),
        "position_z": Math.round(player.location.z),
        "reference": killer_entity.typeId,
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


export function log_self_death_event(dimension: Dimension, player: Player, cause: EntityDamageCause, thorny_id_map: object) {
    const mainhand = player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand)?.typeId ?? null

    const payload = JSON.stringify({
        "thorny_id": thorny_id_map[player.name],
        "type": "die",
        "position_x": Math.round(player.location.x),
        "position_y": Math.round(player.location.y),
        "position_z": Math.round(player.location.z),
        "reference": cause,
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


export function log_player_death_event(dimension: Dimension, player: Player, killer_player: Player, thorny_id_map: object) {
    const mainhand = player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand)?.typeId ?? null

    const payload = JSON.stringify({
        "thorny_id": thorny_id_map[player.name],
        "type": "die",
        "position_x": Math.round(player.location.x),
        "position_y": Math.round(player.location.y),
        "position_z": Math.round(player.location.z),
        "reference": killer_player.name,
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


    const killer_mainhand = player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand)?.typeId ?? null

    const killer_payload = JSON.stringify({
        "thorny_id": thorny_id_map[killer_player.name],
        "type": "kill",
        "position_x": Math.round(killer_player.location.x),
        "position_y": Math.round(killer_player.location.y),
        "position_z": Math.round(killer_player.location.z),
        "reference": player.name,
        "mainhand": killer_mainhand,
        "dimension": dimension.id
      })

    const killer_request = new HttpRequest(`http://nexuscore:8000/api/v0.1/events/interaction`);
    request.method = HttpRequestMethod.Post;
    request.body = killer_payload;
    request.headers = [
        new HttpHeader("Content-Type", "application/json"),
        new HttpHeader("auth", "my-auth-token"),
    ];

    http.request(killer_request);
}