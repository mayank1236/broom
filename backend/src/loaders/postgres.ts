import {Pool} from 'pg';
import config from '@/config';

export default async (): Promise<any> => {
    const connectionString = config.pgURI;

    const pool = new Pool({
        connectionString,
        ssl: {
            rejectUnauthorized: false,
        }
    });

    pool.connect()
        .then(client => {
            console.log("Connected to the database successfully!");
            client.release(); // Release the client back to the pool
        })
        .catch(err => console.error("Error connecting to the database:", err.stack));
}