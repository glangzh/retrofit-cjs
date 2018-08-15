const axios = require('axios');

export const GET = (...args) => request('get', args);

export const POST = (...args) => request('post', args);

export const PUT = (...args) => request('put', args);

export const DELETE = (...args) => request('delete', args);

export const HTTP = args => typeof args === 'object' && _Request(args);

const request = (_method, args) => {
    return _Request(Object.assign({}, { method: _method }, _ParamsParse(args)))
}

const _Merge = (args = {}, options) => {
    let params = args.params || args.data || {};
    if (options && options.length > 0) {
        for (let i = 0, len = options.length; i < len; i++) {
            let _option = options[i];
            if (typeof _option === 'string') {
                _option = parseQuery(_option); // string -> object
            }

            args.url = args.url.replace(/\{(.*?)\}/g, (m, v) => {
                return _option[v] || m;
            })
            params = Object.assign({}, params, _option);
        }
    }
    return params;
}

const _ParamsParse = (args) => {
    if (!args || args.length === 0) {
        return;
    }

    let _url = args[0], _params;
    if (args.length === 1) {
        if (typeof _url === 'object') {
            _params = _url.params || _url.data;
            _url = _url.url
        }
    } else {
        let _args = Array.prototype.slice.call(args, 1);
        _url = _url.replace(/\{(\d+)\}/g, (m, i) => {
            return _args[i];
        });
    }

    return {
        url: _url,
        params: _params
    }
}

const _Request = args => (target, property, descriptor) => {
    if (!descriptor) {
        process.env.NODE_ENV !== 'production' && console.warn(`http options only works on methods`);
        return;
    }

    let oldVal = descriptor.value;
    descriptor.value = function (..._args) {
        let instance = target.axios || this.axios || axios;
        let _headers = oldVal._headers || descriptor.value._headers;
        let _config = oldVal._config || descriptor.value._config;

        let _params = _Merge(args, _args);

        let config = {
            method: args.method,
            url: args.url
        }
        if (_headers) {
            config.headers = _headers;
        }
        if (_params) {
            if (args.method == 'get') {
                config.params = _params;
            } else if (args.method == 'put' || args.method == 'post' || args.method == 'patch') {
                config.data = _params;
            } else if (args.method == 'delete') {
                config.params = _params;
                config.data = _params;
            }
        }

        const req = instance(Object.assign({}, config, _config));

        req.then((res) => {
            oldVal.call(this, res.data);
        }).catch((err) => {
            oldVal.call(this, {}, err);
        })
    };
}

const parseQuery = query => {
    const reg = /([^=&\s]+)[=\s]*([^&\s]*)/g;
    const obj = {};
    while (reg.exec(query)) {
        obj[RegExp.$1] = RegExp.$2;
    }
    return obj;
}