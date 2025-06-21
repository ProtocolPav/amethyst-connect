export default class DragonHeartMessage {
    public static heart_mined(heartsMined: number) {
        const heartMessages = {
            1: `§l§5The Ancient Dragon's roar echoes across dimensions...\n§r"NO! You dare shatter my essence? My remaining §l5 Hearts§r beat frantically across the Relic Islands. Each one you destroy weakens my immortal form... I must stop you before it's too late!"`,

            2: `§l§5The Dragon's voice cracks with growing desperation...\n§r"My power... it's draining away! §l4 Hearts§r still pulse on distant islands, but I can feel my strength ebbing. You don't understand - without them, I become... vulnerable. MORTAL."`,

            3: `§l§5Panic seeps into the Dragon's ancient voice...\n§r"Three of my Hearts destroyed! Only §l3 remain§r to sustain my immortality! My scales grow brittle, my fire dims... If you take the rest, I'll be nothing more than flesh and bone. Please... reconsider this madness!"`,

            4: `§l§5The Dragon's terror becomes palpable...\n§r"I BEG YOU, STOP! With only §l2 Hearts§r left, my ancient body begins to fail! My wings tremble, my breath grows weak... Soon I'll be defenseless against mortal weapons. You are not victorious, you are VICIOUS!"`,

            5: `§l§5The Dragon's voice breaks into desperate whispers...\n§r"One... only §l1 Heart§r remains between me and certain death. I can feel mortality creeping through my veins like poison. When it's gone, any blade can pierce my hide, any arrow can find my heart. You've doomed me to die like... like the rest of them."`,

            6: `§l§5The Dragon's final scream pierces reality itself...\n§r"IT IS FINISHED! All §l6 Hearts§r lie shattered! My immortality bleeds away like water through sand! I am... I am just flesh now. Mortal. Killable. The hunt begins, and I... I am the prey."`
        };

        // @ts-ignore
        return heartMessages[heartsMined] || "§cError: Invalid heart count";
    }

    public static heart_discovery() {
        return "§5A Draconic Heart pulses with desperate energy... §rThe Dragon's voice trembles: 'Please... that fragment sustains my very existence. Without it, I grow closer to mortality with each passing moment.'";
    }

    public static heart_proximity_warning() {
        return "§5The air thrums with panicked draconic energy... §rSomething ancient and terrified of death lies nearby.";
    }
}
