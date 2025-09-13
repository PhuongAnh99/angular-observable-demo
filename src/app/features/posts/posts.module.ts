import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PostsRoutingModule } from './posts-routing.module';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { PostFormComponent } from './components/post-form/post-form.component';

@NgModule({
  declarations: [PostListComponent, PostDetailComponent, PostFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PostsRoutingModule,
  ],
})
export class PostsModule {}
