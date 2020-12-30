import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectID } from 'mongodb';
import connectWithDatabase from '../../utils/database';

interface ErrorResponseType {
  errorMessage: string;
}

interface SuccessResponseType {
  _id: string;
  name: string;
  email: string;
  cellphone: string;
  teacher: true;
  courses: string[];
  available_hours: object;
  available_locations: string[];
}

export default async (
  request: NextApiRequest,
  response: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {
  if (request.method === 'GET') {
    const { id } = request.body;

    if (!id) {
      response
        .status(400)
        .json({ errorMessage: 'Missing Teacher ID on request body' });
      return;
    }

    const { db } = await connectWithDatabase();

    const res = await db.collection('users').findOne({ _id: new ObjectID(id) });

    if (!res) {
      response
        .status(400)
        .json({ errorMessage: 'Teacher with this ID was not found' });
      return;
    }

    response.status(200).json(res);
  } else {
    response.status(400).json({ errorMessage: 'Wrong request method' });
  }
};
