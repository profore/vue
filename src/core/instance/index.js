import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

/**
 * 整个Vue的核心, 构造函数定义在此
 */
function Vue (options) {
  // 警告 需要使用new关键字调用构造函数
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // 根据 options 调用_init方法实例化对象
  this._init(options)
}

// 注册 _init 方法
initMixin(Vue)
// 注册 状态相关 如 $data $watch
stateMixin(Vue)
// 注册 事件相关 如 $on $emit
eventsMixin(Vue)
// 注册 生命周期相关
lifecycleMixin(Vue)
// 注册 render函数相关
renderMixin(Vue)

export default Vue
