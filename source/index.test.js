const index = require('./index.js')

jest.useFakeTimers();

test('date string format test', () => {
	var date = new Date(1613616935705)
	expect(index.getTimeString(date)).toBe("55:35");
});