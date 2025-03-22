#!/bin/bash
# PUXAR ATUALIZAÇÕES DO GITHUB
git fetch --all
git reset --hard origin/main

# ENVIAR ALTERAÇÕES PARA O GITHUB
git add .
git commit -m "Descrição das alterações"
git push