const acorn = require("acorn");
const fs = require('fs');
const { default: MagicString } = require("magic-string");

const code = fs.readFileSync('./source.js', 'utf-8').toString();
const ms = new MagicString(code)
const ast = acorn.parse(code, {
    ecmaVersion: 7,
    sourceType: "module",
    locations: true,
    ranges: true,
})

// console.log('ast', ast)
const declarations = {}
const calls = []
ast.body.forEach((node) => {
    if (node.type === 'VariableDeclaration') {
        node.declarations.forEach((declaration) => {
            declarations[declaration.id.name] = node
        })
    }
    if (node.type === 'ExpressionStatement') {
        calls.push(node)
    }
});
const statements = []
calls.forEach((call) => {
    const node = declarations[call.expression.callee.name]
    if (node) {
        statements.push(node)
        statements.push(call)
    }
})

console.log('strings\n', statements.reduce((prev, cur) => {
    return prev + ms.snip(cur.start, cur.end) + '\n'
}, ''))


// console.log(ms.snip(0, 19).toString())