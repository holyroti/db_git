export const prof_decomposer = [
    { 
      text: "Welkom bij 2NF! Hier leren we over het verwijderen van gedeeltelijke afhankelijkheden.", 
      next: 1,
      background: "assets/novel/ai/backgrounds/classroom_composer.webp",
      character: "assets/novel/ai/decomposer/composer_smile.png"
    },
    { 
      text: "Bekijk deze tabel die voldoet aan 1NF, maar nog niet aan 2NF.",
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
      text: "In deze tabel is de cursusnaam afhankelijk van de CursusID, wat een gedeeltelijke afhankelijkheid veroorzaakt.",
      next: 3,
      background: "assets/novel/ai/backgrounds/classroom_composer.webp",
      character: "assets/novel/ai/decomposer/composer_thinking.png"
    },
    { 
      text: "Door deze tabel op te splitsen, verwijderen we gedeeltelijke afhankelijkheden.",
      table: {
        headers: ["StudentID", "CursusID"],
        rows: [
          ["1", "101"],
          ["1", "102"],
          ["2", "101"]
        ]
      },
      next: 4,
      background: "assets/novel/ai/backgrounds/classroom_composer.webp",
      character: "assets/novel/ai/decomposer/composer_smile.png"
    },
    { 
      text: "Daarnaast maken we een aparte tabel voor de cursusinformatie.",
      table: {
        headers: ["CursusID", "CursusNaam"],
        rows: [
          ["101", "Database Normalisatie"],
          ["102", "SQL Basics"]
        ]
      },
      next: 5,
      background: "assets/novel/ai/backgrounds/classroom_composer.webp",
      character: "assets/novel/ai/decomposer/composer_explaining.png"
    },
    { 
      text: "Door deze splitsing te maken, hebben we de tabel genormaliseerd naar 2NF.",
      next: 6,
      background: "assets/novel/ai/backgrounds/classroom_composer.webp",
      character: "assets/novel/ai/decomposer/composer_smile.png"
    },
    { 
      text: "Goed gedaan! Je hebt geleerd hoe je naar 2NF normaliseert.",
      achievement: {
        title: "2NF Badge Unlocked!",
        description: "Je hebt geleerd hoe je een tabel normaliseert naar 2NF.",
        badgeImage: "assets/novel/badges/2nf_badge.png"
      },
      next: { scene: 'introduction', index: 4 },
      background: "assets/novel/ai/backgrounds/classroom_composer.webp",
      character: "assets/novel/ai/decomposer/composite_standing.png"
    }
  ];
  