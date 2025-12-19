import express from 'express';
import cors from 'cors';
import pizzeRouter from './routes/pizze.js';
import narudzbeRouter from './routes/narudzbe.js';
import { connectToDatabase } from './db.js'; 

// https://www.postman.com/anna011001-5136958/workspace/pizza-za-3-vjezbu

const corsOptions = {
    origin: 'http://localhost:5173'
};

const app = express();

let db = await connectToDatabase();
export { db };

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