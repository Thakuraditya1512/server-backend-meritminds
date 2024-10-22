import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // Ensure this is set in your Vercel environment variables
const client = new MongoClient(uri);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await client.connect();
            const database = client.db('your_database_name'); // Replace with your database name
            const collection = database.collection('your_collection_name'); // Replace with your collection name

            const newEntry = req.body; // Assuming the body contains the data you want to insert
            const result = await collection.insertOne(newEntry);

            res.status(201).json({ message: 'Entry created successfully', result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            await client.close();
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
