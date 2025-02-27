export const splitterDialogues = [
    {
      text: "Hoi! Ik ben Professor Splitter. Ik help je met hints over 1NF.",
      character: "assets/novel/ai/splitter/splitter-speech.png",
      next: 1
    },
    {
      text: "In 1NF moeten alle waarden in je tabel atomair zijn. Dat betekent: slechts één waarde per cel!",
      character: "assets/novel/ai/splitter/splitter-speech.png",
      next: 2
    },
    {
      text: "Bekijk dit voorbeeld van een fout: meerdere telefoonnummers in één kolom. Dit moet je splitsen!",
      table: {
        headers: ["Naam", "Telefoonnummer"],
        rows: [
          ["Jan", "+31612345678, +31698765432"],
          ["Eva", "+31687654321"]
        ]
      },
      character: "assets/novel/ai/splitter/splitter-speech.png",
      next: 3
    },
    {
      text: "Goed gedaan! Als je nog meer hulp nodig hebt, klik dan weer op mijn icoon. Succes!",
      character: "assets/novel/ai/splitter/splitter-speech.png",
      next: null
    }
  ];
  