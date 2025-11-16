import express from 'express';
import ponudeRouter from './routers/ponude.js';
import nekretnineRouter from './routers/nekretnine.js';

const app = express();

app.use(express.json());
app.use('/nekretnine', nekretnineRouter);
app.use('/ponude', ponudeRouter);

const PORT = 3000;
app.listen(PORT, error => {
    if (error) {
        console.error(`Greska prilikom pokretanja servera: ${error.message}`);
    } else {
        console.log(`Server je pokrenut na http://localhost:${PORT}`);
    }
});