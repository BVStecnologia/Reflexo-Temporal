#!/bin/bash

# Script para implantar a função dream-analysis no Supabase

echo "Iniciando implantação da função dream-analysis..."

# Navegar para o diretório do projeto
cd "$(dirname "$0")"

# Verificar se a CLI do Supabase está instalada
if ! command -v supabase &> /dev/null; then
    echo "Erro: CLI do Supabase não encontrada. Instale com 'npm install -g supabase'"
    exit 1
fi

# Configurações do projeto Supabase (caso precise)
# export SUPABASE_ACCESS_TOKEN="seu_token"
# export SUPABASE_PROJECT_ID="seu_projeto_id"

# Implantar a função
echo "Implantando a função dream-analysis..."
supabase functions deploy dream-analysis --project-ref nctuskofqmldyriyjpsp

# Verificar se a implantação foi bem-sucedida
if [ $? -eq 0 ]; then
    echo "✅ Função dream-analysis implantada com sucesso!"
    
    # Configurar a chave da API Claude
    echo "Configurando segredo CLAUDE_API_KEY..."
    # Usando o mesmo formato da função SQL de exemplo
    supabase secrets set CLAUDE_API_KEY="1001a189-6cc5-4ca4-8ae7-b7225a4f2f92" --project-ref nctuskofqmldyriyjpsp
    
    if [ $? -eq 0 ]; then
        echo "✅ Segredo CLAUDE_API_KEY configurado com sucesso!"
    else
        echo "❌ Falha ao configurar o segredo CLAUDE_API_KEY. Verifique se você tem permissões adequadas."
    fi
    
    echo ""
    echo "URL da função: https://nctuskofqmldyriyjpsp.supabase.co/functions/v1/dream-analysis"
    echo "Para testar, abra o arquivo test-dream-analysis.html no navegador."
else
    echo "❌ Falha na implantação da função dream-analysis. Verifique os logs acima para mais detalhes."
fi