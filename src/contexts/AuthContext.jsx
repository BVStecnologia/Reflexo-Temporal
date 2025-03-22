import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { getUserProfile } from '../services/supabase'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  // Função para buscar o perfil do usuário
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await getUserProfile(userId)
      
      if (error) {
        console.error('Erro ao buscar perfil:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      return null
    }
  }

  useEffect(() => {
    // Função imediata para buscar a sessão atual
    const initAuth = async () => {
      setLoading(true)
      
      try {
        // Verificar se já existe uma sessão
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser(session.user)
          
          // Buscar o perfil do usuário
          const userProfile = await fetchUserProfile(session.user.id)
          setProfile(userProfile)
        }
      } catch (error) {
        console.error('Erro na inicialização da autenticação:', error)
      } finally {
        setLoading(false)
      }
      
      // Configurar o listener para mudanças de auth state
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setLoading(true)
          
          if (session?.user) {
            setUser(session.user)
            
            // Atualizar o perfil quando o estado de autenticação mudar
            const userProfile = await fetchUserProfile(session.user.id)
            setProfile(userProfile)
          } else {
            setUser(null)
            setProfile(null)
          }
          
          setLoading(false)
        }
      )
      
      return () => {
        subscription?.unsubscribe()
      }
    }
    
    initAuth()
  }, [])

  // Função para login com email/senha
  async function login(email, password) {
    setAuthError(null)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        setAuthError(error.message)
        return { data: null, error }
      }
      
      // Sucesso
      return { data, error: null }
    } catch (error) {
      setAuthError('Erro inesperado durante o login')
      return { data: null, error }
    }
  }
  
  // Função para login com Google
  async function loginWithGoogle() {
    setAuthError(null)
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      
      if (error) {
        setAuthError(error.message)
        return { data: null, error }
      }
      
      // Sucesso - Neste caso, o usuário será redirecionado para o Google
      return { data, error: null }
    } catch (error) {
      setAuthError('Erro inesperado durante o login com Google')
      return { data: null, error }
    }
  }

  // Função para cadastro
  async function signup(email, password, metadata) {
    setAuthError(null)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })
      
      if (error) {
        setAuthError(error.message)
        return { data: null, error }
      }
      
      // Sucesso
      return { data, error: null }
    } catch (error) {
      setAuthError('Erro inesperado durante o cadastro')
      return { data: null, error }
    }
  }

  // Função para logout
  async function logout() {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Erro ao fazer logout:', error)
        return { error }
      }
      
      // Limpar o estado
      setUser(null)
      setProfile(null)
      
      return { error: null }
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      return { error }
    }
  }

  // Função para recuperação de senha
  async function resetPassword(email) {
    setAuthError(null)
    
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      if (error) {
        setAuthError(error.message)
        return { data: null, error }
      }
      
      // Sucesso
      return { data, error: null }
    } catch (error) {
      setAuthError('Erro inesperado ao solicitar recuperação de senha')
      return { data: null, error }
    }
  }

  // Função para atualizar senha
  async function updatePassword(newPassword) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) {
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Função para verificar limites diários
  function checkDailyLimit(type) {
    if (!profile) return { allowed: false, remaining: 0 }
    
    const limits = {
      conversation: profile.subscription === 'free' ? 3 : Infinity,
      dream: profile.subscription === 'free' ? 2 : Infinity
    }
    
    const current = type === 'conversation' 
      ? profile.daily_conversation_count 
      : profile.daily_dream_count
    
    const remaining = Math.max(0, limits[type] - current)
    const allowed = current < limits[type]
    
    return { allowed, remaining }
  }

  const value = {
    user,
    profile,
    loading,
    authError,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    signup,
    logout,
    resetPassword,
    updatePassword,
    checkDailyLimit
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}