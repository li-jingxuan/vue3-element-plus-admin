<template>
  <div>
    <el-drawer
      :title="$t('permissions.permissionConfig')"
      v-model="drawerShow"
      destroy-on-close
      size="35%"
      :before-close="handleClose"
      @open="openDrawer"
    >
      <div v-loading="loading">
        <div class="staff-info">
          <span class="subtitle">{{ $t('permissions.staffInfo') }}：</span>
          <span class="item">{{ staffDatas.id }}</span>
          <span class="item">{{ staffDatas.userName }}</span>
          <span class="item">{{ staffDatas.trueName }}</span>
        </div>
        <div class="content">
          <el-divider />
          <div class="checkbox-area">
            <div
              v-for="(menuItem1, index) in routerCopy"
              :key="index"
              :class="setMenuItem1Class(menuItem1)"
            >
              <!-- 菜单标题 -->
              <div class="space-between" v-if="menuItem1.name !== 'dashboard'">
                <span>
                  <i :class="`${menuItem1.icon}`"></i>
                  <span style="margin-left: 5px">{{ menuItem1.title }}</span>
                </span>
              </div>
              <div v-for="(menuItem2, index2) in menuItem1.children" :key="index2">
                <div style="margin-left: 25px">
                  <!-- 二级 -->
                  <el-checkbox-group
                    v-model="checkedList"
                    class="menuItem2-checkbox"
                    :disabled="isSuperuser"
                  >
                    <el-checkbox :label="menuItem2.id" v-if="!menuItem2.meta.hidden">
                      {{ menuItem2.meta.title }}
                    </el-checkbox>
                    <!-- 三级 -->
                    <div v-if="menuItem2.permissionChild" style="margin-left: 40px">
                      <el-checkbox
                        class="menuItem3-checkbox"
                        v-for="(menuItem3, index3) in menuItem2.permissionChild"
                        :key="index3"
                        :label="menuItem3.id"
                      >
                        {{ menuItem3.name }}
                      </el-checkbox>
                    </div>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="update">
        <el-button class="update-btn" size="small" @click="updatePermission">
          {{ $t('permissions.update') }}
        </el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import router from '@/router'
import { useMessage } from '@/utils/messager'
import { defineComponent, ref, watch } from 'vue'
import { getPermissions, editPermission } from '@/api/permissions'
export default defineComponent({
  emits: ['drawerClose'],
  name: 'AuthorityDrawer',
  props: {
    authorityShow: {
      type: Boolean,
      default: false
    },
    staffDatas: {
      type: Object,
      default: () => {}
    }
  },

  setup(props, context) {
    const loading = ref(false)
    const $msg = useMessage()

    const drawerShow = ref(false)
    watch(
      () => props.authorityShow,
      () => {
        drawerShow.value = props.authorityShow
      }
    )

    const routerCopy = ref(null)
    const isSuperuser = ref(false)
    // 抽屉打开
    const openDrawer = () => {
      routerCopy.value = JSON.parse(JSON.stringify(router.sidebarConfig))
      isSuperuser.value = props.staffDatas.isSuperuser
      getPermissionList(props.staffDatas.id)
    }

    // 抽屉关闭
    const handleClose = () => {
      checkedList.value = []
      context.emit('drawerClose')
    }

    // 样式处理
    const setMenuItem1Class = (menuItem1) => {
      if (menuItem1.name !== 'dashboard') {
        return 'menuItem1'
      }
    }

    // 查询已有权限
    const checkedList = ref([])
    let permission = [] // 用于渲染的权限树结构
    const getPermissionList = (staffId) => {
      loading.value = true
      getPermissions({ accountId: staffId })
        .then((res) => {
          permission = menuTreeProcess(res.permissions, 0)
          newPermissionList()
          res.permissions.forEach((item) => {
            if (item.havePermission) {
              checkedList.value.push(item.id)
            }
          })
        })
        .catch((err) => {
          $msg.messageError(err)
          handleClose()
        })
        .finally(() => {
          loading.value = false
        })
    }

    // 修改用户权限
    const updatePermission = () => {
      loading.value = true
      const params = {
        staffId: props.staffDatas.id,
        permissionIds: checkedList.value
      }
      editPermission(params)
        .then((res) => {
          $msg.sysSuccess()
          handleClose()
        })
        .catch((err) => {
          $msg.messageError(err)
        })
        .finally(() => {
          loading.value = false
        })
    }

    // 路由菜单与权限树重组
    const newPermissionList = () => {
      routerCopy.value.forEach((item) => {
        if (item.children) {
          for (let i = 0; i < item.children.length; i++) {
            const _c = item.children[i]

            if (_c.children) {
              for (let z = 0; z < _c.children.length; z++) {
                const _z = _c.children[z]

                if (_z.children) {
                  for (let v = 0; v < _c.children.length; v++) {
                    const _v = _z.children[v]
                    setPermissionParent(_v)
                  }
                } else {
                  setPermissionParent(_z)
                }
              }
            } else {
              setPermissionParent(_c)
            }
          }
        }
      })
    }
    const setPermissionParent = (permissionValue) => {
      for (let i = 0; i < permission.length; i++) {
        const pCode = permission[i].code
        if (pCode === permissionValue.meta.permission) {
          permissionValue.havePermission = permission[i].havePermission
          permissionValue.id = permission[i].id
          permissionValue.permissionChild = permission[i].children || []
          break
        }
      }
    }
    // 树型结构处理
    const menuTreeProcess = (permissions, parentId) => {
      const parentObj = {}
      permissions.forEach((item) => {
        parentObj[item.id] = item
      })
      if (!parentId) {
        return permissions
          .filter((item) => !parentObj[item.parentId])
          .map((item) => {
            item.children = menuTreeProcess(permissions, item.id)
            return item
          })
      } else {
        return permissions
          .filter((item) => item.parentId === parentId)
          .map((item) => {
            item.children = menuTreeProcess(permissions, item.id)
            return item
          })
      }
    }

    return {
      // data
      loading,
      drawerShow,
      routerCopy,
      checkedList,
      isSuperuser,
      // method
      handleClose,
      setMenuItem1Class,
      openDrawer,
      updatePermission
    }
  }
})
</script>

<style lang="scss" scoped>
.space-between {
  display: flex;
  justify-content: space-between;
}

.staff-info {
  padding: 0 20px 0;
  .subtitle {
    font-size: 14px;
    font-weight: bold;
    color: #999;
    margin-right: 10px;
  }
  .item {
    margin-right: 50px;
  }
}

.content {
  padding: 0 20px 0;
  height: calc(100vh - 160px);
  .checkbox-area {
    .menuItem1 {
      margin-bottom: 10px;
      padding: 5px 10px;
      background-color: #f5f7fa;
      .menuItem2-checkbox {
        margin: 15px 0;
      }
      .menuItem3-checkbox {
        margin: 15px 15px 10px 0;
      }
    }
  }
  .update {
    text-align: right;
    width: 100%;
    position: absolute;
    bottom: 0;
    right: 0;
    border-top: 1px solid #e8e8e8;
    background: white;
    padding: 8px 30px;
    .update-btn {
      width: 90px;
      height: 36px;
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>
