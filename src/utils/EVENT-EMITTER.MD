## event-emitter.js API使用文档
event-emitter 是一个全局事件通信的 js 库。由于 Vue3 无法像 Vue2 一样通过创建一个新的 Vue 实例来实现 事件总线（Bus），所以只能自己简单实现一套 事件总线系统。

[event-emitter.js 源代码](./event-emitter.js)

### 使用方式
使用方式类似于 Vue2 中的 this.$emit 和 this.$on，只需要使用 useEmitter 注册即可
```js
// A.vue
import { useEmitter } from '@/utils/event-emitter'

setup() {
  const $emitter = useEmitter()

  // 监听事件
  $emitter.on(
    'close:tag',  // 事件名
    (e) => { console.log(e) } // 回调函数
  )
}

// B.vue
import { useEmitter } from '@/utils/event-emitter'

setup() {
  const $emitter = useEmitter()

  // 监听事件
  $emitter.emit('close:tag', { test: '这里可以传入参数' } )
}
```

### API
```
$emitter.emit: 
  描述：派发事件
  参数:
    $emitter.emit([事件名], [参数])
```
```
$emitter.once：
  描述：监听事件（只监听一次）
  参数：
    $emitter.once([事件名], [回调函数])
```
```
$emitter.on：
  描述：监听事件（只要 emit 派发，就会执行，不会自动注销）
  参数：
    $emitter.on([事件名], [回调函数])
```
```
$emitter.off：
  描述：注销事件
  参数：
    $emitter.off([事件名], [回调函数])
```
