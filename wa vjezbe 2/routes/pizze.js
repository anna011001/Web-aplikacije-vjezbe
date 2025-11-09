import express from 'express';
const pizzeRouter = express.Router();

export default pizzeRouter; 

export let pizze = [ //niz objekata koji predstavljaju pizze
    { id: 1, naziv: 'Margherita', cijena: 9 },
    { id: 2, naziv: 'Capricciosa', cijena: 12 },
    { id: 3, naziv: 'Vegetariana', cijena: 10 },
    { id: 4, naziv: 'Quattro Stagioni', cijena: 14 },
    { id: 5, naziv: 'Diavola', cijena: 11 }
];


pizzeRouter.get('/', (req, res) => { 
    //osnovna ruta
    console.log('Pozvana GET / ruta')
    res.send('Hello World!');
});

pizzeRouter.get('/pizze', (req, res) => {
    //ruta za dohvaćanje svih pizza
    let naziv_pizze = req.params.naziv;
    console.log('Trazim pizzu: ', naziv_pizze);
    res.json(pizze);
});

//route parametar rute
pizzeRouter.get('/pizze/:naziv', (req, res) => {
    let naziv_pizze = req.params.naziv;
    console.log('Trazim pizzu: ', naziv_pizze);
    let trazena_pizza = pizze.find(pizza => pizza.naziv === naziv_pizze);
    if (!trazena_pizza) {
        return res.status(404).send('Pizza s danim nazivom nije pronađena.');
    }
    res.status(200).json(trazena_pizza);
    // -X GET http://localhost:3000/pizze/Vegetariana
});

pizzeRouter.post('/pizze', (req, res) => {
    //ruta za dodavanje nove pizze
    let nova_pizza = req.body;
    console.log('Podaci: ', nova_pizza);
    pizze.push(nova_pizza);
    res.status(201).json(pizze);
});

pizzeRouter.delete('/pizze/:id', (req, res) => {
    //ruta za brisanje pizze prema ID-u
    let brisanje_id = req.params.id;

    let index_polje = pizze.findIndex(pizza => brisanje_id == pizza.id);

    if (index_polje == -1) {
        return res.status(404).send('Pizza s danim ID-em nije pronađena.');
    }

    pizze.splice(index_polje, 1);

    console.log(pizze);

    res.json(pizze);

    console.log(brisanje_id);
    res.send(`Endpoint radi`);
});
    // -X DELETE http://localhost:3000/pizze/3