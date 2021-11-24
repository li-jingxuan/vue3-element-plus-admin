<template>
  <el-upload
    action=""
    multiple
    :show-file-list="showDefaultFileList"
    :limit="maxCount"
    :on-exceed="handleExceedClick"
    :list-type="defaultListType"
    :http-request="handleUploadFileChange"
    :before-upload="handleBeforeUploadChange"
    :accept="accept"
    :file-list="modelValue"
  >
    <!-- :file-list="files" -->
    <slot name="default">
      <el-button type="primary">点击上传</el-button>
    </slot>
    <template #tip class="el-upload__tip">
      <span class="tips">{{ tips }}</span>
    </template>
  </el-upload>

  <component
    v-if="showImageList"
    :is="imageListName"
    :img-list="files"
    @del="handleDelClick"
    @setMain="handleSetMainClick"
  />
</template>

<script>
import { ref, watch, unref, watchEffect } from 'vue'
import { uploadFile as postUploadFile } from '@/api/brand.js'
import { guid } from '@/utils/utils'
import { useMessage } from '@/utils/messager'
import ImageGridList from './ImageGridList.vue'

export default {
  name: 'UploadImage',
  components: { ImageGridList },
  props: {
    modelValue: Array,
    tips: {
      type: String,
      default: '只能上传jpg/png文件，且不超过500kb'
    },
    uploadApi: Function,
    showDefaultFileList: {
      type: Boolean,
      default: false
    },
    defaultListType: {
      type: String,
      default: 'picture'
    },
    // 最大上传数量
    maxCount: {
      type: Number,
      default: 0
    },
    // 自动上传
    autoUpload: {
      type: Boolean,
      default: true
    },
    // 1、品牌图片： brand-logo  2、商品图片： goods 3、详情图片： goods-detail
    resourceType: {
      type: String,
      default: 'goods'
    },
    // 是否临时，0：否  1：是
    isTemp: {
      type: Number,
      default: 0
    },
    showImageList: {
      type: Boolean,
      default: true
    },
    imageListName: {
      type: String,
      default: 'ImageGridList'
    },
    accept: {
      type: String,
      default: 'image/jpeg,image/png,image/jpg'
    }
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const files = ref([])
    watch(
      () => files.value,
      () => {
        console.log(files.value)
        ctx.emit('update:modelValue', files.value)
      },
      // 深度监听
      { deep: true }
    )
    watchEffect(
      () => {
        files.value = unref(props.modelValue)
      }
    )
    const $msg = useMessage()
    // const accept = 'image/jpeg,image/png,image/jpg'

    const handleUploadFileChange = async(e) => {
      const { file } = e
      const reader = new FileReader()

      const key = guid()
      // reqState 0: 未上传  1 上传中 2 已上传
      const fileObj = { key, file, imgUrl: '', fileName: '', reqState: 0 }
      reader.onload = async(c) => {
        fileObj.imgUrl = c.target.result

        files.value.push(fileObj)

        if (props.autoUpload) {
          fileObj.reqState = 1

          const _i = files.value.findIndex((c) => c.key === key)
          const _f = files.value[_i]
          let res
          try {
            let reqApiFn = postUploadFile
            if (props.uploadApi) {
              reqApiFn = props.uploadApi
            }
            res = await reqApiFn({
              file: e.file,
              resource: props.resourceType,
              isTemp: props.isTemp
            })
            _f.reqState = 2
            _f.imgUrl = res.fileUrl
            _f.fileName = res.fileName
          } catch (e) {
            console.error(e)
            _f.reqState = 3
            _f.reqErrMsg = e.msg || '图片上传失败'
          }

          files.value.splice(_i, 1, _f)
        }
      }
      reader.readAsDataURL(file)
    }
    const handleExceedClick = () => {
      $msg.messageError(`最多只能上传 ${props.maxCount} 张图片！`)
    }

    // 主动上传
    const uploadFile = async() => {
      files.value.forEach((c) => {
        c.reqState = 1
        let reqApiFn = postUploadFile
        if (props.uploadApi) {
          reqApiFn = props.uploadApi
        }
        reqApiFn(c.file, props.resourceType, props.isTemp).then((r) => {
          c.reqState = 2
          c.imgUrl = r.fileUrl
        })
      })
    }

    const getFiles = () => {
      return files.value
    }

    const handleDelClick = (e, index) => {
      files.value.splice(index, 1)
    }
    const handleSetMainClick = (e, index) => {
      const mainImg = files.value[index]
      files.value.splice(index, 1)
      files.value.unshift(mainImg)
    }
    const handleBeforeUploadChange = (file) => {
      const reg = new RegExp(file.type)
      const _ok = reg.test(props.accept)

      if (!_ok) {
        $msg.messageError(`只允许上传 ${props.accept} 格式的图片！`)
      }
      return _ok
    }

    return {
      props,
      files,
      handleUploadFileChange,
      handleExceedClick,
      handleDelClick,
      handleSetMainClick,
      handleBeforeUploadChange,
      uploadFile,
      getFiles
    }
  }
}
</script>

<style lang="scss" scoped>
.tips {
  color: #909399;
  margin-left: 10px;
  font-size: 14px;
}
</style>
