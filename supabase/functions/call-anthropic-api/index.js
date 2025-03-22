// Supabase Edge Function para chamar a API da Anthropic
// Para implementar essa função:
// 1. Execute: supabase functions new call-anthropic-api
// 2. Substitua o conteúdo do arquivo gerado por este código
// 3. Configure suas variáveis de ambiente: supabase secrets set ANTHROPIC_API_KEY=your_api_key
// 4. Implante a função: supabase functions deploy call-anthropic-api

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')

serve(async (req) => {
  try {
    // Verificar método
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Apenas método POST é suportado' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Verificar chave da API
    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Chave da API Anthropic não configurada no servidor' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Obter dados do corpo
    const requestData = await req.json()
    
    // Validar dados mínimos
    if (!requestData.messages || !Array.isArray(requestData.messages) || requestData.messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Body inválido, "messages" é obrigatório' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Configurar os parâmetros da API da Anthropic
    const anthropicParams = {
      model: requestData.model || 'claude-3-sonnet-20240229',
      max_tokens: requestData.max_tokens || 1000,
      temperature: requestData.temperature || 0.7,
      messages: requestData.messages,
      stream: false
    }

    // Chamar a API da Anthropic
    const anthropicResponse = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(anthropicParams)
    })

    // Verificar erros da API
    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text()
      console.error('Erro da API Anthropic:', errorText)
      
      return new Response(
        JSON.stringify({ 
          error: 'Erro ao chamar a API da Anthropic', 
          details: errorText
        }),
        { status: anthropicResponse.status, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Obter e retornar a resposta
    const data = await anthropicResponse.json()
    
    return new Response(
      JSON.stringify(data.content),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Erro ao processar requisição:', error)
    
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})