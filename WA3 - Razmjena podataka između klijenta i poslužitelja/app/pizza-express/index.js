import express from 'express';
import cors from 'cors';
import pizzeRouter from './routes/pizze.js';
import narudzbeRouter from './routes/narudzbe.js';

const corsOptions = {
    origin: 'http://localhost:5173'
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use('/pizze', pizzeRouter);
app.use('/narudzbe', narudzbeRouter);



const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Dobrodošli u Pizza Express poslužitelj!');
});

app.listen(PORT, () => {
    console.log(`Pizza poslužitelj sluša na portu ${PORT}`);
});