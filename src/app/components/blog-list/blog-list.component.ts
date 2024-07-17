import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BlogService } from '../../service/blog.service';
import { Blog } from '../../interfaces/blog';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css'],
  imports: [CommonModule, RouterModule, NzButtonModule, NzTableModule]
})
export class BlogListComponent implements OnInit {
  blogs: Blog[] = [];

  constructor(
    private blogService: BlogService,
    private notification: NzNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.blogService.getAll().subscribe({
      next: blogs => {
        this.blogs = blogs;
      },
      error: error => {
        console.error('Error fetching blogs:', error);
        this.notification.error('Error', 'Failed to load blogs.');
      }
    });
  }

  deleteBlog(id: string | undefined): void {
    if (id) {
      this.blogService.delete(id).subscribe({
        next: () => {
          console.log('Blog deleted successfully');
          this.loadBlogs(); // Recargar la lista de blogs
          this.notification.success('Success', 'Article deleted successfully!');
        },
        error: error => {
          console.error('Error deleting blog:', error);
          this.notification.error('Error', 'Failed to delete article.');
        }
      });
    } else {
      console.error('Blog ID is undefined');
      this.notification.error('Error', 'Blog ID is undefined.');
    }
  }

  editBlog(blog: Blog): void {
    if (blog.id) {
      this.router.navigate([`/blogs/${blog.id}/edit`]);
    } else {
      this.notification.error('Error', 'Blog ID is undefined.');
    }
  }
}
