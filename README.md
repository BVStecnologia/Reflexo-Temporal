# Reflexo Temporal

Aplicativo web que permite aos usuários conversar com uma versão futura de si mesmos e receber análises dos seus sonhos.

## Visão Geral

O Reflexo Temporal é uma plataforma de autoconhecimento que utiliza IA avançada para simular conversas com seu "eu futuro" e analisar sonhos para extrair insights significativos. A aplicação combina tecnologia de ponta com design intuitivo para proporcionar uma experiência única de reflexão pessoal.

## Tecnologias Utilizadas

- **Frontend**: React 18 com Vite, React Router, Tailwind CSS, Framer Motion
- **Backend**: Supabase (Autenticação, Banco de Dados PostgreSQL, Storage)
- **IA**: API da Anthropic via Supabase Edge Functions

## Funcionalidades Principais

- 🗣️ **Conversas com o Futuro**: Dialogue com uma versão de você mesmo em 2030.
- 💭 **Análise de Sonhos**: Interpretação profunda de símbolos e significados nos seus sonhos.
- 📊 **Dashboard Personalizado**: Acompanhe suas conversas, sonhos e insights.
- 💰 **Sistema de Assinatura**: Planos gratuitos e premium para diferentes níveis de acesso.
- 🌓 **Tema Escuro/Claro**: Interface adaptável à sua preferência visual.

## Configuração do Ambiente de Desenvolvimento

### Pré-requisitos

- Node.js (v16+)
- Conta no Supabase
- API Key da Anthropic (para funcionalidade completa de IA)

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/reflexo-temporal.git
   cd reflexo-temporal
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto:
   ```
   VITE_SUPABASE_URL=sua-url-do-supabase
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-do-supabase
   ```

4. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

### Configuração do Supabase

1. Criação de tabelas:
   - Execute o script SQL fornecido no arquivo `supabase/schema.sql` no seu painel do Supabase

2. Configuração da Edge Function para a API da Anthropic:
   ```bash
   # Instalar CLI do Supabase (se ainda não tiver)
   npm install -g supabase

   # Login no Supabase
   supabase login

   # Vincular ao seu projeto
   supabase link --project-ref seu-ref-id

   # Configurar a chave da API da Anthropic
   supabase secrets set ANTHROPIC_API_KEY=sua-chave-da-anthropic

   # Implantar a função
   supabase functions deploy call-anthropic-api
   ```

## Estrutura do Projeto

```
reflexo-temporal/
├── src/
│   ├── assets/           # Imagens e recursos estáticos
│   ├── components/       # Componentes reutilizáveis
│   ├── contexts/         # Contextos React (auth, theme)
│   ├── hooks/            # Hooks personalizados
│   ├── pages/            # Componentes de página
│   ├── services/         # Serviços (API, integrações)
│   └── utils/            # Funções utilitárias
├── supabase/
│   ├── functions/        # Edge Functions do Supabase
│   └── schema.sql        # Esquema do banco de dados
├── public/               # Arquivos públicos
└── ...
```

## Deployment

Para implantar o aplicativo em produção:

1. Construa o aplicativo:
   ```bash
   npm run build
   ```

2. Deploy no serviço de sua escolha (Vercel, Netlify, etc.).

## Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue para discutir mudanças maiores antes de enviar um pull request.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).