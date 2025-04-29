export default class AltarMessage {
    public static random_sacrifice(blockValue: number, originalBlockValue: number) {
        // Special case for completely worthless items
        const noValueMessages = [
            `The Anomaly cracks audibly... your empty gesture rejected. §l${blockValue} blocks§r`,
            `The void ignores your hollow tribute. Not even dust remains`,
            `Your hands burn with static... the crystal knows you lied. §l${blockValue} blocks§r`,
            `A chorus of enderman laughter... your mockery exposed. §l${blockValue} blocks§r`,
            `The Altar bleeds black ichor... your insult quantified. §l${blockValue} blocks§r`,
            `Reality itself flinches from your apathy. Contribution: Null`,
            `The Anomaly shows you visions of your own indifference. §l${blockValue} blocks§r`,
            `Your 'offering' shatters into anti-matter. Debt unpaid`,
            `The void between stars whispers: §oWorthless§r. §l${blockValue} blocks§r`,
            `The crystal's core turns obsidian... a permanent record of your deceit`,
        ];

        if (blockValue <= 0) {
            return noValueMessages[Math.floor(Math.random() * noValueMessages.length)];
        }

        // Message categories
        const valueTierMessages = {
            extreme: [ // 200+
                `The sky hemorrhages violet lightning... §l+${blockValue} blocks§r tear through reality`,
                `Stone screams as it liquefies. Sacrifice consumed: §l+${blockValue} blocks§r`,
                `Time fractures into overlapping echoes. Debt paid: §l+${blockValue} blocks§r`,
                `The End's bedrock cracks like eggshells. §l+${blockValue} border blocks§r claimed`,
                `Oceans of shadow boil over. §l+${blockValue} blocks§r absorbed`
            ],
            very: [ // 60+
                `Trees age centuries in seconds. §l+${blockValue} blocks§r logged`,
                `Water flows upward to the crystal. §l+${blockValue} blocks§r fed`,
                `Animals flee in geometric patterns. §l+${blockValue} blocks§r cataloged`,
                `A chorus root network petrifies instantly. §l+${blockValue} blocks§r`,
                `Your voice echoes from tomorrow. §l+${blockValue} blocks§r owed`
            ],
            valuable: [ // 25+
                `Flames burn cold and blue. §l+${blockValue} blocks§r recorded`,
                `Ender motes orbit your head like flies. §l+${blockValue} blocks§r`,
                `Metal objects vibrate mournfully. §l+${blockValue} blocks§r`,
                `Your breath frosts black. §l+${blockValue} blocks§r accepted`,
                `All coins in your pocket invert. §l+${blockValue} blocks§r`
            ],
            not: [ // <25
                `Dust settles in perfect circles. §l+${blockValue} blocks§r`,
                `A faint enderman groan echoes... then silence. §l+${blockValue} blocks§r`,
                `Leaves curl unnaturally. §l+${blockValue} blocks§r`,
                `Puddles reflect red for 1 heartbeat. §l+${blockValue} blocks§r`,
                `The Anomaly exhales static. §l+${blockValue} blocks§r`
            ]
        };

        const depreciationMessages = {
            high: [ // 80-65%
                `The Anomaly pauses... did you ever truly care? §l+${blockValue} blocks§r`,
                `Your hesitation taints the offering. §l+${blockValue} grudgingly absorbed§r`,
                `The crystal vibrates suspiciously. "Again?" §l+${blockValue} blocks§r`,
                `Once-prized, now routine. The void notices. §l+${blockValue} blocks§r`,
                `The Altar accepts your mechanical tribute. §l+${blockValue} blocks§r`
            ],
            mid: [ // 65-50%
                `The Anomaly mocks your hollow repetition. §l+${blockValue} blocks§r`,
                `"This meant something once," the void accuses. §l+${blockValue} blocks§r`,
                `Your growing apathy poisons the ritual. §l+${blockValue} blocks§r`,
                `The crystal's light dims in disappointment. §l+${blockValue} blocks§r`,
                `The Altar accepts stale tribute... for now. §l+${blockValue} blocks§r`
            ],
            low: [ // 50-30%
                `The Anomaly snarls at your rotten deception. §l+${blockValue} blocks§r`,
                `"You think I don't see?" Static shreds air. §l+${blockValue} blocks§r`,
                `Your contempt for the ritual becomes mutual. §l+${blockValue} blocks§r`,
                `The void regurgitates part of your insult. §l+${blockValue} blocks§r`,
                `The crystal burns your hands in contempt. §l+${blockValue} blocks§r`
            ],
            negligible: [ // <30%
                `The Anomaly's fury cracks nearby stone. "ENOUGH." §l+${blockValue} blocks§r`,
                `Your betrayal hangs in the air. §l+${blockValue} pity blocks§r`,
                `The void rejects all but cosmic spite. §l+${blockValue} blocks§r`,
                `The Altar bleeds black ichor from your insult. §l+${blockValue} blocks§r`,
                `Reality itself recoils at your mockery. §l+${blockValue} blocks§r`
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
            `The Anomaly hums quietly... current border: §l${currentBorderSize} blocks§r`,
            `The void's edge shimmers at §l${currentBorderSize} blocks§r from center`,
            `Crystal energies oscillate... border diameter: §l${currentBorderSize} blocks§r`,
            `A map etches itself in your mind: §l${currentBorderSize} blocks§r claimed`,
            `The Anomaly whispers dimensions into your thoughts: §l${currentBorderSize} blocks§r`,
            `Ender particles outline a circle of §l${currentBorderSize} blocks§r diameter`,
            `The crystal projects the border's reach: §l${currentBorderSize} blocks§r`,
            `Your shadow stretches to the void's edge: §l${currentBorderSize} blocks§r`,
            `Reality's membrane currently extends §l${currentBorderSize} blocks§r outward`,
            `The Altar displays ethereal runes: §l${currentBorderSize} blocks§r of safety`
        ];

        return infoMessages[Math.floor(Math.random() * infoMessages.length)];
    }

}
