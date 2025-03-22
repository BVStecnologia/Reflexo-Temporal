# Edge Function para Análise de Sonhos - Reflexo Temporal

Este projeto implementa uma Edge Function no Supabase para análise de sonhos usando a API Claude 3.7 Sonnet. A função recebe detalhes de um sonho e retorna uma análise detalhada em formato JSON.

✅ **Status: Implementada e testada com sucesso!**

## Estrutura do Projeto

- `/supabase/functions/dream-analysis/index.ts` - Código principal da Edge Function
- `/test-dream-analysis.html` - Interface para testar a função
- `/test-dream-analysis.js` - Script para testar a função via linha de comando
- `/deploy-dream-analysis.sh` - Script para implantar a função
- `/CLAUDE_API_SETUP.md` - Instruções detalhadas para configurar a chave API do Claude

## Funcionalidades

A Edge Function analisa um sonho e retorna:

1. **Resumo geral** - Visão geral do sonho e significados principais
2. **Símbolos chave** - 3-5 símbolos principais com interpretações
3. **Interpretação psicológica** - Análise profunda do significado do sonho
4. **Conexões com a vida desperta** - Como o sonho se relaciona com a realidade
5. **Perguntas reflexivas** - 3-5 questões para explorar mais a fundo

## Implantação

Para implantar a função:

1. Certifique-se de que o Docker Desktop esteja em execução
2. Obtenha uma chave API válida do Claude (ver CLAUDE_API_SETUP.md)
3. Execute o script de implantação: `bash deploy-dream-analysis.sh`

## Uso

A função pode ser chamada com um POST para:
`https://nctuskofqmldyriyjpsp.supabase.co/functions/v1/dream-analysis`

Parâmetros no corpo da requisição:
```json
{
  "dreamTitle": "Título do Sonho",
  "dreamDescription": "Descrição detalhada do sonho...",
  "dreamEmotions": ["Alegria", "Medo", "Confusão"],
  "userId": "id-opcional-do-usuário",
  "dreamId": "id-opcional-do-sonho"
}
```

Apenas `dreamDescription` é obrigatório.

Se `userId` e `dreamId` forem fornecidos, a análise também será salva no banco de dados Supabase.

## Resposta

A função retorna um JSON com a seguinte estrutura:

```json
{
  "success": true,
  "analysis": {
    "summary": "Resumo do sonho",
    "symbols": [
      {"name": "Oceano", "meaning": "Simboliza o inconsciente..."},
      {"name": "Porta", "meaning": "Representa transições..."},
      {"name": "Pássaro", "meaning": "Símbolo de liberdade..."}
    ],
    "psychologicalInterpretation": "Análise psicológica detalhada...",
    "wakingLifeConnections": "Conexões com a vida desperta...",
    "reflectiveQuestions": [
      "Que tipo de liberdade você busca em sua vida?",
      "O que a transição pela porta pode representar?"
    ]
  }
}
```

## Teste

### Via Navegador
Abra o arquivo `test-dream-analysis.html` no navegador para uma interface interativa.

### Via Linha de Comando
Execute `node test-dream-analysis.js` para testar via terminal.

## Integração na Aplicação

Para integrar a Edge Function na aplicação React:

```javascript
import { createClient } from '@supabase/supabase-js';

// Inicializar cliente Supabase
const supabaseUrl = 'https://nctuskofqmldyriyjpsp.supabase.co';
const supabaseKey = 'chave-anon-pública';
const supabase = createClient(supabaseUrl, supabaseKey);

// Função para analisar um sonho
async function analyzeDream(dreamData) {
  try {
    const { data, error } = await supabase.functions.invoke('dream-analysis', {
      body: dreamData
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao analisar sonho:', error);
    throw error;
  }
}
```

## Requisitos

- Node.js 14+
- Docker Desktop
- Supabase CLI
- Chave API válida do Claude