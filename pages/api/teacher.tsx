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
  coins: number;
  courses: string[];
  available_hours: Record<string, number[]>;
  available_locations: string[];
  reviews: Record<string, unknown>[];
  appointments: Record<string, unknown>[];
}

export default async (
  request: NextApiRequest,
  response: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {
  if (request.method === 'GET') {
    const { id }: { id: string } = request.body;

    if (!id) {
      response
        .status(400)
        .json({ errorMessage: 'Missing Teacher ID on request body' });
      return;
    }

    let _id: ObjectID;
    try {
      _id = new ObjectID(id);
    } catch {
      response.status(400).json({ errorMessage: 'Wrong objectID' });
      return;
    }

    const { db } = await connectWithDatabase();

    const res = await db.findOne({ _id });

    if (!res) {
      response
        .status(400)
        .json({ errorMessage: `Teacher with this ID: '${_id}' was not found` });
      return;
    }

    response.status(200).json(res);
  } else {
    response.status(400).json({ errorMessage: 'Wrong request method' });
  }
};
