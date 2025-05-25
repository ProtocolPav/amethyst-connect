import {system, world} from "@minecraft/server"
import api from "../api"
import utils from "../utils"
import { EntityComponentTypes, EquipmentSlot, Player } from "@minecraft/server"
import {MinecraftBlockTypes, MinecraftEntityTypes} from "@minecraft/vanilla-data"

export default function load_entity_event_handler() {
    // Handle Entity Die/Kill event
    world.afterEvents.entityDie.subscribe((event) => {

        // Player kills Something
        if (event.damageSource.damagingEntity instanceof Player) {
            const player = event.damageSource.damagingEntity
            const dimension = player.dimension
            const mainhand = player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand)

            const interaction = new api.Interaction(
                {
                    thorny_id: api.ThornyUser.fetch_user(player.name)?.thorny_id ?? 0,
                    type: 'kill',
                    position_x: event.deadEntity.location.x,
                    position_y: event.deadEntity.location.y,
                    position_z: event.deadEntity.location.z,
                    reference: event.deadEntity.typeId,
                    mainhand: mainhand?.typeId ?? null,
                    dimension: dimension.id

                }
            )

            // Player kills Player
            // Log dead player's death
            if (event.deadEntity instanceof Player) {
                const dead_player = event.deadEntity
                const dead_mainhand = dead_player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand)
                
                // Replace Interaction Ref with dead players name
                interaction.reference = dead_player.name

                const death_interaction = new api.Interaction(
                    {
                        thorny_id: api.ThornyUser.fetch_user(dead_player.name)?.thorny_id ?? 0,
                        type: 'die',
                        position_x: dead_player.location.x,
                        position_y: dead_player.location.y,
                        position_z: dead_player.location.z,
                        reference: player.name,
                        mainhand: dead_mainhand?.typeId ?? null,
                        dimension: dimension.id

                    }
                )

                // Set reference back to player so that Quests can
                // correctly handle them :))
                interaction.reference = MinecraftEntityTypes.Player

                // Log kill interaction
                interaction.post_interaction()

                // Log death interaction
                death_interaction.post_interaction()

                // Relay death
                api.Relay.event(utils.DeathMessage.random_pvp(player.name, dead_player.name), '', 'other')
            } else {
                // Log kill interaction
                interaction.post_interaction()
            }

            api.Interaction.enqueue(interaction)
        }

        // Entity Kills Player
        else if (event.deadEntity instanceof Player && event.damageSource.damagingEntity) {
            const killer = event.damageSource.damagingEntity
            const player = event.deadEntity

            const dimension = player.dimension
            const mainhand = player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand)

            const death_interaction = new api.Interaction(
                {
                    thorny_id: api.ThornyUser.fetch_user(player.name)?.thorny_id ?? 0,
                    type: 'die',
                    position_x: player.location.x,
                    position_y: player.location.y,
                    position_z: player.location.z,
                    reference: killer.typeId,
                    mainhand: mainhand?.typeId ?? null,
                    dimension: dimension.id

                }
            )

            // Log death interaction
            death_interaction.post_interaction()

            // Relay death
            api.Relay.event(utils.DeathMessage.random_pve(player.name, killer.typeId), '', 'other')
        }

        // Player Suicide
        else if (event.deadEntity instanceof Player && !event.damageSource.damagingEntity) {
            const player = event.deadEntity

            const dimension = player.dimension
            const mainhand = player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand)

            const death_interaction = new api.Interaction(
                {
                    thorny_id: api.ThornyUser.fetch_user(player.name)?.thorny_id ?? 0,
                    type: 'die',
                    position_x: player.location.x,
                    position_y: player.location.y,
                    position_z: player.location.z,
                    reference: event.damageSource.cause,
                    mainhand: mainhand?.typeId ?? null,
                    dimension: dimension.id

                }
            )

            // Log death interaction
            death_interaction.post_interaction()

            // Relay death
            api.Relay.event(utils.DeathMessage.random_suicide(player.name, event.damageSource.cause), '', 'other')
        }
    })

    // Handle Entity Interact event
    world.afterEvents.playerInteractWithEntity.subscribe((event) => {
        const entity_id = event.target.typeId
        const entity_location = [event.target.location.x, event.target.location.y, event.target.location.z]
        const dimension = event.player.dimension
        const mainhand = event.player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand)

        // List of all block IDs that the system will log.
        // Anything that isn't these will not be logged.
        const all_entities: string[] = [
            // Villagers
            MinecraftEntityTypes.Villager, MinecraftEntityTypes.VillagerV2, MinecraftEntityTypes.WanderingTrader,

            // Rideable Entities
            MinecraftEntityTypes.Horse, MinecraftEntityTypes.Donkey, MinecraftEntityTypes.Mule, MinecraftEntityTypes.Minecart,
            MinecraftEntityTypes.Strider, MinecraftEntityTypes.Pig, MinecraftEntityTypes.Boat, MinecraftEntityTypes.Camel,

            // Entity Containers
            MinecraftEntityTypes.ChestBoat, MinecraftEntityTypes.ChestMinecart, MinecraftEntityTypes.HopperMinecart
        ]

        if (
            all_entities.includes(entity_id)
        ) {
            system.run(() => {
                const interaction = new api.Interaction(
                    {
                        thorny_id: api.ThornyUser.fetch_user(event.player.name)?.thorny_id ?? 0,
                        type: 'use',
                        position_x: entity_location[0],
                        position_y: entity_location[1],
                        position_z: entity_location[2],
                        reference: entity_id,
                        mainhand: mainhand?.typeId ?? null,
                        dimension: dimension.id
                    }
                )

                interaction.post_interaction()
            })
        }
    })
}