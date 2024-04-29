import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { IBasketView, Product } from '../../types/index';

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this.button = this.container.querySelector('.basket__button');

		if (this.button) {
			this.button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		this._list.replaceChildren(...items);
	}

	set selected(items: Product[]) {
		if (items.length) {
			this.setDisabled(this.button, false);
		} else {
			this.setDisabled(this.button, true);
		}
	}

	set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
		this.button.disabled = total <= 0;
	}
}
