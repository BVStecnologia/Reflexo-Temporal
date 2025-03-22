-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT,
  email TEXT,
  age INTEGER,
  interests TEXT[] DEFAULT '{}',
  aspirations TEXT[] DEFAULT '{}',
  daily_conversation_count INTEGER DEFAULT 0,
  daily_dream_count INTEGER DEFAULT 0,
  last_reset_date TEXT,
  subscription TEXT DEFAULT 'free',
  precision_ranking INTEGER DEFAULT 0,
  total_shares INTEGER DEFAULT 0,
  badges JSONB[] DEFAULT '{}',
  stripe_customer_id TEXT,
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days',
  UNIQUE(user_id)
);

-- Trigger para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabela de conversas
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_shared BOOLEAN DEFAULT FALSE,
  share_url TEXT,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
      REFERENCES auth.users(id)
);

CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON conversations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sender TEXT NOT NULL CHECK (sender IN ('present', 'future')),
  CONSTRAINT fk_conversation
    FOREIGN KEY(conversation_id)
      REFERENCES conversations(id)
);

-- Tabela de sonhos
CREATE TABLE IF NOT EXISTS dreams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  emotions TEXT[] DEFAULT '{}',
  analysis JSONB,
  is_shared BOOLEAN DEFAULT FALSE,
  share_url TEXT,
  tags TEXT[] DEFAULT '{}',
  visualization_url TEXT,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
      REFERENCES auth.users(id)
);

CREATE TRIGGER update_dreams_updated_at
BEFORE UPDATE ON dreams
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'promo', 'insight')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  action_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
      REFERENCES auth.users(id)
);

-- Tabela de compartilhamentos
CREATE TABLE IF NOT EXISTS share_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('conversation', 'dream')),
  content_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  url TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  image_url TEXT,
  hashtags TEXT[] DEFAULT '{}',
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
      REFERENCES auth.users(id)
);

-- Tabela de configurações do usuário
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('dark', 'light', 'system')),
  notifications BOOLEAN DEFAULT TRUE,
  email_frequency TEXT NOT NULL DEFAULT 'weekly' CHECK (email_frequency IN ('daily', 'weekly', 'none')),
  share_analytics BOOLEAN DEFAULT TRUE,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
      REFERENCES auth.users(id),
  UNIQUE(user_id)
);

-- Tabela de eventos do usuário
CREATE TABLE IF NOT EXISTS user_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('conversation_started', 'dream_analyzed', 'subscription_changed', 'content_shared')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
      REFERENCES auth.users(id)
);

-- Políticas de segurança RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE dreams ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

-- Políticas para perfis
CREATE POLICY "Usuários podem ver seus próprios perfis" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios perfis" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para conversas
CREATE POLICY "Usuários podem ver suas próprias conversas" ON conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias conversas" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias conversas" ON conversations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir suas próprias conversas" ON conversations
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para mensagens
CREATE POLICY "Usuários podem ver mensagens em suas próprias conversas" ON messages
  FOR SELECT USING (conversation_id IN (
    SELECT id FROM conversations WHERE user_id = auth.uid()
  ));

CREATE POLICY "Usuários podem criar mensagens em suas próprias conversas" ON messages
  FOR INSERT WITH CHECK (conversation_id IN (
    SELECT id FROM conversations WHERE user_id = auth.uid()
  ));

-- Políticas para sonhos
CREATE POLICY "Usuários podem ver seus próprios sonhos" ON dreams
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios sonhos" ON dreams
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios sonhos" ON dreams
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir seus próprios sonhos" ON dreams
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para notificações
CREATE POLICY "Usuários podem ver suas próprias notificações" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias notificações" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para compartilhamentos
CREATE POLICY "Usuários podem ver seus próprios compartilhamentos" ON share_cards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios compartilhamentos" ON share_cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios compartilhamentos" ON share_cards
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para configurações
CREATE POLICY "Usuários podem ver suas próprias configurações" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias configurações" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias configurações" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para eventos
CREATE POLICY "Usuários podem ver seus próprios eventos" ON user_events
  FOR SELECT USING (auth.uid() = user_id);

-- Função para criar perfil quando um novo usuário é criado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, interests, aspirations, last_reset_date)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'name',
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'interests')::TEXT[]::TEXT[], '{}'),
    COALESCE((NEW.raw_user_meta_data->>'aspirations')::TEXT[]::TEXT[], '{}'),
    to_char(NOW(), 'YYYY-MM-DD')
  );
  
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  INSERT INTO public.notifications (
    user_id,
    title,
    message,
    type
  ) VALUES (
    NEW.id,
    'Bem-vindo ao Reflexo Temporal',
    'Estamos felizes por você iniciar sua jornada de autodescoberta! Comece conversando com seu eu do futuro ou registrando um sonho.',
    'info'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para novos usuários
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();