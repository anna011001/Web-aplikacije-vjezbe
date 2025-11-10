import express from "express";
import { recenzije } from "../data.js";
const recenzijeRouter = express.Router();

// GET sve recenzije
recenzijeRouter.get("/", (req, res) => res.json(recenzije));

// GET recenzije po ID-u
recenzijeRouter.get("/:id", (req, res) => {
  const id_recenzija = req.params.id;

  if (isNaN(id_recenzija)) {
    res.json({ message: 'Proslijedili ste parametar id koji nije broj!'});
    return;
  }

  const recenzija = recenzije.find(recenzija => recenzija.id == id_recenzija);
  recenzija ? res.json(recenzija) : res.status(404).send("Recenzija nije pronađena");
});

// GET recenzije apartmana po ocjeni
recenzijeRouter.get("/ocjena/:ocjena", (req, res) => {
  const lista = recenzije.filter(recenzija => recenzija.ocjena == req.params.ocjena);
  res.json(lista);
});

// POST nova recenzija
recenzijeRouter.post("/", (req, res) => {
  const nova_recenzija = {...req.body, id: recenzije.length + 1};
  recenzije.push(nova_recenzija);
  res.status(201).json(nova_recenzija);
});

// PUT zamjena cijele recenzije
recenzijeRouter.put("/:id", (req, res) => {
  const index = recenzije.findIndex(recenzija => recenzija.id == req.params.id);
  if (index === -1) return res.status(404).send("Recenzija nije pronađena");
  recenzije[index] = { ...req.body, id: recenzije[index].id };
  res.status(200).json(recenzije[index]);
});

// PATCH izmjena ocjene ili komentara
recenzijeRouter.patch("/:id", (req, res) => {
  const recenzija = recenzije.find(recenzija => recenzija.id == req.params.id);
  if (!recenzija) return res.status(404).send("Recenzija nije pronađena");
  recenzija.apartmanId = req.body.apartmanId ?? recenzija.apartmanId;
  recenzija.gost = req.body.gost ?? recenzija.gost;
  recenzija.ocjena = req.body.ocjena ?? recenzija.ocjena;
  recenzija.komentar = req.body.komentar ?? recenzija.komentar;
  res.json(recenzija);
});

// DELETE recenzija
recenzijeRouter.delete("/:id", (req, res) => {
 const index = recenzije.findIndex(recenzija => recenzija.id == req.params.id);
    if (index == -1) {
        res.status(404).send("Recenzija nije pronađena");
        return;
    }
    recenzije.splice(index, 1);
    res.status(200).send("Recenzija je obrisana");
});

export default recenzijeRouter;
