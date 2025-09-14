import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = 'https://jsonplaceholder.typicode.com';

  private commentsSubject = new BehaviorSubject<Comment[]>([]);
  private comments$ = this.commentsSubject.asObservable();
  private isLoaded = false;

  constructor(private http: HttpClient) {}

  getComments(): Observable<Comment[]> {
    if (!this.isLoaded) {
      this.loadComments();
    }
    return this.comments$;
  }

  getComment(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/comments/${id}`);
  }

  getCommentsByPost(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/posts/${postId}/comments`);
  }

  createComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/comments`, comment).pipe(
      tap((newComment) => {
        // Add to local state
        const currentComments = this.commentsSubject.value;
        this.commentsSubject.next([...currentComments, newComment]);
      })
    );
  }

  updateComment(id: number, comment: Comment): Observable<Comment> {
    return this.http
      .put<Comment>(`${this.apiUrl}/comments/${id}`, comment)
      .pipe(
        tap((updatedComment) => {
          // Update local state
          const currentComments = this.commentsSubject.value;
          const index = currentComments.findIndex((c) => c.id === id);
          if (index !== -1) {
            currentComments[index] = updatedComment;
            this.commentsSubject.next([...currentComments]);
          }
        })
      );
  }

  deleteComment(id: number): Observable<{}> {
    return this.http.delete<{}>(`${this.apiUrl}/comments/${id}`).pipe(
      tap(() => {
        // Remove from local state
        const currentComments = this.commentsSubject.value;
        const filteredComments = currentComments.filter((c) => c.id !== id);
        this.commentsSubject.next(filteredComments);
      })
    );
  }

  private loadComments(): void {
    this.http
      .get<Comment[]>(`${this.apiUrl}/comments`)
      .subscribe((comments) => {
        this.commentsSubject.next(comments);
        this.isLoaded = true;
      });
  }
}
