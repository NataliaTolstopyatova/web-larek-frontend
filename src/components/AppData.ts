import {Model} from "./base/model";
import {FormErrors, IAppState, Product, IOrder, IOrderForm, IOrderFormContacts} from "../types/index";

export type CatalogChangeEvent = {
	catalog: Product[];
};

export class AppFunctionality extends Model<IAppState> {
	basket: Product[] = [];
	catalog: Product[];
	order: IOrder = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	};
	preview: string | null;
	formErrors: FormErrors = {};
	button: HTMLButtonElement;

	setCatalog(items: Product[]) {
        this.catalog = items;
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: Product) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

	addProductToBasket(item: Product) {
		this.basket.push(item);
	}

	removeProductFromBasket(item: Product) {
		const index = this.basket.indexOf(item);
		if (index >= 0) {
		  this.basket.splice( index, 1 );
		}
	}

	get iBasket(): Product[] {
		return this.basket;
	}

	getTotal() {
		return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0);
	}

	set total(value: number) {
		this.order.total = value;
	}

	get statusBasketOfGoods(): boolean {
		return this.basket.length === 0;
	}

	clearBasket() {
		this.basket = [];
		this.order.items = [];
	}

	addProductToOrder(item: Product) {
		if (item.price !== null) {
			this.order.items.push(item.id);
		}
	}
	  
	removeProductFromOrder(item: Product) {
		const index = this.order.items.indexOf(item.id);
		if (index >= 0) {
		  this.order.items.splice( index, 1 );
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment)
			errors.payment = 'Необходимо указать способ оплаты';
		if (!this.order.address) {
		  errors.address = 'Необходимо указать адрес';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
	
		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		} 
	}

	validateOrderContacts() {
		  const errors: typeof this.formErrors = {};
		  if (!this.order.email) {
			  errors.email = 'Необходимо указать email';
		  }
		  if (!this.order.phone) {
			  errors.phone = 'Необходимо указать телефон';
		  }
		  
		  this.formErrors = errors;
		  this.events.emit('formErrors:change', this.formErrors);
		  return Object.keys(errors).length === 0;
	}

	setContactsField(field: keyof IOrderFormContacts, value: string) {
		this.order[field] = value;
	
		if (this.validateOrderContacts()) {
			this.events.emit('order:ready', this.order);
		} 
	}
}