import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useNavigate } from 'react-router-dom'

// Inicialização do cliente Supabase
// Em produção, essas chaves deveriam vir de variáveis de ambiente
const supabaseUrl = 'https://example.supabase.co' // Este é um URL de exemplo
const supabaseKey = 'your-supabase-key' // Esta é uma chave de exemplo
const supabase = createClient(supabaseUrl, supabaseKey)

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Modo de demonstração para fins de desenvolvimento
  const [mockUser, setMockUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Em um ambiente real, verificaríamos a sessão com o Supabase
    // Como estamos no modo de demonstração, vamos apenas configurar o estado inicial
    setLoading(false)
    
    // Verificar se há um usuário mockado no localStorage (para persistência na demonstração)
    const savedMockUser = localStorage.getItem('mockUser')
    if (savedMockUser) {
      try {
        const parsedUser = JSON.parse(savedMockUser)
        setMockUser(parsedUser)
        setIsAuthenticated(true)
      } catch (e) {
        localStorage.removeItem('mockUser')
      }
    }
  }, [])

  // Função para login (modo de demonstração)
  async function login(email, password) {
    try {
      // Validação básica
      if (!email) {
        return { data: null, error: { message: 'Email é obrigatório' } }
      }
      if (!password) {
        return { data: null, error: { message: 'Senha é obrigatória' } }
      }
      
      // Em um ambiente real, isso seria verificado pelo Supabase
      // Para demo, aceitamos qualquer combo de email/senha válido
      if (password.length < 6) {
        return { data: null, error: { message: 'Senha deve ter pelo menos 6 caracteres' } }
      }
      
      // Criar usuário mockado
      const mockUserData = {
        id: 'demo-user-id',
        email: email,
        name: email.split('@')[0],
        created_at: new Date().toISOString(),
      }
      
      setMockUser(mockUserData)
      setIsAuthenticated(true)
      localStorage.setItem('mockUser', JSON.stringify(mockUserData))
      
      return { data: { user: mockUserData }, error: null }
    } catch (error) {
      return { data: null, error: { message: 'Erro no login' } }
    }
  }

  // Função para cadastro (modo de demonstração)
  async function signup(email, password, metadata) {
    try {
      // Validação básica
      if (!email) {
        return { data: null, error: { message: 'Email é obrigatório' } }
      }
      if (!password) {
        return { data: null, error: { message: 'Senha é obrigatória' } }
      }
      if (password.length < 6) {
        return { data: null, error: { message: 'Senha deve ter pelo menos 6 caracteres' } }
      }
      
      // Criar usuário mockado
      const mockUserData = {
        id: 'demo-user-id',
        email: email,
        name: metadata?.name || email.split('@')[0],
        created_at: new Date().toISOString(),
        ...metadata
      }
      
      setMockUser(mockUserData)
      setIsAuthenticated(true)
      localStorage.setItem('mockUser', JSON.stringify(mockUserData))
      
      return { data: { user: mockUserData }, error: null }
    } catch (error) {
      return { data: null, error: { message: 'Erro no cadastro' } }
    }
  }

  // Função para logout (modo de demonstração)
  async function logout() {
    setMockUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('mockUser')
    return { error: null }
  }

  // Função para recuperação de senha (modo de demonstração)
  async function resetPassword(email) {
    try {
      if (!email) {
        return { data: null, error: { message: 'Email é obrigatório' } }
      }
      
      // Simular sucesso
      return { data: { success: true }, error: null }
    } catch (error) {
      return { data: null, error: { message: 'Erro na recuperação de senha' } }
    }
  }

  const value = {
    user: mockUser,
    isAuthenticated,
    login,
    signup,
    logout,
    resetPassword,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}