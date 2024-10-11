import clientPromise from '../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const database = client.db('gold-ore-game'); // Replace with your database name
      const usersCollection = database.collection('players'); // Replace with your collection name

      const { user, gameProgress } = req.body; // Expecting gameProgress as part of the request body
      const filter = { id: user.id }; // Using Telegram user ID as a unique identifier
      const update = {
        $set: {
          user,
          gameProgress,
        },
      };

      const result = await usersCollection.updateOne(filter, update, { upsert: true });

      res.status(200).json({ message: 'User data saved successfully', result });
    } catch (error) {
      console.error('Error saving user data:', error);
      res.status(500).json({ message: 'Failed to save user data' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}