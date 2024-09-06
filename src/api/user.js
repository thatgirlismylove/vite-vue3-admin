import request from '@/utils/request'

// 登录接口
export const login = (data) => {
  const formData = new FormData()
  formData.append('username', data.username)
  formData.append('password', data.password)
  formData.append('captchaKey', data.captchaKey || '')
  formData.append('captchaCode', data.captchaCode || '')
  return request({
    url: '/api/v1/auth/login',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function logoutApi() {
  return request({
    url: '/api/v1/auth/logout',
    method: 'delete'
  })
}
