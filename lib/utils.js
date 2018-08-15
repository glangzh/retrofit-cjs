const axios = require('axios');
const DEFAULT_TIMEOUT = 300;

/**
 * 防抖修饰器
 * @param {*} wait          执行间隔
 * @param {*} immediate     是否立即执行
 */
export const Debounce = (wait = DEFAULT_TIMEOUT, immediate) => (target, property, descriptor) => {
    if (descriptor) {
        let oldValue = descriptor.value;
        descriptor.value = (...args) => debounce(oldValue, wait, immediate)(target, args);
    }
}

const debounce = (func, wait, immediate) => {
    let timeout, args, context, timestamp;

    let later = function () {
        let last = Date.now() - timestamp;
        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
                if (!timeout) context = args = null;
            }
        }
    }

    return (ctx, _args) => {
        context = ctx;
        args = _args;

        timestamp = Date.now();
        let callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);

        if (callNow) {
            func.apply(context, args);
            context = args = null;
        }
    }
}

/**
 * 节流修饰器
 * @param {*} wait      执行间隔
 * @param {*} options   如果想忽略开始函数的的调用， 传入 {leading: false}。
 *                      如果想忽略结尾函数的调用， 传入 {trailing: false}。
 *                      两者不能共存， 否则函数不能执行。
 */

export const Throttle = (wait = DEFAULT_TIMEOUT, options) => (target, property, descriptor) => {
    if (descriptor) {
        let oldValue = descriptor.value;
        descriptor.value = (...args) => throttle(oldValue, wait, options)(target, args);
    }
}

const throttle = (func, wait, options) => {
    let context, args;
    let timeout = null;
    let previous = 0;
    if (!options) options = {};
    let later = function () {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        func.apply(context, args);
        if (!timeout) context = args = null;
    };

    return (ctx, ..._args) => {
        let now = Date.now();
        if (!previous && options.leading === false) previous = now;
        let remaining = wait - (now - previous);
        context = ctx;
        args = _args;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
    }
}

/**
 * timeout
 * @param {*} millisec      时间间隔
 * @param {*} immediate     是否立即执行
 */
export const Timer = (millisec, immediate) => (target, property, descriptor) => {
    if (descriptor) {
        const timeOut = args => {
            setTimeout(() => descriptor.value.apply(target, args || []), millisec);
        }

        immediate ? timeOut() : descriptor.value = (...args) => timeOut(args);
    }
}

/**
 * interval
 * @param {*} millisec      时间间隔
 * @param {*} endtime       结束时间
 * @param {*} immediate     是否立即执行
 */
export const Interval = (millisec, endtime, immediate) => (target, property, descriptor) => {
    if (descriptor) {
        const _end = interval => setTimeout(() => clearInterval(interval), endtime);

        const _interval = (args = []) => {
            let interval = setInterval(() => {
                args.unshift(interval);
                descriptor.value.apply(target, args);
            }, millisec);
            return interval;
        }

        if ((typeof endtime === 'boolean' && endtime) || immediate) {
            let interval = _interval();
            typeof endtime !== 'boolean' && endtime > millisec && _end(interval);
        } else {
            descriptor.value = (...args) => {
                let interval = _interval(args);
                endtime > millisec && _end(interval);
            }
        }
    }
}

/**
 * 自动绑定
 * @param {*} target 
 * @param {*} property 
 * @param {*} descriptor 
 */
export const Autobind = (target, property, descriptor) => {
    descriptor && descriptor.value.bind(target);
}


/**
 * 通过vue插件 配置 axios
 */
export const RetroPlugin = {
    install(Vue, options = {}) {
        Vue.prototype.$axios = axios.create(options);
        Vue.mixin({
            created() {
                let __proto__ = this.$options.__proto__;
                if (__proto__ && __proto__.methods) {
                    __proto__.methods.axios = this.$axios;
                }
            }
        });
    }
}