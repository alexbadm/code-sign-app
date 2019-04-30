const state = {
  fromDate: 1559347200000,
  toDate: 1567296000000,
};

function init() {
  global.birthday = state;
}

function onChange([ type, newDate ]) {
  state[type] = newDate;
  console.log("onChange event", type, newDate, state);
  return state;
}

module.exports = {
  init,
  onChange,
};
