import {EntityComponentTypes, Player, PlayerSoundOptions, system, TicksPerSecond} from "@minecraft/server";
import {MinecraftBlockTypes, MinecraftEffectTypes, MinecraftEntityTypes} from "@minecraft/vanilla-data";

export default class Glitches {
    private glitches: Map<string, (player: Player) => void>;

    constructor() {
        this.glitches = new Map();
        this.initializeGlitches();
    }

    private initializeGlitches(): void {
        // Audio Glitches
        this.addGlitch('noise_chaos', (player) => this.noiseGlitch(player));
        this.addGlitch('audio_distortion', (player) => this.audioDistortionGlitch(player));
        this.addGlitch('phantom_music', (player) => this.phantomMusicGlitch(player));

        // Visual Glitches
        this.addGlitch('vision_entity', (player) => this.visionEntityGlitch(player));
        this.addGlitch('vision_block', (player) => this.visionBlockGlitch(player));
        this.addGlitch('particle_swarm', (player) => this.particleSwarmGlitch(player));
        this.addGlitch('fake_explosion', (player) => this.fakeExplosionGlitch(player));

        // Movement Glitches
        this.addGlitch('effect_chaos', (player) => this.effectGlitch(player));

        // Environmental Glitches
        this.addGlitch('dimension_echo', (player) => this.dimensionEchoGlitch(player));

        // Interface Glitches
        this.addGlitch('inventory_shuffle', (player) => this.inventoryShuffleGlitch(player));
        this.addGlitch('ui_corruption', (player) => this.uiCorruptionGlitch(player));
    }

    addGlitch(name: string, glitchFunction: (player: Player) => void): void {
        this.glitches.set(name, glitchFunction);
    }

    executeRandomGlitch(player: Player): string {
        const glitchKeys = Array.from(this.glitches.keys());
        const randomKey = glitchKeys[Math.floor(Math.random() * glitchKeys.length)];
        const glitch = this.glitches.get(randomKey);

        if (glitch) {
            glitch(player);
            return randomKey;
        }
        return '';
    }

    executeGlitch(name: string, player: Player): boolean {
        const glitch = this.glitches.get(name);
        if (glitch) {
            glitch(player);
            return true;
        }
        return false;
    }

    getGlitchNames(): string[] {
        return Array.from(this.glitches.keys());
    }

    removeGlitch(name: string): boolean {
        return this.glitches.delete(name);
    }

    private noiseGlitch(player: Player): void {
        const noises: {name: string, options: PlayerSoundOptions}[][] = [
            [{"name": "mob.villager.yes", "options": { "volume": 100, "pitch": 1}}],
            [
                {"name": "block.bell.hit", "options": { "volume": 100, "pitch": 0.3}},
                {"name": "block.bell.hit", "options": { "volume": 100, "pitch": 0.5}},
                {"name": "block.bell.hit", "options": { "volume": 100, "pitch": 0.8}},
                {"name": "block.bell.hit", "options": { "volume": 100, "pitch": 0.4}},
            ],
            [{"name": "random.fuse", "options": { "volume": 100, "pitch": 1}}],
            [{"name": "mob.llama.idle", "options": { "volume": 100, "pitch": 1}}],
            [{"name": "random.anvil_land", "options": { "volume": 100, "pitch": 1}}],
            [{"name": "block.end_portal.spawn", "options": { "volume": 100, "pitch": 1}}],
            [
                {"name": "mob.shulker.ambient", "options": { "volume": 100, "pitch": 0.75}},
                {"name": "mob.shulker.ambient", "options": { "volume": 100, "pitch": 1.25}}
            ],
            [{"name": "mob.cat.meow", "options": { "volume": 100, "pitch": 1}}],
        ];

        const noise = noises[Math.floor(Math.random() * noises.length)];

        for (const noise_instance of noise) {
            system.runTimeout(
                () => {player.playSound(noise_instance.name, noise_instance.options)},
                5
            );
        }
    }

    private audioDistortionGlitch(player: Player): void {
        const sounds = [
            "mob.enderman.scream",
            "mob.ghast.scream",
            "random.explode",
            "mob.wither.spawn"
        ];

        const sound = sounds[Math.floor(Math.random() * sounds.length)];
        const pitches = [0.1, 0.3, 1.5, 2.0];

        pitches.forEach((pitch, index) => {
            system.runTimeout(() => {
                player.playSound(sound, { volume: 50, pitch: pitch });
            }, index * 10);
        });
    }

    private phantomMusicGlitch(player: Player): void {
        const musicDiscs = [
            "record.11",
            "record.13",
            "record.ward",
            "record.cat"
        ];

        player.stopMusic()
        const disc = musicDiscs[Math.floor(Math.random() * musicDiscs.length)];
        player.playSound(disc, { volume: 30, pitch: Math.random() * 2 });
    }

    private visionEntityGlitch(player: Player): void {
        const entities = [
            MinecraftEntityTypes.Enderman,
            MinecraftEntityTypes.Panda,
            MinecraftEntityTypes.Rabbit,
            MinecraftEntityTypes.ZombieHorse,
            MinecraftEntityTypes.Breeze,
            MinecraftEntityTypes.Camel,
            MinecraftEntityTypes.Sheep,
            MinecraftEntityTypes.Stray,
            'amethyst:the_breath',
            'amethyst:endstone_golem'
        ];

        const entity = entities[Math.floor(Math.random() * entities.length)];

        let location = player.location;
        let facing = player.getViewDirection();

        location.x -= facing.x * 2;
        location.z -= facing.z * 2;

        let current_entity = player.dimension.spawnEntity(entity, location);

        let sysid = system.runInterval(() => {
            if (current_entity.isValid) {
                current_entity.teleport(location);
                current_entity.getComponent(EntityComponentTypes.Health)?.resetToMaxValue();
            } else {
                system.clearRun(sysid);
                current_entity.remove();
            }
        });

        system.waitTicks(TicksPerSecond * 15).then(() => {
            system.clearRun(sysid);
            current_entity.remove();
        });
    }

    private visionBlockGlitch(player: Player): void {
        const blocks = [
            MinecraftBlockTypes.Bedrock,
            MinecraftBlockTypes.LightBlock15,
            MinecraftBlockTypes.BambooStairs,
            MinecraftBlockTypes.Dispenser,
            MinecraftBlockTypes.DarkOakFence,
            MinecraftBlockTypes.EnchantingTable,
            MinecraftBlockTypes.Campfire
        ];

        const block = blocks[Math.floor(Math.random() * blocks.length)];

        let location = player.location;
        let facing = player.getViewDirection();

        location.x += facing.x * 2;
        location.z += facing.z * 2;

        let random_block = player.dimension.getBlock(location);

        if (random_block?.typeId === MinecraftBlockTypes.Air
            && player.dimension.getEntitiesAtBlockLocation(location).length === 0) {
            random_block.setType(block);

            system.waitTicks(TicksPerSecond).then(() => {
                random_block.setType(MinecraftBlockTypes.Air);
            });
        }
    }

    private particleSwarmGlitch(player: Player): void {
        const location = player.location;

        for (let i = 0; i < 20; i++) {
            system.runTimeout(() => {
                const particleLocation = {
                    x: location.x + (Math.random() - 0.5) * 4,
                    y: location.y + Math.random() * 3,
                    z: location.z + (Math.random() - 0.5) * 4
                };

                player.dimension.spawnParticle("minecraft:endrod", particleLocation);
            }, i * 5);
        }
    }

    private fakeExplosionGlitch(player: Player): void {
        const location = player.location;

        player.playSound("random.explode", { volume: 100, pitch: 1 });
        player.dimension.spawnParticle("minecraft:huge_explosion_emitter", location);

        // Add screen shake effect with knockback
        player.applyKnockback({x:0, z:0}, 0.2);
    }

    private effectGlitch(player: Player): void {
        const effects: MinecraftEffectTypes[] = [
            MinecraftEffectTypes.Haste,
            MinecraftEffectTypes.MiningFatigue,
            MinecraftEffectTypes.SlowFalling,
            MinecraftEffectTypes.JumpBoost,
            MinecraftEffectTypes.HealthBoost,
            MinecraftEffectTypes.Hunger
        ];

        const effect = effects[Math.floor(Math.random() * effects.length)];

        system.run(() => {
            player.addEffect(effect, TicksPerSecond * 20);
        });
    }

    private dimensionEchoGlitch(player: Player): void {
        const echoSounds = [
            "ambient.cave.cave",
            "portal.portal",
            "mob.endermen.portal",
            "ambient.nether.mood"
        ];

        const sound = echoSounds[Math.floor(Math.random() * echoSounds.length)];

        for (let i = 0; i < 3; i++) {
            system.runTimeout(() => {
                player.playSound(sound, { volume: 50, pitch: 0.5 + (i * 0.2) });
            }, i * 30);
        }
    }

    private inventoryShuffleGlitch(player: Player): void {
        const inventory = player.getComponent('inventory')?.container;
        if (!inventory) return;

        const items: any[] = [];
        const slots: number[] = [];

        // Collect items from hotbar
        for (let i = 0; i < 9; i++) {
            const item = inventory.getItem(i);
            if (item) {
                items.push(item);
                slots.push(i);
                inventory.setItem(i, undefined);
            }
        }

        // Shuffle items
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }

        // Place shuffled items back
        for (let i = 0; i < items.length; i++) {
            inventory.setItem(slots[i], items[i]);
        }
    }

    private uiCorruptionGlitch(player: Player): void {
        // Send fake system messages
        const fakeMessages = [
            "§cError: Reality.exe has stopped working",
            "§4WARNING: Dimensional integrity compromised",
            "§8[SYSTEM] Recalibrating existence parameters...",
            "§5ANOMALY DETECTED: Player consciousness unstable"
        ];

        const message = fakeMessages[Math.floor(Math.random() * fakeMessages.length)];
        player.sendMessage(message);
    }

}
