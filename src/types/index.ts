export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export interface ILarekAPI {
	getProductList: () => Promise<IProductItem[]>;
	getProductItem: (id: string) => Promise<IProductItem>;
	orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export interface IProductItem {
	id: string;
	title: string;
	category: string;
	image?: string;
	price: number | null;
	description?: string;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface Product extends IProductItem {
	button?: string;
	index?: number;
}

export interface IOrderForm {
	payment: string;
	address: string;
}

export interface IOrderFormContacts {
	email: string;
	phone: string;
}

export interface IOrder extends IOrderForm, IOrderFormContacts {
	total: number;
	items: string[];
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
	id: string;
	total: number;
}

export interface IAppState {
	catalog: IProductItem[];
	basket: IProductItem[];
	preview: string | null;
	order: IOrder | null;
	loading: boolean;
}

export interface IBasketView {
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

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}
