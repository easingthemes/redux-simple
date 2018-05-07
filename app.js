(function() {
  // Action creator
  const changeQuantity = (price, quantity) => {
    return {
      type: 'QUANTITY_CHANGED',
      payload: {
        quantity,
        price
      }
    }
  };

  // Reducers
  const totalReducer = (state = {}, action) => {
    switch (action.type) {
      case 'QUANTITY_CHANGED':
        const {
          quantity,
          price
        } = action.payload;
        return {
          ...action.payload,
          total: quantity * price
        };
      default:
        return state;
    }
  };

  // Combine reducers
  const rootReducer = Redux.combineReducers({
    active: totalReducer
  });

  // Create store
  const store = Redux.createStore(
    rootReducer, {},
    window.devToolsExtension ? window.devToolsExtension() : f => f
  );

  // Action Dispatch
  const handleEvents = () => {
    const $item = document.querySelector('.item');
    const $quantityButton = $item.querySelector('.quantity');
    $quantityButton.addEventListener('input', (event) => {
      const quantity = event.currentTarget.value;
      const price = $item.dataset.price;

      store.dispatch(changeQuantity(price, quantity));
    });
  };

  // Listen Store changes - Subscribe
  const updateDomTotal = () => {
    const state = store.getState();
    const $item = document.querySelector('.item');
    const item = state.active;
    $item.querySelector('.total').innerHTML = item.total;
  };

  store.subscribe(updateDomTotal);

  handleEvents();
})();