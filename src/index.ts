import './scss/styles.scss';

import {WebLarekApi} from "./components/WebLarekAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {cloneTemplate, ensureElement} from "./utils/utils";
import {IOrderForm, IOrderFormContacts, Product} from "./types/index";
import {EventEmitter} from "./components/base/events";
import {AppFunctionality, CatalogChangeEvent} from "./components/AppData";
import {Page} from "./components/Page";
import {Card} from "./components/Card";
import {Modal} from "./components/common/Modal";
import {Basket} from "./components/common/Basket";
import {Order} from "./components/Order";
import {OrderContacts} from "./components/OrderContacts";
import {Success} from "./components/common/Success";

const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);

// Модель данных приложения
const appData = new AppFunctionality ({}, events);

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new OrderContacts(cloneTemplate(contactsTemplate), events);

// Бизнес-логика

// Получаем товары с сервера
api.getProductList()
  .then(appData.setCatalog.bind(appData))
  .catch(err => {
      console.error(err);
  });

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
})

// Получение и отображение данных о товаре
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});

// открытие товара для предварительного просмотра
events.on('card:select', (item: Product) => {
	appData.setPreview(item);
});

// отображение данных товара при предварительном просмотре
events.on('preview:changed', (item: Product) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:check', item);
			card.button =
				appData.basket.indexOf(item) === -1 ? 'В корзину' : 'Удалить из корзины';
		},
	});
	modal.render({
		content: card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			description: item.description,
			button:
				appData.basket.indexOf(item) === -1 ? 'В корзину' : 'Удалить из корзины',
			price: item.price,
		}),
	});
});

// добавление товара в корзину из открытого модального окна
events.on('card:add', (item: Product) => {
	appData.addProductToBasket(item);
	appData.addProductToOrder(item);
	page.counter = appData.basket.length;
	modal.close();
});

// удаление товара из корзины из открытого модального окна
events.on('card:remove', (item: Product) => {
	appData.removeProductFromBasket(item);
	appData.removeProductFromOrder(item);
	page.counter = appData.basket.length;
});

// смена статуса кнопки покупки в модальном окне
events.on('card:check', (item: Product) => {
	if (appData.basket.indexOf(item) === -1) 
    events.emit('card:add', item);
	else 
    events.emit('card:remove', item);
});

// открытие корзины, отображение добавленного товара
events.on('basket:open', () => {
	basket.setDisabled(basket.button, appData.statusBasketOfGoods);
	basket.total = appData.getTotal();
	let i = 1;
	basket.items = appData.iBasket.map((item) => {
		const cardBasket = new Card(cloneTemplate(cardBasketTemplate), {
		onClick: () => events.emit('basket:remove', item)
		});
			return cardBasket.render({
			title: item.title,
			price: item.price,
			index: i++
		});
	})
	modal.render({
		content: 
		basket.render()
	})
});

// удаление товара из корзины
events.on('basket:remove', (item: Product) => {
	appData.removeProductFromBasket(item);
	appData.removeProductFromOrder(item);
	page.counter = appData.iBasket.length;
	basket.setDisabled(basket.button, appData.statusBasketOfGoods);
	basket.total = appData.getTotal();
	basket.items = appData.iBasket.map((item) => {
		const cardBasket = new Card(cloneTemplate(cardBasketTemplate), {
		onClick: () => events.emit('basket:remove', item)
		});
			return cardBasket.render({
			title: item.title,
			price: item.price
		});
	})
	modal.render({
		content: basket.render()
	})
});

// переход к оформлению заказа
events.on('order:open', () => {
	appData.order.total = appData.getTotal();
	modal.render({
		content: order.render({
		payment: '',
		address: '',
		valid: false,
		errors: []
		})
	});
});

// выбор способа оплаты. Проверка заполнения поля- адрес
events.on('payment:change', (item: HTMLButtonElement) => {
	appData.order.payment = item.name;
	appData.validateOrder();
});

// Изменилось одно из полей- payment  или address
events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
	appData.setOrderField(data.field, data.value);
});

// Изменилось состояние валидации первой формы
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const {address, payment} = errors;
	order.valid = !address && !payment;
	order.errors = Object.values({address, payment}).filter(i => !!i).join('; ');
});

// Открытие второй формы заказа
events.on('order:submit', () => {
	appData.order.total = appData.getTotal();
	modal.render({
	  content: contacts.render({
		phone: '',
		email: '',
		valid: false,
		errors: []
	  })
	});
});

// Изменилось одно из полей- email  или phone
events.on(/^contacts\..*:change/, (data: { field: keyof IOrderFormContacts, value: string }) => {
	appData.setContactsField(data.field, data.value);
});

// Изменилось состояние валидации второй формы
events.on('formErrors:change', (errors: Partial<IOrderFormContacts>) => {
	const {email, phone} = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Отправлена форма заказа
events.on('contacts:submit', () => {
  	api.orderProducts(appData.order)
      .then(() => {
          const success = new Success(cloneTemplate(successTemplate), {
              onClick: () => {
                  modal.close();
                  appData.clearBasket();
				  page.counter = appData.basket.length;
              }
          });

          success.total = `Списано ${appData.order.total} синапсов`;
          modal.render({
              content: 
                success.render({})
          });
      })
      .catch(err => {
          console.error(err);
    });
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  	page.locked = true;
});

// Разблокируем прокрутку страницы если закрыта модалка
events.on('modal:close', () => {
  	page.locked = false;
});