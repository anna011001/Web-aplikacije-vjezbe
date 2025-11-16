import express from 'express';
import {nekretnine} from '../data.js';

const nekretnineRouter = express.Router();

function validirajNekretninu(nekretnina) {
    return (nekretnina.cijena >= 0 && nekretnina.broj_soba >= 0 && nekretnina.povrsina > 0);
}

// GET sve nekretnine
nekretnineRouter.get('/', (req, res) => {
    res.status(200).send(nekretnine);
});

// GET nekretnina po ID-u
nekretnineRouter.get('/:id', (req, res) => {
    if (isNaN(req.params.id)) {
        res.status(400).json({ message: 'Proslijedili ste parametar id koji nije broj!'});
        return;
    }

    const nekretnina = nekretnine.find(nekretnina => nekretnina.id == req.params.id);

    nekretnina ? res.status(200).send(nekretnina) : res.status(404).send("Sorry, nije pronadena nekretnina.");
});

// POST dodaj novu nekretninu
nekretnineRouter.post('/', (req, res) => {
    const nova_nekretnina = req.body;
    console.log(req.body);
    
    if (!validirajNekretninu(nova_nekretnina)) return res.status(400).send("Nije prosla validacija, unijeli ste negativne iznose!");

    const kljucevi = Object.keys(nova_nekretnina);

    if (!(kljucevi.includes("naziv") && kljucevi.includes("opis") && kljucevi.includes("cijena") 
        && kljucevi.includes("lokacija") && kljucevi.includes("broj_soba") && kljucevi.includes("povrsina"))) {
    res.status(400).send("Bad request.");
    return;
    }
    nekretnine.push({...nova_nekretnina, id: nekretnine.length + 1});
    return res.status(201).json(nova_nekretnina);

});

// PUT azuriraj nekretninu potpuno
nekretnineRouter.put('/:id', (req, res) => {
    const nekretnina_index = nekretnine.findIndex(nekretnina => nekretnina.id == req.params.id);

    if (!validirajNekretninu(req.body)) return res.status(400).send("Nije prosla validacija, unijeli ste negativne iznose!");

    if (isNaN(req.params.id)) return res.status(400).json({message: 'Proslijedili ste parametar koji nije broj!'});

    if (nekretnina_index == -1) {
        return res.status(400).send("Nekretnina nije pronadena.");
    }
    nekretnine[nekretnina_index] = {...req.body, id: nekretnine[nekretnina_index].id};
    res.status(200).json(nekretnine[nekretnina_index]);
});

// PATCH azuriraj nekretninu djelomicno
nekretnineRouter.patch('/:id', (req, res) => {
    const nekretnina = nekretnine.find(nekretnina => nekretnina.id == req.params.id);

    if (!validirajNekretninu(nekretnina)) return res.status(400).send("Nije prosla validacija, unijeli ste negativne iznose!");

    if (isNaN(req.params.id)) return res.status(400).json({message: 'Proslijedili ste parametar koji nije broj!'});

    if (!nekretnina) return res.status(400).send("Nekretnina nije pronadena.");
    nekretnina.id = req.body.id ?? nekretnina.id;
    nekretnina.opis = req.body.opis ?? nekretnina.opis;
    res.status(200).json(nekretnina);
});

// DELETE nekretninu
nekretnineRouter.delete('/:id', (req, res) => {
    const index = nekretnine.findIndex(nekretnina => nekretnina.id == req.params.id);

    if (isNaN(req.params.id)) return res.status(400).json({message: 'Proslijedili ste parametar koji nije broj!'});
    
    if (index == -1) return res.status(400).send("Nekretnina nije pronadena.");
    nekretnine.splice(index, 1);
    res.status(200).send(`Nekretnina s id-jem ${req.params.id} je obrisana.`);
});

export default nekretnineRouter;