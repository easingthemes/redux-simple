const startApp = () => {
    // Action creator
    const API_URL = 'https://www.mocky.io/v2';
    const API_ID = '59200c34110000ce1a07b598';

    const fetchItemsStart = (id) => {
      return {
        type: 'FETCH_ITEMS_STARTED',
        id
      }
    };

    const fetchItemsFinished = (id, items) => {
      return {
        type: 'FETCH_ITEMS_FINISHED',
        id,
        items,
        receivedAt: Date.now()
      }
    };

    const fetchItems = (id) => {
      return function (dispatch) {
        dispatch(fetchItemsStart(id));

        return fetch(`${API_URL}/${id}`)
          .then(
            response => response.json(),
            error => console.log('An error occurred.', error)
          )
          .then(items => {
              dispatch(fetchItemsFinished(id, items))
          })
      }
    };

    const changeQuantity = (name, price, quantity) => {
      return {
        type: 'QUANTITY_CHANGED',
        payload: {
            name,
            quantity,
            price
        }
      }
    };

    // Reducers
    const itemsReducer = (state = {}, action) => {
      switch (action.type) {
        case 'FETCH_ITEMS_STARTED':
            return {
              ...state,
              isLoading: true
            };
        case 'FETCH_ITEMS_FINISHED':
            const itemsObj = {};
            action.items.forEach(item => {
                itemsObj[item.name] = item;
                itemsObj[item.name].total = 0;
            });
            return {
                ...state,
                data: itemsObj,
                isLoading: false
            };
        case 'QUANTITY_CHANGED':
            const { name, quantity, price } = action.payload;
            return {
                ...state,
                data: {
                    ...state.data,
                    [name]: {
                        ...state.data[name],
                        total: quantity * price
                    }
                }
            };
        default:
          return state;
      }
    };

    // Combine reducers
    const rootReducer = Redux.combineReducers({
      items: itemsReducer
    });

    // Create store
    const initialState = {
        items: {
            data: {},
            isLoading: false
        }
    };

    const store = Redux.createStore(
      rootReducer,
      initialState,
      Redux.compose(
        Redux.applyMiddleware(ReduxThunk.default),
        window.devToolsExtension ? window.devToolsExtension() : f => f
      )
    );

    // Action Dispatch
    store.dispatch(fetchItems(API_ID));

    const attachEvents = ($item) => {

        const $quantityButton = $item.querySelector('.quantity');
        $quantityButton.addEventListener('input', (event) => {
          const quantity = event.currentTarget.value;
          const price = $item.dataset.price;
          const name = $item.dataset.name;

          store.dispatch(changeQuantity(name, price, quantity));
        });
        
    };

    // Create Selectors
    const itemSelector = Reselect.createSelector(
      state => state.items.data,
      items => _.memoize(
        id => items[id]
      )
    );

    // Listen Store changes - Subscribe
    const toggleLoader = (state = 'remove') => {
        const $items = document.querySelector('.items');

        if (state === 'add') {
            $items.innerHTML = '';
            const $loaderOrigin = document.querySelector('.loader');
            const $loaderClone = $loaderOrigin.cloneNode(true);
            $items.appendChild($loaderClone);
        } else {
            const $loader = $items.querySelector('.loader');
            $loader.remove();
        }
    };

    const updateDomTotal = () => {
        const state = store.getState();
        const getItem = itemSelector(state);
        const $items = document.querySelectorAll('.item');
        for (const $item of $items) {
            const name = $item.dataset.name;
            const item = getItem(name);
            $item.querySelector('.total').innerHTML = item.total;
        }
    };

    const modifyDomItem = ($item, data) => {
        const { name, ticketPrice } = data;
        $item.dataset.price = ticketPrice;
        $item.dataset.name = name;
        $item.querySelector('.name').innerHTML = name;
        $item.querySelector('.price').innerHTML = ticketPrice;
    };

    const renderDomItems = (callback) => {
      const state = store.getState();
      const items = state.items.data;

      if (state.items.isLoading) {
          return;
      }

      const $items = document.querySelector('.items');
      toggleLoader();
      const $itemTemplate = document.querySelector('.item__template');

      Object.entries(items).forEach(item => {
          const $item = $itemTemplate.cloneNode(true);
          $item.classList.remove('item__template');
          $item.classList.add('item');
          $items.appendChild($item);
          modifyDomItem($item, item[1]);
          attachEvents($item);
      });
      callback();
      store.subscribe(updateDomTotal);
    };

    const unsubscribe = store.subscribe(() => renderDomItems(unsubscribe));

    toggleLoader('add');
};

(function() {
    startApp();
})();
