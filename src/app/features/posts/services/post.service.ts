import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'https://jsonplaceholder.typicode.com';

  private postsSubject = new BehaviorSubject<Post[]>([]);
  private posts$ = this.postsSubject.asObservable();
  private isLoaded = false;

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    if (!this.isLoaded) {
      this.loadPosts();
    }
    return this.posts$;
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/posts/${id}`);
  }

  getPostsByUser(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/users/${userId}/posts`);
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts`, post).pipe(
      tap((newPost) => {
        // Add to local state
        const currentPosts = this.postsSubject.value;
        this.postsSubject.next([...currentPosts, newPost]);
      })
    );
  }

  updatePost(id: number, post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/posts/${id}`, post).pipe(
      tap((updatedPost) => {
        // Update local state
        const currentPosts = this.postsSubject.value;
        const index = currentPosts.findIndex((p) => p.id === id);
        if (index !== -1) {
          currentPosts[index] = updatedPost;
          this.postsSubject.next([...currentPosts]);
        }
      })
    );
  }

  deletePost(id: number): Observable<{}> {
    return this.http.delete<{}>(`${this.apiUrl}/posts/${id}`).pipe(
      tap(() => {
        // Remove from local state
        const currentPosts = this.postsSubject.value;
        const filteredPosts = currentPosts.filter((p) => p.id !== id);
        this.postsSubject.next(filteredPosts);
      })
    );
  }

  private loadPosts(): void {
    this.http.get<Post[]>(`${this.apiUrl}/posts`).subscribe((posts) => {
      this.postsSubject.next(posts);
      this.isLoaded = true;
    });
  }
}
