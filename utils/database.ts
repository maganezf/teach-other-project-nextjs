import { Db, MongoClient } from 'mongodb';

interface ConnectWithDatabaseType {
  db: Db;
  client: MongoClient;
}

const client = new MongoClient(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function connectWithDatabase(): Promise<ConnectWithDatabaseType> {
  if (!client.isConnected()) await client.connect();

  const db = client.db('teach-other-database');
  return { db, client };
}
