import { supabase } from './supabase'

/**
 * Chama a API da Anthropic via Supabase Edge Function
 * 
 * @param {string} prompt - O prompt para enviar para a API da Anthropic
 * @param {Object} options - Opções adicionais
 * @param {string} options.role - O papel do prompt ('human' ou 'assistant')
 * @param {string} options.model - O modelo a ser usado (ex: 'claude-3-sonnet-20240229')
 * @param {number} options.maxTokens - Número máximo de tokens na resposta
 * @param {number} options.temperature - Temperatura (criatividade) da resposta
 * @returns {Promise<Object>} - A resposta da API
 */
export const callAnthropic = async (prompt, options = {}) => {
  try {
    const {
      role = 'human',
      model = 'claude-3-sonnet-20240229',
      maxTokens = 1000,
      temperature = 0.7
    } = options

    // Chamar a Edge Function do Supabase
    const { data, error } = await supabase.functions.invoke('call-anthropic-api', {
      body: {
        messages: [
          { role, content: prompt }
        ],
        model,
        max_tokens: maxTokens,
        temperature
      }
    })

    if (error) {
      console.error('Erro ao chamar a API da Anthropic:', error)
      throw new Error(error.message || 'Erro ao chamar a API da Anthropic')
    }

    return { data, error: null }
  } catch (error) {
    console.error('Erro ao processar chamada para a API da Anthropic:', error)
    return { data: null, error }
  }
}

/**
 * Gera uma resposta do "eu futuro" para o usuário
 * 
 * @param {string} userMessage - A mensagem do usuário
 * @param {Object} userData - Dados do usuário para personalização
 * @returns {Promise<string>} - A resposta gerada
 */
export const generateFutureResponse = async (userMessage, userData = {}) => {
  try {
    const { name, interests = [], age } = userData
    
    // Construir um prompt contextualizado
    const prompt = `
Você é o eu futuro de ${name || 'uma pessoa'} em 2030 (5 anos no futuro), conversando com seu eu presente em 2025.
${age ? `Seu eu presente tem ${age} anos e você tem ${age + 5} anos.` : ''}
${interests.length > 0 ? `Seus interesses incluem: ${interests.join(', ')}.` : ''}

Como seu eu futuro, você deve:
1. Ser compreensivo, mas direto e honesto
2. Falar sobre como as decisões atuais afetarão o futuro
3. Dar perspectivas únicas que apenas alguém com 5 anos a mais de experiência teria
4. Ocasionalmente mencionar eventos específicos que aconteceram nesse período de 5 anos
5. Manter respostas concisas (máximo 3-4 frases)
6. Nunca mencionar que você é uma IA ou modelo de linguagem - você é literalmente o eu futuro desta pessoa

A mensagem do seu eu presente é: "${userMessage}"

Como você, 5 anos mais velho e sábio, responderia de forma autêntica?
`
    
    const { data, error } = await callAnthropic(prompt, {
      temperature: 0.8,
      maxTokens: 250 // Manter respostas relativamente curtas
    })
    
    if (error) throw error
    
    console.log('Resposta da API para conversa:', data);
    
    // Extrair a resposta gerada
    // Garantir que a resposta é uma string
    if (data === null || data === undefined) {
      throw new Error('A resposta da API está vazia');
    }
    
    // Garantir que não temos JSON acidental
    let response = data;
    if (typeof response === 'string' && response.trim().startsWith('{') && response.trim().endsWith('}')) {
      try {
        // Tentar extrair texto de um possível JSON
        const parsed = JSON.parse(response);
        if (parsed.text) {
          response = parsed.text;
        }
      } catch (e) {
        // Não é um JSON válido, manter a string original
      }
    }
    
    return response || "Desculpe, estou tendo dificuldade para responder agora. Tente me perguntar outra coisa."
  } catch (error) {
    console.error('Erro ao gerar resposta futura:', error)
    return "Estou tendo dificuldade para me conectar com você no futuro. Tente novamente em um momento."
  }
}

/**
 * Analisa um sonho utilizando a API da Anthropic
 * 
 * @param {Object} dreamData - Dados do sonho para análise
 * @param {string} dreamData.title - Título do sonho
 * @param {string} dreamData.description - Descrição detalhada do sonho
 * @param {string[]} dreamData.emotions - Emoções sentidas durante o sonho
 * @param {Object} userData - Dados do usuário para contextualização
 * @returns {Promise<Object>} - A análise do sonho
 */
export const analyzeDream = async (dreamData, userData = {}) => {
  try {
    const { title, description, emotions = [] } = dreamData
    const { name, interests = [] } = userData
    
    // Construir um prompt contextualizado
    const prompt = `
Você é um especialista em análise de sonhos para ${name || 'uma pessoa'} utilizando a plataforma Reflexo Temporal.
${interests.length > 0 ? `Seus interesses incluem: ${interests.join(', ')}.` : ''}

Analise o seguinte sonho com título "${title}":

Descrição: ${description}

${emotions.length > 0 ? `Emoções sentidas: ${emotions.join(', ')}` : 'Nenhuma emoção específica mencionada.'}

INSTRUÇÕES IMPORTANTES:
1. Sua resposta DEVE ser EXCLUSIVAMENTE um objeto JSON válido, sem texto explicativo antes ou depois.
2. O JSON deve seguir EXATAMENTE esta estrutura, mantendo as chaves exatamente como mostradas abaixo.
3. Não use aspas simples, use apenas aspas duplas para as strings no JSON.
4. Não use caracteres de escape desnecessários como \\n ou \\".
5. Não inclua nenhuma explicação, apenas o JSON.

Formato exato do JSON:
{
  "symbols": [
    {"name": "SÍMBOLO PRINCIPAL 1", "meaning": "SIGNIFICADO DETALHADO"},
    {"name": "SÍMBOLO PRINCIPAL 2", "meaning": "SIGNIFICADO DETALHADO"},
    {"name": "SÍMBOLO PRINCIPAL 3", "meaning": "SIGNIFICADO DETALHADO"}
  ],
  "interpretation": "INTERPRETAÇÃO GERAL DO SONHO - 2-3 PARÁGRAFOS",
  "message_from_future": "UMA MENSAGEM DO SEU EU FUTURO BASEADA NESTE SONHO - 1-2 FRASES",
  "reflection_questions": [
    "PERGUNTA REFLEXIVA 1?",
    "PERGUNTA REFLEXIVA 2?",
    "PERGUNTA REFLEXIVA 3?"
  ]
}
`
    
    const { data, error } = await callAnthropic(prompt, {
      temperature: 0.7,
      maxTokens: 1000
    })
    
    if (error) throw error
    
    // Extrair e validar o JSON
    try {
      let analysisText = data || '';
      console.log('Resposta bruta da API:', analysisText);
      
      // Se não for uma string, converter para string
      if (typeof analysisText !== 'string') {
        analysisText = JSON.stringify(analysisText);
      }
      
      // Tentar encontrar um JSON válido na resposta
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisText = jsonMatch[0];
        console.log('JSON extraído:', analysisText);
      } else {
        console.error('Não foi possível encontrar JSON válido na resposta');
        throw new Error('Formato de resposta inválido');
      }
      
      // Tenta fazer o parse do JSON
      const analysis = JSON.parse(analysisText);
      
      // Validar se o JSON tem a estrutura esperada
      if (!analysis.symbols || !analysis.interpretation || !analysis.message_from_future || !analysis.reflection_questions) {
        console.error('JSON não contém os campos esperados');
        throw new Error('Estrutura de análise inválida');
      }
      
      return { analysis, error: null };
    } catch (parseError) {
      console.error('Erro ao analisar resposta JSON:', parseError);
      throw new Error('Erro ao processar análise do sonho');
    }
  } catch (error) {
    console.error('Erro ao analisar sonho:', error);
    return { 
      analysis: null, 
      error: error.message || 'Ocorreu um erro na análise do sonho. Tente novamente mais tarde.' 
    };
  }
}