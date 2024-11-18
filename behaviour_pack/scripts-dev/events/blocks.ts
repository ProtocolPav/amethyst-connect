import { world, system } from "@minecraft/server"
import api from "../api"
import { EntityComponentTypes, EquipmentSlot } from "@minecraft/server"
import { MinecraftBlockTypes } from "@minecraft/vanilla-data"

export default function load_block_event_handler() {

    // Handle Block Break Event
    world.beforeEvents.playerBreakBlock.subscribe((event) => {
        const block_id = event.block.typeId
        const block_location = [event.block.x, event.block.y, event.block.z]
        const dimension = event.player.dimension
        const mainhand = event.player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand)

        system.run(() => {
            const interaction = new api.Interaction(
                {
                    thorny_id: api.ThornyUser.fetch_user(event.player.name)?.thorny_id ?? 0,
                    type: 'mine',
                    position_x: block_location[0],
                    position_y: block_location[1],
                    position_z: block_location[2],
                    reference: block_id,
                    mainhand: mainhand?.typeId ?? null,
                    dimension: dimension.id

                }
            )
            
            interaction.post_interaction()

            api.Interaction.enqueue(interaction)
        })
    })
    
    // Handle Block Place Event
    world.afterEvents.playerPlaceBlock.subscribe((event) => {
        const block_id = event.block.typeId
        const block_location = [event.block.x, event.block.y, event.block.z]
        const dimension = event.player.dimension
        const mainhand = event.player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand)
    
        system.run(() => {
            const interaction = new api.Interaction(
                {
                    thorny_id: api.ThornyUser.fetch_user(event.player.name)?.thorny_id ?? 0,
                    type: 'place',
                    position_x: block_location[0],
                    position_y: block_location[1],
                    position_z: block_location[2],
                    reference: block_id,
                    mainhand: mainhand?.typeId ?? null,
                    dimension: dimension.id

                }
            )
            
            interaction.post_interaction()
        })
    })
    
    // Handle Block Interact Event
    world.afterEvents.playerInteractWithBlock.subscribe((event) => {
        const block_id = event.block.typeId
        const block_location = [event.block.x, event.block.y, event.block.z]
        const dimension = event.player.dimension
        const mainhand = event.player.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand)
        
        // List of all block IDs that the system will log.
        // Anything that isn't these will not be logged.
        const all_blocks: string[] = [
            MinecraftBlockTypes.Chest, MinecraftBlockTypes.Barrel, MinecraftBlockTypes.RedShulkerBox,
            MinecraftBlockTypes.BlueShulkerBox, MinecraftBlockTypes.CyanShulkerBox, MinecraftBlockTypes.GrayShulkerBox,
            MinecraftBlockTypes.LimeShulkerBox, MinecraftBlockTypes.PinkShulkerBox, MinecraftBlockTypes.BlackShulkerBox,
            MinecraftBlockTypes.BrownShulkerBox, MinecraftBlockTypes.GreenShulkerBox, MinecraftBlockTypes.WhiteShulkerBox,
            MinecraftBlockTypes.OrangeShulkerBox, MinecraftBlockTypes.PurpleShulkerBox, MinecraftBlockTypes.UndyedShulkerBox,
            MinecraftBlockTypes.YellowShulkerBox, MinecraftBlockTypes.MagentaShulkerBox, MinecraftBlockTypes.LightBlueShulkerBox,
            MinecraftBlockTypes.LightGrayShulkerBox
        ]
    
        if (all_blocks.includes(block_id)) {
            system.run(() => {
                const interaction = new api.Interaction(
                    {
                        thorny_id: api.ThornyUser.fetch_user(event.player.name)?.thorny_id ?? 0,
                        type: 'use',
                        position_x: block_location[0],
                        position_y: block_location[1],
                        position_z: block_location[2],
                        reference: block_id,
                        mainhand: mainhand?.typeId ?? null,
                        dimension: dimension.id
    
                    }
                )
                
                interaction.post_interaction()
            })
        }
    })
}