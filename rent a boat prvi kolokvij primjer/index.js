import express from 'express';
import path from 'path';
import boatRouter from './routes/boats.js';
import rentalsRouter from './routes/rentals.js';

//postman: https://www.postman.com/anna011001-5136958/workspace/rent-a-boat-anna-bissinger

const app = express();
app.use(express.json());
app.use('/boats', boatRouter);
app.use('/rentals', rentalsRouter);

const PORT = 3000;
app.listen (PORT, error => {
    if (error) {
        console.error(`Greska prilikom pokretanja posluzitelja: ${error.message}`);
    } else {
        console.log(`Welcome to Rent-a-boat API! How can I help you?`);
    }
});

let relativna = path.join("public", "index.html");
let apsolutna = path.resolve(relativna);
console.log(apsolutna);


app.get("/", (req, res) => {
    res.status(200).sendFile(apsolutna);
});