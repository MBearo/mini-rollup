const Scope = require('../scope')

test('test scope', () => {
    const root = new Scope();
    root.add('a')
    const child = new Scope({ parent: root })
    child.add('b')
    expect(child.contains('a')).toBe(true)
    expect(child.contains('b')).toBe(true)
    expect(child.findDefiningScope('a')).toBe(root)
    expect(child.findDefiningScope('b')).toBe(child)
})