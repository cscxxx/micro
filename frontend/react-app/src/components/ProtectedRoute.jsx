import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  const remember = localStorage.getItem('remember')
  const tokenExpiration = localStorage.getItem('tokenExpiration')

  console.log('ProtectedRoute检查:', { token: !!token, user: !!user, path: location.pathname })

  // 检查是否有有效的token和用户信息
  if (!token || !user) {
    console.log('未找到token或用户信息，重定向到登录页')
    // 保存当前路径，登录后可以重定向回来
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 检查token是否过期
  if (remember && tokenExpiration) {
    const expirationTime = parseInt(tokenExpiration)
    if (Date.now() > expirationTime) {
      console.log('Token已过期，清除本地存储并重定向到登录页')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('remember')
      localStorage.removeItem('tokenExpiration')
      return <Navigate to="/login" state={{ from: location }} replace />
    }
  }

  try {
    // 验证用户信息是否有效
    const userData = JSON.parse(user)
    if (!userData || !userData.username) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('remember')
      localStorage.removeItem('tokenExpiration')
      return <Navigate to="/login" state={{ from: location }} replace />
    }
  } catch (error) {
    
    // 用户信息解析失败，清除并重定向到登录页
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('remember')
    localStorage.removeItem('tokenExpiration')
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
