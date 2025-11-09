import express from 'express';
import { pizze } from './pizze.js';
const narudzbeRouter = express.Router();

export default narudzbeRouter;

let lastId = 0;
let narudzbe = []; //niz objekata, in memory pohrana

narudzbeRouter.post('/naruci', (req, res) => {
    const narudzba = req.body;

    let ukupna_cijena = 0;

    for (const stavka of narudzba.narudzba) {
        const kljucevi = Object.keys(stavka);

        if (!(kljucevi.includes('pizza') && kljucevi.includes('velicina') && kljucevi.includes('kolicina'))) {
            return res.status(400).send('Niste poslali sve potrebne podatke za narudzbu!');
        }

        const pizza_postoji = pizze.find(pizza => pizza.naziv === stavka.pizza);
        if (!pizza_postoji) {
            return res.status(400).send(`Pizza ${stavka.pizza} ne postoji u jelovniku!`);
        }
        ukupna_cijena += pizza_postoji.cijena * stavka.kolicina;
    }

    const kljucevi_klijenta = Object.keys(narudzba.klijent);

    if (!(kljucevi_klijenta.includes('prezime') && kljucevi_klijenta.includes('adresa') && kljucevi_klijenta.includes('broj_telefona'))) {
        return res.status(400).send('Niste poslali sve potrebne podatke o klijentu!');
    }

    narudzba.id = ++lastId;
    narudzbe.push(narudzba);

    console.log('Primljeni podaci:', narudzba);

    const opisNarudzbe = narudzba.narudzba
        .map(stavka => `${stavka.pizza} (${stavka.velicina})`)
        .join(', ');

    return res.status(201).send({
        message:`Vaša narudžba za ${opisNarudzbe} je uspješno zaprimljena!`, 
        prezime: narudzba.klijent.prezime, 
        adresa: narudzba.klijent.adresa, 
        broj_telefona: narudzba.klijent.broj_telefona, 
        ukupna_cijena
    });
});

narudzbeRouter.get('/', (req, res) => {
    res.send(narudzbe);
});

narudzbeRouter.get('/:id', (req, res) => {
    const id = req.params.id;
    const narudzba = narudzbe.find(narudzba => narudzba.id == id);
    if (!narudzba) {
        return res.status(404).send('Narudžba s danim ID-em nije pronađena.');
    }
    res.status(200).json(narudzba);
});

narudzbeRouter.delete('/:id', (req, res) => {
    const id = req.params.id;
    const index = narudzbe.findIndex(narudzba => narudzba.id == id);
    if (index == -1) {
        return res.status(404).send('Narudžba s danim ID-em nije pronađena.');
    }
    narudzbe.splice(index, 1);
    res.status(200).send('Narudžba je uspješno obrisana.');
});