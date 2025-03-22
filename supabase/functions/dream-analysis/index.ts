// Supabase Edge Function para análise de sonhos usando a API da Anthropic
// Esta função analisa o sonho fornecido e retorna uma análise detalhada
// A chave da API está armazenada no Vault como CLAUDE_API_KEY

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

// Interfaces para tipagem
interface DreamRequest {
  dreamTitle?: string;
  dreamDescription: string;
  dreamEmotions?: string[] | string;
  userId?: string;
  dreamId?: string;
}

interface DreamSymbol {
  name: string;
  meaning: string;
}

interface DreamAnalysis {
  summary: string;
  symbols: DreamSymbol[];
  psychologicalInterpretation: string;
  wakingLifeConnections: string;
  reflectiveQuestions: string[];
}

// Função de tratamento das requisições
serve(async (req: Request) => {
  try {
    // Verificar método
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Apenas método POST é suportado' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Obter a chave da API do Vault (já configurada no Supabase)
    // Observação: esta chave deve estar armazenada no Vault do Supabase
    const ANTHROPIC_API_KEY = Deno.env.get('CLAUDE_API_KEY')

    // Verificar chave da API
    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Chave da API Anthropic não encontrada no Vault' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Obter dados do corpo
    const requestData: DreamRequest = await req.json()
    
    // Validar dados mínimos
    if (!requestData.dreamDescription || typeof requestData.dreamDescription !== 'string' || requestData.dreamDescription.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Body inválido, "dreamDescription" é obrigatório e não pode estar vazio' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Extrair dados do sonho da requisição
    const { dreamDescription, dreamTitle, dreamEmotions, userId, dreamId } = requestData

    // Criar cliente do Supabase usando a autenticação da função edge
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization') ?? '' },
        },
      }
    )

    // Construir o prompt para a análise do sonho
    const systemPrompt = `Você é um especialista em análise de sonhos com conhecimento em psicologia junguiana, freudiana e em símbolos universais. Sua tarefa é analisar e interpretar o sonho descrito, dividindo sua análise em várias seções:

1. Resumo geral (2-3 frases): Uma visão geral do sonho e possíveis significados principais.

2. Símbolos chave (identifique 3-5): Liste os principais símbolos ou elementos que aparecem no sonho e explique seus possíveis significados psicológicos ou arquetípicos.

3. Interpretação psicológica (2-3 parágrafos): Uma análise mais profunda do que o sonho pode revelar sobre o estado emocional ou mental do sonhador, preocupações inconscientes ou aspectos da personalidade.

4. Conexões com a vida desperta (1-2 parágrafos): Como este sonho pode se relacionar com a vida cotidiana do sonhador, experiências recentes, relações ou desafios atuais.

5. Perguntas reflexivas (3-5 questões): Sugira perguntas que o sonhador poderia considerar para explorar mais profundamente o significado do sonho.

Responda apenas com um objeto JSON no seguinte formato:
{
  "summary": "string",
  "symbols": [
    {"name": "string", "meaning": "string"},
    ...
  ],
  "psychologicalInterpretation": "string",
  "wakingLifeConnections": "string",
  "reflectiveQuestions": ["string", ...]
}

Seu tom deve ser profissional mas acessível, evitando jargão excessivo. Ofereça interpretações perspicazes sem ser dogmático, reconhecendo que o significado último do sonho pertence ao sonhador.`

    // Montagem da mensagem do usuário
    const userMessage = `Aqui está o sonho que gostaria que você analisasse:
      
Título: ${dreamTitle || 'Sem título'}
Emoções: ${Array.isArray(dreamEmotions) ? dreamEmotions.join(', ') : (dreamEmotions || 'Não especificadas')}
Descrição: ${dreamDescription}`

    // Configurar os parâmetros da API da Anthropic seguindo o formato da função SQL de exemplo
    const anthropicParams = {
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 2000,
      temperature: 0.5,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    }

    console.log(`Analisando sonho: "${dreamTitle || 'Sem título'}" para usuário: ${userId || 'anônimo'}`)

    // Chamar a API da Anthropic usando o ID como API key
    console.log('Tentando chamar API Claude...');
    
    // Formato a chave corretamente se necessário
    // Se a chave não começar com sk-, adiciona o prefixo para o formato de Bearer token
    let formattedKey = ANTHROPIC_API_KEY;
    if (!ANTHROPIC_API_KEY.startsWith('sk-')) {
      formattedKey = `sk-ant-api03-${ANTHROPIC_API_KEY}`;
      console.log('Chave formatada com prefixo sk-ant-api03-');
    }
    
    const anthropicResponse = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': formattedKey,
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

    // Obter a resposta da API
    const anthropicData = await anthropicResponse.json()
    
    // Extrair o texto da resposta
    let analysisText = ""
    if (anthropicData && anthropicData.content && Array.isArray(anthropicData.content)) {
      // Concatenar todos os blocos de texto
      analysisText = anthropicData.content
        .filter((item: any) => item.type === 'text')
        .map((item: any) => item.text)
        .join('')
    }
    
    // Processar o texto para extrair o JSON
    let analysisJson: DreamAnalysis = {
      summary: '',
      symbols: [],
      psychologicalInterpretation: '',
      wakingLifeConnections: '',
      reflectiveQuestions: []
    }
    
    try {
      // Tentar extrair o JSON da resposta
      // Primeiro remover qualquer texto extra antes ou depois do JSON
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisJson = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Formato JSON não encontrado na resposta')
      }
    } catch (error) {
      console.error('Erro ao processar resposta JSON:', error)
      
      return new Response(
        JSON.stringify({ 
          error: 'Erro ao processar a análise do sonho', 
          details: (error as Error).message,
          rawResponse: analysisText
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Se um dreamId foi fornecido, atualizar o registro no banco de dados
    if (dreamId && userId) {
      try {
        const { error } = await supabaseClient
          .from('dreams')
          .update({ 
            analysis: analysisJson, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', dreamId)
          .eq('user_id', userId)
        
        if (error) {
          console.error('Erro ao atualizar sonho no banco:', error)
        } else {
          console.log(`Sonho ${dreamId} atualizado com sucesso para usuário ${userId}`)
        }
      } catch (dbError) {
        console.error('Erro ao acessar banco de dados:', dbError)
      }
    }
    
    // Retornar a análise
    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysisJson 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Erro ao processar requisição:', error)
    
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor', details: (error as Error).message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})