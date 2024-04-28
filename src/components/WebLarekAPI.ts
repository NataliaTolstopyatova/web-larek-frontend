import { Api } from './base/api';
import {IOrder, IOrderResult, IProductItem, ILarekAPI, ApiListResponse} from "../types/index";
  
export class WebLarekApi extends Api implements ILarekAPI {
    readonly cdn: string;
  
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }
  
    getProductItem(id: string): Promise<IProductItem> {
      return this.get(`/product/${id}`).then(
        (item: IProductItem) => ({
          ...item,
          image: this.cdn + item.image
        })
      );
    }
  
    getProductList(): Promise<IProductItem[]> {
      return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
        data.items.map((item) => ({
          ...item,
          image: this.cdn + item.image
        }))
      );
    }
  
    orderProducts(order: IOrder): Promise<IOrderResult> {
      return this.post('/order', order).then(
        (data: IOrderResult) => data
      );
    }
}