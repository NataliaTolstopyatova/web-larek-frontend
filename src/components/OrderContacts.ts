import { Form } from './common/form';
import { IOrderFormContacts } from '../types/index';
import { IEvents } from './base/events';

export class OrderContacts extends Form<IOrderFormContacts> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}
}
