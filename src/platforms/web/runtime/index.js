/* @flow */

import Vue from 'core/index'
import config from 'core/config'
import { extend, noop } from 'shared/util'
import { mountComponent } from 'core/instance/lifecycle'
import { devtools, inBrowser } from 'core/util/index'

import {
  query,
  mustUseProp,
  isReservedTag,
  isReservedAttr,
  getTagNamespace,
  isUnknownElement
} from 'web/util/index'

import { patch } from './patch'
import platformDirectives from './directives/index'
import platformComponents from './components/index'

// 挂载一些在特定平台使用的工具方法
// install platform specific utils
Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isReservedAttr = isReservedAttr
Vue.config.getTagNamespace = getTagNamespace
Vue.config.isUnknownElement = isUnknownElement

/**
 * 安装平台运行时的指令 和 组件
 * extend - 将属性(后者)混合到目标对象(前者)中。
 */
// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives)
extend(Vue.options.components, platformComponents)

/**
 * 如果是浏览器环境
 * 在原型上挂载 path 方法
 * 否者挂载空函数
 */
// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop

/**
 * 定义公共的 $mount 方法
 */
// public mount method
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  // 在浏览器环境使用 query 方法获取dom节点
  el = el && inBrowser ? query(el) : undefined
  // 调用 mountComponent 挂载, 将会触发声明周期等一系列后续逻辑
  return mountComponent(this, el, hydrating)
}

// 浏览器端 开发工具的全局钩子 
// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
  // 宏任务
  setTimeout(() => {
    // config.devtools 默认在不为 production 模式下开启
    if (config.devtools) {
      // devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__
      if (devtools) {
        devtools.emit('init', Vue)
      } else if (
        process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test'
      ) {
        /**
         * 开发环境下, 如果没有 devtools 提示下载 devtools 以获得更好的开发体验
         * 有 console.info 使用 info 否则使用 log
         */
        console[console.info ? 'info' : 'log'](
          'Download the Vue Devtools extension for a better development experience:\n' +
          'https://github.com/vuejs/vue-devtools'
        )
      }
    }
    // 用户位于开发环境时的默认提示
    if (process.env.NODE_ENV !== 'production' &&
      process.env.NODE_ENV !== 'test' &&
      config.productionTip !== false &&
      typeof console !== 'undefined'
    ) {
      console[console.info ? 'info' : 'log'](
        `You are running Vue in development mode.\n` +
        `Make sure to turn on production mode when deploying for production.\n` +
        `See more tips at https://vuejs.org/guide/deployment.html`
      )
    }
  }, 0)
}

export default Vue
