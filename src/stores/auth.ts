import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: number
  email: string
  name: string
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Initialize user from localStorage
  try {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  } catch (err) {
    console.error('Failed to parse user from localStorage', err)
  }

  // In a real app, this would call an API
  async function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock successful login
      if (credentials.email === 'user@example.com' && credentials.password === 'password') {
        const userData = {
          id: 1,
          email: credentials.email,
          name: 'John Doe'
        }
        
        user.value = userData
        localStorage.setItem('user', JSON.stringify(userData))
        return true
      } else {
        throw new Error('Invalid email or password')
      }
    } catch (err: any) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(data: RegisterData) {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock successful registration
      const userData = {
        id: 1,
        email: data.email,
        name: data.name
      }
      
      user.value = userData
      localStorage.setItem('user', JSON.stringify(userData))
      return true
    } catch (err: any) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('user')
  }

  return {
    user,
    loading,
    error,
    login,
    register,
    logout
  }
})