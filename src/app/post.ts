import { User } from './user'
import { Comment } from './comment'

export class Post {
    _id: string;
    text: string;
    date: Date;
    tags: string[];
    comments: Comment[];
    user: User;

    __v: number;
}