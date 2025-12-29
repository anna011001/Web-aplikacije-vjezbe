// app/pizza-express/routes/pizze.js
import express from 'express';
import { db } from '../index.js';
const pizzeRouter = express.Router();

// GET /pizze - Dohvaćanje svih pizza (npr. GET /pizze)
const velicine = ['mala', 'srednja', 'jumbo'];

pizzeRouter.get('/', async (req, res) => {
  const pizze_collection = db.collection('pizze');

  const { naziv, cijena_min, cijena_max, sort } = req.query;
  const filter = {};

  if (naziv?.trim()) {
    filter.naziv = { $regex: naziv.trim(), $options: 'i' };
  }

  /**
   * Primjer filtera:
   * ```
   * {
   *  $or: [
   *    { "cijene.mala": { $gte: min, $lte: max } },
   *    { "cijene.srednja": { $gte: min, $lte: max } },
   *    { "cijene.jumbo": { $gte: min, $lte: max } }
   *  ]
   * }
   *```
   */

  if (cijena_min || cijena_max) {
    const min = Number(cijena_min);
    const max = Number(cijena_max);

    const iliUvjeti = [];

    for (const velicina of velicine) {
      const uvjetZaVelicinu = {};

      if (!Number.isNaN(min)) uvjetZaVelicinu.$gte = min;
      if (!Number.isNaN(max)) uvjetZaVelicinu.$lte = max;

      if (Object.keys(uvjetZaVelicinu).length) {
        iliUvjeti.push({ [`cijene.${velicina}`]: uvjetZaVelicinu });
      }
    }

    if (iliUvjeti.length) {
      filter.$or = iliUvjeti;
    }
  }

  const sortObj = {};

    if (sort === 'asc') sortObj[`cijene.mala`] = 1;
    if (sort === 'desc') sortObj[`cijene.mala`] = -1;

  try {
    let cursor = pizze_collection.find(filter);

    if (sortObj[`cijene.mala`]) {
      cursor = cursor.sort(sortObj);
    }

    const pizze = await cursor.toArray();
    return res.status(200).json(pizze);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// GET /pizze/:naziv - Dohvaćanje pizze prema nazivu (npr. GET /pizze/Margherita)

pizzeRouter.get('/:naziv', async (req, res) => {
    let pizze_collection = db.collection('pizze');
    let naziv_param = req.params.naziv;
    let pizza = await pizze_collection.find({ naziv: naziv_param }).toArray();
    res.status(200).json(pizza);
});

pizzeRouter.post('/', async (req, res) => {
    let pizze_collection = db.collection('pizze');
    let novaPizza = req.body;
    let obavezniKljucevi = ["naziv", "sastojci", "cijene", "slika_url"];
    let obavezniKljuceviCijene = ["mala", "srednja", "jumbo"];

    if (!obavezniKljucevi.every(kljuc => kljuc in novaPizza)) {
        return res.status(400).send("Niste poslali sve parametre!");
    }

    if (!obavezniKljuceviCijene.every(kljuc => kljuc in novaPizza.cijene)) {
        return res.status(400).send("Niste poslali sve parametre!");
    }

    if (isNaN(novaPizza.cijene.mala) || isNaN(novaPizza.cijene.srednja || isNaN(novaPizza.cijene.jumbo))) {
        return res.status(400).send("Cijena pizze mora biti broj!");
    }

    if (novaPizza.sastojci.some(sastojak => typeof sastojak !== "string")) {
        return res.status(400).send("Sastojci pizze moraju biti rijeci!");
    }

    if (typeof novaPizza.slika_url !== "string" || novaPizza.slika_url.trim() == "") {
        return res.status(400).send("Url pizze mora biti string i ne smije biti prazan.");
    }

    if (typeof novaPizza.naziv !== "string") {
        return res.status(400).send("Naziv pizze mora biti rijec!");
    }

    try {
        let result = await pizze_collection.insertOne(novaPizza);
        res.status(201).json({ InsertedId: result.insertedId });
    } 
    catch (error) {
        console.log(error.errorResponse);
        res.status(400).json({ error: error.errorResponse }); 
    }
});

pizzeRouter.patch('/', async (req, res) => {
    let pizze_collection = db.collection('pizze');

    try {
        let result = await pizze_collection.updateMany({ cijena: { $lt: 15 } }, { $inc: { cijena: 2 } }); // povećaj cijenu svih pizza čija je cijena manja od 15 za 2 eura
        res.status(200).json({ modifiedCount: result.modifiedCount });
    } catch (error) {
        console.log(error.errorResponse);
        res.status(400).json({ error: error.errorResponse });
    }
});

pizzeRouter.patch('/:naziv', async (req, res) => {
    let pizze_collection = db.collection('pizze');
    let naziv_param = req.params.naziv;
    let novaCijena = req.body.cijena;

    try {
        let result = await pizze_collection.updateOne({ naziv: naziv_param }, { $set: { cijena: novaCijena } });
        res.status(200).json({ modifiedCount: result.modifiedCount });
    } catch (error) {
        console.log(error.errorResponse);
        res.status(400).json({ error: error.errorResponse });
    }
});

pizzeRouter.put('/', async (req, res) => {
    let pizze_collection = db.collection('pizze');
    let noviMeni = req.body;

    try{
        await pizze_collection.deleteMany({});
        let result = await pizze_collection.insertMany(noviMeni);
        res.status(200).json({ insertedCount: result.insertedCount });
    } catch (error) {
        console.log(error.errorResponse);res.status(400).json({ error: error.errorResponse });
    }
});

pizzeRouter.delete('/:naziv', async (req, res) => {
    let pizze_collection = db.collection('pizze');
    let naziv_param = req.params.naziv;

    try {
        let result = await pizze_collection.deleteOne({ naziv: naziv_param }); // brišemo pizzu prema nazivu
        res.status(200).json({ deletedCount: result.deletedCount });
    } catch (error) {
        console.log(error.errorResponse);
        res.status(400).json({ error: error.errorResponse });
    }
});

pizzeRouter.delete('/', async (req, res) => {
    let pizze_collection = db.collection('pizze');

    try {
        let result = await pizze_collection.deleteMany({});
        res.status(200).json({ deletedCount: result.deletedCount });
    } catch (error) {
        console.log(error.errorResponse);
        res.status(400).json({ error: error.errorResponse });
    }
});

export default pizzeRouter;