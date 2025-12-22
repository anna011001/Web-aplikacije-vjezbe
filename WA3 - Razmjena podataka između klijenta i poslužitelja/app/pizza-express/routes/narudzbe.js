// app/pizza-express/routes/narudzbe.js

import express from 'express';
import { db } from '../index.js';
import { ObjectId } from 'mongodb';
export const narudzbeRouter = express.Router();

narudzbeRouter.get('/', async (req, res) => {
    let narudzbe_collection = db.collection('narudzbe');
    let narudzbe = await narudzbe_collection.find().toArray();

    if (narudzbe.length === 0) {
        return res.status(404).json({ error: 'Nema narudzbi' });
    }
    res.status(200).json(narudzbe);
});

narudzbeRouter.get('/:id', async (req, res) => {
    let narudzbe_collection = db.collection('narudzbe');
    let id_param = req.params.id;
    let narudzba = await narudzbe_collection.findOne({ _id: new ObjectId(id_param) });

    if (!narudzba) {
        return res.status(404).json({ error: 'Narudzba nije pronadena' });
    }

    res.status(200).json(narudzba);
});

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
            return Number.isInteger(stavka.količina) && stavka.količina > 0 && ['mala', 'srednja', 'velika'].includes(stavka.veličina)
            && typeof novaNarudzba.naziv !== "string";
        })
    ) {
        return res.status(400).json({ error: 'Neispravni podaci u stavci narudzbe' });
    }

    if (isNaN(novaNarudzba.broj_telefona)) {
        return res.status(400).send("Telefon mora biti broj.");
    }

    let pizze_collection = db.collection('pizze');
    let dostupne_pizze = await pizze_collection.find().toArray();

    if (!novaNarudzba.narucene_pizze.every(stavka => dostupne_pizze.some(pizza => pizza.naziv === stavka.naziv))) {
        return res.status(400).json({ error: 'Odabrali ste pizzu koju nemamo u ponudi' });
    }

    let ukupna_cijena = 0;

    novaNarudzba.narucene_pizze.forEach(stavka => {
        const pizza = dostupne_pizze.find(druga_pizza => druga_pizza.naziv == stavka.naziv);

        ukupna_cijena += pizza.cijene[stavka.veličina] * stavka.količina;
    });

    novaNarudzba.ukupna_cijena = ukupna_cijena;
    
    try {
        let result = await narudzbe_collection.insertOne(novaNarudzba);
        res.status(201).json({ insertedId: result.insertedId });
    } catch (error) {
        console.log(error.errorResponse);
        res.status(400).json({ error: error.errorResponse });
    }
});

narudzbeRouter.patch('/:id', async (req, res) => {
    let narudzbe_collection = db.collection('narudzbe');
    let id_param = req.params.id;
    let noviStatus = req.body.status;

    try {
        let result = await narudzbe_collection.updateOne({ _id: new ObjectId(id_param) }, { $set: { status: noviStatus } });

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Narudzba nije pronadena' });
        }

        res.status(200).json({ modifiedCount: result.modifiedCount });
    } catch (error) {
        console.log(error.errorResponse);
        res.status(400).json({ error: error.errorResponse});
    }
});

export default narudzbeRouter;