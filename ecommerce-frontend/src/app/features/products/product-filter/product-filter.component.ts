import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit {
  @Output() filterChange = new EventEmitter<any>();

  filterForm: FormGroup;
  categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other'];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group(
      {
        search: [''],
        category: [''],
        minPrice: [null],
        maxPrice: [null],
        inStock: [false]
      },
      {}
    );
  }

  ngOnInit(): void {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(filters => {
        this.filterChange.emit(filters);
      });
  }

  resetFilters(): void {
    this.filterForm.reset({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: false
    });
  }
}
