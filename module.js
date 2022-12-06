const acorn = require("acorn");
const analyze = require('./example/analyse');
const MagicString = require("magic-string");

class Module {
    constructor({ code, path, bundle }) {
        this.code = new MagicString(code);
        this.ast = acorn.parse(code, {
            ecmaVersion: 7,
            sourceType: "module",
            locations: true,
            ranges: true,
        });
        this.imports = {}
        this.exports = {}
        this.definitions = {}
        this.analyze()
    }
    analyze() {
        for (const node of this.ast.body) {
            if (node.type === 'ImportDeclaration') {
                for (const specifier of node.specifiers) {
                    this.imports[specifier.local.name] = {
                        source: node.source.value,
                        localName: specifier.local.name,
                        name: specifier.imported ? specifier.imported.name : ''
                    }
                }
            }
            if (node.type === 'ExportNamedDeclaration') {
                if (node.declaration) {
                    if (node.declaration.type === 'VariableDeclaration') {
                        if (!node.declaration.declarations) return // 无声明直接返回，引入类等情况未考虑
                        let name = node.declaration.declarations[0].id.name;
                        this.exports[name] = {
                            node,
                            localName: name,
                            expression: node.declaration,
                        };
                    }
                }
            }
        }
        analyze(this.ast, this.code)
        this.definitions = {};
        this.ast.body.forEach((statement) => {
            Object.keys(statement._defines).forEach((name) => {
                this.definitions[name] = statement;
            });
        });
        console.log('definitions', this.definitions)
    }
    expandAllStatement() {
        const statements = []
        for (const node of this.ast.body) {
            if (node.type === 'ImportDeclaration') {
                return
            }
            if (node.type === 'VariableDeclaration') {
                return
            }
            statements.push(...this.expandStatement(node))
        }
        console.log('statements',statements)
        return statements
    }
    expandStatement(node) {
        const result = []
        const _dependsOn = node._dependsOn
        for (const name of _dependsOn) {
            const definition = this.define[name]
            if (definition) {
                result.push(...definition)
            }
        }
        result.push(node)
        return result
    }
    // 查找变量声明
    define(name) {
        return this.expandStatement(this.definitions[name])
    }
}
module.exports = Module