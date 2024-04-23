export interface IProductItem {
    id: string;
    title: string;
    description?: string;
    image: string;
    category: string;
    price: number | null;
}

export interface IProductsList {
    products: IProductItem[];
}

export interface IAppState {
    catalog: IProductItem[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
    total: string | number;
}

export interface IOrderForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
    total: string | number;
}

export interface IOrder extends IOrderForm {
    items: string[];
}

export interface IOrderResult {
    id: string;
}

export interface ILarekAPI {
    getProductList: () => Promise<IProductItem[]>; 
    getProductItem: (id: string) => Promise<IProductItem>; 
    orderProducts: (order: IOrder) => Promise<IOrderResult>; 
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IBasketView  {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export interface IModalData {
    content: HTMLElement;
}

export interface ISuccess {
    total: number;
}
  
export interface ISuccessActions {
    onClick: () => void;
}

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
    id: string;
    title: string;
    category: string;
    image: string;
    price: number;
    description: string;
}

export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}