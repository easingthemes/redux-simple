const startApp = () => {
    // Action creator
    const changeQuantity = (price = 1, quantity) => {
      return {
        type: 'QUANTITY_CHANGED',
        payload: quantity * price
      }
    };

    // Reducer
    const totalReducer = (state = 0, action) => {
      switch (action.type) {
        case 'QUANTITY_CHANGED':
          return action.payload;
        default:
          return state;
      }
    };

    // Combine reducers
    const rootReducer = Redux.combineReducers({
      total: totalReducer
    });


    // Create store
    const store = Redux.createStore(
      rootReducer,
      {},
      window.devToolsExtension ? window.devToolsExtension() : f => f
    );

    // Action Dispatch
    const $quantityButton = document.querySelector('.quantity');

    $quantityButton.addEventListener('input', (event) => {
      const quantity = event.currentTarget.value;
      const $item = event.currentTarget.closest('.item');
      const $priceEl = $item.querySelector('.price');
      const price = $priceEl.innerHTML;

      store.dispatch(changeQuantity(price, quantity));
    });

    // Listen Store changes - Subscribe
    const updateDomTotal = () => {
      const state = store.getState();
      document.querySelector('.total').innerHTML = state.total;
    };

    store.subscribe(updateDomTotal);
};

(function() {
    startApp();
})();
