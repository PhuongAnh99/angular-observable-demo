import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, tap, of } from 'rxjs';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.scss',
})
export class PostFormComponent implements OnInit {
  postForm!: FormGroup;
  isEditMode = false;
  post$!: Observable<Post | null>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.post$ = this.route.params.pipe(
      switchMap((params) => {
        const id = params['id'];
        if (id) {
          this.isEditMode = true;
          return this.postService.getPost(+id);
        }
        return of(null);
      }),
      tap((post) => {
        if (post) {
          this.postForm.patchValue(post);
        }
      })
    );
  }

  private initForm(): void {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      userId: ['', [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      const postData = this.postForm.value;

      if (this.isEditMode) {
        this.route.params
          .pipe(
            switchMap((params) =>
              this.postService.updatePost(+params['id'], postData)
            )
          )
          .subscribe(() => {
            this.router.navigate(['/posts']);
          });
      } else {
        this.postService.createPost(postData).subscribe(() => {
          this.router.navigate(['/posts']);
        });
      }
    }
  }
}
