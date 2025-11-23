import express from 'express';
import { leases } from '../data/leases.js';
import { cars } from '../data/cars.js';
import { brojDana } from '../utils/broj-dana.js';

const leaseRouter = express.Router();

leaseRouter.post("/", (req, res) => {
    let car = cars.find(car => car.id == req.body.carId);

    if (!car) {
        return res.status(404).send("Auto s tim id-jem nije pronaden");
    }

    if (req.body.leaseStart > req.body.leaseEnd) return res.status(400).send("Krivi datum.");

    let broj_dana = brojDana(req.body.leaseStart, req.body.leaseEnd);

    let totalPrice = car.dailyPrice * broj_dana;

    leases.push({...req.body, id: leases.length + 1, totalPrice: totalPrice});
    return res.status(201).json(leases);
});

leaseRouter.patch("/:id", (req, res) => {
    const lease = leases.find(lease => lease.id == req.params.id);
    let leaseStart = new Date(req.body.leaseStart);
    let leaseEnd = new Date(req.body.leaseEnd);

    if(leaseStart > leaseEnd) return res.status(400).send("Upisali ste krivi datum.");

    if(lease) {
        Object.assign(lease, {leaseStart: req.body.leaseStart, leaseEnd: req.body.leaseEnd});
        return res.status(200).json(lease);
    }
    return res.status(400).json({message: `Promjena datuma nije uspjela.`});
});

export default leaseRouter;