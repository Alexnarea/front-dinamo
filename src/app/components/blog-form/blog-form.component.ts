import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../service/blog.service';
import { Blog } from '../../interfaces/blog';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css'],
  imports: [CommonModule, RouterModule, NzButtonModule, NzFormModule, NzInputModule, ReactiveFormsModule]
})
export class BlogFormComponent implements OnInit {
  blogForm: FormGroup;
  blogId: string | null = null; // Para almacenar el ID del blog en edición

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NzNotificationService // Agregar el servicio de notificaciones
  ) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      imagenUrl: ['', Validators.required],
      authors: ['', Validators.required],
      createDate: [null, Validators.required], // Usa null para manejar fechas
      magazine: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.blogId = this.route.snapshot.paramMap.get('id'); // Obtener el ID del blog desde la ruta

    if (this.blogId) {
      // Si hay un ID, es una edición
      this.blogService.getBlog(this.blogId).subscribe({
        next: (blog: Blog) => {
          this.blogForm.patchValue(blog); // Cargar datos del blog en el formulario
        },
        error: (error) => {
          console.error('Error fetching blog:', error);
          this.notification.error('Error', 'Failed to load blog.');
        }
      });
    }
  }

  onSubmit(): void {
    if (this.blogForm.valid) {
      const formValue = this.blogForm.value;
      const blogData: Blog = {
        ...formValue,
        createDate: formValue.createDate ? new Date(formValue.createDate).toISOString() : null // Asegúrate de convertir a ISO string si es necesario
      };

      if (this.blogId) {
        // Si hay un ID, actualiza el blog existente
        this.blogService.update(this.blogId, blogData).subscribe({
          next: () => {
            this.notification.success('Success', 'Article updated successfully!'); // Mostrar notificación de éxito
            this.router.navigate(['/blogs']);
          },
          error: (error) => {
            console.error('Error updating blog:', error);
            this.notification.error('Error', 'Failed to update article.'); // Mostrar notificación de error
          }
        });
      } else {
        // Si no hay ID, crea un nuevo blog
        this.blogService.create(blogData).subscribe({
          next: () => {
            this.notification.success('Success', 'Article created successfully!'); // Mostrar notificación de éxito
            this.router.navigate(['/blogs']);
          },
          error: (error) => {
            console.error('Error creating blog:', error);
            this.notification.error('Error', 'Failed to create article.'); // Mostrar notificación de error
          }
        });
      }
    } else {
      console.error('Form is invalid');
    }
  }
}
