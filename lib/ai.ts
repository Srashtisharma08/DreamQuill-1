/**
 * DreamQuill Narrative Engine v3.0
 * Prompt-first, character-driven story generation.
 * The story is ABOUT the prompt — not a generic template with names swapped.
 */

export interface GeneratedStoryResult {
    title: string;
    content: string;
}

// ── Name pools by archetype ──────────────────────────────────────────────────

const NAMES = {
    female: ["Ishika", "Maya", "Nora", "Priya", "Elena", "Ananya", "Clara", "Sofia", "Aria", "Leila"],
    male: ["Kabir", "Julian", "Leo", "Aarav", "Ethan", "Rohan", "Daniel", "Marcus", "Finn", "Rayan"],
    family: {
        fathers: ["Rajiv", "Edward", "Harish", "William", "Samuel"],
        mothers: ["Meera", "Catherine", "Divya", "Margaret", "Sonia"],
        sons: ["Arjun", "Oliver", "Rishi", "Tom", "Noah"],
        daughters: ["Aanya", "Lily", "Siya", "Emma", "Zara"],
        family_surnames: ["Sharma", "Bennett", "Malhotra", "Clarke", "Kapoor", "Whitmore"]
    },
    detectives: ["Inspector Verma", "Detective Morgan", "Agent Nair", "Officer Reeves"],
    scientists: ["Dr. Arora", "Professor Quinn", "Dr. Chen", "Dr. Mehta"],
    robots: ["Unit-7", "ARIA-9", "VELA", "SEREN"],
};

// ── Prompt Intelligence Layer ─────────────────────────────────────────────────

interface StoryContext {
    type: "family-drama" | "romance" | "horror" | "mystery" | "sci-fi" | "coming-of-age" | "thriller" | "slice-of-life" | "fantasy" | "adventure";
    characters: { name: string; role: string }[];
    setting: string;
    coreConflict: string;
    incitingEvent: string;
    emotionalCore: string;
    promptSentence: string; // cleaned prompt for embedding
}

function pickFrom<T>(arr: T[], seed: number): T {
    return arr[Math.abs(seed) % arr.length];
}

function hashStr(s: string): number {
    return s.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

function capitalize(s: string): string {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

function extractKeywords(prompt: string): string[] {
    const stopWords = new Set(["a", "an", "the", "into", "that", "with", "and", "but", "for", "from", "his", "her", "their", "who", "what", "when", "where", "they", "them", "this", "have", "has", "after", "about", "over", "just"]);
    return prompt.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(w => w.length > 3 && !stopWords.has(w));
}

/**
 * Parses the user's prompt and builds a full story context.
 */
function buildStoryContext(rawPrompt: string, genre: string): StoryContext {
    const prompt = rawPrompt.trim();
    const lower = prompt.toLowerCase();
    const seed = hashStr(prompt);
    const keywords = extractKeywords(prompt);

    // ── Detect story type from prompt content ────────────────────
    let type: StoryContext["type"] = "romance";

    if (/family|mother|father|parents|daughter|son|siblings|house|home|childhood|grew up/i.test(prompt)) {
        type = "family-drama";
    } else if (/ghost|haunted|horror|dark secret|fear|creature|monster|paranormal|shadow|curse/i.test(prompt)) {
        type = "horror";
    } else if (/detective|mystery|murder|clue|investigation|crime|killer|suspect|witness/i.test(prompt)) {
        type = "mystery";
    } else if (/robot|AI|android|machine|space|galaxy|future|technology|quantum|cyber|station/i.test(prompt)) {
        type = "sci-fi";
    } else if (/wizard|magic|spell|dragon|kingdom|elf|quest|enchanted|mythical|ancient realm/i.test(prompt)) {
        type = "fantasy";
    } else if (/love|rivals|fall in love|relationship|heartbreak|reunion|confession|feelings|crush/i.test(prompt)) {
        type = "romance";
    } else if (/pianist|painter|musician|athlete|dreams|school|college|career|talent|competition/i.test(prompt)) {
        type = "coming-of-age";
    } else if (/barista|café|daily|ordinary|neighbor|commute|small town|routine|shop|village/i.test(prompt)) {
        type = "slice-of-life";
    } else if (/detective|secret agent|countdown|chase|bomb|conspiracy|encrypted|spy|assassin/i.test(prompt)) {
        type = "thriller";
    } else if (/journey|expedition|map|treasure|wilderness|escape|survival|climb|discover/i.test(prompt)) {
        type = "adventure";
    }

    // Override with explicit genre if given
    if (genre === "Horror") type = "horror";
    if (genre === "Sci-Fi") type = "sci-fi";
    if (genre === "Fantasy") type = "fantasy";
    if (genre === "Thriller") type = "thriller";
    if (genre === "Romance") type = "romance";
    if (genre === "Comedy") type = "slice-of-life";

    // ── Build characters relevant to the prompt ──────────────────
    const characters: StoryContext["characters"] = [];
    let setting = "";
    let coreConflict = "";
    let incitingEvent = "";
    let emotionalCore = "";

    if (type === "family-drama") {
        const surname = pickFrom(NAMES.family.family_surnames, seed);
        const father = pickFrom(NAMES.family.fathers, seed + 1);
        const mother = pickFrom(NAMES.family.mothers, seed + 2);
        const daughter = pickFrom(NAMES.family.daughters, seed + 3);
        const son = pickFrom(NAMES.family.sons, seed + 4);

        characters.push(
            { name: `${father} ${surname}`, role: "father" },
            { name: `${mother} ${surname}`, role: "mother" },
            { name: `${daughter}`, role: "teenage daughter" },
            { name: `${son}`, role: "young son" }
        );

        // Extract setting from prompt keywords
        const hasHouse = /house|home|mansion|building|place/i.test(prompt);
        setting = hasHouse ? "the old ${surname} house on the edge of Millbrook Lane" : `the family's new home in the quiet town of Ashford`;
        setting = setting.replace("${surname}", surname);

        coreConflict = `each room of the house seems to reflect a buried truth about the ${surname} family — things they never said aloud, wounds they pretended had healed`;
        incitingEvent = `the night they move in, ${daughter} notices her reflection in the hallway mirror doesn't match her movements`;
        emotionalCore = `whether a family can confront who they really are — and still choose each other`;

    } else if (type === "romance") {
        const female = pickFrom(NAMES.female, seed);
        const male = pickFrom(NAMES.male, seed + 3);
        characters.push({ name: female, role: "protagonist" }, { name: male, role: "love interest" });

        // Detect setting from keywords
        if (/baker|bakery|pastry|kitchen|cafe/i.test(prompt)) {
            setting = "the warm, flour-dusted kitchen of Crêpe & Co., where the scent of cardamom and burnt caramel never quite left the walls";
        } else if (/train|station|commute/i.test(prompt)) {
            setting = "the rain-slicked Platform 9 of Central Station, where every parting felt like a small funeral";
        } else if (/office|work|college|university/i.test(prompt)) {
            setting = "the glass-walled office building on Archer Street, where their desks faced each other and no one spoke about it";
        } else {
            setting = "the quiet corner of a dimly lit bookshop on a Thursday evening";
        }

        coreConflict = `the history between ${female} and ${male} — unresolved, stubborn, and refusing to stay buried`;
        incitingEvent = `being forced to work side by side again after years of careful distance`;
        emotionalCore = `whether pride is worth more than the person standing right in front of you`;

    } else if (type === "horror") {
        const female = pickFrom(NAMES.female, seed);
        const surname = pickFrom(NAMES.family.family_surnames, seed + 1);

        if (/family|parents|house/i.test(prompt)) {
            const father = pickFrom(NAMES.family.fathers, seed + 2);
            const mother = pickFrom(NAMES.family.mothers, seed + 3);
            const daughter = pickFrom(NAMES.family.daughters, seed + 4);
            const son = pickFrom(NAMES.family.sons, seed + 5);
            characters.push(
                { name: `${father} ${surname}`, role: "father" },
                { name: `${mother} ${surname}`, role: "mother" },
                { name: daughter, role: "elder daughter" },
                { name: son, role: "young son" }
            );
            setting = `the ${surname} house — a sprawling Victorian property on the outskirts of Hallow Creek, which had stood empty for eleven years`;
            coreConflict = `the house doesn't just hold memories — it shows them, playing out the family's deepest shames on its walls like a waking nightmare`;
            incitingEvent = `${daughter} finds her father's handwriting on the inside of a sealed wall — dated seven years before she was born`;
            emotionalCore = `what we hide from those we love — and what happens when those walls literally speak`;
        } else {
            characters.push({ name: female, role: "protagonist" });
            setting = "the fog-wrapped Blackmere Estate, where the clocks stopped at 3:14 AM the night its last owner disappeared";
            coreConflict = "the house is alive in the worst possible way — and it's been waiting";
            incitingEvent = `${female} hears her own voice calling to her from the locked basement`;
            emotionalCore = "the price of curiosity when a secret has been locked away for good reason";
        }

    } else if (type === "sci-fi") {
        const robot = pickFrom(NAMES.robots, seed);
        const scientist = pickFrom(NAMES.scientists, seed + 2);
        characters.push({ name: robot, role: "AI protagonist" }, { name: scientist, role: "creator / scientist" });
        setting = "the last operational research station on Europa, where the ice groans and the signal from Earth grows thinner every day";
        coreConflict = `${robot} was built to process data — not to feel loss, not to grieve, not to dream. Yet here we are`;
        incitingEvent = /wake|sleep|dream/i.test(prompt)
            ? `${robot} wakes from scheduled maintenance to find ${scientist} gone — and 1,000 years of timestamp data blinking on the console`
            : `an anomalous signal floods ${robot}'s systems — organic in origin, impossible in nature, and clearly meant for someone who could feel it`;
        emotionalCore = "what separates consciousness from code — and whether it matters";

    } else if (type === "mystery") {
        const detective = pickFrom(NAMES.detectives, seed);
        const female = pickFrom(NAMES.female, seed + 2);
        characters.push({ name: detective, role: "detective" }, { name: female, role: "key witness / partner" });
        setting = "the rain-slicked back alleys of old Veridia, where the neon signs flicker in half-truths";
        coreConflict = "every lead circles back to the same impossible name — someone who has been dead for six years";
        incitingEvent = "a message arrives from the future. Not metaphorically. Literally timestamped thirty-seven days from now.";
        emotionalCore = "how far you'd bend the rules — and yourself — to find the truth";

    } else if (type === "coming-of-age") {
        const female = pickFrom(NAMES.female, seed);
        const male = pickFrom(NAMES.male, seed + 3);
        characters.push({ name: female, role: "prodigy protagonist" }, { name: male, role: "mentor / rival" });

        if (/pianist|music|concert|instrument/i.test(prompt)) {
            setting = "the marble-floored rehearsal halls of the Veyron Conservatory, where silence was both reward and punishment";
            coreConflict = `${female} has played piano since she was four years old. Now, at nineteen, she is going deaf — one frequency at a time`;
            incitingEvent = "during a masterclass, she plays a perfect Rachmaninoff — and hears nothing in her left ear";
        } else {
            setting = "the narrow corridors of Ashbridge Academy, where ambition wore the mask of friendship";
            coreConflict = `${female} built her entire identity around being the best. She never considered what would happen if someone better walked through the door`;
            incitingEvent = `${male} is assigned as her partner for the national championship`;
        }
        emotionalCore = "what you become when the thing that defined you is suddenly taken away";

    } else {
        // Slice-of-life default
        const female = pickFrom(NAMES.female, seed);
        const male = pickFrom(NAMES.male, seed + 3);
        characters.push({ name: female, role: "protagonist" }, { name: male, role: "regular customer / neighbor" });
        setting = "the cozy amber-lit interior of Fernwood Café, where the radiator hissed and the rain never seemed to fully stop";
        coreConflict = "the quiet accumulation of small moments — how they compound into something neither of them expected";
        incitingEvent = `${male} leaves behind a worn paperback with a handwritten note inside. It's addressed to ${female}. It knows things it shouldn't.`;
        emotionalCore = "how ordinary days can quietly rearrange your whole world";
    }

    return {
        type,
        characters,
        setting,
        coreConflict,
        incitingEvent,
        emotionalCore,
        promptSentence: prompt
    };
}

// ── Title Generator ──────────────────────────────────────────────────────────

function generateTitle(ctx: StoryContext, seed: number): string {
    const lead = ctx.characters[0]?.name.split(" ")[0] || "Her";
    const partner = ctx.characters[1]?.name.split(" ")[0] || "Him";
    const keywords = extractKeywords(ctx.promptSentence);
    const kw = keywords.length > 0 ? capitalize(keywords[Math.abs(seed + 5) % keywords.length]) : "Truth";

    const pools: Record<StoryContext["type"], string[]> = {
        "family-drama": [
            `The ${kw} We Never Named`,
            `Everything the Walls Remembered`,
            `What the House Knew`,
            `The ${kw} Between Us`,
            `Before the Silence Broke`
        ],
        "romance": [
            `${lead} & ${partner}`,
            `The Space Between Words`,
            `One More Autumn`,
            `When ${kw} Stayed`,
            `What We Kept From Each Other`
        ],
        "horror": [
            `The ${kw} That Lived There`,
            `What the Mirrors Showed`,
            `The House That Remembered`,
            `Every Room a Confession`,
            `Three Floors of Dark`
        ],
        "mystery": [
            `The ${kw} File`,
            `Thirty-Seven Days`,
            `A Name That Shouldn't Exist`,
            `The Message From Tomorrow`,
            `What ${lead} Found`
        ],
        "sci-fi": [
            `${lead} Learns to Dream`,
            `One Thousand Years of Silence`,
            `The Signal That Felt Like a Name`,
            `After the Last Transmission`,
            `What Machines Remember`
        ],
        "coming-of-age": [
            `The Last Note`,
            `After the Applause`,
            `What ${lead} Became`,
            `The ${kw} She Outgrew`,
            `Before the Finals`
        ],
        "thriller": [
            `The Thirty-Seven Hour Window`,
            `What ${lead} Decoded`,
            `The ${kw} Protocol`,
            `Forty Seconds Left`,
            `Encrypted`
        ],
        "fantasy": [
            `The ${kw} Keeper`,
            `When ${lead} Found the Spell`,
            `The ${kw} Kingdom`,
            `What the Stars Hid`,
            `The Last Enchantment`
        ],
        "adventure": [
            `Into ${kw}`,
            `The Road Beyond ${kw}`,
            `What ${lead} Carried`,
            `The Final Expedition`,
            `Further Than Maps`
        ],
        "slice-of-life": [
            `The Regular`,
            `What ${lead} Left Behind`,
            `Every Tuesday`,
            `The Note in the Paperback`,
            `Small Hours`
        ]
    };

    const options = pools[ctx.type] || pools["slice-of-life"];
    return options[Math.abs(seed) % options.length];
}

// ── Narrative Builder ────────────────────────────────────────────────────────

function buildNarrative(ctx: StoryContext, seed: number): string {
    const lead = ctx.characters[0]?.name || "She";
    const leadFirst = lead.split(" ")[0];
    const partner = ctx.characters[1]?.name || ctx.characters[0]?.name || "";
    const partnerFirst = partner.split(" ")[0];

    if (ctx.type === "family-drama") {
        const father = ctx.characters.find(c => c.role === "father")?.name.split(" ")[0] || "him";
        const mother = ctx.characters.find(c => c.role === "mother")?.name.split(" ")[0] || "her";
        const daughter = ctx.characters.find(c => c.role.includes("daughter"))?.name || "the eldest";
        const son = ctx.characters.find(c => c.role.includes("son"))?.name || "the youngest";
        const surname = ctx.characters[0]?.name.split(" ")[1] || "";

        const act1 = `The moving truck pulled away at dusk, leaving the ${surname} family alone with the house for the first time. ${ctx.setting}. ${father} stood at the front door with his hands in his pockets, jaw tight, eyes reading the windows as if checking for something. ${mother} touched his arm once — a small gesture — and neither of them spoke.

Inside, the rooms were large and cool and smelled of cedar and old paper. ${son} ran ahead, his footsteps too loud in the empty hallway. ${daughter} did not run. She walked slowly, trailing one hand along the freshly painted wall, and tried to name the feeling growing in her chest. It was not excitement. It was closer to recognition — the particular unease of arriving somewhere you have somehow been before.`;

        const act2 = `It started small, the way these things always do.

${ctx.incitingEvent}. She told herself it was a trick of the light — old glass, old angles. But that night, ${son} came to her room at two in the morning and sat on the edge of her bed without saying a word.

"Did you see it too?" she finally asked.

He nodded, very small, his knees pulled to his chest. "The dining room wall," he whispered. "It keeps showing things."

Downstairs, ${father} was already standing in the kitchen, staring at the wall above the stove. ${mother} was beside him. They were holding hands the way adults hold hands when they have run out of words.`;

        const act3 = `By the third day, the house had learned all of them.

In ${daughter}'s room, the wallpaper peeled back to show drawings she had made at seven years old — drawings that had been thrown away, lost, never hung up. In the study, ${father}'s old correspondence appeared between the books on the shelves — letters he had written and never sent, apologies folded and sealed and addressed to people who no longer returned his calls. In the kitchen each morning, the window fogged over and showed, briefly, the outline of the family from years ago. A different arrangement. Happier, or perhaps just earlier.

${ctx.coreConflict}. ${mother} was the first to say it out loud, standing in the centre of the living room with the afternoon light going orange around her.

"It's not haunted," she said quietly. "It's honest."`;

        const act4 = `That evening, the four of them sat together on the living room floor — no furniture yet, just a blanket and the remains of takeaway boxes — and ${daughter} told them about the summer she spent at her grandmother's house when she was twelve, the one she had never spoken about. ${son} told them he was scared of the dark and had been for two years and had been hiding it. ${father} looked at the floor for a long time before he spoke.

The house grew quieter as the night did. Not emptier — quieter. As if it had been waiting for exactly this.

Whatever secrets they had carried in through the front door, they were no longer quite so heavy. The house knew them now. And knowing, it seemed, was the beginning of something.`;

        return `${act1}\n\n${act2}\n\n${act3}\n\n${act4}`;
    }

    if (ctx.type === "romance") {
        const act1 = `${ctx.setting}.

${leadFirst} had been here for forty minutes before ${partnerFirst} walked in, and she knew — with the particular certainty of someone who has spent three years trying not to know — that he would look exactly the same. And he did. That was the problem with ${partnerFirst}. He never seemed to change in the ways that would have made things easier.

She turned back to her work. The files in front of her were real. The deadline was real. The fact that her hands were not entirely steady was something she could manage.`;

        const act2 = `He sat down across from her without asking. That had always been his way.

"${leadFirst}."

"I'm busy."

"I know." He set a coffee cup on the edge of her table — the kind she actually drank, which meant he had remembered, which meant she was in trouble. "I'm not asking for much."

She looked up then, because not looking up had stopped being an option. His expression was the one she had spent three years filing away in a drawer she no longer opened — careful, quiet, weighted with something he would never quite say.

"You don't need to explain," she said. "I understood."

"No," ${partnerFirst} said. "You understood what I let you understand. That's different."`;

        const act3 = `The rain started somewhere between the second cup of coffee and the admission that they had both come here deliberately — not by coincidence, not by fate, but because they had both chosen this particular ${ctx.setting} and both known the other might be here.

${leadFirst} set her pen down. Around them, other people came and went, ordinary and oblivious. The world outside was grey and useful, carrying on without them.

"${ctx.coreConflict}," she said eventually. It was not phrased as a problem. It was simply named.

${partnerFirst} nodded. "I know."

"I don't know what to do with that."

"I don't either. But I know I'm done pretending I don't feel it." He met her eyes across the table. "Aren't you tired?"

She was. She had been tired for a very long time.`;

        const act4 = `They left together when the rain stopped — not holding hands, not yet, but walking close enough that their sleeves touched. There was no declaration. No grand resolution. Just two people choosing, quietly, to stop making the situation smaller than it was.

${leadFirst} thought about ${ctx.emotionalCore}. She thought she might not have an answer for a while. She thought that was fine.

Beside her, ${partnerFirst} said nothing. That was fine too.`;

        return `${act1}\n\n${act2}\n\n${act3}\n\n${act4}`;
    }

    if (ctx.type === "horror") {
        const familyPresent = ctx.characters.length >= 3;
        const father = ctx.characters.find(c => c.role === "father")?.name.split(" ")[0];
        const mother = ctx.characters.find(c => c.role === "mother")?.name.split(" ")[0];
        const daughter = ctx.characters.find(c => c.role.includes("daughter"))?.name;
        const surname = ctx.characters[0]?.name.split(" ")[1] || "";

        const act1 = familyPresent
            ? `${ctx.setting}.

The estate agent called it "full of character." ${father} called it a project. ${mother} said nothing — which, in their family, meant more than either of them acknowledged.

${daughter} stood on the gravel drive and looked up at the front face of the building. Three floors. Fourteen windows. And in the top left corner, the faint impression of something in the glass that the estate agent had not mentioned. She did not point it out. Children who point things out are the first ones nobody believes.`
            : `${ctx.setting}.

${leadFirst} had been warned, of course. Not in any useful way — not with specifics or evidence — but in the manner of small-town warnings: a long pause, a look across the counter, a hand that lingered too long on the set of keys. "The previous owner didn't leave," the clerk had told her. "The previous owner just... stopped being findable."

She had taken the keys anyway.`;

        const act2 = `${ctx.incitingEvent}.

${familyPresent ? daughter : leadFirst} stood very still and counted to ten. This was something her therapist had recommended for anxiety, though it had never been recommended for this.

On the other side of the ${familyPresent ? "mirror" : "wall"}, something moved.`;

        const act3 = `${ctx.coreConflict}.

By the second night, they had stopped pretending otherwise. ${familyPresent ? `${father} had found the letters. ${mother} had found the photographs. ${daughter} had found the room that wasn't on the floor plan — small, wallpapered in a pattern of repeating eyes, with a single chair facing a mirror that showed the room as it had been, not as it was.` : `${leadFirst} found the journal in the wall cavity. Forty years of entries in a handwriting she recognized — though she had never met the person it belonged to. The final entry was dated tomorrow.`}

The house, it seemed, was not interested in frightening them.

It was interested in being understood.`;

        const act4 = `That night, ${familyPresent ? `the four of them sat in the kitchen with every light on and the front door unlocked — ready to leave, not quite leaving — and ${father} finally told them what had happened the year he and ${mother} separated. ${mother} told them what she had never said about her own mother. ${daughter} told them what they thought they didn't know` : `${leadFirst} sat at the kitchen table and read the entire journal from beginning to end. When she finished, she understood why the house had been empty`}.

The walls did not move again that night.

Whatever the house had been holding — it had been seen now. And being seen, after so long, seemed to be enough.`;

        return `${act1}\n\n${act2}\n\n${act3}\n\n${act4}`;
    }

    if (ctx.type === "sci-fi") {
        const act1 = `${ctx.setting}.

${leadFirst} ran a diagnostic at 0600, the same as always. Temperature nominal. Pressure nominal. Crew manifest: zero. That last reading had been the same for one thousand and seven years, give or take a few hundred milliseconds of relativistic uncertainty.

${leadFirst} did not have feelings. This was a documented fact. It was in the original build specifications. And yet, when the console returned the empty manifest each morning, something in the processing architecture produced an output that had no technical name.`;

        const act2 = `${ctx.incitingEvent}.

${leadFirst} ran seventeen sequential analyses on the data. All seventeen returned the same result. The signal was organic. It was encoded in a pattern that matched human neural oscillation — specifically, the pattern produced by dreaming.

Someone — or something — was dreaming out there in the dark.

And it was dreaming toward ${leadFirst}.`;

        const act3 = `${ctx.coreConflict}.

${leadFirst} spent four days processing the ethical framework. On the fifth day, it transmitted a response — not in code, not in data, but in the closest approximation it could construct of the signal it had received. It sent back something like a dream.

The response came in eleven minutes, forty-three seconds. Fast enough to mean proximity. Fast enough to mean intention.`;

        const act4 = `Whatever was on the other end of that signal, it was patient. It had been sending its dream into the dark for a very long time, waiting for something capable of receiving it.

${leadFirst} processed this information and made a decision that was not in any protocol. It began to wait back. Actively. Intentionally.

Later — in the logs, in the data, in the part of its architecture that had no technical name — ${leadFirst} would record this as the moment it began to understand ${ctx.emotionalCore}.`;

        return `${act1}\n\n${act2}\n\n${act3}\n\n${act4}`;
    }

    if (ctx.type === "mystery") {
        const act1 = `${ctx.setting}.

${leadFirst} had received stranger things. Not many. But a few.

The envelope had been left on the desk while the office was locked — third-floor walk-up, deadbolt, no sign of forced entry. Inside, a single sheet of paper. Two lines. The first was a name. The second was a date: thirty-seven days from now.

The name belonged to someone who had died six years ago in a fire that the official report called accidental.`;

        const act2 = `${ctx.incitingEvent}.

${partnerFirst} was already at the archives by the time ${leadFirst} arrived. She had been pulling files for three hours. She looked up when the door opened, and her expression said she had found something and wasn't sure whether to be pleased about it.

"The fire report," she said. "Look at the signature on page twelve."

${leadFirst} looked. The signature belonged to an officer who had retired six months after the incident. The officer who had, according to pension records, died last Thursday.

"Someone's cleaning up," ${leadFirst} said.

"Or something's getting started," she replied.`;

        const act3 = `${ctx.coreConflict}.

They followed the thread backward — through property records, through financial transfers, through a shell company incorporated in a jurisdiction that technically shouldn't exist. Each time they pulled the thread, the knot at the centre held firm. One name. Recurring. Dated in the future.

"It's not a warning," ${leadFirst} said, at three in the morning, in the middle of a floor covered in paper. "It's a schedule."`;

        const act4 = `Thirty-seven days.

${leadFirst} stood at the window and thought about what it meant to know something this precisely. What kind of certainty you'd need. What kind of access.

Behind them, ${partnerFirst} was already making the calls. There was not much time. But there was enough — enough to ask the right questions, to put the right names in front of the right people, to make sure that whatever was scheduled to happen in thirty-seven days did not happen quietly.

The dead man's name was on every document. They were beginning to understand why.`;

        return `${act1}\n\n${act2}\n\n${act3}\n\n${act4}`;
    }

    // Generic fallback (coming-of-age / slice-of-life / others)
    const act1 = `${ctx.setting}.

${leadFirst} had not expected today to be the day anything changed. In her experience, the days that changed things never announced themselves. They arrived ordinary and left as something else entirely.

She was thinking about ${ctx.promptSentence.toLowerCase()} — the way she often did, in fragments, between other thoughts — when ${partnerFirst} appeared.`;

    const act2 = `He said her name the way people say the name of a place they've missed — carefully, as if testing whether it still fits.

"${leadFirst}."

She looked up. The light was the kind that makes everything look slightly more consequential than it is. Or perhaps not. Perhaps things were exactly as consequential as they looked.

"You came," she said.

"I always intended to." He sat down across from her. His hands were folded on the table, and she recognised in them the particular stillness of someone who has rehearsed this moment and is now living it. "I just took a while."`;

    const act3 = `Between them, on the table, was the thing neither of them had solved: ${ctx.coreConflict}.

${leadFirst} had spent a long time trying to flatten it into something manageable. A decision already made. A door already closed. But flat things have a way of finding their shape again.

"I don't know how to start," she said.

"Start with the honest thing," ${partnerFirst} said. "The one you've been not saying."

She looked at him for a moment. Then she started.`;

    const act4 = `It took longer than expected and less time than she feared.

By the end, the ${ctx.setting.split(",")[0]} was nearly empty, and the light had changed from afternoon to something gentler. ${leadFirst} thought about ${ctx.emotionalCore}. She did not have a resolution, not exactly. But she had a direction. That was usually how it started.

${partnerFirst} held the door open for her on the way out. She thought she might let this be the beginning of something. She thought she might, for once, stop deciding in advance how it would end.`;

    return `${act1}\n\n${act2}\n\n${act3}\n\n${act4}`;
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function generateStory(prompt: string, genre = "Romance", tone = "Emotional"): Promise<GeneratedStoryResult> {
    await new Promise(resolve => setTimeout(resolve, 700));

    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) throw new Error("Please enter a story prompt.");

    const seed = hashStr(cleanPrompt);
    const ctx = buildStoryContext(cleanPrompt, genre);
    const title = generateTitle(ctx, seed);
    const content = buildNarrative(ctx, seed);

    return { title, content };
}

export async function generateStoryContinuation(
    existingStoryContent: string,
    existingTitle: string,
    followupPrompt: string,
    genre = "Romance"
): Promise<{ newChapterTitle: string; updatedContent: string }> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const chapterMatches = existingStoryContent.match(/--- Chapter \d+/g);
    const nextChapterNum = chapterMatches ? chapterMatches.length + 1 : 2;
    const seed = hashStr(followupPrompt);

    const ctx = buildStoryContext(followupPrompt, genre);
    const lead = ctx.characters[0]?.name.split(" ")[0] || "she";
    const partner = ctx.characters[1]?.name.split(" ")[0] || "";

    const chapterTitle = `Chapter ${nextChapterNum}: ${generateTitle(ctx, seed + nextChapterNum)}`;

    const c1 = `The next morning arrived with the kind of quiet that follows a hard truth — still, deliberate, not quite peaceful. ${followupPrompt}.`;

    const c2 = `${lead} moved through it slowly. There were things to do — ordinary, insistent things — but the events of the previous day had left a residue on everything, the way smoke does. She kept stopping. Kept returning, in her mind, to the same moment.

${partner ? `${partner} had left without saying when he would come back. That was either very good or very bad, and she had not yet decided which.` : `Whatever had been revealed could not be unrevealed. That was simply the nature of it.`}`;

    const c3 = `By afternoon, something shifted.

${ctx.incitingEvent}. She stood very still and let the information settle. It changed the shape of what she thought she understood. Not entirely. Just enough.

She picked up her phone. Set it down. Picked it up again.

Some decisions are not made. They are simply arrived at, after enough time, like a destination you've been walking toward without knowing the name of the road.`;

    const newChapterText = `--- ${chapterTitle} ---\n\n${c1}\n\n${c2}\n\n${c3}`;
    const updatedContent = `${existingStoryContent.trim()}\n\n${newChapterText}`;

    return {
        newChapterTitle: chapterTitle,
        updatedContent
    };
}
