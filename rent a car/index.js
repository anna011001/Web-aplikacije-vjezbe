import express from 'express';
import path from 'path';
import carRouter from './routes/cars.js';
import leaseRouter from './routes/leases.js';

// https://www.postman.com/anna011001-5136958/workspace/rent-a-car-anna-bissinger

const app = express();
app.use(express.json());
app.use('/cars', carRouter);
app.use('/leases', leaseRouter);

const PORT = 3000;
app.listen(PORT, error => {
    if (error) {
        console.error(`Greska pri pokretanju posluzitelja: ${error.message}`);
    } else {
        console.log(`Welcome to Car-Leasing API! How can I assist you today?`);
    }
});

let relativna = path.join("public", "index.html");
let apsolutna = path.resolve(relativna);

app.get("/", (req, res) => {
    res.status(200).sendFile(apsolutna);
});
