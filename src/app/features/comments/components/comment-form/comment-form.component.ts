import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { Comment } from '../../models/comment.model';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.scss',
})
export class CommentFormComponent implements OnInit {
  commentForm!: FormGroup;
  comment$!: Observable<Comment>;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private commentService: CommentService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.comment$ = this.route.params.pipe(
      switchMap((params) => {
        const id = params['id'];
        if (id) {
          this.isEditMode = true;
          return this.commentService.getComment(+id);
        }
        return [];
      }),
      tap((comment) => {
        if (comment) {
          this.commentForm.patchValue(comment);
        }
      })
    );
  }

  private initForm(): void {
    this.commentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      body: ['', Validators.required],
      postId: ['', [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit(): void {
    if (this.commentForm.valid) {
      const commentData = this.commentForm.value;

      if (this.isEditMode) {
        this.route.params
          .pipe(
            switchMap((params) =>
              this.commentService.updateComment(+params['id'], commentData)
            )
          )
          .subscribe(() => {
            this.router.navigate(['/comments']);
          });
      } else {
        this.commentService.createComment(commentData).subscribe(() => {
          this.router.navigate(['/comments']);
        });
      }
    }
  }
}
