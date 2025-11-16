import express from 'express';
import {ponude} from '../data.js';

const ponudeRouter = express.Router();

function validirajPonudu(ponuda) {
    return (ponuda.ponudjena_cijena >= 0);
}

// GET sve ponude
ponudeRouter.get ('/', (req, res) => {
    res.status(200).send(ponude);
});

// POST dodaj novu ponudu
ponudeRouter.post('/', (req, res) => {
    const nova_ponuda = req.body;

    if (!validirajPonudu(nova_ponuda)) return res.status(400).json({message: 'Nije prosla validacija, unijeli ste negativne iznose!'});
    
    const kljucevi = Object.keys(nova_ponuda);

    if (!(kljucevi.includes("nekretnina_id") && kljucevi.includes("ime") 
        && kljucevi.includes("prezime") && kljucevi.includes("ponudjena_cijena") && kljucevi.includes("telefon"))) {
    return res.status(400).send("Niste napisali sve podatke za ponudu!");
    }
    ponude.push({ ...nova_ponuda, id: ponude.length + 1 });
    res.status(200).json("Objavljena nova ponuda.");
});

export default ponudeRouter;