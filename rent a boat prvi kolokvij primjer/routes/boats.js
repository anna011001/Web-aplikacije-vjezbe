import express from 'express';
import { boats } from '../data/boats.js';

const boatRouter = express.Router();

boatRouter.get('/', (req, res) => {
    if (!boats || boats.length === 0) return res.status(404).json({message: `Nisu pronadeni brodovi.`});
    return res.status(200).json(boats);
});

boatRouter.get('/:naziv', (req, res) => {
    const boat = boats.find(boat => boat.naziv.toLowerCase() == req.params.naziv.toLowerCase());

    !boat ? res.status(404).json({message: `Nije pronaden brod.`}) : res.status(200).json(boat);
});

boatRouter.post('/', (req, res) => {
    const novi_brod = req.body;
    const kljucevi = Object.keys(req.body);

    if (!(kljucevi.includes("naziv") && kljucevi.includes("tip") && kljucevi.includes("duljina") && kljucevi.includes("cijenaPoDanu") && kljucevi.includes("motor_hp"))) {
        return res.status(400).json({message: `Niste upisali sve kljuceve`});
    }
    if (boats.find(boat => boat.naziv == req.body.naziv)) {
        return res.status(400).json({message: `Brod sa nazivom ${req.body.naziv} vec postoji`});
    }
    let novi_id = boats.length + 1;

    boats.push({...novi_brod, id: novi_id});
    return res.status(201).json(boats);
});

export default boatRouter;