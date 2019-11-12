import { getPositionByDefaultValue } from '~/utils/tools';

describe('getPositionByDefaultValue', () => {
	it('Without parameters, the result should be an empty array', () => {
		const input = null;
		const output = [];
		expect(getPositionByDefaultValue(input)).toStrictEqual(output);
	});
});