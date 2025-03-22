#!/bin/bash

# Remover o arquivo de bloqueio, se existir
rm -f .git/index.lock

# Adicionar todas as alterações
echo "Executando git add ."
git add . 2>&1 > git-output.log
echo "Status após git add:"
git status 2>&1 >> git-output.log

# Fazer commit das alterações
echo "Executando git commit"
git commit -m "Adicionando alterações" 2>&1 >> git-output.log
echo "Status após git commit:"
git status 2>&1 >> git-output.log

# Enviar alterações para o repositório remoto
echo "Executando git push"
git push 2>&1 >> git-output.log
echo "Status após git push:"
git status 2>&1 >> git-output.log

echo "Verificando configuração do Git"
git config --list 2>&1 >> git-output.log

echo "Verificando repositórios remotos"
git remote -v 2>&1 >> git-output.log

echo "Concluído. Verifique o arquivo git-output.log para ver os resultados."
