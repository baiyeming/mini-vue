import { track, trigger } from "./effect";
import { ReactiveFlags, reactive, readonly } from "./reactive";
import { extend, isObject } from '../shared/index';

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key) {

        if(key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly;
        }else if(key === ReactiveFlags.IS_READONLY) {
            return isReadonly;
        }

        const res = Reflect.get(target, key);

        if(shallow) {
            return res;
        }

        if(isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res)
        }
            
        if(!isReadonly) {
            //TODO 依赖收集
            track(target, key);
        }
        
        return res;
    }
}

function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value);
        //todo 触发依赖 
        trigger(target, key);
        return res;
    }
}

export const mutableHandlers = {
    get,
    set,
}
export const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value) {
        console.warn(`key: ${key} set失败，因为target是readonly`, target);
        return true;
    } 
}


export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
});