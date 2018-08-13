const axios = require('axios');
const CancelToken = axios.CancelToken;

// Custom instance defaults
export const Create = config => (target, property, descriptor) => {
    if (!descriptor) { // 避免在方法上添加
        target.prototype.axios = target.prototype.$axios = axios.create(config);
    }
}

// Config Defaults custom or global
export const Config = config => (target, property, descriptor) => {
    if (typeof config === 'object') {
        if (descriptor) {
            descriptor.value._config = Object.assign({}, descriptor.value._config, config);
        } else {
            let instance = target.prototype.axios;
            config && Object.keys(config).forEach((key) => {
                if (!instance || config.global) {
                    axios.defaults[key] = config[key];
                } else {
                    instance.defaults[key] = config[key];
                }
            })
        }
    }
}

// config header
export const Headers = headers => (target, property, descriptor) => {
    if (typeof headers === 'object') {
        if (descriptor) {
            descriptor.value._headers = Object.assign({}, descriptor.value._headers, headers);
        } else {
            let instance = target.prototype.axios;
            headers && Object.keys(headers).forEach((key) => {
                if (!instance || headers.global) {
                    if ('Content-Type' === key) {
                        axios.defaults.headers.post[key] = headers[key];
                    } else {
                        axios.defaults.headers.common[key] = headers[key];
                    }
                } else {
                    if ('Content-Type' === key) {
                        axios.defaults.headers.post[key] = headers[key];
                    } else {
                        instance.defaults.headers.common[key] = headers[key];
                    }
                }
            })
        }
    }
}

// cancel  
export const Cancel = (cb) => (target, property, descriptor) => {
    if (descriptor && cb) {
        descriptor.value._headers = Object.assign({}, descriptor.value._headers, {
            cancelToken: new CancelToken(ctoken => {
                cb.call(target, ctoken);
            })
        });
    }
}

// 发送form-encoded的数据（适用于 文件 上传的场景）
export const Multipart = (target, property, descriptor) => {
    if (descriptor) {
        descriptor.value._headers = Object.assign({}, descriptor.value._headers, {
            'Content-Type': 'multipart/form-data'
        });
    }
    return descriptor;
}

export const FormUrlEncoded = (target, property, descriptor) => {
    if (descriptor) {
        descriptor.value._headers = Object.assign({}, descriptor.value._headers, {
            'Content-Type': 'application/x-www-form-urlencoded'
        });
    }
    return descriptor;
}