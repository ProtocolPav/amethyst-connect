export default class AltarMessage {
    public static random_sacrifice(blockValue: number, originalBlockValue: number) {
        // Special case for completely worthless items
        const noValueMessages = [
            `The Anomaly cracks audibly... your empty gesture rejected. ${blockValue} blocks`,
            `The void ignores your hollow tribute. Not even dust remains`,
            `Your hands burn with static... the crystal knows you lied. ${blockValue} blocks`,
            `A chorus of enderman laughter... your mockery exposed. ${blockValue} blocks`,
            `The Altar bleeds black ichor... your insult quantified. ${blockValue} blocks`,
            `Reality itself flinches from your apathy. Contribution: Null`,
            `The Anomaly shows you visions of your own indifference. ${blockValue} blocks`,
            `Your 'offering' shatters into anti-matter. Debt unpaid`,
            `The void between stars whispers: §oWorthless§r. ${blockValue} blocks`,
            `The crystal's core turns obsidian... a permanent record of your deceit`,
        ];

        if (blockValue <= 0) {
            return noValueMessages[Math.floor(Math.random() * noValueMessages.length)];
        }

        // Message categories
        const valueTierMessages = {
            extreme: [ // 200+
                `The sky hemorrhages violet lightning... +${blockValue} blocks tear through reality`,
                `Stone screams as it liquefies. Sacrifice consumed: +${blockValue} blocks`,
                `Time fractures into overlapping echoes. Debt paid: +${blockValue} blocks`,
                `The End's bedrock cracks like eggshells. +${blockValue} border blocks claimed`,
                `Oceans of shadow boil over. +${blockValue} blocks absorbed`
            ],
            very: [ // 60+
                `Trees age centuries in seconds. +${blockValue} blocks logged`,
                `Water flows upward to the crystal. +${blockValue} blocks fed`,
                `Animals flee in geometric patterns. +${blockValue} blocks cataloged`,
                `A chorus root network petrifies instantly. +${blockValue} blocks`,
                `Your voice echoes from tomorrow. +${blockValue} blocks owed`
            ],
            valuable: [ // 25+
                `Flames burn cold and blue. +${blockValue} blocks recorded`,
                `Ender motes orbit your head like flies. +${blockValue} blocks`,
                `Metal objects vibrate mournfully. +${blockValue} blocks`,
                `Your breath frosts black. +${blockValue} blocks accepted`,
                `All coins in your pocket invert. +${blockValue} blocks`
            ],
            not: [ // <25
                `Dust settles in perfect circles. +${blockValue} blocks`,
                `A faint enderman groan echoes... then silence. +${blockValue} blocks`,
                `Leaves curl unnaturally. +${blockValue} blocks`,
                `Puddles reflect red for 1 heartbeat. +${blockValue} blocks`,
                `The Anomaly exhales static. +${blockValue} blocks`
            ]
        };

        const depreciationMessages = {
            high: [ // 80-65%
                `The Anomaly pauses... did you ever truly care? +${blockValue} blocks`,
                `Your hesitation taints the offering. +${blockValue} grudgingly absorbed`,
                `The crystal vibrates suspiciously. "Again?" +${blockValue} blocks`,
                `Once-prized, now routine. The void notices. +${blockValue} blocks`,
                `The Altar accepts your mechanical tribute. +${blockValue} blocks`
            ],
            mid: [ // 65-50%
                `The Anomaly mocks your hollow repetition. +${blockValue} blocks`,
                `"This meant something once," the void accuses. +${blockValue} blocks`,
                `Your growing apathy poisons the ritual. +${blockValue} blocks`,
                `The crystal's light dims in disappointment. +${blockValue} blocks`,
                `The Altar accepts stale tribute... for now. +${blockValue} blocks`
            ],
            low: [ // 50-30%
                `The Anomaly snarls at your rotten deception. +${blockValue} blocks`,
                `"You think I don't see?" Static shreds air. +${blockValue} blocks`,
                `Your contempt for the ritual becomes mutual. +${blockValue} blocks`,
                `The void regurgitates part of your insult. +${blockValue} blocks`,
                `The crystal burns your hands in contempt. +${blockValue} blocks`
            ],
            negligible: [ // <30%
                `The Anomaly's fury cracks nearby stone. "ENOUGH." +${blockValue} blocks`,
                `Your betrayal hangs in the air. +${blockValue} pity blocks`,
                `The void rejects all but cosmic spite. +${blockValue} blocks`,
                `The Altar bleeds black ichor from your insult. +${blockValue} blocks`,
                `Reality itself recoils at your mockery. +${blockValue} blocks`
            ]
        };

        // Single point of value tier selection
        const getValueTier = () => {
            if (blockValue >= 200) return valueTierMessages.extreme;
            if (blockValue >= 60) return valueTierMessages.very;
            if (blockValue >= 25) return valueTierMessages.valuable;
            return valueTierMessages.not;
        };

        // Default to value tier messages
        let messages = getValueTier();

        // Check for significant depreciation
        if (blockValue < originalBlockValue) {
            const valueRemaining = blockValue / originalBlockValue;

            if (valueRemaining < 0.8) {
                if (valueRemaining >= 0.65) {
                    messages = depreciationMessages.high;
                } else if (valueRemaining >= 0.5) {
                    messages = depreciationMessages.mid;
                } else if (valueRemaining >= 0.3) {
                    messages = depreciationMessages.low;
                } else {
                    messages = depreciationMessages.negligible;
                }
            }
        }

        return messages[Math.floor(Math.random() * messages.length)];
    }

    public static random_not_sacrificial() {
        const rejectionMessages = [
            "The Anomaly probes your soul... finds no attachment. Try harder",
            "The void whispers: 'Sacrifice what you'd mourn to lose'",
            "Your hands remain unburned. You didn't truly care about this",
            "The crystal glows faintly: 'Your heartrate never changed'",
            "The Altar rejects empty gestures. Bring meaning, not objects",
            "The Anomaly shows you visions of actual valuables... as a hint",
            "Your reflection shakes its head. 'You know the rules'",
            "The void hungers for emotional weight, not dead weight",
            "The crystal seeks sacrifices soaked in your longing",
            "Your apathy is louder than this offering. Try again"
        ];

        return rejectionMessages[Math.floor(Math.random() * rejectionMessages.length)];
    }

    public static random_info(currentBorderSize: number) {
        const infoMessages = [
            `The Anomaly hums quietly... current border: ${currentBorderSize} blocks`,
            `The void's edge shimmers at ${currentBorderSize} blocks from center`,
            `Crystal energies oscillate... border diameter: ${currentBorderSize} blocks`,
            `A map etches itself in your mind: ${currentBorderSize} blocks claimed`,
            `The Anomaly whispers dimensions into your thoughts: ${currentBorderSize} blocks`,
            `Ender particles outline a circle of ${currentBorderSize} blocks diameter`,
            `The crystal projects the border's reach: ${currentBorderSize} blocks`,
            `Your shadow stretches to the void's edge: ${currentBorderSize} blocks`,
            `Reality's membrane currently extends ${currentBorderSize} blocks outward`,
            `The Altar displays ethereal runes: ${currentBorderSize} blocks of safety`
        ];

        return infoMessages[Math.floor(Math.random() * infoMessages.length)];
    }

}
