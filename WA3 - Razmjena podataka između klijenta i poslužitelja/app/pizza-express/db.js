import 'dotenv/config'; // ubacili smo config za connection string za mongo iz env fajla
import { MongoClient } from 'mongodb';

const mongoURI = process.env.MONGO_URI;

export async function connectToDatabase() {
    try {
        const client = new MongoClient(mongoURI); // stvaramo novi klijent
        await client.connect(); // spajamo se na klijent
        console.log('Uspješno spajanje na bazu podataka');
        let db = client.db(process.env.MONGO_DB_NAME); // odabiremo bazu podataka
        return db;
    } catch (error) {
        console.error('Greška prilikom spajanja na bazu podataka', error);
        throw error;
    }
}
