

export default class DeathMessage {

    public static random_pvp(killer: string, dead: string): string {
        const deathMessages = [
            // Quirky messages
            `${killer} ended ${dead}'s life with style.`,
            `${killer} cut ${dead}'s journey short.`,
            `${killer} turned ${dead} into a spectator.`,
            `${killer} sent ${dead} on a one-way trip to respawn.`,
            `${killer} said goodbye to ${dead}, permanently.`,
            `${killer} reminded ${dead} why armor is important.`,
            `${killer} made sure ${dead} won't see another sunrise.`,
            `${killer} put an end to ${dead}'s ambitions.`,
            `${killer} decided ${dead} needed a timeout.`,
            `${killer} proved ${dead} wasn't ready for the fight.`,
            `${killer} gave ${dead} a firsthand lesson in humility.`,
            `${killer} turned ${dead} into an unwilling fireworks display.`,
            `${killer} showed ${dead} the real power of an enchanted weapon.`,
            `${killer} made ${dead} regret forgetting their shield.`,
            `${killer} casually yeeted ${dead} into the afterlife.`,
            `${killer} turned ${dead} into a piñata full of loot.`,
            `${killer} made ${dead} wonder why they even logged in today.`,
            `${killer} turned ${dead}'s health bar into a suggestion.`,
            `${killer} gave ${dead} a one-way ticket to spectator mode.`,
          
            // More serious messages
            `${killer} struck the final blow, ending ${dead}'s fight.`,
            `${killer} executed ${dead} with precision and skill.`,
            `${killer} proved to be the stronger warrior against ${dead}.`,
            `${killer} ended ${dead}'s journey with a decisive strike.`,
            `${killer} overwhelmed ${dead} with superior tactics.`,
            `${killer} delivered a critical hit, silencing ${dead}.`,
            `${killer} claimed victory over ${dead} in a fierce battle.`,
            `${killer} vanquished ${dead}, leaving no room for doubt.`,
            `${killer} dominated ${dead}, proving their superiority.`,
            `${killer} took ${dead}'s life in a moment of triumph.`,
            `${killer} emerged victorious over ${dead} in combat.`,
            `${killer} brought an end to ${dead}'s reign on the battlefield.`,
            `${killer} showed no mercy and finished off ${dead}.`,
            `${killer} shattered ${dead}'s defenses, claiming victory.`,
            `${killer} crushed ${dead} with unrelenting force.`,
            `${killer} left no chance for ${dead} to recover.`,
            `${killer} turned the tide of battle, defeating ${dead}.`,
            `${killer} demonstrated unmatched skill, taking down ${dead}.`,
            `${killer} secured their dominance by defeating ${dead}.`,
        ];
        
        return deathMessages[Math.floor(Math.random() * deathMessages.length)]
    }

    public static random_pve(player: string, entity: string) {
        entity = entity.replace("minecraft:", "") // Remove the "minecraft:" prefix
                       .replace(/_/g, " ")        // Replace underscores with spaces
                       .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
        
        const deathMessages = [
            // Funny Death Messages
            `${player} picked a fight with a ${entity} and lost... miserably.`,
            `${player} thought they could outsmart a ${entity}. Spoiler: They couldn't.`,
            `${player} tried to pet a ${entity}. It was not in the mood.`,
            `${player} challenged a ${entity} to a duel. Only one of them read the rules.`,
            `${player} learned that ${entity}s are not for cuddling.`,
            `${player} thought they were the hunter. The ${entity} disagreed.`,
            `${player} got turned into loot by a ${entity}.`,
            `${player} thought they could YOLO past a ${entity}. They YOLO'd too hard.`,
            `${player} underestimated the bite of a ${entity}.`,
            `${player} wanted to be brave. The ${entity} wanted them to respawn.`,
            `${player} was schooled by a ${entity} in PvP 101.`,
            `${player} tried to befriend a ${entity}. It wasn't interested.`,
            `${player} was taught a hard lesson in humility by a ${entity}.`,
            `${player} learned the definition of pain from a ${entity}.`,
            `${player} thought shields were optional. The ${entity} proved otherwise.`,
            `${player} charged at a ${entity} with confidence. The ${entity} sent them back to respawn.`,
            `${player} tried to roast a ${entity}, but it roasted them instead.`,
            `${player} got smacked into next Tuesday by a ${entity}.`,
            `${player} tried diplomacy with a ${entity}. The ${entity} voted "No."`,
            `${player} found out what happens when you ignore ${entity}s.`,
          
            // Serious Death Messages
            `${player} fought valiantly but was slain by a ${entity}.`,
            `${player} fell in battle to a ${entity}.`,
            `${player} was overpowered by the relentless assault of a ${entity}.`,
            `${player} met their end at the hands of a ${entity}.`,
            `${player} was defeated by the ferocity of a ${entity}.`,
            `${player} tried to stand their ground but was overwhelmed by a ${entity}.`,
            `${player}'s journey was cut short by a ${entity}.`,
            `${player} underestimated the strength of a ${entity} and paid the price.`,
            `${player} was caught off guard by a ${entity} and didn't make it.`,
            `${player} was brought down by a ${entity} in a brutal fight.`,
            `${player} gave their all but couldn't survive the wrath of a ${entity}.`,
            `${player} fought to the bitter end against a ${entity}.`,
            `${player} fell to the might of a ${entity}.`,
            `${player} couldn't withstand the power of a ${entity}.`,
            `${player} was outmatched in combat by a ${entity}.`,
            `${player} succumbed to their wounds after a fight with a ${entity}.`,
            `${player} met their match in a ${entity}.`,
            `${player} was slain by a ${entity} in a moment of intense combat.`,
            `${player} fought with honor but was defeated by a ${entity}.`,
            `${player} was overwhelmed by a ${entity} after a fierce struggle.`,
          
            // Ambiguous Death Messages
            `${player} fought valiantly... or so they thought.`,
            `${player} couldn't stand against their foe.`,
            `${player} gave it their all but couldn't survive the battle.`,
            `${player} fell in a moment of chaos.`,
            `${player} met their end in the heat of battle.`,
            `${player} was overwhelmed by a deadly opponent.`,
            `${player} tried to fight back, but it wasn't enough.`,
            `${player} was taken down in a fierce skirmish.`,
            `${player} lost their life in a brutal confrontation.`,
            `${player} perished in the heat of combat.`,
            `${player} was struck down in the middle of a fight.`,
            `${player} fought bravely but ultimately succumbed.`,
            `${player} couldn't escape the fury of their attacker.`,
            `${player} miscalculated during a tense battle.`,
            `${player}'s life ended during a relentless assault.`,
            `${player} couldn't recover from the damage dealt.`,
            `${player} was caught in the chaos of combat.`,
            `${player} lost the fight and paid the ultimate price.`,
            `${player} was overcome by an insurmountable challenge.`,
        ];

        return deathMessages[Math.floor(Math.random() * deathMessages.length)]
    }

    public static random_suicide(player: string, cause: string) {
        let deathMessages: string[];

        const fallDeathMessages = [
            `${player} took a tumble and couldn't recover from the fall.`,
            `${player} had a long drop. Too bad they didn't stick the landing.`,
            `${player} fell from a great height... and didn't make it.`,
            `${player} misjudged the fall, and gravity made sure they paid.`,
            `${player} learned the hard way that falling isn't a safe way down.`,
        ];
          
        const lavaDeathMessages = [
            `${player} got too close to the heat and didn't survive the burn.`,
            `${player} decided to take a swim in lava. It didn't end well.`,
            `${player} got cooked alive in lava.`,
            `${player} thought lava was just a harmless pool. It was not.`,
            `${player} learned that lava isn't as warm as it looks.`,
        ];
          
        const drowningDeathMessages = [
            `${player} couldn't hold their breath long enough and drowned.`,
            `${player} tried to swim but forgot how to breathe.`,
            `${player} sank to the depths... and stayed there.`,
            `${player} was caught in the water's grip and couldn't escape.`,
            `${player} drowned while exploring the depths of the ocean.`,
        ];
          
        const fireDeathMessages = [
            `${player} got too close to the fire and burned to a crisp.`,
            `${player} spent too much time in the flames.`,
            `${player} felt the heat... and it was the last thing they felt.`,
            `${player} tried to walk through fire. It didn't work out.`,
            `${player} got roasted by a fire they couldn't escape.`,
        ];
          
        const fallingBlockDeathMessages = [
            `${player} was crushed by a falling block.`,
            `${player} didn't stand a chance against the falling blocks.`,
            `${player} took a hit from a falling block and didn't make it.`,
            `${player} miscalculated and was crushed by falling debris.`,
            `${player} learned to watch out for falling blocks the hard way.`,
        ];
          
        const contactDeathMessages = [
            `${player} couldn't handle the sharp prick of a cactus.`,
            `${player} made contact with a cactus and it didn't end well.`,
            `${player} took a wrong step into a cactus patch.`,
            `${player} tried to walk through a sweet berry bush and learned its lesson.`,
            `${player} found out the hard way that cactus isn't friendly.`,
        ];
          
        const magicDeathMessages = [
            `${player} couldn't resist the effects of the potion and fell.`,
            `${player} was too weak to survive the magic that hit them.`,
            `${player} couldn't outlast the effects of the enchanted potion.`,
            `${player} succumbed to the magic that surrounded them.`,
            `${player} was struck by a magical force beyond their control.`,
        ];

        const defaultDeathMessages = [
            `${player} met an untimely end due to mysterious circumstances.`,
            `${player} was caught off guard by the unforgiving world.`,
            `${player} disappeared, leaving behind only questions.`,
            `${player} succumbed to forces beyond understanding.`,
            `${player} didn't make it.`,
            `${player} encountered something they couldn't survive.`,
            `${player} was claimed by the unknown.`,
            `${player} was no match for whatever happened.`,
            `${player} fell victim to an unforeseen fate.`,
            `${player} perished, but no one knows how or why.`,
            `${player} met their end, and the details remain a mystery.`,
            `${player} passed away under unknown circumstances.`,
            `${player} was taken by the world in an unknown way.`,
            `${player} didn't live to tell the tale... for unknown reasons.`,
            `${player} didn't survive, but the cause will forever remain a secret.`,
            `${player} faced an untold fate, leaving behind no explanation.`,
        ];
        
        if (cause === "fall") {
            deathMessages = fallDeathMessages;
        } else if (cause === "lava") {
            deathMessages = lavaDeathMessages;
        } else if (cause === "drowning") {
            deathMessages = drowningDeathMessages;
        } else if (cause === "fire") {
            deathMessages = fireDeathMessages;
        } else if (cause === "fallingBlock") {
            deathMessages = fallingBlockDeathMessages;
        } else if (cause === "contact") {
            deathMessages = contactDeathMessages;
        } else if (cause === "magic") {
            deathMessages = magicDeathMessages;
        } else {
            deathMessages = defaultDeathMessages;
        }

        return deathMessages[Math.floor(Math.random() * deathMessages.length)]
          
    }
}