import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectID } from 'mongodb';
import { getSession } from 'next-auth/client';
import connectWithDatabase from '../../utils/database';

interface ErrorResponseType {
  errorMessage: string;
}

interface SuccessResponseType {
  date: string;
  teacher_name: string;
  teacher_id: string;
  student_name: string;
  student_id: string;
  course: string;
  location: string;
  appointment_link: string;
}

export default async (
  request: NextApiRequest,
  response: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {
  if (request.method === 'POST') {
    const session = await getSession({ request });

    if (!session) {
      response.status(400).json({
        errorMessage: 'Please, Log in first to get started!',
      });
      return;
    }

    const {
      date,
      teacher_name,
      teacher_id,
      student_name,
      student_id,
      course,
      location,
      appointment_link,
    } = request.body;

    if (
      !date ||
      !teacher_name ||
      !teacher_id ||
      !student_name ||
      !student_id ||
      !course ||
      !location
    ) {
      response.status(400).json({
        errorMessage: 'Missing parameter Appointment on request body',
      });
      return;
    }

    const { db } = await connectWithDatabase();

    const teacherExists = await db
      .collection('users')
      .findOne({ _id: new ObjectID(teacher_id) });

    if (!teacherExists) {
      response.status(400).json({
        errorMessage: `Teacher: '${teacher_name}' with this ID: '${teacher_id}', doesn't exists`,
      });
      return;
    }

    const studentExists = await db
      .collection('users')
      .findOne({ _id: new ObjectID(student_id) });

    if (!studentExists) {
      response.status(400).json({
        errorMessage: `Student: '${student_name}' with this ID: '${student_id}', doesn't exists`,
      });
    }

    const appointment = {
      date,
      teacher_name,
      teacher_id,
      student_name,
      student_id,
      course,
      location,
      appointment_link: appointment_link || '',
    };

    await db
      .collection('users')
      .updateOne(
        { _id: new ObjectID(teacher_id) },
        { $push: { appointments: appointment } }
      );

    await db
      .collection('users')
      .updateOne(
        { _id: new ObjectID(student_id) },
        { $push: { appointments: appointment } }
      );

    response.status(200).json(appointment);
  } else {
    response.status(400).json({ errorMessage: 'Wrong request method' });
  }
};
