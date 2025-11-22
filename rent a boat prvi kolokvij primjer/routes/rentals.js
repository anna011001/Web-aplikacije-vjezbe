import express from 'express';
import { rentals } from '../data/rentals.js';
import { boats } from '../data/boats.js';

const rentalsRouter = express.Router();

rentalsRouter.get("/", (req, res) => {
    res.status(200).json(rentals);
});

rentalsRouter.post("/", (req, res) => {
    const novi_rental_podaci = req.body;
    const brod_id = req.body.boatId;

    const brod_postoji = boats.find(boat => boat.id == brod_id);

    if(!brod_postoji) {
        return res.status(404).send("Nema tog broda");
    }

    let novi_id = rentals.length + 1;
    let rentalStartDate = new Date(novi_rental_podaci.rentalStartDate);
    let rentalEndDate = new Date(novi_rental_podaci.rentalEndDate);

    if (rentalStartDate > rentalEndDate) return res.status(400).json({message: `Nije dobar datum.`});

    let razlika_u_ms = rentalEndDate - rentalStartDate;
    let razlika_u_danima = razlika_u_ms / 1000 / 60 / 60 / 24;
    let totalPrice = brod_postoji.cijenaPoDanu * razlika_u_danima;

    rentals.push({ id: novi_id, ...novi_rental_podaci, totalPrice: totalPrice});
    return res.status(201).json(rentals);
});

rentalsRouter.patch("/:id", (req, res) => {
    const rental = rentals.find(rental => rental.id == req.params.id);
    let rentalStartDate = new Date(req.body.rentalStartDate);
    let rentalEndDate = new Date(req.body.rentalEndDate);
    if (rentalStartDate > rentalEndDate) {
        return res.status(400).json({message: `Krivi datum.`});
    }
    if (rental) {
        Object.assign(rental, {rentalStartDate: req.body.rentalStartDate, rentalEndDate: req.body.rentalEndDate});
        return res.status(200).json(rental);
    }
    return res.status(400).send("Rental not found");
});

export default rentalsRouter;