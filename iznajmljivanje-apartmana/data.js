export let apartmani = [
  { id: 1, naziv: "Villa Sunce", lokacija: "Zadar", cijenaNoćenja: 80, zauzet: false },
  { id: 2, naziv: "Apartman More", lokacija: "Split", cijenaNoćenja: 100, zauzet: true },
  { id: 3, naziv: "Studio Luka", lokacija: "Dubrovnik", cijenaNoćenja: 90, zauzet: false },
  { id: 4, naziv: "Luxury View", lokacija: "Makarska", cijenaNoćenja: 120, zauzet: true },
  { id: 5, naziv: "Green Oasis", lokacija: "Rovinj", cijenaNoćenja: 85, zauzet: false },
  { id: 6, naziv: "Blue Horizon", lokacija: "Pula", cijenaNoćenja: 95, zauzet: false },
  { id: 7, naziv: "Apartman Jadran", lokacija: "Šibenik", cijenaNoćenja: 75, zauzet: true },
  { id: 8, naziv: "Sunset Bay", lokacija: "Krk", cijenaNoćenja: 110, zauzet: false },
  { id: 9, naziv: "Family Nest", lokacija: "Zagreb", cijenaNoćenja: 70, zauzet: true },
  { id: 10, naziv: "Villa Relax", lokacija: "Trogir", cijenaNoćenja: 105, zauzet: false },
];

export let rezervacije = [
  { id: 1, apartmanId: 2, gost: "Ana Kovač", od: "2025-10-10", do: "2025-10-15" },
  { id: 2, apartmanId: 1, gost: "Marko Horvat", od: "2025-11-01", do: "2025-11-05" },
  { id: 3, apartmanId: 4, gost: "Ivana Perić", od: "2025-12-20", do: "2025-12-27" },
  { id: 4, apartmanId: 7, gost: "Petar Novak", od: "2025-09-01", do: "2025-09-10" },
  { id: 5, apartmanId: 9, gost: "Lucija Barić", od: "2025-08-15", do: "2025-08-20" },
  { id: 6, apartmanId: 5, gost: "Toni Babić", od: "2025-07-10", do: "2025-07-14" },
  { id: 7, apartmanId: 3, gost: "Maja Petrović", od: "2025-06-01", do: "2025-06-05" },
  { id: 8, apartmanId: 10, gost: "Filip Marić", od: "2025-09-05", do: "2025-09-09" },
  { id: 9, apartmanId: 8, gost: "Karla Krstić", od: "2025-04-10", do: "2025-04-15" },
  { id: 10, apartmanId: 6, gost: "Ivan Pavlović", od: "2025-05-02", do: "2025-05-08" },
];

export let recenzije = [
  { id: 1, apartmanId: 1, gost: "Ana Kovač", ocjena: 5, komentar: "Savršeno iskustvo! Čisto i udobno." },
  { id: 2, apartmanId: 2, gost: "Marko Horvat", ocjena: 4, komentar: "Odlična lokacija, ali buka s ulice." },
  { id: 3, apartmanId: 3, gost: "Ivana Perić", ocjena: 3, komentar: "Apartman prosječan, ali domaćin ljubazan." },
  { id: 4, apartmanId: 4, gost: "Petar Novak", ocjena: 5, komentar: "Luksuzan smještaj, sve preporuke!" },
  { id: 5, apartmanId: 5, gost: "Lucija Barić", ocjena: 4, komentar: "Mirna lokacija, lijep vrt." },
  { id: 6, apartmanId: 6, gost: "Toni Babić", ocjena: 2, komentar: "Nedovoljno čisto, loša ventilacija." },
  { id: 7, apartmanId: 7, gost: "Maja Petrović", ocjena: 5, komentar: "Fantastičan pogled i blizina plaže!" },
  { id: 8, apartmanId: 8, gost: "Filip Marić", ocjena: 4, komentar: "Vrlo ugodno, sve kao na slikama." },
  { id: 9, apartmanId: 9, gost: "Karla Krstić", ocjena: 3, komentar: "Solidno, ali previše skuplje nego što vrijedi." },
  { id: 10, apartmanId: 10, gost: "Ivan Pavlović", ocjena: 5, komentar: "Super domaćin, preporučujem svakome!" },
];
