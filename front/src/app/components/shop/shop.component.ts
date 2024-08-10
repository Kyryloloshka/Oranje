import { Component } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/models/product.interface';
import { ProductItemComponent } from './product-item/product-item.component';
import { MatDialog } from '@angular/material/dialog';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import {
  MatListOption,
  MatSelectionList,
  MatSelectionListChange,
} from '@angular/material/list';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    ProductItemComponent,
    MatButton,
    MatMenuTrigger,
    MatMenu,
    MatSelectionList,
    MatListOption,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent {
  constructor(private shopService: ShopService, private dialog: MatDialog) {}
  products: Product[] = [];
  selectedBrands: string[] = [];
  selectedTypes: string[] = [];
  selectedSort: string = 'name';
  sortOptions = [
    { name: 'За назвою', value: 'name' },
    { name: 'За зростанням ціни', value: 'priceAsc' },
    { name: 'За спаданням ціни', value: 'priceDesc' },
  ];

  initShop(): void {
    this.shopService.getTypes();
    this.shopService.getBrands();
    this.uploadProducts();
  }

  uploadProducts(): void {
    this.shopService
      .getProducts(this.selectedBrands, this.selectedTypes, this.selectedSort)
      .subscribe({
        next: (res) => (this.products = res.data),
        error: (error) => console.error(error),
      });
  }

  ngOnInit(): void {
    this.initShop();
  }

  onSortChange(event: MatSelectionListChange): void {
    const selectedOption = event.options[0];
    if (selectedOption) {
      this.selectedSort = selectedOption.value;
      this.uploadProducts();
    }
  }

  openFiltersDialog(): void {
    const dialogRef = this.dialog.open(FiltersDialogComponent, {
      minWidth: '300px',
      data: {
        selectedBrands: this.selectedBrands,
        selectedTypes: this.selectedTypes,
      },
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          console.log(result);

          this.selectedBrands = result.selectedBrands;
          this.selectedTypes = result.selectedTypes;
          this.uploadProducts();
        }
      },
    });
  }
}
