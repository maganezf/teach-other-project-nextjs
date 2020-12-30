import { NextApiRequest, NextApiResponse } from 'next';
import connectWithDatabase from '../../utils/database';

interface ErrorResponseType {
  errorMessage: string;
}

interface SucessResponseType {
  _id: string;
  name: string;
  email: string;
  cellphone: string;
  teacher: string;
}

export default async (
  request: NextApiRequest,
  response: NextApiResponse<ErrorResponseType | SucessResponseType>,
): Promise<void> => {
  if (request.method === 'POST') {
    const {
      name, email, cellphone, teacher,
    } = request.body;

    if (!name || !email || !cellphone || !teacher) {
      response.status(400).json({ errorMessage: 'Missing body parameter' });
      return;
    }

    const { db } = await connectWithDatabase();

    const res = await db.collection('users').insertOne({
      name,
      email,
      cellphone,
      teacher,
    });
    response.status(200).json(res.ops[0]);
  } else {
    response.status(400).json({ errorMessage: 'Wrong request method error founded' });
  }
};
