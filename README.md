# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Базовый код 

### Класс Api
Определяет методы для выполнения HTTP-запросов GET и POST с указанным базовым URL-адресом и заголовками запросов по умолчанию.

Конструктор инициализирует базовый URL-адрес и параметры запроса с заголовками по умолчанию для класса TypeScript.
  - Параметр 'baseUrl' — это строка, представляющая базовый URL-адрес для выполнения HTTP-запросов. Он используется в качестве отправной точки для создания полного URL-адреса для запросов.
  - Параметр 'options' — это объект, который может содержать дополнительные конфигурации для HTTP-запроса. 

#### Методы:
  - get(uri: string) - отправляет запрос GET по указанному URI, используя API-интерфейс выборки с указанными параметрами, и обрабатывает ответ;
  - post(uri: string, data: object, method: ApiPostMethods = 'POST') - отправляет запрос POST по указанному URI с предоставленным объектом данных в качестве тела. В параметрe method по умолчанию установлено значение «POST», но можно использовать другие методы HTTP, такие как «PUT», «DELETE»;
  - handleResponse обрабатывает объект ответа и возвращает обещание, которое разрешается в объект или отклоняется с сообщением об ошибке.Если ответ в порядке, функция возвращает обещание, которое преобразуется в данные JSON из ответа. Если ответ неудовлетворительный, функция возвращает обещание, которое отклоняет сообщение об ошибке из данных JSON или текст статуса ответа, если сообщение об ошибке недоступно.

### Класс EventEmitter
Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков о наступлении события.

#### Методы:

- on<T extends object>(eventName: EventName, callback: (event: T) => void) - устанавливает обработчик на событие;
- off(eventName: EventName, callback: Subscriber) - снимает обработчик с события;
- emit<T extends object>(eventName: string, data?: T) - инициирует событие с данными;
- onAll(callback: (event: EmitterEvent) => void) - слушатель всех событий;
- offAll() - сбрасывает все обработчики;
- trigger<T extends object>(eventName: string, context?: Partial<T>) - коллбек триггер, генерирующий событие при вызове.

### Класс Model<T>
Абстрактный класс с именем Model с универсальным типом T. У класса есть конструктор, который принимает два параметра: данные типа Partial<T> и события типа IEvents.

#### Методы:
- emitChanges(event: string, payload?: object) — регистрирует изменение данных.

### Класс Component<T>
Абстрактный класс с именем «Component» с универсальным типом «T», включающий в себя инструменты для работы с DOM в дочерних компонентах.

#### Конструктор:
Конструктор инициализирует защищенное свойство с модификатором только для чтения в классе, который принимает параметр HTMLElement.

#### Методы:

- toggleClass(element: HTMLElement, className: string, force?: boolean) — переключает указанный класс для данного элемента HTML с необязательным параметром, принудительно добавляющим или удаляющим класс;
- setText(element: HTMLElement, value: unknown) — устанавливает текстовое содержимое HTML-элемента в строковое представление заданного значения;
- setDisabled(element: HTMLElement, state: boolean) — переключает отключенный атрибут элемента HTML на основе предоставленногот параметра состояния;
- setImage(element: HTMLImageElement, src: string, alt?: string) — устанавливает атрибуты src и дополнительные атрибуты alt элемента изображения HTML;
- render(data?: Partial<T>): HTMLElement — объединяет предоставленные данные с текущим объектом и возвращает корневой DOM-элемент.

## Компоненты модели данных (бизнес-логика)

### Класс WebLarekApi
Основной класс работы с сетью в проекте. Расширяет API и реализует ILarekAPI, предоставляя методы для получения позиций продуктов, списков продуктов и размещения заказов с дополнительными функциями CDN.

#### Конструктор

- принимает передает в родительский конструктор Api поля baseUrl и options;
- принимает и сохраняет входящий url запроса в cdn.

#### Методы

- getProductItem - метод получения информацию о конкретном продукте по id;
- getProductList — метод получения списка товаров с сервера;
- orderProducts — метод отправки данных заказа на сервер.

### Класс AppFunctionality
Данный класс представляет собой основные данные страницы (каталог, предварительный просмотр товара, корзина, форма заказа) и методы работы с ними.

#### Поля

  - basket: Product[] = [] - товары добавленные в корзину;
  - catalog: Product[] - список товаров полученных с сервера;
  - order: IOrder = {
        payment: 'online',
        address: '',
        email: '',
        phone: '',
        total: 0,
        items: []
    } - данные для отправки заказа на сервер; 
  - preview: string | null - данные товара, открытого в предварительном просмотре;
  - formErrors: FormErrors = {} - ошибка валидации при оформлении заказа. 

#### Методы

  - setCatalog(items: Product[]) - установка данных в каталог; 
  - setPreview(item: Product) - установка данных при предварительном просмотре товара;
  - addProductToBasket(item: Product) - добавить товар в корзину; 
  - removeProductFromBasket(item: Product) - удалить товар из корзины;
  - get iBasket(): Product[] - получение данных товара, добавленных в корзину;
  - getTotal() - установка суммы товаров в корзине; 
  - set total(value: number) - установка суммы товаров в заказе; 
  - get statusBasketOfGoods(): boolean - получение состояния коризны (пустая или имеются товары);
  - clearBasket() - ощичение корзины после офомления заказа;
  - addProductToOrder(item: Product) - добавить товар в заказ;
  - removeProductFromOrder(item: Product) - удалить товар из заказа;
  - validateOrder() - валидация первой формы при оформлении заказа;
  - setOrderField(field: keyof IOrderForm, value: string) - установка данных поля первой формы заказа; 
  - validateOrderContacts() - валидация второй формы при оформлении заказа; 
  - setContactsField(field: keyof IOrderFormContacts, value: string) - установка данных поля второй формы заказа; 
  
## Компоненты представления

### Page
Класс Page расширяет Component и предоставляет методы для взаимодействия с элементами на веб-странице, такие как обновление счетчика, отображение элементов каталога и блокировка/разблокировка оболочки страницы.

#### Конструктор

Конструктор инициализирует элементы и прослушиватели событий для веб-компонента, связанного с корзиной покупок. Принимает два аругмента: 
  - container: HTMLElement - это элемент HTMLElement, который представляет основной элемент контейнера, в котором будет отображаться компонент;
  - protected events: IEvents - Параметр «events» — это объект, который содержит обработчики событий для различных действий в приложении. Он имеет тип IEvents, который, определяет структуру обработчиков событий, которые можно использовать внутри компонента.

#### Поля

  - protected _counter: HTMLElement -  счетчик товаров в корзине;
  - protected _catalog: HTMLElement - каталог товаров;
  - protected _wrapper: HTMLElement - блокировка прокрутки при открытии модального окна;
  - protected _basket: HTMLElement - кнопки корзины.

#### Методы

  - set counter(value: number) - устанавливает значение в счётчике товаров корзины;
  - set catalog(items: HTMLElement[]) - устанавливает список карточек;
  - set locked(value: boolean) - устаналивает класс блокировки прокрутки при открытии модального окна.

### Card
Класс Card представляет собой компонент товара со свойствами заголовка, категории, изображения, цены, кнопки и описания, а также методами установки и получения этих свойств.

#### Конструктор

Функция-конструктор инициализирует свойства элемента товара и добавляет прослушиватель событий щелчка к кнопке или самой карточке на основе предоставленных действий. Принимает два аругмента:
  - container: HTMLElement - это HTMLElement, представляющий элемент контейнера, в котором будут отображаться компоненты товара. Это родительский элемент, который будет содержать заголовок, категорию, изображение, цену, кнопку и описание товара;
  - actions?: ICardActions - это необязательный объект, содержащий свойство «onClick», которое представляет собой функцию, выполняемую при запуске определенного действия, например нажатия кнопки или самой карточки товара. 

#### Поля

  - protected _id: string - id товара;
  - protected _title: HTMLElement - наименование товара;
  - protected _category: HTMLElement - категория товара;
  - protected _image?: HTMLImageElement - изображение товара; 
  - protected _price: HTMLElement - цена товара;
  - protected _description?: HTMLElement - описание товара; 
  - protected _button?: HTMLButtonElement - кнопки добавления/удаления товара в/из корзины; 
  - protected _index?: HTMLElement - порядковый номер товара в корзине;
  

#### Методы

  - set id(value: string) - устанавливает идентификационный номер товара;
  - get id(): string - возвращает идентификационный номер товара;
  - set index(value: string) - устанавливает порядковый номер товара в корзине;
  - get index(): string - возвращает порядковый номер товара в корзине;
  - set title(value: string) - устанавливает наименование товара;
  - get title(): string - возвращает наименование товара;
  - set image(value: string) - устанавливает изображение товара; 
  - set description(value: string | string[]) - устаналивает описание товара;
  - set category(value: string) - устанавливает категорию товара и присваивает соответсвующий класс CSS;
  - set price(value: number | null) - устанавливает цену товара;
  - get price(): number - возвращает цену товара;
  - set button(value: string) - устанавливает текст кнопки.

### Modal
Класс Modal представляет модальный компонент с методами открытия, закрытия и рендеринга.

#### Конструктор

Конструктор инициализирует модальный компонент с помощью прослушивателей событий для закрытия модального окна. Принимает два аругмента:
  - container: HTMLElement - это элемент HTMLElement, который представляет элемент контейнера для модального компонента. Это элемент, в котором будет содержаться модальное содержимое и кнопка закрытия;
  - protected events: IEvents -  это объект, который,  содержит обработчики событий или функции, связанные с обработкой событий внутри модального компонента. Он может включать функции для открытия, закрытия или взаимодействия с модальным окном различными способами.

#### Поля

  - protected _closeButton: HTMLButtonElement - кнопка закрытия модального окна;
  - protected _content: HTMLElement - контейнер для контента модального окна.

#### Методы

  - set content(value: HTMLElement) - устанавливает контент модального окна; 
  - open() - открытие модального окна; 
  - close() - закрытие модального окна; 
  - render(data: IModalData): HTMLElement - возвращает данные контента модального окна при его открытии. 

### Basket
Класс Basket — это компонент, который управляет списком товаров, отображает общую цену и обеспечивает функцию заказа.

#### Конструктор

Конструктор инициализирует компонент корзины с обработкой событий открытия заказа. Принимает два аругмента:
  - container: HTMLElement -  это элемент HTMLElement, представляющий элемент контейнера, в котором будет отображаться компонент корзины.
  - protected events: EventEmitter - параметр events является экземпляром класса EventEmitter, который используется для генерации и прослушивания событий внутри приложения. В этом конструкторе параметр «events» используется для создания события с именем «order:open» при нажатии элемента кнопки.

#### Поля

  - protected _list: HTMLElement - контейнер с карточками товаров; 
  - protected _total: HTMLElement - общая стоимость товаров; 
  - button: HTMLElement - кнопка для перехода оформления заказа.

#### Методы

  - set items(items: HTMLElement[]) - установка товара в разметку корзины; 
  - set selected(items: string[]) - делает кнопку недоступной для нажатия если корзина пуста;
  - set total(total: number) - устаналивает общую стоиомость товаров в корзине.  

### Form
Класс Form расширяет Component и предоставляет функциональные возможности для обработки событий ввода, проверки и отправки формы.

#### Конструктор

Конструктор инициализирует прослушиватели событий для ввода и отправки событий в элементе формы.
  - protected container: HTMLFormElement - Параметр контейнера в конструкторе имеет тип HTMLFormElement, который представляет элемент формы в документе HTML. Он используется для ссылки на элемент формы, с которым будет взаимодействовать код.
  - protected events: IEvents - Параметр «events» в конструкторе имеет тип «IEvents», который содержит функции, связанные с событиями, или обработчики событий, которые будут использоваться внутри класса. Этот параметр позволяет классу структурированно взаимодействовать с событиями и управлять ими,  обеспечивая централизованный способ обработки выбросов или подписок на события.

#### Поля

  - protected _submit: HTMLButtonElement - кнопка отправки формы;
  - protected _errors: HTMLElement - вывод ошибок валидации.

#### Методы

  - protected onInputChange(field: keyof T, value: string) - регисрация события; 
  - set valid(value: boolean) - установка валидности; 
  - set errors(value: string) - установка ошибок валидации;
  - render(state: Partial<T> & IFormState) - возвращает данные контента формы.

### Order
Класс Order — это компонент, который предоставляет модальное окно оформления заказа с выбором типа оплаты и указанием адреса.

#### Конструктор

Конструктор инициализирует компонент заказа. Принимает два аругмента:
  - container: HTMLFormElement -  это элемент HTMLElement, представляющий элемент контейнера, в котором будет отображаться компоненты необоходимые для офрмления заказа.
  - events: IEvents - параметр events является экземпляром класса EventEmitter, который используется для генерации и прослушивания событий внутри приложения. В этом конструкторе параметр «events» используется для создания события с именем «payment:change» при нажатии элемента кнопки.

#### Поля

  - protected _buttons: HTMLButtonElement[] - кнопка для перехода оформления заказа.

#### Методы

  - set payment(name: string) - устаналивает способ оплаты и класс активности в зависимости от нажатой кнопки;
  - set address(value: string) - устанавливает значение поля "адрес";

### OrderContacts
Класс OrderContacts — это компонент, который предоставляет модальное окно оформления заказа с указанием email и телефона.

#### Конструктор

Конструктор инициализирует компонент заказа. Принимает два аругмента:
  - container: HTMLFormElement -  это элемент HTMLElement, представляющий элемент контейнера, в котором будет отображаться компоненты необоходимые для офрмления заказа.
  - events: IEvents - параметр events является экземпляром класса EventEmitter, который используется для генерации и прослушивания событий внутри приложения.

#### Методы

  - set email(value: string) - устанавливает значение поля "email";
  - set phone(value: string) - устанавливает значение поля "телефон".

### Success
Класс Success — это компонент, который отображает сообщение об успешном оформлении заказа с общим значением и кнопкой закрытия.

#### Конструктор

Конструктор инициализирует элементы и прослушиватель событий для кнопки закрытия в компоненте успеха заказа. Принимает два аругмента:
  - container: HTMLElement - это элемент HTMLElement, представляющий элемент, в котором будет отображаться компонент успешного заказа.
  - actions: ISuccessActions - это объект, который содержит свойство «onClick», которое представляет собой функцию, которая будет выполняться при нажатии кнопки закрытия в компоненте успеха заказа.

#### Поля

  - protected _close: HTMLElement - кнопка возврата к главную страницу (списку товаров);
  - protected _total: HTMLElement - итоговая сумма заказа, списанная со счета покупателя.

#### Методы

  - set total(value: string) - устанавливает итоговую сумму заказа, списанную со счета покупателя.

### Основные события

  - items:changed - получение и отображение данных о товаре;
  - card:select - открытие товара для предварительного просмотра;
  - preview:changed - отображение данных товара при предварительном просмотре;
  - card:add - добавление товара в корзину из открытого модального окна; 
  - card:remove - удаление товара из корзины из открытого модального окна; 
  - card:check - смена статуса кнопки покупки в модальном окне;
  - basket:open - открытие корзины, отображение добавленного товара; 
  - basket:remove - удаление товара из корзины;
  - order:open - переход к оформлению заказа;
  - payment:change - выбор способа оплаты. Проверка заполнения поля- адрес. При успешном заполнении, переход к следующей форме заказа; 
  - order:submit - заполнение формы заказа (телефон и email). При успешном заполнении, переход к оплате заказа; 
  - formErrors:change - проверка валидации форм;
  - contacts:submit - возврат к списку товаров и очищение корзины после успешного оформления заказа;
  - modal:open - блокировка прокрутки страницы если открыто модальное окно;
  - modal:close - разблокировка прокрутки страницы если закрыто модальное окно;