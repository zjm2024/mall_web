// 表单验证规则

// 手机号验证
export const validatePhone = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入手机号'))
  }
  const reg = /^1[3-9]\d{9}$/
  if (!reg.test(value)) {
    return callback(new Error('请输入正确的手机号'))
  }
  callback()
}

// 邮箱验证
export const validateEmail = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入邮箱'))
  }
  const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!reg.test(value)) {
    return callback(new Error('请输入正确的邮箱'))
  }
  callback()
}

// 密码验证
export const validatePassword = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入密码'))
  }
  if (value.length < 6) {
    return callback(new Error('密码长度不能少于6位'))
  }
  if (value.length > 20) {
    return callback(new Error('密码长度不能超过20位'))
  }
  callback()
}

// 身份证验证
export const validateIdCard = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入身份证号'))
  }
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (!reg.test(value)) {
    return callback(new Error('请输入正确的身份证号'))
  }
  callback()
}

// 金额验证（支持两位小数）
export const validateAmount = (rule, value, callback) => {
  if (!value && value !== 0) {
    return callback(new Error('请输入金额'))
  }
  const reg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
  if (!reg.test(value)) {
    return callback(new Error('请输入正确的金额，最多两位小数'))
  }
  callback()
}

// 正整数验证
export const validatePositiveInteger = (rule, value, callback) => {
  if (!value && value !== 0) {
    return callback(new Error('请输入数值'))
  }
  const reg = /^[1-9]\d*$/
  if (!reg.test(value)) {
    return callback(new Error('请输入正整数'))
  }
  callback()
}

// URL 验证
export const validateUrl = (rule, value, callback) => {
  if (!value) {
    return callback()
  }
  const reg = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/
  if (!reg.test(value)) {
    return callback(new Error('请输入正确的URL地址'))
  }
  callback()
}

// 中文验证
export const validateChinese = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入内容'))
  }
  const reg = /^[\u4e00-\u9fa5]+$/
  if (!reg.test(value)) {
    return callback(new Error('请输入中文'))
  }
  callback()
}

// 数字和字母验证
export const validateAlphanumeric = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入内容'))
  }
  const reg = /^[a-zA-Z0-9]+$/
  if (!reg.test(value)) {
    return callback(new Error('只能输入数字和字母'))
  }
  callback()
}

// 表单验证规则生成器
export const createRules = (rulesConfig) => {
  const rules = {}
  
  Object.keys(rulesConfig).forEach(field => {
    const config = rulesConfig[field]
    rules[field] = []
    
    // 必填验证
    if (config.required) {
      rules[field].push({
        required: true,
        message: config.message || `${config.label || field}不能为空`,
        trigger: config.trigger || 'blur'
      })
    }
    
    // 类型验证
    if (config.type) {
      const typeValidators = {
        phone: validatePhone,
        email: validateEmail,
        password: validatePassword,
        idCard: validateIdCard,
        amount: validateAmount,
        positiveInteger: validatePositiveInteger,
        url: validateUrl,
        chinese: validateChinese,
        alphanumeric: validateAlphanumeric
      }
      
      if (typeValidators[config.type]) {
        rules[field].push({
          validator: typeValidators[config.type],
          trigger: config.trigger || 'blur'
        })
      }
    }
    
    // 长度验证
    if (config.min || config.max) {
      rules[field].push({
        min: config.min,
        max: config.max,
        message: config.lengthMessage || 
          (config.min && config.max ? `${config.label || field}长度在${config.min}到${config.max}之间` :
          config.min ? `${config.label || field}长度不能少于${config.min}` :
          `${config.label || field}长度不能超过${config.max}`),
        trigger: config.trigger || 'blur'
      })
    }
    
    // 自定义验证
    if (config.validator) {
      rules[field].push({
        validator: config.validator,
        trigger: config.trigger || 'blur'
      })
    }
  })
  
  return rules
}

// 快速创建 Element Plus 表单验证规则
export const createFormRules = (fields) => {
  return Object.keys(fields).reduce((rules, field) => {
    const config = fields[field]
    rules[field] = []
    
    if (config.required) {
      rules[field].push({
        required: true,
        message: config.message || '此项为必填项',
        trigger: config.trigger || 'blur'
      })
    }
    
    if (config.pattern) {
      rules[field].push({
        pattern: config.pattern,
        message: config.patternMessage || '格式不正确',
        trigger: config.trigger || 'blur'
      })
    }
    
    return rules
  }, {})
}

export default {
  validatePhone,
  validateEmail,
  validatePassword,
  validateIdCard,
  validateAmount,
  validatePositiveInteger,
  validateUrl,
  validateChinese,
  validateAlphanumeric,
  createRules,
  createFormRules
}