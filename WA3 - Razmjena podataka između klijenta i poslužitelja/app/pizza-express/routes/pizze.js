// app/pizza-express/routes/pizze.js
import express from 'express';
import { db } from '../index.js';
const pizzeRouter = express.Router();

// GET /pizze - Dohvaćanje svih pizza (npr. GET /pizze)
pizzeRouter.get('/', async (req, res) => {
    let pizze_collection = db.collection('pizze'); // referenca na kolekciju 'pizze'
    let cijena_query = req.query.cijena;
    let naziv_query = req.query.naziv;

    if(!cijena_query) {
        let pizze = await pizze_collection.find().toArray();
        return res.status(200).json(pizze);
    }

    try {
        let pizze = await pizze_collection
            .find()
            .sort({ cijena: Number(cijena_query), naziv: Number(naziv_query) })
            .toArray(); // pretvorba u Array
        res.status(200).json(pizze);
    } catch (error) {
        console.log(error.errorResponse);
        res.status(400).json({ error: error.errorResponse });
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