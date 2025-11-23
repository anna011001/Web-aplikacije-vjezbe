import express from 'express';
import { cars } from '../data/cars.js';

const carRouter = express.Router();

carRouter.get("/", (req, res) => {
    if(!cars || cars.length === 0) {
        return res.status(400).json({message: `Nema auta.`});
    } else {
        return res.status(200).json(cars);
    }
});

carRouter.get("/models/:model", (req, res) => {
    const car = cars.find(car => car.model.toLowerCase() == req.params.model.toLowerCase());

    car ? res.status(200).json(car) : res.status(404).json({message: `Auto nije pronaden.`});
});

carRouter.post("/", (req, res) => {
    const kljucevi = Object.keys(req.body);

    if (!(kljucevi.includes("brand") && kljucevi.includes("model") && kljucevi.includes("year") && kljucevi.includes("dailyPrice") && kljucevi.includes("engine_hp"))) {
        return res.status(400).json({message: `Niste upisali sve podatke.`});
    }

    if (cars.find(car => car.model == req.body.model)) {
        return res.status(400).json({message: `Auto tog modela vec postoji.`});
    } else {
        cars.push({...req.body, id: cars.at(-1)["id"] + 1});
        return res.status(201).json(req.body);
    }
});

export default carRouter;