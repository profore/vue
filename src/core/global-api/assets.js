/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  // 遍历 ASSET_TYPES 数组, 为 Vue 定义相应的方法
  // ASSET_TYPES 包括 directive component filter
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        // 如果没有传第二个参数 是为查找
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        // 如果是组件 
        // isPlainObject 是否是原始 object 对象
        if (type === 'component' && isPlainObject(definition)) {
          // 是否有设置 name 属性, 没有默认 id 作为组件名称
          definition.name = definition.name || id
          // 把组件配置转换为组件构造函数 this.options._base 是vue的构造函数
          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        // 全局注册, 存储资源并赋值
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
