import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CommentsRoutingModule } from './comments-routing.module';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { CommentFormComponent } from './components/comment-form/comment-form.component';

@NgModule({
  declarations: [CommentListComponent, CommentFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CommentsRoutingModule,
  ],
})
export class CommentsModule {}
