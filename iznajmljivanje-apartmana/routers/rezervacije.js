import express from 'express';
import { rezervacije } from '../data.js';
const rezervacijeRouter = express.Router();


// GET sve rezervacije
rezervacijeRouter.get("/", (req, res) => res.json(rezervacije));

// GET po ID-u
rezervacijeRouter.get("/:id", (req, res) => {
  const r = rezervacije.find(x => x.id === parseInt(req.params.id));
  r ? res.json(r) : res.status(404).send("Rezervacija nije pronađena");
});

// GET po gostu
rezervacijeRouter.get("/gost/:gost", (req, res) => {
  const rezervacija = rezervacije.filter(rezervacija => rezervacija.gost == req.params.gost);
  if (rezervacija.length > 0) {
    res.json(rezervacija);
    return;
  }
  res.status(404).send("Rezervacija nije pronađena");
});

// POST nova rezervacija
rezervacijeRouter.post("/", (req, res) => {
  const kljucevi = Object.keys(req.body);

  if (!(kljucevi.includes('apartmanId') && kljucevi.includes('gost') && kljucevi.includes('od') && kljucevi.includes('do'))) {
    res.status(400).send('Niste poslali sve potrebne podatke za rezervaciju!');
    return;
  }

  const nova_rezervacija = {...req.body,id: rezervacije.length + 1};
  rezervacije.push(nova_rezervacija);
  res.status(201).json(`Uspjesno ste stvorili novu rezervaciju: ${nova_rezervacija.apartmanId} od ${nova_rezervacija.od} do ${nova_rezervacija.do}`);
});

// PUT
rezervacijeRouter.put("/:id", (req, res) => {
  const index = rezervacije.findIndex(rezervacija => rezervacija.id == req.params.id);
  if (index == -1) return res.status(404).send("Rezervacija nije pronađena");
  rezervacije[index] = { ...req.body, id: rezervacije[index].id };
  res.status(200).json(`Izmijenili ste rezervaciju ${rezervacije[index].id}`);
});

// PATCH
rezervacijeRouter.patch("/:id", (req, res) => {
  const rezervacija = rezervacije.find(rezervacija => rezervacija.id == req.params.id);
  if (!rezervacija) return res.status(404).send("Rezervacija nije pronađena");
  rezervacija.od = req.body.od ?? rezervacija.od;
  rezervacija.do = req.body.do ?? rezervacija.do;
  res.status(200).json(rezervacije);
});

// DELETE
rezervacijeRouter.delete("/:id", (req, res) => {
  const index = rezervacije.findIndex(rezervacija => rezervacija.id == req.params.id);
      if (index == -1) {
          res.status(404).send("Rezervacija nije pronađena");
          return;
      }
      rezervacije.splice(index, 1);
      res.status(200).send("Rezervacija je obrisana");
});

export default rezervacijeRouter;
