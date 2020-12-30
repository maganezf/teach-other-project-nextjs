import { NextApiRequest, NextApiResponse } from 'next';
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
  coins: 1;
  courses: string[];
  available_hours: object;
  available_locations: string[];
  reviews: object[];
  appointments: object[];
}

export default async (
  request: NextApiRequest,
  response: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {
  if (request.method === 'POST') {
    const {
      name,
      email,
      cellphone,
      teacher,
      courses,
      available_hours,
      available_locations,
    } = request.body;

    if (!teacher) {
      if (!name || !email || !cellphone) {
        response.status(400).json({ errorMessage: 'Missing body parameter' });
        return;
      }
    }

    if (teacher) {
      if (
        !name ||
        !email ||
        !cellphone ||
        !courses ||
        !available_hours ||
        !available_locations
      ) {
        response.status(400).json({ errorMessage: 'Missing body parameter' });
        return;
      }
    }

    const { db } = await connectWithDatabase();

    const res = await db.collection('users').insertOne({
      name,
      email,
      cellphone,
      teacher,
      coins: 1,
      courses: courses || [],
      available_hours: available_hours || {},
      available_locations: available_locations || [],
      reviews: [],
      appointments: [],
    });

    response.status(200).json(res.ops[0]);
  } else if (request.method === 'GET') {
    const { email } = request.body;

    if (!email) {
      response
        .status(400)
        .json({ errorMessage: 'Missing email on request body' });
      return;
    }

    const { db } = await connectWithDatabase();

    const res = await db.collection('users').findOne({ email });

    if (!res) {
      response
        .status(400)
        .json({ errorMessage: 'User with this email was not found' });
      return;
    }

    response.status(200).json(res);
  } else {
    response.status(400).json({ errorMessage: 'Wrong request method' });
  }
};
