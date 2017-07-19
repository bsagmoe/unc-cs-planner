export class Course {
    _id: string;
    dept: string;
    credit_hours: string;
    number: number;
    modifier: string;
    title: string;
    semesters: string[];
    description: string;
    offerings: [
            {
                    instructor: string;
                    semester: string;
                    year: number
            }
    ];

}