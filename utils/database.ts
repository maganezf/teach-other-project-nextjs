import { MongoClient, Collection } from 'mongodb';

interface ConnectWithDatabaseType {
  db: Collection;
  client: MongoClient;
}

const client = new MongoClient(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function connectWithDatabase(): Promise<ConnectWithDatabaseType> {
  if (!client.isConnected()) await client.connect();

  const db = client.db('teach-other-database').collection('users');
  return { db, client };
}
