const express = require('express');
const app = express();
const PORT = 3000;

let korisnici = [
  { id: 1, ime: "Ana", godine: 28 },
  { id: 2, ime: "Marko", godine: 35 },
  { id: 3, ime: "Ivana", godine: 22 },
];

// Ruta za pocetnu stranicu
app.get("/", (req, res) => {
  console.log('Pozvan je GET endpoint!');
  res.sendFile(__dirname + "/Public/index.html");
});

// Ruta za about stranicu
app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/Public/about.html");
});

// Ruta za dohvat korisnika
app.get("/korisnici", (req, res) => {
  console.log('Pozvan je GET /korisnici endpoint!');
  res.json(korisnici);
});

// Pokretanje poslužitelja
app.listen(PORT, (error) => {
  if (error) {
    console.error("Greška prilikom pokretanja poslužitelja:", error);
  } else {
    console.log(`Express.js poslužitelj sluša na portu ${PORT}`);
  }
});

