import {EntityDamageCause, Player, TicksPerSecond, world} from "@minecraft/server";

export default class EvilActs {
    private punishments: Map<any, any>;

    constructor() {
        this.punishments = new Map();
        this.initializePunishments();
    }

    initializePunishments() {
        // Status Effect Punishments
        this.addPunishment('blindness', (player: Player) => this.applyBlindness(player));
        this.addPunishment('levitation', (player: Player) => this.applyLevitation(player));
        this.addPunishment('nausea', (player: Player) => this.applyNausea(player));
        this.addPunishment('slowness', (player: Player) => this.applySlowness(player));
        this.addPunishment('weakness', (player: Player) => this.applyWeakness(player));
        this.addPunishment('poison', (player: Player) => this.applyPoison(player));
        this.addPunishment('wither', (player: Player) => this.applyWither(player));

        // Environmental Punishments
        this.addPunishment('lightning', (player: Player) => this.strikeLightning(player));
        this.addPunishment('teleport_overworld', (player: Player) => this.teleportToOverworld(player));
        this.addPunishment('spawn_hostile', (player: Player) => this.spawnHostileMobs(player));

        // Physical Punishments
        this.addPunishment('damage', (player: Player) => this.dealDamage(player));
        this.addPunishment('knockback', (player: Player) => this.applyKnockback(player));
        this.addPunishment('launch_skyward', (player: Player) => this.launchSkyward(player));
        this.addPunishment('inventory_shuffle', (player: Player) => this.inventoryShuffle(player));

        // Psychological Punishments
        this.addPunishment('fake_death', (player: Player) => this.simulateDeath(player));
        this.addPunishment('phantom_sounds', (player: Player) => this.playPhantomSounds(player));
    }

    addPunishment(name: string, punishmentFunction: Function) {
        this.punishments.set(name, punishmentFunction);
    }

    executeRandomPunishment(player: Player) {
        const punishmentKeys = Array.from(this.punishments.keys());
        const randomKey = punishmentKeys[Math.floor(Math.random() * punishmentKeys.length)];
        const punishment = this.punishments.get(randomKey);

        if (punishment) {
            console.log(punishment);
            punishment(player);
            return randomKey;
        }
    }

    // Basic negative effects
    applyBlindness(player: Player, duration = 20) {
        player.addEffect('blindness', duration*TicksPerSecond, { amplifier: 2 });
    }

    applyLevitation(player: Player, duration = 18) {
        player.addEffect('levitation', duration*TicksPerSecond, { amplifier: 1 });
    }

    applyNausea(player: Player, duration = 10) {
        player.addEffect('nausea', duration*TicksPerSecond, { amplifier: 2 });
    }

    applySlowness(player: Player, duration = 10) {
        player.addEffect('slowness', duration*TicksPerSecond, { amplifier: 3 });
    }

    applyWeakness(player: Player, duration = 60) {
        player.addEffect('weakness', duration*TicksPerSecond, { amplifier: 2 });
    }

    applyPoison(player: Player, duration = 10) {
        player.addEffect('poison', duration*TicksPerSecond, { amplifier: 1 });
    }

    applyWither(player: Player, duration = 10) {
        player.addEffect('wither', duration*TicksPerSecond, { amplifier: 1 });
    }

    // Environmental Punishments
    strikeLightning(player: Player) {
        const location = player.location;
        player.dimension.spawnEntity('lightning_bolt', location);
    }

    teleportToOverworld(player: Player) {
        const overworld = world.getDimension('overworld');
        player.teleport({x: 10, y: 100, z: 0}, { dimension: overworld });
    }

    spawnHostileMobs(player: Player) {
        const location = player.location;
        const mobs = ['zombie', 'skeleton', 'spider', 'enderman'];
        const randomMob = mobs[Math.floor(Math.random() * mobs.length)];

        for (let i = 0; i < 3; i++) {
            const spawnLocation = {
                x: location.x + (Math.random() - 0.5) * 10,
                y: location.y,
                z: location.z + (Math.random() - 0.5) * 10
            };
            player.dimension.spawnEntity(`minecraft:${randomMob}`, spawnLocation);
        }
    }

    // Physical
    dealDamage(player: Player, amount = 4) {
        player.applyDamage(amount, { cause: EntityDamageCause.freezing });
    }

    applyKnockback(player: Player) {
        const direction = {
            x: (Math.random() - 0.5) * 2,
            z: (Math.random() - 0.5) * 2
        };
        player.applyKnockback(direction, 0.8);
    }

    launchSkyward(player: Player) {
        player.applyKnockback({x:0, z:0}, 3);
    }

    private inventoryShuffle(player: Player): void {
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

    // Psychological
    simulateDeath(player: Player) {
        // Apply death effects without actual death
        player.addEffect('blindness', 60*TicksPerSecond, { amplifier: 5 });
        player.addEffect('slowness', 60*TicksPerSecond, { amplifier: 10 });
        player.playSound('entity.player.death', { volume: 5.0 });
    }

    playPhantomSounds(player: Player) {
        const sounds = [
            'entity.enderman.ambient',
            'entity.ghast.scream',
            'entity.wither.ambient',
            'block.portal.ambient'
        ];

        const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        player.playSound(randomSound, { volume: 0.5 });
    }


}
