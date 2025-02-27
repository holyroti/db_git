export interface NestedTable {
  headers: string[];
  rows: (string | NestedTable)[][];
}

export interface DialogueChoice {
  text: string;
  next: string | number | SceneNavigation;  // Supports scene navigation
}

export interface SceneNavigation {
  scene: string;
  index: number;
}

export interface DialogueEntry {
  text: string;
  next?: number | string | SceneNavigation;
  choices?: DialogueChoice[];
  table?: NestedTable;  // Using the original NestedTable structure
  background?: string;
  character?: string;
  videoUrl?: string;
  imageUrl?: string;
  achievement?: {   // Achievement Property
    title: string;
    description: string;
    badgeImage: string;  // URL to the badge image
  };
}

export interface DialogueMap {
  [key: string]: DialogueEntry[];
}

export const dialogues: DialogueMap = {
  // === INTRODUCTION ===
  introduction: [
    { 
      text: "Welkom bij de cursus Database Normalisatie! Vandaag begin je aan een avontuur vol kennis, inzichten en praktische voorbeelden. Ons doel is om je te helpen meester te worden in het ontwerpen van efficiënte databases.",
      next: 1,
      background: "assets/novel/ai/backgrounds/front.webp",
      character: "assets/novel/ai/normalis/normalis-front.png"
    },
    {
      text: "Ik ben Directeur Normalis, de trotse leider van onze academie. Hier draait alles om het structureren van data op een manier die redundantie elimineert en de integriteit van je informatie waarborgt. In deze cursus leggen we de fundamenten van een robuuste database.",
      next: 2,
      background: "assets/novel/ai/backgrounds/front.webp",
      character: "assets/novel/ai/normalis/normalis-front.png"
    },
    {
      text: "Database normalisatie is een proces waarbij we tabellen opdelen in kleinere, logisch samenhangende tabellen. Hierdoor voorkomen we dat gegevens herhaald worden en zorgen we ervoor dat elke update, verwijdering of toevoeging foutloos verloopt.",
      next: 3,
      background: "assets/novel/ai/backgrounds/front.webp",
      character: "assets/novel/ai/normalis/normalis-front.png"
    },
    {
      text: "Er zijn drie basisniveaus die we gaan behandelen: de Eerste Normale Vorm (1NF), de Tweede Normale Vorm (2NF) en de Derde Normale Vorm (3NF). Elk niveau introduceert een nieuwe manier om je data nog consistenter en efficiënter te structureren.",
      next: 4,
      background: "assets/novel/ai/backgrounds/front.webp",
      character: "assets/novel/ai/normalis/normalis-front.png"
    },
    {
      text: "Een goed genormaliseerde database maakt niet alleen je data overzichtelijk, maar verbetert ook de prestaties van je toepassingen. Door redundantie te vermijden, verklein je de kans op fouten en bespaar je tijd bij toekomstige wijzigingen.",
      next: 5,
      background: "assets/novel/ai/backgrounds/front.webp",
      character: "assets/novel/ai/normalis/normalis-front.png"
    },
    {
      text: "In de komende lessen duiken we diep in elk normalisatieniveau met concrete voorbeelden, interactieve tabellen en zelfs keuzemomenten die je helpen de stof echt te doorgronden. Zorg dat je aantekeningen bij de hand hebt!",
      next: 6,
      background: "assets/novel/ai/backgrounds/front.webp",
      character: "assets/novel/ai/normalis/normalis-front.png"
    },
    {
      text: "Laten we beginnen met een informatieve video die de basisprincipes van databasemodellering en normalisatie behandelt. Deze video legt stap voor stap uit waarom normalisatie zo belangrijk is en hoe het je helpt om efficiënte databases te ontwerpen.",
      videoUrl: "https://www.youtube.com/embed/UrYLYV7eStY", // Een betrouwbare video over normalisatie
      next: 7,
      background: "assets/novel/ai/backgrounds/front.webp",
      character: "assets/novel/ai/normalis/normalis-front.png"
    },
    {
      text: "Neem even de tijd om de video te bekijken en de voorbeelden in je op te nemen. Als je vragen hebt, kun je later altijd terugkomen voor meer uitleg.",
      next: 8,
      background: "assets/novel/ai/backgrounds/front.webp",
      character: "assets/novel/ai/normalis/normalis-front.png"
    },
    {
      text: "Hier zie je een afbeelding van een genormaliseerde tabel die laat zien hoe data er na een correcte normalisatie uitziet. Dit visuele voorbeeld helpt je de theorie te koppelen aan de praktijk.",
      imageUrl: "assets/novel/images/normalized_table.png",
      next: 9,
      background: "assets/novel/ai/backgrounds/front.webp",
      character: "assets/novel/ai/normalis/normalis-front.png"
    },
    {
      text: "Ben je klaar om je kennis in de praktijk te brengen? Kies hieronder een professor die je verder zal begeleiden in één van de drie normalisatieniveaus. Elk van hen beschikt over een schat aan kennis, voorbeelden en interactieve uitdagingen:",
      choices: [
        { text: "Professor Splitter (1NF)", next: 'prof_splitter' },
        { text: "Professor Decomposer (2NF)", next: 'prof_decomposer' },
        { text: "Professor Keywise (3NF)", next: 'prof_keywise' }
      ],
      background: "assets/novel/ai/backgrounds/front.webp",
      character: "assets/novel/ai/normalis/normalis-front.png"
    }
  ],

  // === PROFESSOR SPLITTER (1NF) ===
  prof_splitter: [
    {
      text: "Hallo! Ik ben Professor Splitter, expert in 1NF. Vandaag gaan we leren hoe je een tabel zodanig ontwerpt dat elke cel precies één atomaire waarde bevat.",
      next: 1,
      background: "assets/novel/ai/backgrounds/classroom_spitter.webp",
      character: "assets/novel/ai/splitter/splitter_standing.png"
    },
    {
      text: "Voordat we normaliseren, bekijken we een tabel in 0NF. In deze tabel zijn de contactgegevens van studenten in één cel samengevoegd, waardoor meerdere waarden in één cel staan.",
      table: {
        headers: ["Student", "Contactgegevens"],
        rows: [
          [
            "Jan",
            {
              headers: ["E-mail", "Telefoonnummer"],
              rows: [
                ["jan@example.com", "+31612345678"],
                ["jan.work@example.com", "+31698765432"]
              ]
            }
          ],
          [
            "Eva",
            {
              headers: ["E-mail", "Telefoonnummer"],
              rows: [
                ["eva@example.com", "+31687654321"],
                ["eva.work@example.com", "+31612349876"]
              ]
            }
          ]
        ]
      },
      next: 2,
      background: "assets/novel/ai/backgrounds/classroom_spitter.webp",
      character: "assets/novel/ai/splitter/splitter_talking_standing.png"
    },
    {
      text: "In 1NF moeten alle waarden atomair zijn. Laten we deze tabel normaliseren door de samengestelde cel op te splitsen zodat elke rij slechts één e-mailadres en één telefoonnummer bevat.",
      table: {
        headers: ["Student", "E-mail", "Telefoonnummer"],
        rows: [
          ["Jan", "jan@example.com", "+31612345678"],
          ["Eva", "eva@example.com", "+31687654321"]
        ]
      },
      next: 3,
      background: "assets/novel/ai/backgrounds/classroom_spitter.webp",
      character: "assets/novel/ai/splitter/splitter_standing.png"
    },
    {
      text: "Gefeliciteerd, je begrijpt nu de basis van 1NF! Door zorgvuldig data op te splitsen voorkom je verwarring en leg je de basis voor een efficiënte database.",
      achievement: {
        title: "1NF Badge Unlocked!",
        description: "Je hebt geleerd hoe je een tabel normaliseert naar 1NF.",
        badgeImage: "assets/novel/badges/1nf_badge.png"
      },
      next: { scene: 'introduction', index: 9 },
      background: "assets/novel/ai/backgrounds/classroom_spitter.webp",
      character: "assets/novel/ai/splitter/splitter_talking_standing.png"
    }
  ],

  // === PROFESSOR DECOMPOSER (2NF) ===
  prof_decomposer: [
    {
      text: "Welkom bij 2NF! Hier leren we over het verwijderen van gedeeltelijke afhankelijkheden. Ik ben Professor Decomposer en ik help je begrijpen hoe je redundantie in je database vermindert.",
      next: 1,
      background: "assets/novel/ai/backgrounds/classroom_composer.webp",
      character: "assets/novel/ai/decomposer/composer_smile.png"
    },
    {
      text: "Bekijk deze tabel die voldoet aan 1NF, maar nog niet aan 2NF. In deze tabel wordt de cursusinformatie herhaald voor dezelfde student, wat wijst op gedeeltelijke afhankelijkheden.",
      table: {
        headers: ["StudentID", "CursusID", "CursusNaam"],
        rows: [
          ["1", "101", "Database Normalisatie"],
          ["1", "102", "SQL Basics"],
          ["2", "101", "Database Normalisatie"]
        ]
      },
      next: 2,
      background: "assets/novel/ai/backgrounds/classroom_composer.webp",
      character: "assets/novel/ai/decomposer/composite_standing.png"
    },
    {
      text: "Door de tabel op te splitsen, verwijderen we deze gedeeltelijke afhankelijkheden. We leggen de relatie tussen studenten en cursussen vast in één tabel en bewaren de cursusinformatie in een andere tabel, zodat iedere informatie maar één keer voorkomt.",
      table: {
        headers: ["StudentID", "CursusID"],
        rows: [
          ["1", "101"],
          ["1", "102"],
          ["2", "101"]
        ]
      },
      next: 3,
      background: "assets/novel/ai/backgrounds/classroom_composer.webp",
      character: "assets/novel/ai/decomposer/composer_smile.png"
    },
    {
      text: "Goed gedaan! Je hebt geleerd hoe je een tabel naar de Tweede Normale Vorm (2NF) transformeert.",
      achievement: {
        title: "2NF Badge Unlocked!",
        description: "Je hebt geleerd hoe je een tabel normaliseert naar 2NF.",
        badgeImage: "assets/novel/badges/2nf_badge.png"
      },
      next: { scene: 'introduction', index: 9 },
      background: "assets/novel/ai/backgrounds/classroom_composer.webp",
      character: "assets/novel/ai/decomposer/composite_standing.png"
    }
  ],

  // === PROFESSOR KEYWISE (3NF) ===
  prof_keywise: [
    {
      text: "Welkom bij 3NF! Ik ben Professor Keywise en ik help je begrijpen hoe je transitieve afhankelijkheden elimineert zodat elke niet-sleutelattribuut uitsluitend afhankelijk is van de primaire sleutel.",
      next: 1,
      background: "assets/novel/ai/backgrounds/classroom_keywise.png",
      character: "assets/novel/ai/keywise/keywise_waving.png"
    },
    {
      text: "Bekijk deze tabel die wel voldoet aan 2NF, maar nog steeds transitieve afhankelijkheden bevat. De studentnaam en cursusnaam staan samen in dezelfde tabel, wat kan leiden tot inconsistenties.",
      table: {
        headers: ["StudentID", "StudentNaam", "CursusID", "CursusNaam"],
        rows: [
          ["1", "Jan", "101", "Database Normalisatie"],
          ["2", "Eva", "102", "SQL Basics"]
        ]
      },
      next: 2,
      background: "assets/novel/ai/backgrounds/classroom_keywise.png",
      character: "assets/novel/ai/keywise/keywise_pose.png"
    },
    {
      text: "In 3NF splitsen we de tabel verder op. We verplaatsen de cursusinformatie naar een aparte tabel, zodat iedere niet-sleutelattribuut volledig afhankelijk is van de primaire sleutel en niet van andere kolommen.",
      table: {
        headers: ["CursusID", "CursusNaam"],
        rows: [
          ["101", "Database Normalisatie"],
          ["102", "SQL Basics"]
        ]
      },
      next: 3,
      background: "assets/novel/ai/backgrounds/classroom_keywise.png",
      character: "assets/novel/ai/keywise/keywise_pose2.png"
    },
    {
      text: "Gefeliciteerd, je hebt de 3NF geleerd! Door transitieve afhankelijkheden te elimineren, creëer je een database die robuust, onderhoudbaar en klaar voor de toekomst is.",
      achievement: {
        title: "3NF Badge Unlocked!",
        description: "Je hebt geleerd hoe je een tabel normaliseert naar 3NF en transitieve afhankelijkheden elimineert.",
        badgeImage: "assets/novel/badges/3nf_badge.png"
      },
      next: { scene: 'introduction', index: 9 },
      background: "assets/novel/ai/backgrounds/classroom_keywise.png",
      character: "assets/novel/ai/keywise/keywise_waving.png"
    }
  ]
};
