import { Injectable } from '@angular/core';
import { AngularFirestore,  AngularFirestoreDocument, AngularFirestoreCollection} from 'angularfire2/firestore'
import { Post } from '../post'

@Injectable()
export class PostService {

  constructor(private afs: AngularFirestore) { }

  formatTag(tag: string): string {
    return tag.toLowerCase().replace(/\s/, '');
  }

  getTabObject(tags: string[]): object {
    const tagObject = {};
    tags.map(tag => this.formatTag(tag)).forEach(tag => tagObject[tag] = true);
    return tagObject;
  }

  getTags(tagString: string): string[] {
    let tags;
    if (tagString) {
      tags = tagString.split(',').map(tag => tag.trim());
    } else {
      tags = [];
    }

    return tags;
  }

  createPost(text: string, tagString: string, uid: string, displayName: string): Promise<any> {
    const id = this.afs.createId();
    const tags = this.getTags(tagString);

    const post = {
      id,
      text,
      tags,
      tagObject: this.getTabObject(tags),
      date: Date.now(),
      edited: false,
      uid,
      displayName
    }

    return this.afs.collection('/posts').doc(id).set(post);
  }

  editPost(text: string, tagString: string, postId: string) {
    const tags = this.getTags(tagString);

    return this.afs.doc(`/posts/${postId}`).update({
      text,
      tags,
      tagObject: this.getTabObject(tags),
      edited: true,
      editDate: Date.now()
    })
  }

  getPosts(): AngularFirestoreCollection<Post> {
    // TODO: Implement paging on here
    return this.afs.collection<Post>('/posts', ref => ref.orderBy('date', 'desc'));
  }

  getPostsByUser(uid: string): AngularFirestoreCollection<Post> {
    return this.afs.collection<Post>('/posts', ref => ref.where('uid', '==', uid).orderBy('date', 'desc'));
  }

  getPostsWithTag(tag: string): AngularFirestoreCollection<Post> {
    tag = this.formatTag(tag);
    return this.afs.collection<Post>('/posts', ref => ref.where('tagObject.' + tag, '==', true));
  }
}
