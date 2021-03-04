import util from './util';

// deepCopy
function deepCopy(data) {
    var t = util.typeOf(data);
    var o;

    if (t === 'array') {
        o = [];
    } else if (t === 'object') {
        o = {};
    } else {
        return data;
    }

    if (t === 'array') {
        for (var i = 0; i < data.length; i++) {
            o.push(deepCopy(data[i]));
        }
    } else if (t === 'object') {
        for (var i in data) {
            o[i] = deepCopy(data[i]);
        }
    }
    return o;
}

const operateBtn = function (vm, h, currentRow, operationName, operation, type, permission) {
    return h('Button', {
        props: {
            type: type,
            size: "small",
            ghost: true,
        },
        directives: [{
            name: "permission",
            value: permission
        }],
        style: {
            margin: '0 2px'
        },
        on: {
            'click': () => {
                operation(vm, currentRow);
            }
        }
    }, operationName);
};
const operateHref = function (vm, h, currentRow, operationName, operation) {
    return h('a', {
        on: {
            'click': () => {
                operation(vm, currentRow);
            }
        }
    }, operationName);
};
export {deepCopy, operateBtn, operateHref};

