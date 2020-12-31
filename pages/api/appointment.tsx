import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectID } from 'mongodb';
// import { getSession } from 'next-auth/client';
import connectWithDatabase from '../../utils/database';

interface User {
  name: string;
  email: string;
  cellphone: string;
  teacher: boolean;
  coins: number;
  courses: string[];
  available_hours: Record<string, number[]>;
  available_locations: string[];
  reviews: Record<string, unknown>[];
  appointments: {
    date: string;
  }[];
  _id: string;
}

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
    /* const session = await getSession({ request });

    if (!session) {
      response.status(400).json({
        errorMessage: 'Please, Log in first to get started!',
      });
      return;
    } */

    const {
      date,
      teacher_name,
      teacher_id,
      student_name,
      student_id,
      course,
      location,
      appointment_link,
    }: {
      date: string;
      teacher_name: string;
      teacher_id: string;
      student_name: string;
      student_id: string;
      course: string;
      location: string;
      appointment_link: string;
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

    // check if teacher_id or student_id is invalid
    try {
      const testTeacherID = new ObjectID(teacher_id);
      const testStudentID = new ObjectID(student_id);
    } catch {
      response.status(400).json({ errorMessage: 'Wrong objectID' });
      return;
    }

    const parsedDate = new Date(date);
    const now = new Date();
    const today = {
      day: now.getDate(),
      month: now.getMonth(),
      year: now.getFullYear(),
    };
    const fullDate = {
      day: parsedDate.getDate(),
      month: parsedDate.getMonth(),
      year: parsedDate.getFullYear(),
    };

    // check if requested date is on the past
    if (
      fullDate.year < today.year ||
      fullDate.month < today.month ||
      fullDate.day < today.day
    ) {
      response.status(400).json({
        errorMessage: "You can't create appointments on the past",
      });
      return;
    }

    const { db } = await connectWithDatabase();

    // check if teacher exists
    const teacherExists: User = await db.findOne({
      _id: new ObjectID(teacher_id),
    });

    if (!teacherExists) {
      response.status(400).json({
        errorMessage: `The teacher: '${teacher_name}' with this ID: '${teacher_id}', does not exists`,
      });
      return;
    }

    // check if student exists
    const studentExists: User = await db.findOne({
      _id: new ObjectID(student_id),
    });

    if (!studentExists) {
      response.status(400).json({
        errorMessage: `The student: '${student_name}' with this ID: '${student_id}', does not exists`,
      });
      return;
    }

    // check if requested day/hour is available for the teacher
    const weekdays = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const requestedDay = weekdays[parsedDate.getDay()];
    const requestedHour = parsedDate.getUTCHours() - 3;
    if (!teacherExists.available_hours[requestedDay]?.includes(requestedHour)) {
      response.status(400).json({
        errorMessage: `Teacher ${teacher_name} is not available at ${requestedDay} ${requestedHour}:00`,
      });
      return;
    }

    // check if teacher already have an appointment on the requested day of the month
    teacherExists.appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.date);

      if (appointmentDate.getTime() === parsedDate.getTime()) {
        response.status(400).json({
          errorMessage: `Teacher ${teacher_name} already have an appointment at ${appointmentDate.getDate()}/
            ${appointmentDate.getMonth() + 1}/
            ${appointmentDate.getFullYear()} -
            ${appointmentDate.getUTCHours() - 3}:00`,
        });
      }
    });

    // create appointment object

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

    // update teacher appointments
    await db.updateOne(
      { _id: new ObjectID(teacher_id) },
      { $push: { appointments: appointment }, $inc: { coins: 1 } }
    );

    // update student appointments
    await db.updateOne(
      { _id: new ObjectID(student_id) },
      { $push: { appointments: appointment }, $inc: { coins: -1 } }
    );

    response.status(200).json(appointment);
  } else {
    response.status(400).json({ errorMessage: 'Wrong request method' });
  }
};
