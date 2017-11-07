import { User } from './user'

export class Comment {
    id: string;
    path: string;
    text: string;
    date: Date;
    editDate: Date;
    edited: boolean;
    redacted: boolean;
    comments: Comment[];
    uid: string;
    displayName: string;
    likes: object;
}
