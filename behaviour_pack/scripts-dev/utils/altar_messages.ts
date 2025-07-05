export default class AltarMessage {
    public static random_sacrifice(blockValue: number, originalBlockValue: number) {
        // Special case for completely worthless items
        const noValueMessages = [
            `The Anomaly cracks audibly... your empty gesture rejected. §8§l${blockValue} blocks§r`,
            `The void ignores your hollow tribute. Not even dust remains`,
            `Your hands burn with static... the crystal knows you lied. §8§l${blockValue} blocks§r`,
            `A chorus of enderman laughter... your mockery exposed. §8§l${blockValue} blocks§r`,
            `The Altar bleeds black ichor... your insult quantified. §8§l${blockValue} blocks§r`,
            `Reality itself flinches from your apathy. Contribution: Null`,
            `The Anomaly shows you visions of your own indifference. §8§l${blockValue} blocks§r`,
            `Your 'offering' shatters into anti-matter. Debt unpaid`,
            `The void between stars whispers: §oWorthless§r. §8§l${blockValue} blocks§r`,
            `The crystal's core turns obsidian... a permanent record of your deceit`,
        ];

        if (blockValue <= 0) {
            return noValueMessages[Math.floor(Math.random() * noValueMessages.length)];
        }

        // Message categories
        const valueTierMessages = {
            extreme: [ // 100+
                `Reality tears open. §l+${blockValue} blocks§r claimed for the border`,
                `The void screams in hunger. §l+${blockValue} blocks§r added`,
                `Dimensions collapse inward. §l+${blockValue} blocks§r added`
            ],
            very: [ // 30+
                `Shadows dance with purpose. §l+${blockValue} blocks§r added`,
                `The crystal pulses greedily. §l+${blockValue} blocks§r expanded`,
                `Time stutters briefly. §l+${blockValue} blocks§r expanded`
            ],
            valuable: [ // 10+
                `A whisper of change. §l+${blockValue} blocks§r expanded`,
                `Minor disturbance detected. §l+${blockValue} blocks§r added`,
                `The air shifts slightly. §l+${blockValue} blocks§r claimed for the border`
            ],
            not: [ // <10
                `Barely a tremor. §l+${blockValue} blocks§r claimed for the border`,
                `The Anomaly yawns. §l+${blockValue} blocks§r expanded`,
                `Dust motes settle. §l+${blockValue} blocks§r added`
            ]
        };

        const depreciationMessages = {
            high: [ // 80-65% - Yellow (still decent value)
                `The Anomaly pauses, confused... "Why do you repeat this hollow act?" §e§l+${blockValue} blocks§r`,
                `The crystal dims with disappointment. "Have you forgotten the meaning?" §e§l+${blockValue} blocks§r`,
                `The void whispers uncertainty... "Is this all you offer now?" §e§l+${blockValue} blocks§r`,
            ],
            mid: [ // 65-50% - Orange (declining value)
                `"How... predictable," the Anomaly laughs coldly. §6§l+${blockValue} blocks§r`,
                `The void yawns theatrically. "Another 'grand' gesture." §6§l+${blockValue} blocks§r`,
                `"You bore me," echoes through reality. §6§l+${blockValue} blocks§r`
            ],
            low: [ // 50-30% - Red (poor value)
                `"Your mockery ends NOW," the void seethes. §c§l+${blockValue} blocks§r`,
                `The Anomaly's rage cracks the ground beneath you. §c§l+${blockValue} blocks§r`,
                `"Continue this insult and face the consequences." §c§l+${blockValue} blocks§r`
            ],
            negligible: [ // <30% - Dark Red (terrible value)
                `The Anomaly's wrath tears through reality. "YOU WILL SUFFER." §4§l+${blockValue} blocks§r`,
                `"Your insolence demands retribution," the void seethes. §4§l+${blockValue} blocks§r`,
                `The cosmos itself turns against you in fury. §4§l+${blockValue} blocks§r`
            ]
        };

        // Single point of value tier selection
        const getValueTier = () => {
            if (blockValue >= 100) return valueTierMessages.extreme;  // Top 5% (elite items)
            if (blockValue >= 30) return valueTierMessages.very;      // Top 20% (high-value items)
            if (blockValue >= 10) return valueTierMessages.valuable;  // Top 50% (above-average items)
            return valueTierMessages.not;                             // Bottom 50% (common items)
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
