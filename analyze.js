const Scope = require('./scope')
const walk = require('./walk')

function analyze(ast, magicString) {
    const scope = new Scope();
    ast._scope = scope;
    let currentScope = scope;
    walk(
        ast,
        null,
        (node, parent) => {
            if (node.type === 'VariableDeclaration') {
                for (const declarator of node.declarations) {
                    scope.add(declarator.id.name);
                }
            }
            if (node.type ==='FunctionDeclaration') {
                scope.add(node.id.name);
                const functionScope = new Scope({ parent: scope });
                node._scope = functionScope;
                currentScope = functionScope;
            }
        },
        (node, parent) => {
            if (node.type === 'FunctionDeclaration') {
                currentScope = scope;
            }
        }
    )
}


module.exports = analyze