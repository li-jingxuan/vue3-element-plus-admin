<template>
  <el-dialog
    :title="title"
    v-model="staffDialogShow"
    :close-on-click-modal="false"
    :before-close="beforeClose"
    :width="560"
  >
    <div v-loading="loading">
      <el-form
        :model="staffForm"
        ref="staffFormRefs"
        :rules="staffRules"
        label-position="left"
        hide-required-asterisk
        label-suffix="："
        label-width="120px"
      >
        <el-form-item :label="$t('permissions.staffId')" v-if="disabled">
          <span>{{ staffId }}</span>
        </el-form-item>
        <el-form-item :label="$t('permissions.account')" prop="account">
          <el-input
            :disabled="disabled"
            clearable
            v-model="staffForm.account"
            style="width: 70%"
            size="small"
          />
        </el-form-item>
        <el-form-item :label="$t('permissions.trueName')" prop="trueName">
          <el-input clearable v-model="staffForm.trueName" style="width: 70%" size="small" />
        </el-form-item>
        <el-form-item :label="$t('permissions.passWord')" prop="password">
          <el-input
            :placeholder="passwordPlaceholder"
            type="password"
            clearable
            v-model.trim="staffForm.password"
            style="width: 70%"
            size="small"
            show-password
          />
          <el-tooltip
            v-if="disabled"
            class="item"
            effect="light"
            :content="$t('permissions.passWordTip')"
            placement="top"
          >
            <span class="passwordIcon"><i class="el-icon-question"></i></span>
          </el-tooltip>
        </el-form-item>
        <el-form-item :label="$t('permissions.rePassWord')" prop="rePassword">
          <el-input
            :placeholder="passwordPlaceholder"
            type="password"
            clearable
            v-model.trim="staffForm.confirmPassword"
            style="width: 70%"
            size="small"
            show-password
          />
        </el-form-item>
        <el-form-item :label="$t('permissions.status')">
          <el-radio-group v-model="staffForm.enabled">
            <el-radio :label="true">{{ $t('permissions.active') }}</el-radio>
            <el-radio :label="false">{{ $t('permissions.locked') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('permissions.identity')">
          <el-radio-group v-model="staffForm.role">
            <el-radio label="admin">{{ $t('permissions.admin') }}</el-radio>
            <el-radio label="pm">{{ $t('permissions.pm') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button size="small" class="cancel-btn" @click="beforeClose">
          {{ $t('permissions.cancel') }}
        </el-button>
        <el-button @click="saveHanldClick" style="width: 64px" type="primary" size="small">
          {{ $t('permissions.submit') }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import { editManageAccount, addManageAccount } from '@/api/permissions'
import { useMessage } from '@/utils/messager'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  emits: ['refreshList'],
  setup(props, context) {
    const { t } = useI18n()
    const loading = ref(false)
    const staffDialogShow = ref(false) // 对话框显示隐藏
    const $msg = useMessage()
    const staffForm = reactive({
      account: '',
      trueName: '',
      password: '',
      confirmPassword: '',
      enabled: true,
      role: 'admin'
    })

    // 密码校验规则
    const validatorPassWord = (rule, value, callback) => {
      const editPasswordReg = /^$|.{6,30}$/
      const addPasswordRegs = /^.{6,30}$/
      if (disabled.value) {
        if (!editPasswordReg.test(value)) {
          callback(new Error(t('permissions.passWordRule1')))
        }
      } else {
        if (!addPasswordRegs.test(value)) {
          callback(new Error(t('permissions.passWordRule2')))
        }
      }
      callback()
    }

    const validatorRePassWord = (rule, value, callback) => {
      if (staffForm.confirmPassword !== staffForm.password) {
        callback(new Error(t('permissions.passWordRule3')))
      }
      callback()
    }

    const staffRules = {
      account: [
        {
          required: true,
          message: t('permissions.userNameRule'),
          trigger: 'blur'
        }
      ],
      trueName: [
        {
          required: true,
          message: t('permissions.trueNameRule'),
          trigger: 'blur'
        }
      ],
      password: [{ validator: validatorPassWord, trigger: 'change' }],
      rePassword: [{ validator: validatorRePassWord, trigger: 'change' }]
    }

    // 对话框打开
    const staffId = ref(null)
    const title = ref(t('permissions.addTitle'))
    const passwordPlaceholder = ref('')
    const disabled = ref(false)
    const turnOnDialog = (row) => {
      staffDialogShow.value = true
      if (row) {
        title.value = t('permissions.editTitle')
        disabled.value = true
        passwordPlaceholder.value = '*'.repeat(12)
        // 表单赋值
        staffId.value = row.id
        staffForm.account = row.account
        staffForm.trueName = row.trueName
        staffForm.password = ''
        staffForm.state = row.state
      } else {
        disabled.value = false
      }
    }

    // 对话框关闭
    const staffFormRefs = ref(null)
    const beforeClose = () => {
      title.value = t('permissions.addTitle')
      passwordPlaceholder.value = ''
      staffDialogShow.value = false
      // 重置表单
      staffFormRefs.value.resetFields()
      staffForm.account = ''
      staffForm.trueName = ''
      staffForm.password = ''
      staffForm.confirmPassword = ''
      staffForm.state = 1
    }

    // 修改
    const editAccount = (query) => {
      loading.value = true
      editManageAccount(query)
        .then((res) => {
          $msg.sysSuccess()
          context.emit('refreshList')
          beforeClose()
        })
        .catch((err) => {
          $msg.messageError(err)
        })
        .finally(() => {
          loading.value = false
        })
    }

    // 添加
    const addAccount = (query) => {
      loading.value = true
      addManageAccount(query)
        .then((res) => {
          $msg.sysSuccess()
          context.emit('refreshList')
          beforeClose()
        })
        .catch((err) => {
          $msg.messageError(err)
        })
        .finally(() => {
          loading.value = false
        })
    }

    // 保存
    const saveHanldClick = () => {
      staffFormRefs.value.validate(async(valid) => {
        if (!valid) {
          return
        }
        if (!disabled.value) {
          addAccount(staffForm)
        } else {
          const params = {}
          for (const key in staffForm) {
            if (staffForm[key] !== '') {
              params[key] = staffForm[key]
            }
          }
          params.accountId = staffId.value
          // const params = { data: _s, id: staffId.value }
          editAccount(params)
        }
      })
    }

    return {
      // data
      loading,
      staffId,
      title,
      passwordPlaceholder,
      disabled,
      staffDialogShow,
      staffForm,
      staffFormRefs,
      staffRules,
      //   methods
      beforeClose,
      turnOnDialog,
      saveHanldClick
    }
  }
})
</script>

<style lang="scss" scoped>
.passwordIcon {
  margin-left: 10px;
  position: relative;
  top: 3px;
  font-size: 20px;
  color: rgb(250, 133, 0);
}
.cancel-btn {
  width: 64px;
  margin-right: 12px;
}
</style>
