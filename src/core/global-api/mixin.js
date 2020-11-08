/* @flow */

import { mergeOptions } from '../util/index'

// 将两个选项对象合并为一个新对象。
export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
