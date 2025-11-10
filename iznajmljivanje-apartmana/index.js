import express from 'express';
import apartmaniRouter from './routers/apartmani.js';
import rezervacijeRouter from './routers/rezervacije.js';
import recenzijeRouter from './routers/recenzije.js';

const app = express(); 

app.use(express.json());
app.use('/apartmani', apartmaniRouter);
app.use('/rezervacije', rezervacijeRouter);
app.use('/recenzije', recenzijeRouter);

const PORT = 3000;
app.listen(PORT, error => {
    if (error) {
        console.error(`Greška prilikom pokretanja posluzitelja: ${error.message}`);
    } else {
        console.log(`Server je pokrenut na http://localhost:${PORT}`);
    }
});