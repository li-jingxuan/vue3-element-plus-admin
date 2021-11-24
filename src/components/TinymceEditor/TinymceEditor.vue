<template>
<textarea :id="editorId" />
<!-- <el-button type="primary" @click="getHtml">获取</el-button> -->
</template>

<script>
import { onMounted, unref } from 'vue'
import { uploadFile as postUploadFile } from '@/api/brand.js'
import 'tinymce/tinymce.min.js'
import 'tinymce/themes/silver/theme.min.js'
import 'tinymce/icons/default/icons.min.js'
import 'tinymce/skins/ui/oxide/skin.min.css'
import './plugins/image/index.js'
// import 'tinymce/plugins/image/plugin.min.js'
import 'tinymce/plugins/paste/plugin.min.js'
import './lang/zh_CN'

const plugins = 'image paste'
const toolbar = 'image forecolor fontsizeselect'
const imagesUploadHandler = async(blobInfo, succFun, failFun) => {
  try {
    const file = blobInfo.blob()
    const { fileUrl } = await postUploadFile({
      file,
      resource: 'goods-detail',
      isTemp: 0
    })
    succFun(fileUrl)
  } catch (e) {
    console.error(e)
    failFun(e.msg)
  }
}

const pastePreprocess = (plugin, args) => {
  const { content } = args
  // const formEl = ['form', 'fieldset', 'legend', 'input', 'textarea', 'button', 'select', 'option']
  const vd = document.createElement('div')
  vd.innerHTML = content
  vd.style.height = 0
  vd.style.opacity = 0

  document.getElementById('app').appendChild(vd)
  const doms = []
  // 将所有的 块级元素 转换为 p 标签
  // 将所有的 行内块、行内标签 转为 span 标签
  // 去除样式
  deepDomTree(vd, (c) => {
    // const _display = getDisplay(c)
    if (['IMG'].includes(c.tagName)) {
      doms.push(c.outerHTML)
    } else {
      const _domStr = `<p>${c.innerText}</p>`

      doms.push(_domStr)
    }
  })

  args.content = doms.join('')
  vd.parentElement.removeChild(vd)

  function deepDomTree(parent, callback) {
    if (!parent.children || parent.children.length <= 0) {
      callback(parent)
    } else {
      for (let i = 0; i < parent.children.length; i++) {
        const child = parent.children[i]
        deepDomTree(child, callback)
      }
    }
  }
}
const defaultConfig = (editorId) => ({
  selector: `#${editorId}`,
  language: 'zh_CN',
  menubar: '',
  plugins,
  toolbar,
  toolbar_location: 'bottom',
  statusbar: false,
  height: '400px',
  paste_data_images: true,
  paste_preprocess: pastePreprocess,
  image_dimensions: false,
  image_description: false,
  typeahead_urls: true,
  content_style: 'p { line-height:24px;margin: 0; }',
  urlconverter_callback: (url, node, onSave, name) => {
    if (node === 'img' && url.startsWith('blob:')) {
      window.tinymce.activeEditor && window.tinymce.activeEditor.uploadImages()
    }
    return url
  },
  images_upload_handler: imagesUploadHandler
})

export default {
  props: {
    editorId: {
      type: String,
      default: 'tinymce-editor'
    },
    editorConfig: {
      type: Object,
      default: () => ({})
    },
    defaultContent: {
      type: String,
      default: ''
    }
  },
  // 解决 keep-alive 缓存无法输入问题
  async activated() {
    console.log(this.editorId)
    let _html = ''
    const curActTinymce = window.tinymce.get(this.editorId)
    if (curActTinymce) {
      _html = curActTinymce.getContent()
      window.tinymce.remove(`#${this.editorId}`)
      const _defaultConfig = defaultConfig(this.editorId)
      const config = Object.assign(_defaultConfig, this.editorConfig)
      await window.tinymce.init(config)
      window.tinymce.get(this.editorId).setContent(_html)
    }
  },
  // tionymce 富文本编辑器配置文档：http://tinymce.ax-z.cn/configure/editor-appearance.php#statusbar
  setup(props) {
    onMounted(() => {
      window.tinymce.get(props.editorId) && window.tinymce.remove(`#${props.editorId}`)
      const _defaultConfig = defaultConfig(props.editorId)
      const config = Object.assign(_defaultConfig, props.editorConfig)

      setTimeout(async() => {
        await window.tinymce.init(config)
        const _defaultContent = unref(props.defaultContent)
        if (_defaultContent) {
          window.tinymce.get(props.editorId).setContent(_defaultContent)
        }
      }, 20)
    })
    // 对外接口
    const getHtml = (type = 'details') => {
      const _tinymce = window.tinymce.get(props.editorId)
      if (!_tinymce) {
        return ''
      }

      const htmlStr = _tinymce.getContent()

      return type === 'details' ? parseHtml(htmlStr) : htmlStr
    }

    const parseHtml = (htmlStr) => {
      const doc = new DOMParser().parseFromString(htmlStr, 'text/html')
      const nodes = doc.childNodes[0].childNodes[1].childNodes
      const details = []
      nodes.forEach(el => {
        if ((el.tagName === 'P' || el.tagName === 'IMAGE')) {
          console.log()
          if (el.innerText) {
            details.push({ type: 'text', content: el.innerText })
          }
          const imgs = el.getElementsByTagName('IMG')
          for (let i = 0; i < imgs.length; i++) {
            const imgEl = imgs[i]
            details.push({ type: 'image', content: imgEl.getAttribute('src') })
          }
        }
      })

      return details
    }

    const setContent = (html) => {
      const _tinymce = window.tinymce.get(props.editorId)
      if (!_tinymce) {
        return ''
      }

      _tinymce.setContent(html)
    }
    return {
      props,
      getHtml,
      setContent
    }
  }
}
</script>
