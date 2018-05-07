// Action creator
const changeQuantity = (quantity) => {
	return {
  	type: 'QUANTITY_CHANGED',
    payload: quantity
  }
};

// Reducer
const totalReducer = (state = 0, action) => {
  switch (action.type) {
    case 'QUANTITY_CHANGED':
      return '';
    default:
      return state;
  }
}

// Combine reducers
const rootReducer = Redux.combineReducers({
  total: totalReducer
})

// Action Dispatch
const $quantityButton = document.querySelector('.quantity');

$quantityButton.addEventListener('click', (event) => {
	const quantity = event.currentTarget.value;

  store.dispatch(changeQuantity(quantity));
});

// Listen Store changes - Subscribe
const updateDomTotal = () => {
	const state = store.getState();
  console.log('state', state);
  document.querySelector('.total').innerHTML = state.total;
}

const store = Redux.createStore(
	rootReducer,
  {},
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(updateDomTotal);
