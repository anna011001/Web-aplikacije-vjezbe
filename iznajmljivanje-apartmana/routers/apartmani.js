import express from 'express';
import { apartmani } from '../data.js';
const apartmaniRouter = express.Router();

// GET svi apartmani
apartmaniRouter.get("/", (req, res) => {
  res.json(apartmani);
});

// GET jedan apartman
apartmaniRouter.get("/:id", (req, res) => {
  const apartman = apartmani.find(apartman => apartman.id == req.params.id);
  apartman ? res.json(apartman) : res.status(404).send("Apartman nije pronađen");
});

// POST novi apartman
apartmaniRouter.post("/", (req, res) => {
  const kljucevi = Object.keys(req.body);

  if (!(kljucevi.includes('naziv') && kljucevi.includes('lokacija') && kljucevi.includes('cijenaNoćenja') && kljucevi.includes('zauzet'))) {
    res.status(400).send('Niste poslali sve potrebne podatke za apartman!');
    return;
  }

  const novi_apartman = {...req.body, id: apartmani.length + 1};
  apartmani.push(novi_apartman);
  res.status(201).json(`Objavili ste novi apartman naziva ${novi_apartman.naziv}, na lokaciji ${novi_apartman.lokacija} sa cijenom noćenja ${novi_apartman.cijenaNoćenja} eura.`);
});

// PUT - zamjena cijelog zapisa
apartmaniRouter.put("/:id", (req, res) => {
  const index = apartmani.findIndex(apartman => apartman.id == req.params.id);
  if (index === -1) return res.status(404).send("Apartman nije pronađen");
  apartmani[index] = { ...req.body, id: apartmani[index].id, };
  res.status(200).json(apartmani[index]);
});

// PATCH - djelomična izmjena
apartmaniRouter.patch("/:id", (req, res) => {
  const apartman = apartmani.find(apartman => apartman.id == req.params.id);
  if (!apartman) return res.status(404).send("Apartman nije pronađen");
  Object.assign(apartman, req.body);
  apartman.id = req.params.id;
  res.json(apartman);
});
          
// DELETE
apartmaniRouter.delete("/:id", (req, res) => {
  const index = apartmani.findIndex(apartman => apartman.id == req.params.id);
      if (index == -1) {
          res.status(404).send("Apartman nije pronađen");
          return;
      }
      recenzije.splice(index, 1);
      res.status(200).send("Apartman je obrisan");
});

export default apartmaniRouter;
