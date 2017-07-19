import { User } from './user'

export class Comment {

    _id: string;
    parent: string;
    text: string;
    date: Date;
    comments: Comment[];
    user: User;
    meta: number;
}