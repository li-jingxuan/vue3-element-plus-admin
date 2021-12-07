<template>
  <div class="login-wrapper">
    <div class="title">
      <img class="title-img" src="../assets/img/login/login-title.png" alt="" />
    </div>
    <div class="login-form-box">
      <div class="login-box">
        <div class="title-text">{{ $t('loginLang.loginTitle') }}</div>
        <el-form ref="loginFormRef" :model="loginParams" :rules="loginParamsRule">
          <el-form-item prop="username">
            <el-input
              :placeholder="$t('loginLang.pleaseInputAccount')"
              v-model.trim="loginParams.username"
            >
              <template #prefix>
                <img class="unlock" src="../assets/img/login/user.png" alt="" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :placeholder="$t('loginLang.pleaseInputPassWord')"
              v-model.trim="loginParams.password"
              style="height: 48px"
              @focus="pwdIconShow = true"
              @blur="pwdIconShow = false"
              :type="!pwdToggle ? 'password' : 'default'"
              id="task"
            >
              <template #prefix>
                <img class="unlock" src="../assets/img/login/unlock.png" alt="" />
              </template>
              <template #suffix>
                <div
                  v-if="pwdIconShow"
                  @click="pwdToggle = !pwdToggle"
                  @mousedown.prevent
                  @mouseup.prevent="mouseup"
                >
                  <img
                    v-if="pwdToggle"
                    class="password"
                    src="../assets/img/login/password.png"
                    alt=""
                  />
                  <img v-else class="password" src="../assets/img/login/password-off.png" alt="" />
                </div>
              </template>
            </el-input>
          </el-form-item>
        </el-form>

        <el-button type="primary" class="login-btn" @click="handleLoginClick">
          {{ $t('loginLang.register') }}
        </el-button>
      </div>
    </div>
    <div class="tips">Copyright 2021 XXXX, All rights reserved.</div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useMessage } from '@/utils/messager'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  setup() {
    const $router = useRouter()
    const $msg = useMessage()
    const $store = useStore()
    const { t } = useI18n()
    const loginParams = reactive({
      username: '',
      password: ''
    })
    const loginParamsRule = {
      username: [
        {
          required: true,
          message: t('loginLang.inputAccount'),
          trigger: 'blur'
        },
        {
          min: 2,
          max: 64,
          message: t('loginLang.accountChange'),
          trigger: 'blur'
        }
      ],
      password: [
        {
          required: true,
          message: t('loginLang.inputPassword'),
          trigger: 'blur'
        },
        {
          min: 2,
          max: 64,
          message: t('loginLang.accountChange'),
          trigger: 'blur'
        }
      ]
    }

    const loginFormRef = ref(null)
    // 进行登录
    const handleLoginClick = () => {
      loginFormRef.value.validate(async(valid) => {
        if (!valid) {
          return
        }
        const loading = $msg.fullLoading()
        try {
          await $store.dispatch('loginAction', {
            ...loginParams
          })
          $router.push('/dashboard')
        } catch (e) {
          $msg.messageError(e)
        } finally {
          loading.close()
        }
      })
    }

    const pwdIconShow = ref(false)
    const pwdToggle = ref(false)
    // 让光标始终保持在末尾
    const mouseup = () => {
      nextTick(() => {
        const length = loginParams.password.length
        const task = document.getElementById('task')
        task.focus()
        task.selectionStart = length
        task.selectionEnd = length
      })
    }

    return {
      loginParams,
      loginFormRef,
      loginParamsRule,
      handleLoginClick,
      pwdIconShow,
      mouseup,
      pwdToggle
    }
  }
})
</script>

<style lang="scss" scoped>
.login-wrapper {
  height: 100vh;
  width: 100%;
  position: relative;
  background-image: url('../assets/img/login/login-bj.jpg');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100% 50%;
  background-position: top;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .title-text {
    color: #409eff;
    font-size: 22px;
    font-weight: 700;
    margin: 10px 0 32px 0;
    letter-spacing: 2px;
  }
  .login-form-box {
    margin-top: 20px;
    margin-bottom: 150px;
    padding: 28px;
    width: 392px;
    height: 353px;
    border-radius: 4px;
    background-color: rgba(246, 246, 246, 0.5);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: #b9b7b7 0px 0px 6px;
    .login-box {
      padding: 24px;
      width: 100%;
      height: 100%;
      background-color: #fff;
      box-sizing: border-box;
      box-shadow: #b9b7b7 0px 0px 6px;
      .unlock {
        width: 18px;
        height: 18px;
        margin-left: 3px;
      }
      .password {
        width: 18px;
        height: 18px;
        margin-right: 8px;
      }
      .login-btn {
        width: 100%;
        height: 48px;
      }
    }
  }
}
.title {
  .title-img {
    width: 361px;
    height: 55px;
  }
}
.tips {
  font-size: 14px;
  position: absolute;
  bottom: 1%;
  color: #666565;
}
:deep(.el-input__suffix),
:deep(.el-input__prefix) {
  line-height: 55px;
}
:deep(.el-input--prefix .el-input__inner) {
  height: 48px;
}
:deep(.el-form-item) {
  margin-bottom: 20px;
}
</style>
