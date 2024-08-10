import { Component, inject } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatListOption, MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-filters-dialog',
  standalone: true,
  imports: [MatButton, FormsModule, MatSelectionList, MatListOption],
  templateUrl: './filters-dialog.component.html',
  styleUrl: './filters-dialog.component.scss',
})
export class FiltersDialogComponent {
  constructor(
    protected shop: ShopService,
    private dialogRef: MatDialogRef<FiltersDialogComponent>
  ) {}
  data = inject(MAT_DIALOG_DATA);
  selectedBrands: string[] = this.data.selectedBrands;
  selectedTypes: string[] = this.data.selectedTypes;

  applyFilters(): void {
    this.dialogRef.close({
      selectedBrands: this.selectedBrands,
      selectedTypes: this.selectedTypes,
    });
  }
}
