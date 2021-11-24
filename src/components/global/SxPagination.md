## SxPagination.vue 使用说明
<strong>·</strong> SxPagination解决当 el-pagination size变化导致page改变时会派发多次调用的问题<br />
<strong>·</strong> SxPagination是全局组件，无需在每个页面导入使用

### props属性说明
```js
// 当前页面页码（取父组件传入的值）
page: {
  type: Number,
  default: 1
},
// 当前页面长度（取父组件传入的值）
size: {
  type: Number,
  default: 10
},
// 页面大小选择
sizeOption: {
  type: Array,
  default: () => [10, 20, 30]
},
// 数据总条数
total: {
  type: Number,
  required: true
},
// 翻页水平位置：'left', 'center', 'right'
position: {
  type: String,
  default: 'right',
  validator: (value) => {
    // 传入的必须是指定范围的值
    return ['left', 'center', 'right'].includes(value)
  }
}
```

### emit事件派发
```
emit: ['payload:change']

params: {
  size: 当前页大小
  page：当前页码
  total：数据总长度（传入是多少就是多少）
}
```

### 使用示例
```html
<!-- 组件 -->
<sx-pagination
  @payload:change="handlePayloadChange"
  :page="currentPage"
  :size="searchParams.limit"
  :total="tableDataTotal"
/>
```
```js
// 逻辑
const handlePayloadChange = async(payload) => {
  currentPage.value = payload.page // 当前页码
  searchParams.limit = payload.size // 页大小
  // 这里根据业务计算长度
  searchParams.skip = (payload.page - 1) * searchParams.limit
  // 这里根据业务调用接口
  await clickSearch()
}
```
