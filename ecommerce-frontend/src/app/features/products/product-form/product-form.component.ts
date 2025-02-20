import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isLoading = false;
  categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other'];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product
  ) {
    this.productForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        price: [null, [Validators.required, Validators.min(0)]],
        category: ['', [Validators.required]],
        stock: [null, [Validators.required, Validators.min(0)]],
        description: ['', [Validators.required]]
      },
      {}
    );
  }

  ngOnInit(): void {
    if (this.data) {
      this.productForm.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isLoading = true;
      const product = this.productForm.value;

      const request$ = this.data
        ? this.productService.updateProduct(this.data.id, product)
        : this.productService.createProduct(product);

      request$.subscribe({
        next: () => {
          this.notificationService.showNotification(
            `Product ${this.data ? 'updated' : 'created'} successfully`,
            'success'
          );
          this.dialogRef.close(true);
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }
}