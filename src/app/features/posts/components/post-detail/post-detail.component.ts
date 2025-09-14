import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap, combineLatest, map, filter } from 'rxjs';
import { Post } from '../../models/post.model';
import { Comment } from '../../../comments/models/comment.model';
import { PostService } from '../../services/post.service';
import { CommentService } from '../../../comments/services/comment.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
})
export class PostDetailComponent implements OnInit {
  post$!: Observable<Post>;
  postComments$!: Observable<Comment[]>;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.post$ = combineLatest([
      this.route.params,
      this.postService.getPosts(),
    ]).pipe(
      map(([params, posts]) => {
        const postId = +params['id'];
        return posts.find((post) => post.id === postId);
      }),
      filter((post) => post !== undefined),
      map((post) => post!)
    );

    this.postComments$ = this.route.params.pipe(
      switchMap((params) =>
        this.commentService.getCommentsByPost(+params['id'])
      )
    );
  }
}
