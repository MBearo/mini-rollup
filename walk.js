module.exports = function walk(node, parent, enter, leave) {
    if (enter) {
        enter(node, parent);
    }
    const keys = Object.keys(node);
    for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        const child = node[key];
        if (child && typeof child === "object") {
            if (Array.isArray(child)) {
                for (let j = 0; j < child.length; j += 1) {
                    if (typeof child[j] === "object") {
                        walk(child[j], node, enter, leave);
                    }
                }
            }
            else {
                walk(child, node, enter, leave);
            }
        }
    }
    if (leave) {
        leave(node, parent);
    }
}