// merge webpack配置文件
function merge(origin, option) {
    if(option){
        Object.keys(option).forEach(opt => {
            let _option = option[opt];
            let _origin = origin[opt];
            if(_origin){
                if (_option instanceof Array) {
                    origin[opt] = _origin.concat(option[opt]);
                } else if (_option instanceof Object) {
                    origin[opt] = merge(_origin, _option);
                } else {
                    origin[opt] = option[opt];
                }
            } else {
                origin[opt] = option[opt];
            }
        });
    }
    return origin;
}

module.exports = merge;