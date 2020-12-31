import { NextApiRequest, NextApiResponse } from 'next';
import connectWithDatabase from '../../../utils/database';

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
  // SHOW USER PROFILE

  if (request.method === 'GET') {
    const { email } = request.query;

    if (!email) {
      response
        .status(400)
        .json({ errorMessage: 'Missing email on request body' });
      return;
    }

    const { db } = await connectWithDatabase();

    const res = await db.findOne({ email });

    if (!res) {
      response.status(400).json({
        errorMessage: `User with this email: '${email}'  was not found`,
      });
      return;
    }

    response.status(200).json(res);
  } else {
    response.status(400).json({ errorMessage: 'Wrong request method' });
  }
};
