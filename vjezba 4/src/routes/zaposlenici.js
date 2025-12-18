import express from 'express';
import fs from 'fs/promises';

const zaposleniciRouter = express.Router();
const zaposlenici_ruta = './data/zaposlenici.json';


zaposleniciRouter.get('', async (req, res) => {
    const data = await fs.readFile(zaposlenici_ruta, {encoding: "utf-8"});
    let zaposlenici = JSON.parse(data);

    if (zaposlenici) {
        const sortiraj_po_godinama = req.query.sortiraj_po_godinama;

      if (sortiraj_po_godinama) {
            if (sortiraj_po_godinama === 'uzlazno') {
                // sortiranje uzlazno: od najmanjeg prema najvećem
                zaposlenici.sort((a, b) => a.godine_staza - b.godine_staza);
                // sortiranje silazno: od najvećeg prema najmanjem
            } else if (sortiraj_po_godinama === 'silazno') {
                zaposlenici.sort((a, b) => b.godine_staza - a.godine_staza);
            }
        }

        const pozicija = req.query.pozicija;   

        if(pozicija) {
            zaposlenici = zaposlenici.filter(zaposlenik => zaposlenik.pozicija == pozicija);
        }

        const godine_staza_min = Number(req.query.godine_staza_min);

        if(!isNaN(godine_staza_min)) {
            zaposlenici = zaposlenici.filter(zaposlenik => zaposlenik.godine_staza >= godine_staza_min)
        }

        const godine_staza_max = Number(req.query.godine_staza_max);

        if(!isNaN(godine_staza_max)) {
            zaposlenici = zaposlenici.filter(zaposlenik => zaposlenik.godine_staza <= godine_staza_max)
        }

        return res.status(200).json(zaposlenici);
    }
    return res.status(404).send('Zaposlenici nisu pronadeni');
});

zaposleniciRouter.get('/:id', async (req, res) => {
    if (isNaN(req.params.id)) {
        return res.status(400).send("Los zahtjev");
    }

    const data = await fs.readFile(zaposlenici_ruta, {encoding: "utf-8"});
    const zaposlenici = JSON.parse(data);

    const zaposlenik = zaposlenici.find(zaposlenik => zaposlenik.id == req.params.id);
    
    if(!zaposlenik) {
        return res.status(404).send("nema zaposlenika");
    } else {
        return res.status(200).json(zaposlenik);
    }
});

zaposleniciRouter.post('/', async (req, res) => {
    const kljucevi = Object.keys(req.body);

    if (!(kljucevi.includes("ime") && kljucevi.includes("prezime") && kljucevi.includes("godine_staza") && kljucevi.includes("pozicija"))) {
        return res.status(400).send("Niste poslali sve atribute");
    }

    if (typeof req.body.ime !== 'string' || typeof req.body.prezime !== 'string') {
        return res.status(400).send("Ime i prezime moraju sadrzavati samo tekst");
    }

    if (isNaN(req.body.godine_staza)) return res.status(400).send("Godine staza moraju biti broj");


    let zaposlenici;

    try {
        const data = await fs.readFile(zaposlenici_ruta, 'utf-8');
        zaposlenici = JSON.parse(data);
    } catch (error) {
        console.error('Greska u citanju datoteke:', error);
        return res.status(500).send('Greska u citanju json datoteke.');
    }

    const novi_zaposlenik = {...req.body, id: zaposlenici.at(-1)['id'] + 1};
    zaposlenici.push(novi_zaposlenik);

    try {
        await fs.writeFile(zaposlenici_ruta, JSON.stringify(zaposlenici, null, 2)); // 2 je za uredivanje uvucenih redaka u jsonu
        console.log('Podaci uspješno zapisani u datoteku.');
        res.status(201).send("Created");
    } catch (error) {
        console.error('Greška prilikom pohrane u datoteku:', error);
        res.status(500).send('Greška prilikom pohrane u datoteku.');
    }
});

export default zaposleniciRouter;