import { Course } from './course'

export enum Year {
  First, Second, Third, Fourth, Fifth, Other
}

export class User {
      
    _id: string;
    
    name: {
      first: String;
      last: String;
    };

    classInfo: {
      year: number;
      class: number;
      majors: string[];
      minors: string[];
    }

    username: string;
    
    courses: {
      past: Course[];
      current: Course[];
      future: Course[];
    }

    private: boolean;

}