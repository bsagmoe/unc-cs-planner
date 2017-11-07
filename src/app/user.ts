import { Course } from './course'
import { UserCourse } from './user-course';

export interface User {

    uid: string;
    displayName: string;
    name: {
      first: String;
      last: String;
    };

    classInfo: {
      year: number;
      class: number;
      majors: string[];
      minors: string[];
    };

    courses: UserCourse[];
    isPrivate: boolean;
}
