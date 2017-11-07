import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore'

import { Comment } from '../comment'

@Injectable()
export class CommentService {

  constructor(private afs: AngularFirestore) { }

  like(comment: Comment, uid: string) {
    const likes = comment.likes || {};
    likes[uid] = true;

    this.afs.doc(comment.path).update( {likes: likes} );
  }

  unlike(comment: Comment, uid: string) {
    delete comment.likes[uid];
    this.afs.doc(comment.path).update( {likes: comment.likes} );
  }

  createComment(text: string, parentPath: string, uid: string, displayName: string): Promise<void> {
    const id = this.afs.createId();

    const comment = {
      id,
      path: `${parentPath}/comments/${id}`,
      text,
      date: Date.now(),
      edited: false,
      uid,
      displayName,
      likes: {}
    }

    return this.afs.collection<Comment>(`${parentPath}/comments`).doc(id).set(comment);
  }

  editComment(text: string, commentPath: string) {
    return this.afs.doc(commentPath).update({
      text,
      edited: true,
      editDate: Date.now()
    })
  }

  redactComment(path: string) {
    this.afs.doc(path).update({text: '[deleted]', redacted: true});
  }

  deleteComment(path: string) {
    this.afs.doc(path).delete();
  }

  getPostComments(postId: string): AngularFirestoreCollection<Comment> {
    return this.getCommentsFromDocument(`/posts/${postId}`);
  }

  getCommentsFromDocument(path: string): AngularFirestoreCollection<Comment> {
    return this.afs.collection(`${path}/comments`, ref => ref.orderBy('date', 'asc'));
  }

}
