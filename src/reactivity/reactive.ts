import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from "./baseHandlers";

export const enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive",
    IS_READONLY = "__v_isReadonly",
}

export function reactive(raw) {
    return createReactiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
    return createReactiveObject(raw, readonlyHandlers)
}

export function shallowReadonly(raw) {
    return createReactiveObject(raw, shallowReadonlyHandlers)
}

export function isReactive(value) { 
    return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isProxy(value) { 
    return isReactive(value) || isReadonly(value)
}

export function isReadonly(value) { 
    return !!value[ReactiveFlags.IS_READONLY]
}

function createReactiveObject(raw: any, baseHandlers) {
    return new Proxy(raw, baseHandlers);
}