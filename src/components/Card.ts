import { ensureElement } from '../utils/utils';
import { settings } from '../utils/constants';
import { Component } from './base/component';
import { ICardActions, Product } from '../types/index';

export class Card extends Component<Product> {
	protected _id: string;
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _price: HTMLElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _index?: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._category = container.querySelector('.card__category');
		this._image = container.querySelector(`.card__image`);
		this._price = ensureElement<HTMLElement>(`.card__price`, container);
		this._description = container.querySelector(`.card__text`);
		this._button = container.querySelector(`.card__button`);
		this._index = container.querySelector('.basket__item-index');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set index(value: number) {
		this.setText(this._index, value);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(descTemplate, str);
					return descTemplate;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}

	set category(value: string) {
		const colorClass = settings[value];
		if (colorClass) {
			this._category.classList.add(colorClass);
		}
		this.setText(this._category, value);
	}

	set price(value: number | null) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
		} else {
			this.setText(this._price, `${value} синапсов`);
		}
	}

	get price(): number {
		return Number(this._price.textContent || '');
	}

	set button(value: string) {
		this._button.textContent = value;
	}
}
