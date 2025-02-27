export const keywiseDialogues = [
    {
      text: "Hallo daar! Ik ben Professor Keywise, jouw gids naar de geheimen van 3NF.",
      character: "assets/novel/ai/keywise/keywise_waving.png",
      next: 1
    },
    {
      text: "3NF draait om het elimineren van *transitieve afhankelijkheden*. Dit betekent dat geen enkel niet-sleutelattribuut afhankelijk mag zijn van een ander niet-sleutelattribuut.",
      character: "assets/novel/ai/keywise/keywise_explaining.png",
      next: 2
    },
    {
      text: "Bekijk dit voorbeeld. Hier is *CursusNaam* afhankelijk van *CursusID*, en *StudentNaam* is afhankelijk van *StudentID*. Dit is transitief afhankelijk!",
      table: {
        headers: ["StudentID", "StudentNaam", "CursusID", "CursusNaam"],
        rows: [
          ["1", "Jan", "101", "Database Normalisatie"],
          ["2", "Eva", "102", "SQL Basics"]
        ]
      },
      character: "assets/novel/ai/keywise/keywise_explaining.png",
      next: 3
    },
    {
      text: "Om dit op te lossen splitsen we de tabel in tweeën: één tabel voor studenten en één voor cursussen. Zo verwijderen we de transitieve afhankelijkheid.",
      table: {
        headers: ["StudentID", "StudentNaam"],
        rows: [
          ["1", "Jan"],
          ["2", "Eva"]
        ]
      },
      character: "assets/novel/ai/keywise/keywise_pointing.png",
      next: 4
    },
    {
      text: "En hier is de tweede tabel, waarin we *CursusID* koppelen aan *CursusNaam*. Dit is nu volledig genormaliseerd volgens 3NF!",
      table: {
        headers: ["CursusID", "CursusNaam"],
        rows: [
          ["101", "Database Normalisatie"],
          ["102", "SQL Basics"]
        ]
      },
      character: "assets/novel/ai/keywise/keywise_smiling.png",
      next: 5
    },
    {
      text: "Goed gedaan! Als je meer hulp nodig hebt, klik gerust op mijn icoon. Succes met je normalisatie-avontuur!",
      character: "assets/novel/ai/keywise/keywise_waving.png",
      next: null
    }
  ];
  