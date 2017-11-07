import { Course } from './course';

export type PlannerStatus =
  'past'
  | 'current'
  | 'future'
  | 'none'

export interface UserCourse {
    course: Course;
    year: number;
    semester: String;
    plannerStatus: PlannerStatus
}
