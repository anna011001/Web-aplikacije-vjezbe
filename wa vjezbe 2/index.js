import express from 'express';
import pizzeRouter from './routes/pizze.js';
import narudzbeRouter from './routes/narudzbe.js';

let PORT = 3000;
let app = express();

app.use(express.json()); //middleware za parsiranje JSON tijela zahtjeva
app.use('/pizze', pizzeRouter);
app.use('/narudzbe', narudzbeRouter);

app.listen(PORT, (error) => { //pokretanje poslužitelja
    if (error) {
        console.log('Error occurred while starting the server');
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});