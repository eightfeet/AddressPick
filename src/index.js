import './style/common';
if (window.Promise === undefined) {
	throw new Error('Promise pollyfill not found.');
}

import AddressPicker from './modules/AddressPicker';
module.exports = AddressPicker;


