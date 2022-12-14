const walk = require('../walk');

test('adds 1 + 2 to equal 3', () => {
    const ast = { a: 1 }
    const mockEnter = jest.fn();
    const mockLeave = jest.fn();
    walk(ast, null, mockEnter, mockLeave);

    let calls = mockEnter.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toEqual({ a: 1 });

    calls = mockLeave.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toEqual({ a: 1 });
});