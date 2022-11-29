const analyze = require('../analyze')
const acorn = require("acorn");
const fs = require('fs');
const MagicString = require("magic-string");

function getCode(code) {
    const ast = acorn.parse(code, {
        ecmaVersion: 7,
        sourceType: "module",
        locations: true,
        ranges: true,
    })
    return {
        ast,
        magicString: new MagicString(code),
    }
}
test('test analyze', () => {
    const { ast, magicString } = getCode(`const a = 1`)
    analyze(ast, magicString)

    expect(ast._scope.contains('a')).toBe(true)
    expect(ast._scope.findDefiningScope('a')).toEqual(ast._scope)
})
test('test analyze', () => {
    const { ast, magicString } = getCode(`const a = 1;const b=2`)
    analyze(ast, magicString)

    expect(ast._scope.contains('a')).toBe(true)
    expect(ast._scope.findDefiningScope('a')).toEqual(ast._scope)
    expect(ast._scope.contains('b')).toBe(true)
    expect(ast._scope.findDefiningScope('b')).toEqual(ast._scope)
})
test('test analyze', () => {
    const { ast, magicString } = getCode(`const a = 1;
    function foo() {
        const b = 2;
    }
    const c=3
    `)
    analyze(ast, magicString)

    expect(ast._scope.contains('a')).toBe(true)
    expect(ast._scope.findDefiningScope('a')).toEqual(ast._scope)
    expect(ast._scope.contains('b')).toBe(true)
    expect(ast._scope.findDefiningScope('b')).toEqual(ast._scope)
    expect(ast._scope.contains('c')).toBe(true)
    expect(ast._scope.findDefiningScope('c')).toEqual(ast._scope)
})