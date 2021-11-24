<template>
  <div class="sx-pagination" :style="{ textAlign: position }">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="sizeOption"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="page"
      :page-size="size"
      :total="total"
      background
    >
    </el-pagination>
  </div>
</template>

<script>
import { reactive } from 'vue'
export default {
  name: 'SxPagination',
  emits: ['payload:change'],
  props: {
    page: {
      type: Number,
      default: 1
    },
    size: {
      type: Number,
      default: 10
    },
    sizeOption: {
      type: Array,
      default: () => [10, 20, 30]
    },
    // 数据总条数
    total: {
      type: Number,
      required: true
    },
    position: {
      type: String,
      default: 'right',
      validator: (value) => {
        // 传入的必须是指定范围的值
        return ['left', 'center', 'right'].includes(value)
      }
    }
  },
  setup(props, ctx) {
    const payload = reactive({
      size: props.size,
      page: props.page
    })

    const handleSizeChange = (size) => {
      payload.size = size

      const curPage = Math.ceil(props.total / size)
      if (props.page === 1 || curPage >= props.page) {
        payloadChange()
      }
    }

    const handleCurrentChange = (page) => {
      payload.page = page
      payloadChange()
    }

    const payloadChange = () => {
      ctx.emit('payload:change', {
        size: payload.size,
        page: payload.page,
        total: props.total
      })
    }

    return {
      // data
      payload,
      props,
      // methods
      handleCurrentChange,
      handleSizeChange
    }
  }
}
</script>

<style lang="scss" scoped>
.sx-pagination {
  padding: 15px 0;
}
</style>
