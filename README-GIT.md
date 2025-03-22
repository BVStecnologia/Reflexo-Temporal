# Comandos Git para o Projeto Reflexo-Temporal

Este arquivo contém comandos Git úteis para o desenvolvimento do projeto Reflexo-Temporal.

## Como usar

Você pode copiar e colar os comandos abaixo diretamente no terminal.

### Puxar atualizações do GitHub

```bash
git fetch --all
git reset --hard origin/main
```

Este comando irá buscar todas as atualizações do repositório remoto e forçar seu repositório local a corresponder exatamente ao branch main do repositório remoto. **Atenção**: Isso descartará quaisquer alterações locais não commitadas.

### Enviar alterações para o GitHub

```bash
git add .
git commit -m "Descrição das alterações"
git push
```

Este comando irá:
1. Adicionar todas as alterações ao stage
2. Criar um commit com a mensagem especificada (substitua "Descrição das alterações" por uma mensagem descritiva)
3. Enviar as alterações para o repositório remoto

## Script de automação

Você também pode usar o script `git-comandos.sh` para executar esses comandos:

Para puxar atualizações:
```bash
./git-comandos.sh pull
```

Para enviar alterações:
```bash
./git-comandos.sh push "Sua mensagem de commit aqui"
```

Certifique-se de que o script tenha permissões de execução:
```bash
chmod +x git-comandos.sh
