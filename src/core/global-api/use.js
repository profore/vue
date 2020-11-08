/* @flow */

import { toArray } from '../util/index'

export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    // 如果有 this._installedPlugins 则直接赋值, 如果没有则复制为空数组并保存到 this._installedPlugins
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    // 防止重复注册
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // 转换类数组元素为一个真数组, 第二个参数为开始下标(包含)
    // additional parameters
    const args = toArray(arguments, 1)
    // 向数组开头添加 this(Vue) 元素
    args.unshift(this)
    // 如果 plugin.install 是函数则调用, this是plugin本身
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    // 如果 plugin 本身是函数 则直接调用, this是null
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    // 函数执行完成 向 以注册的插件数组 添加插件
    installedPlugins.push(plugin)
    return this
  }
}
