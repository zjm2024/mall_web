<template>
  <div class="login-container">
    <div class="login-card">
      <!-- 登录标题 -->
      <div class="login-header">
        <h2>欢迎登录</h2>
        <p class="subtitle">请输入您的账号信息</p>
      </div>

      <!-- 登录表单 -->
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- 账号 -->
        <div class="form-item">
          <label for="userNo">账号</label>
          <div class="input-with-icon">
            <i class="icon">👤</i>
            <input id="userNo" v-model="form.userNo" type="text" placeholder="账号" class="form-input"
              :class="{ 'input-error': errors.userNo }" @input="clearError('userNo')" />
          </div>
          <div v-if="errors.userNo" class="error-message">
            {{ errors.userNo }}
          </div>
        </div>

        <!-- 密码输入 -->
        <div class="form-item">
          <div class="label-row">
            <label for="password">密码</label>
            <a href="#" class="forgot-link" @click.prevent="handleForgotPassword">
              忘记密码?
            </a>
          </div>
          <div class="input-with-icon">
            <i class="icon">🔒</i>
            <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="请输入密码"
              class="form-input" :class="{ 'input-error': errors.password }" @input="clearError('password')" />
            <button type="button" class="password-toggle" @click="togglePasswordVisibility">
              <i class="toggle-icon">{{ showPassword ? '🙈' : '👁️' }}</i>
            </button>
          </div>
          <div v-if="errors.password" class="error-message">
            {{ errors.password }}
          </div>
        </div>

        <!-- 记住我选项 -->
        <div class="checkbox-item">
          <input type="checkbox" id="rememberMe" v-model="form.rememberMe" />
          <label for="rememberMe">记住我</label>
        </div>

        <!-- 登录按钮 -->
        <button type="submit" class="login-btn" :disabled="isSubmitting" :class="{ 'btn-loading': isSubmitting }">
          <span v-if="!isSubmitting">登录</span>
          <span v-else class="loading-text">
            <span class="loading-dots">...</span> 登录中
          </span>
        </button>

        <!-- 注册链接 -->
        <div class="register-link">
          还没有账号?
          <a href="#" @click.prevent="handleRegister">立即注册</a>
        </div>
      </form>

      <!-- 底部信息 -->
      <div class="login-footer">
        <p>© 2024 系统平台 · 版本 2.1.0</p>
        <div class="footer-links">
          <a href="#" @click.prevent="handleHelp">帮助中心</a>
          <span class="separator">|</span>
          <a href="#" @click.prevent="handlePrivacy">隐私政策</a>
          <span class="separator">|</span>
          <a href="#" @click.prevent="handleTerms">服务条款</a>
        </div>
      </div>
    </div>

    <!-- 背景装饰 -->
    <div class="decoration-circle circle-1"></div>
    <div class="decoration-circle circle-2"></div>
    <div class="decoration-circle circle-3"></div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { login } from '../../utils/auth'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()


// 表单数据
const form = reactive({
  userNo: '',
  password: '',
  rememberMe: false
})

// 表单错误信息
const errors = reactive({
  userNo: '',
  password: ''
})

// UI状态
const showPassword = ref(false)
const isSubmitting = ref(false)

// 清除错误信息
const clearError = (field) => {
  if (errors[field]) {
    errors[field] = ''
  }
}

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 表单验证
const validateForm = () => {
  let isValid = true

  // 清空之前的错误
  Object.keys(errors).forEach(key => errors[key] = '')

  // 验证账号
  if (!form.userNo.trim()) {
    errors.userNo = '请输入账号'
    isValid = false
  } else if (form.userNo.length < 3) {
    errors.userNo = '账号至少3个字符'
    isValid = false
  }

  // 验证密码
  if (!form.password) {
    errors.password = '请输入密码'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = '密码至少6个字符'
    isValid = false
  }

  return isValid
}

// 登录处理
const handleLogin = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    // 调用登录API
    const response = await login(form.userNo, form.password)


    if (response.flag === 1) {

      userStore.login("token", response.result)

      ElMessage.success({
        message: `欢迎回来，${response.result.realName}！`,
        duration: 2000
      })

      // 获取重定向地址，如果没有则跳转到首页
      const redirect = route.query.redirect || '/dashboard'

      // 短暂延迟后跳转，让用户看到成功消息
      setTimeout(() => {
        router.push(redirect)
      }, 500)
    } else {
      ElMessage.error(response.message || '登录失败')
    }


  } catch (error) {
    alert('登录失败:' + error)
  } finally {
    isSubmitting.value = false
  }
}

// 其他交互处理函数
const handleForgotPassword = () => {
  alert('忘记密码功能开发中...')
}

const handleRegister = () => {
  alert('注册功能开发中...')
}

const handleWechatLogin = () => {
  alert('微信登录功能开发中...')
}

const handleQQLogin = () => {
  alert('QQ登录功能开发中...')
}

const handleHelp = () => {
  alert('帮助中心功能开发中...')
}

const handlePrivacy = () => {
  alert('隐私政策页面开发中...')
}

const handleTerms = () => {
  alert('服务条款页面开发中...')
}

// 组件挂载后，尝试从本地存储恢复记住的用户名
onMounted(() => {
  const savedUserNo = localStorage.getItem('rememberedUserNo')
  if (savedUserNo) {
    form.userNo = savedUserNo
    form.rememberMe = true
  }
})
</script>

<style scoped>
/* 容器样式 */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* 主卡片 */
.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 420px;
  z-index: 10;
  position: relative;
}

/* 标题区域 */
.login-header {
  margin-bottom: 32px;
  text-align: center;
}

.login-header h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  color: #333;
  font-weight: 600;
}

.login-header .subtitle {
  margin: 0;
  color: #666;
  font-size: 14px;
}

/* 登录表单 */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 表单项 */
.form-item {
  display: flex;
  flex-direction: column;
}

.form-item label {
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.forgot-link {
  font-size: 13px;
  color: #1890ff;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #40a9ff;
  text-decoration: underline;
}

/* 输入框带图标 */
.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.icon {
  position: absolute;
  left: 12px;
  font-size: 16px;
  color: #999;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
}

.form-input.input-error {
  border-color: #ff4d4f;
}

.form-input.input-error:focus {
  box-shadow: 0 0 0 3px rgba(255, 77, 79, 0.1);
}

/* 密码显示切换按钮 */
.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #999;
  transition: color 0.2s;
}

.password-toggle:hover {
  color: #666;
}

.toggle-icon {
  font-size: 16px;
  display: block;
}

/* 错误信息 */
.error-message {
  margin-top: 6px;
  font-size: 12px;
  color: #ff4d4f;
}

/* 复选框 */
.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: -8px;
}

.checkbox-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  cursor: pointer;
}

.checkbox-item label {
  margin: 0;
  color: #666;
  font-size: 14px;
  cursor: pointer;
}

/* 登录按钮 */
.login-btn {
  padding: 14px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 8px;
}

.login-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-loading {
  position: relative;
}

.loading-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.loading-dots {
  display: inline-block;
  animation: loadingDots 1.5s infinite;
}

@keyframes loadingDots {

  0%,
  20% {
    opacity: 0.2;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.2;
  }
}

/* 注册链接 */
.register-link {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.register-link a {
  color: #1890ff;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
  transition: color 0.2s;
}

.register-link a:hover {
  color: #40a9ff;
  text-decoration: underline;
}

/* 分隔线 */
.divider {
  position: relative;
  text-align: center;
  margin: 20px 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #eee;
}

.divider-text {
  position: relative;
  background: white;
  padding: 0 12px;
  color: #999;
  font-size: 12px;
}

/* 社交登录 */
.social-login {
  display: flex;
  gap: 12px;
}

.social-btn {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.social-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.social-btn.wechat:hover {
  border-color: #07c160;
  background: rgba(7, 193, 96, 0.05);
}

.social-btn.qq:hover {
  border-color: #12b7f5;
  background: rgba(18, 183, 245, 0.05);
}

.social-icon {
  font-size: 16px;
}

/* 底部信息 */
.login-footer {
  margin-top: 32px;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.login-footer p {
  margin: 0 0 12px 0;
  color: #999;
  font-size: 12px;
}

.footer-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.footer-links a {
  color: #666;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #1890ff;
  text-decoration: underline;
}

.separator {
  color: #ddd;
}

/* 背景装饰圆圈 */
.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.1) 0%, rgba(64, 169, 255, 0.05) 100%);
  z-index: 1;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -100px;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -80px;
  left: -80px;
}

.circle-3 {
  width: 150px;
  height: 150px;
  bottom: 100px;
  right: 100px;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }

  .login-header h2 {
    font-size: 24px;
  }

  .social-login {
    flex-direction: column;
  }

  .circle-1,
  .circle-2,
  .circle-3 {
    display: none;
  }
}
</style>