import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../service/blog.service';
import { Blog } from '../../interfaces/blog';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  templateUrl: './blog-detail.component.html', // Asegúrate de que el nombre del archivo es correcto
  styleUrls: ['./blog-detail.component.css'],
  imports: [CommonModule, RouterModule, NzButtonModule, DatePipe]
})
export class BlogDetailComponent implements OnInit {
  blog: Blog | undefined;

  constructor(private route: ActivatedRoute, private blogService: BlogService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.blogService.getBlog(id).subscribe({
        next: (blog) => {
          this.blog = blog;
        },
        error: (error) => {
          console.error('Error fetching blog:', error);
        }
      });
    }
  }
}