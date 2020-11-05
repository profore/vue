// 运行时 + 编译器 的 开发构建版本（浏览器） 的 入口文件

/* @flow */

import config from 'core/config'
import { warn, cached } from 'core/util/index'
import { mark, measure } from 'core/util/perf'

import Vue from './runtime/index'
import { query } from './util/index'
import { compileToFunctions } from './compiler/index'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'

/**
 * 根据 id 找到 Dom 节点并缓存下来
 * cached - 函数式编程中的缓存函数
 */
const idToTemplate = cached(id => {
  const el = query(id)
  return el && el.innerHTML
})

/**
 * 缓存原始的 $mount 方法
 */
const mount = Vue.prototype.$mount
/**
 * 重写 $mount 方法(对原始 $mount 方法做出扩展)
 */
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {

  // 如果有 el 找到 el 代表的元素
  el = el && query(el)

  // 不允许挂载到 html 或 body 元素上
  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  /**
   * options - 实例化 vue 时的配置项
   */
  const options = this.$options
  // 如果没有 render 字段,解析 template/el 并转换为 render 函数
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template
    // 如果有 template 字段
    if (template) {
      // 如果 template 是字符串
      if (typeof template === 'string') {
        // 如果以 '#' 开头, 说明是选择器语法的id
        if (template.charAt(0) === '#') {
          // 根据 template(id选择器) 获取 Dom节点
          template = idToTemplate(template)
          // 如果啥都没获取到又在非production环境下则报警告
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      // 如果 template 是一个 Dom 节点则将其的 innerHTML 字符串赋值给他
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
      // template 啥都不是则报警告
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    // 如果没有 template 字段
    } else if (el) {
      // template 为 el 的 outerHTML 字符串
      template = getOuterHTML(el)
    }
    if (template) {
      /**
       * 在非 production 情况下统计性能
       * mark 底层调用的 window.performance.mark
       * https://developer.mozilla.org/zh-CN/docs/Web/API/Window/performance
       */
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      // 生成 render 函数 与 staticRenderFns 静态渲染器
      const { render, staticRenderFns } = compileToFunctions(template, {
        // 是否输出 SourceRange
        outputSourceRange: process.env.NODE_ENV !== 'production',
        // 解码换行符
        shouldDecodeNewlines,
        // 为 Href 解码换行符
        shouldDecodeNewlinesForHref,
        // 分隔符
        delimiters: options.delimiters,
        // 备注
        comments: options.comments
      }, this)
      // 挂载至 option 对象上
      options.render = render
      options.staticRenderFns = staticRenderFns

      /**
       * 在非 production 情况下统计性能
       * measure 底层调用的 window.performance.measure
       * https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/measure
       * 记录编译时间
       */
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  // 调用原始 mount 方法
  return mount.call(this, el, hydrating)
}

/**
 * 获取节点元素的 HTML 字符串
 * outerHTML 是包括元素本身标签的序列化HTML字符串
 * innerHTML 是不包括元素本身标签的序列化HTML字符串
 */
/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el: Element): string {
  /**
   * 如果有 outerHTML 这个字段 则返回
   * 否则 
   * 深度复制该节点元素 并添加至一个新的div元素内 
   * 返回div元素的 innerHTML 字段
   */
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

/**
 * 挂载 编译 方法至 Vue.compile 字段上
 */
Vue.compile = compileToFunctions

export default Vue
