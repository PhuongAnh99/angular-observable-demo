import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommentListComponent } from './components/comment-list/comment-list.component';
import { CommentFormComponent } from './components/comment-form/comment-form.component';

const routes: Routes = [
  { path: '', component: CommentListComponent },
  { path: 'new', component: CommentFormComponent },
  { path: ':id/edit', component: CommentFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommentsRoutingModule {}
