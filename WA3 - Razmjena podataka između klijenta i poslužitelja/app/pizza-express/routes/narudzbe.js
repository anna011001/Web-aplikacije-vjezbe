// app/pizza-express/routes/narudzbe.js

import express from 'express';
import { db } from '../index.js';
const narudzbeRouter = express.Router();

// POST /narudzbe - Izrada nove narudžbe pizza
narudzbeRouter.post('/', async (req, res) => {
    let narudzbe_collection = db.collection('narudzbe');
    let novaNarudzba = req.body;

    let obavezniKljucevi = ['kupac', 'adresa', 'broj_telefona', 'narucene_pizze'];
    let obavezniKljuceviStavke = ['naziv', 'količina', 'veličina'];

    if (!obavezniKljucevi.every(kljuc => kljuc in novaNarudzba)) {
        return res.status(400).json({ error: 'Nedostaju obavezni ključevi' });
    }
    // za svaku stavku narudžbe provjeravamo obavezne ključeve, ovaj put ugniježđenom `every` metodom
    if (!novaNarudzba.narucene_pizze.every(stavka => obavezniKljuceviStavke.every(kljuc => kljuc in stavka))) {
        return res.status(400).json({ error: 'Nedostaju obavezni ključevi u stavci narudžbe' });
    }

    if (
        !novaNarudzba.narucene_pizze.every(stavka => {
            return Number.isInteger(stavka.količina) && stavka.količina > 0 && ['mala', 'srednja', 'velika'].includes(stavka.veličina);
        })
    ) {
        return res.status(400).json({ error: 'Neispravni podaci u stavci narudzbe' });
    }

    let pizze_collection = db.collection('pizze');
    let dostupne_pizze = await pizze_collection.find().toArray();

    if (!novaNarudzba.narucene_pizze.every(stavka => dostupne_pizze.some(pizza => pizza.naziv === stavka.naziv))) {
        return res.status(400).json({ error: 'Odabrali ste pizzu koju nemamo u ponudi' });
    }

    try {
        let result = await narudzbe_collection.insertOne(novaNarudzba);
        res.status(201).json({ insertedId: result.insertedId });
    } catch (error) {
        console.log(error.errorResponse);
        res.status(400).json({ error: error.errorResponse });
    }
});

export default narudzbeRouter;