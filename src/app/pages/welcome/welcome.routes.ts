import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome.component';
import { BlogListComponent } from '../../components/blog-list/blog-list.component';
import { BlogFormComponent } from '../../components/blog-form/blog-form.component';
import { BlogDetailComponent } from '../../components/blog-detail/blog-detail.component';

export const WELCOME_ROUTES: Routes = [
  { path: '', component: BlogListComponent },
  { path: 'new', component: BlogFormComponent },
  { path: ':id', component: BlogDetailComponent },
  { path: ':id/edit', component: BlogFormComponent }
];
