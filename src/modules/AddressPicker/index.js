import MobileSelect from './../mobile-select';
import { getPositionByDefaultValue } from '~/utils/regionsWheelsHelper.js';

class AddressPicker extends MobileSelect {
	constructor(data){
		const { defaultValue, wheels } = data || {};
		const operatedData = { triggerDisplayData: false, ...data, position: getPositionByDefaultValue(defaultValue, wheels), wheels };
		console.log(operatedData.trigger);
		super(operatedData);
	}
}

export default AddressPicker;