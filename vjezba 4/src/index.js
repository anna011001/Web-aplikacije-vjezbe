import express from 'express';
import zaposleniciRouter from './routes/zaposlenici.js';

// https://www.postman.com/anna011001-5136958/workspace/zaposlenici

const app = express();
app.use(express.json());
app.use('/zaposlenici', zaposleniciRouter);

const PORT = 3000;

app.listen(PORT, error => {
    if(error) {
        console.error(`Greska prilikom pokretanja posluzitelja: ${error.message}`);
    } else {
        console.log(`Server je pokrenut na http://localhost:${PORT}`);
    }
});