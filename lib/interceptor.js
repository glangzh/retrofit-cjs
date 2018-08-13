const axios = require('axios');

// interceptors
export const AddRequestInterceptor = (config, error, eject = false) => (target, property, descriptor) => {
    if (!descriptor) {
        _addReqInterceptor(target.axios || target.prototype.axios, config, error, typeof error === 'boolean' ? error : eject);
    }
}

export const AddResponseInterceptor = (response, error, eject = false) => (target, property, descriptor) => {
    if (!descriptor) {
        _addResInterceptor(target.axios || target.prototype.axios, response, error, typeof error === 'boolean' ? error : eject);
    }
}
const _addReqInterceptor = (instance, config, error) => {
    return !instance ? axios.interceptors.request.use(config, error) : instance.interceptors.request.use(config, error);
}

const _addResInterceptor = (instance, response, error) => {
    return !instance ? axios.interceptors.response.use(response, error) : instance.interceptors.response.use(response, error);
}