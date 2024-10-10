// pages/api/saveUser.js
import clientPromise from '../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const userData = req.body;

    const client = await clientPromise;
    const db = client.db('gold-ore-game');

    // Save user data to MongoDB
    await db.collection('players').updateOne(
      { id: userData.id },
      { $set: userData },
      { upsert: true }
    );

    res.status(200).json({ message: 'User info saved successfully', user: userData });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}