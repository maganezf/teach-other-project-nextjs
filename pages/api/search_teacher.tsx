import { NextApiRequest, NextApiResponse } from 'next';
import connectWithDatabase from '../../utils/database';

interface ErrorResponseType {
  errorMessage: string;
}

export default async (
  request: NextApiRequest,
  response: NextApiResponse<ErrorResponseType | Record<string, unknown>[]>
): Promise<void> => {
  if (request.method === 'GET') {
    const { courses }: { courses: string } = request.body;

    if (!courses) {
      response
        .status(400)
        .json({ errorMessage: 'Missing course name on request body' });
      return;
    }

    const { db } = await connectWithDatabase();

    const res = await db
      .find({ courses: { $in: [new RegExp(`^${courses}`, 'i')] } })
      .toArray();

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
