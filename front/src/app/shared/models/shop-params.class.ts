export class ShopParams {
  brands: string[] = [];
  types: string[] = [];
  sort = 'name';
  pageIndex = 1;
  pageSize = 12;
  search: string = '';
}