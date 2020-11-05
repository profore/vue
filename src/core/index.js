import Vue from './instance/index'
import { initGlobalAPI } from './global-api/index'
import { isServerRendering } from 'core/util/env'
import { FunctionalRenderContext } from 'core/vdom/create-functional-component'

// 挂载全局api
initGlobalAPI(Vue)

// 定义了只读属性 $isServer
Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
})

// 定义了只读属性 $ssrContext 取自 $vnode.ssrContext
Object.defineProperty(Vue.prototype, '$ssrContext', {
  get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
})

// 公开 FunctionalRenderContext 函数为了ssr运行时帮助程序的安装
// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
})

// __VERSION__是一个占位符 打包时会被填充为当前版本号
Vue.version = '__VERSION__'

export default Vue
