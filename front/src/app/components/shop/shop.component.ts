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
import { ShopParams } from '../../shared/models/shop-params.class';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Pagination } from '../../shared/models/pagination.interface';
import { FormsModule } from '@angular/forms';

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
    MatPaginator,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent {
  constructor(private shopService: ShopService, private dialog: MatDialog) {}
  products: Product[] = [];
  pagination?: Pagination<Product>;
  sortOptions = [
    { name: 'За назвою', value: 'name' },
    { name: 'За зростанням ціни', value: 'priceAsc' },
    { name: 'За спаданням ціни', value: 'priceDesc' },
  ];
  pageSizeOptions = [6, 12, 24];

  shopParams = new ShopParams();

  initShop(): void {
    this.shopService.getTypes();
    this.shopService.getBrands();
    this.uploadProducts();
  }

  uploadProducts(): void {
    this.shopService.getProducts(this.shopParams).subscribe({
      next: (res) => {
        this.pagination = res;
        this.products = res.data;
      },
      error: (error) => console.error(error),
    });
  }

  ngOnInit(): void {
    this.initShop();
  }

  handlePageChange(event: PageEvent): void {
    this.shopParams.pageIndex = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;
    this.uploadProducts();
  }

  onSortChange(event: MatSelectionListChange): void {
    const selectedOption = event.options[0];
    if (selectedOption) {
      this.shopParams.sort = selectedOption.value;
      this.shopParams.pageIndex = 1;
      this.uploadProducts();
    }
  }

  openFiltersDialog(): void {
    const dialogRef = this.dialog.open(FiltersDialogComponent, {
      minWidth: '300px',
      data: {
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.types,
      },
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          console.log(result);

          this.shopParams.brands = result.selectedBrands;
          this.shopParams.types = result.selectedTypes;
          this.shopParams.pageIndex = 1;
          this.uploadProducts();
        }
      },
    });
  }
}
