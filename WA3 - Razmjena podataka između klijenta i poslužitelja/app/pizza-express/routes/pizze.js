// app/pizza-express/routes/pizze.js
import express from 'express';
import { db } from '../index.js';
const pizzeRouter = express.Router();

// GET /pizze - Dohvaćanje svih pizza (npr. GET /pizze)
pizzeRouter.get('/', async (req, res) => {
    let pizze_collection = db.collection('pizze'); // referenca na kolekciju 'pizze'
    let allPizze = await pizze_collection.find().toArray(); // pretvorba u Array
    res.status(200).json(allPizze);
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
    try {
        let result = await pizze_collection.insertOne(novaPizza);
        res.status(201).json({ InsertedId: result.insertedId });
    } 
    catch (error) {
        console.log(error.errorResponse);
        res.status(400).json({ error: error.errorResponse }); 
    }
});



export default pizzeRouter;