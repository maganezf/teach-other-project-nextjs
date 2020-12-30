import { NextApiRequest, NextApiResponse } from 'next';
import connectWithDatabase from '../../utils/database';

interface ErrorResponseType {
  errorMessage: string;
}

export default async (
  request: NextApiRequest,
  response: NextApiResponse<ErrorResponseType | object[]>
): Promise<void> => {
  if (request.method === 'GET') {
    const { courses } = request.body;

    if (!courses) {
      response
        .status(400)
        .json({ errorMessage: 'Missing course name on request body' });
      return;
    }

    const { db } = await connectWithDatabase();

    const res = await db.collection('users').find({ courses }).toArray();

    if (res.length === 0) {
      response
        .status(400)
        .json({ errorMessage: 'Teacher with course name was not found' });
      return;
    }

    response.status(200).json(res);
  } else {
    response.status(400).json({ errorMessage: 'Wrong request method' });
  }
};
