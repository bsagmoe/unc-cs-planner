import { User } from './user'
import { Comment } from './comment'

export class Post {
    id: string;
    text: string;
    date: Date;
    editDate: Date;
    edited: boolean;
    tagObject: object;
    tags: string[];
    comments: Comment[];
    uid: string;
    displayName: string;
}
