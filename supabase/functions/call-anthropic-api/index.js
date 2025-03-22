// Supabase Edge Function para chamar a API da Anthropic
// Esta função já está implantada e configurada no Supabase
// A chave da API está armazenada no Vault como CLAUDE_API_KEY

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

// Função de tratamento das requisições
serve(async (req) => {
  try {
    // Verificar método
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Apenas método POST é suportado' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Obter a chave da API do Vault (já configurada no Supabase)
    const ANTHROPIC_API_KEY = Deno.env.get('CLAUDE_API_KEY')

    // Verificar chave da API
    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Chave da API Anthropic não encontrada no Vault' }),
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

    console.log(`Chamando API Anthropic com modelo: ${anthropicParams.model}`)

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
    
    // Extrair o texto da resposta (a API Claude retorna content como array)
    let responseText = ""
    if (data && data.content && Array.isArray(data.content)) {
      // Concatenar todos os blocos de texto
      responseText = data.content
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('')
    }
    
    return new Response(
      JSON.stringify(responseText),
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