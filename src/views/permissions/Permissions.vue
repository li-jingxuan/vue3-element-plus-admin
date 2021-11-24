<template>
  <Skeleton :title-text="$t('permissions.permissionsTitle')" :showTopSlot="false">
    <div class="tableHeader">
      <span>账号列表</span>
      <el-button class="addStaff" size="small" @click="addHanldClick()">
        + {{ $t('permissions.newStaff') }}
      </el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" :label="$t('permissions.staffId')" width="100" />
      <el-table-column prop="account" :label="$t('permissions.account')" min-width="160" />
      <el-table-column prop="trueName" :label="$t('permissions.trueName')" min-width="120" />
      <el-table-column prop="state" :label="$t('permissions.status')" width="120">
        <template #default="{ row }">
          <span :style="statusColor(row.state)">{{ statusConversion(row.state) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="role" :label="$t('permissions.identity')" width="120" />
      <el-table-column :label="$t('permissions.operation')" width="200">
        <template #default="{ row }">
          <el-button plain type="warning" size="small" @click="addHanldClick(row)">
            {{ $t('permissions.edit') }}
          </el-button>
          <el-button plain type="primary" size="small" @click="authority(row)">
            {{ $t('permissions.permission') }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('permissions.lastLoginiP')" min-width="150">
        <template #default="{ row }">
          <span>{{ row.lastLoginIp }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('permissions.lastLoginTime')" min-width="180">
        <template #default="{ row }">
          <span>{{ formatDate(row.lastLoginTime) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <SxPagination
      :total="total"
      :page="currentPage"
      :size="query.limit"
      @payload:change="handlePayloadChange"
    />
    <StaffDialog ref="staffRef" @refreshList="getAccountList" />
    <AuthorityDrawer
      :authorityShow="authorityShow"
      :staffDatas="staffDatas"
      @drawerClose="authorityShow = false"
    />
  </Skeleton>
</template>

<script>
import { ref, onMounted } from 'vue'
import { formatDate } from '@/utils/utils'
import { getManageAccount } from '@/api/permissions'
import { useI18n } from 'vue-i18n'
import { useMessage } from '@/utils/messager'
import StaffDialog from './widgets/StaffDialog'
import AuthorityDrawer from './widgets/AuthorityDrawer'
export default {
  name: 'Permissions',
  components: { StaffDialog, AuthorityDrawer },
  setup() {
    const $msg = useMessage()
    const { t } = useI18n()
    const tableData = ref([])
    const query = ref({
      skip: 0,
      limit: 10
    })
    const currentPage = ref(1)
    const total = ref(0)
    const loading = ref(false)
    const getAccountList = () => {
      loading.value = true
      getManageAccount(query.value)
        .then((res) => {
          tableData.value = res.accountList
          total.value = res.total
        })
        .catch((err) => {
          $msg.messageError(err)
        })
        .finally(() => {
          loading.value = false
        })
    }

    const statusConversion = (state) => {
      return state === 1 ? t('permissions.active') : t('permissions.locked')
    }

    const statusColor = (state) => {
      if (state === 1) {
        return { color: '#67C23A' }
      }
    }

    const handlePayloadChange = (payload) => {
      currentPage.value = payload.page
      query.value.limit = payload.size
      query.value.skip = (payload.page - 1) * query.value.limit
      getAccountList()
    }

    // 账号
    const staffRef = ref(null)
    const addHanldClick = (row) => {
      staffRef.value.turnOnDialog(row)
    }

    // 权限
    const authorityShow = ref(false)
    const staffDatas = ref({})
    const authority = (row) => {
      staffDatas.value = row
      authorityShow.value = true
    }

    onMounted(() => {
      getAccountList()
    })

    return {
      // data
      tableData,
      total,
      query,
      currentPage,
      loading,
      staffRef,
      authorityShow,
      staffDatas,
      // method
      formatDate,
      getAccountList,
      statusConversion,
      statusColor,
      handlePayloadChange,
      addHanldClick,
      authority
    }
  }
}
</script>

<style lang="scss" scoped>
.tableHeader {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  span {
    font-size: 18px;
    line-height: 36px;
  }
  .addStaff {
    width: 100px;
    height: 36px;
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
  }
}
</style>
