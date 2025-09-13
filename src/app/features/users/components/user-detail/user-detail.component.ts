import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { User } from '../../models/user.model';
import { Post } from '../../../posts/models/post.model';
import { UserService } from '../../services/user.service';
import { PostService } from '../../../posts/services/post.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent implements OnInit {
  user$!: Observable<User>;
  userPosts$!: Observable<Post[]>;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.user$ = this.route.params.pipe(
      switchMap((params) => this.userService.getUser(+params['id']))
    );

    this.userPosts$ = this.route.params.pipe(
      switchMap((params) => this.postService.getPostsByUser(+params['id']))
    );
  }
}
