// parseFloat polyfill
Number.parseFloat = Number.parseFloat || parseFloat;
// parseFloat polyfill
Number.parseInt = Number.parseInt || parseInt;
// isFinite Polyfill
Number.isFinite = Number.isFinite || function(value) {
	return typeof value === 'number' && isFinite(value);
};
module.exports = {
	AddressPicker: require('./modules/AddressPicker').default,
	MobileSelect: require('./modules/MobileSelect').default
};


