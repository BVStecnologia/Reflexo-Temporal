import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nctuskofqmldyriyjpsp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jdHVza29mcW1sZHlyaXlqcHNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY1NTU0NjEsImV4cCI6MjAzMjEzMTQ2MX0.mfIknjEEPp6OFcS9WMD9lMeYoPz9yvEX20k1IPvSIwA'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Funções de perfil
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  return { data, error }
}

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
  
  return { data, error }
}

// Funções de conversas
export const getConversations = async (userId) => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  
  return { data, error }
}

export const getConversation = async (conversationId) => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*, messages(*)')
    .eq('id', conversationId)
    .single()
  
  return { data, error }
}

export const createConversation = async (userId, title) => {
  const { data, error } = await supabase
    .from('conversations')
    .insert([{ user_id: userId, title }])
    .select()
  
  return { data, error }
}

export const addMessage = async (conversationId, content, sender) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ conversation_id: conversationId, content, sender }])
    .select()
  
  return { data, error }
}

// Funções de sonhos
export const getDreams = async (userId) => {
  const { data, error } = await supabase
    .from('dreams')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const getDream = async (dreamId) => {
  const { data, error } = await supabase
    .from('dreams')
    .select('*')
    .eq('id', dreamId)
    .single()
  
  return { data, error }
}

export const createDream = async (userId, dreamData) => {
  const { data, error } = await supabase
    .from('dreams')
    .insert([{ user_id: userId, ...dreamData }])
    .select()
  
  return { data, error }
}

export const updateDream = async (dreamId, updates) => {
  const { data, error } = await supabase
    .from('dreams')
    .update(updates)
    .eq('id', dreamId)
    .select()
  
  return { data, error }
}

// Funções de notificações
export const getNotifications = async (userId) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const markNotificationAsRead = async (notificationId) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .select()
  
  return { data, error }
}

// Funções de contadores diários
export const incrementDailyCounter = async (userId, counterType) => {
  // Primeiro obtém o perfil
  const { data: profile, error: profileError } = await getUserProfile(userId)
  
  if (profileError) {
    return { data: null, error: profileError }
  }
  
  // Verifica se precisamos resetar os contadores
  const today = new Date().toISOString().split('T')[0]
  let updates = {}
  
  if (profile.last_reset_date !== today) {
    // Novo dia, resetar contadores
    updates = {
      daily_conversation_count: counterType === 'conversation' ? 1 : 0,
      daily_dream_count: counterType === 'dream' ? 1 : 0,
      last_reset_date: today
    }
  } else {
    // Mesmo dia, incrementar apenas o contador específico
    if (counterType === 'conversation') {
      updates = { daily_conversation_count: profile.daily_conversation_count + 1 }
    } else if (counterType === 'dream') {
      updates = { daily_dream_count: profile.daily_dream_count + 1 }
    }
  }
  
  const { data, error } = await updateUserProfile(userId, updates)
  return { data, error }
}

// Funções de compartilhamento
export const createShareCard = async (userId, contentType, contentId, imageUrl = null) => {
  const shareUrl = `${window.location.origin}/share/${contentType}/${contentId}`
  
  const { data, error } = await supabase
    .from('share_cards')
    .insert([{
      user_id: userId,
      content_type: contentType,
      content_id: contentId,
      url: shareUrl,
      image_url: imageUrl
    }])
    .select()
  
  // Atualizar a tabela de conteúdo original para marcar como compartilhado
  if (!error && data) {
    if (contentType === 'conversation') {
      await supabase
        .from('conversations')
        .update({ is_shared: true, share_url: shareUrl })
        .eq('id', contentId)
    } else if (contentType === 'dream') {
      await supabase
        .from('dreams')
        .update({ is_shared: true, share_url: shareUrl })
        .eq('id', contentId)
    }
  }
  
  return { data, error }
}

// Funções de configurações
export const getUserSettings = async (userId) => {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  return { data, error }
}

export const updateUserSettings = async (userId, settings) => {
  const { data, error } = await supabase
    .from('user_settings')
    .update(settings)
    .eq('user_id', userId)
    .select()
  
  return { data, error }
}