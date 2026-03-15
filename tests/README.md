# Testes - Curso.Dev

## Estrutura de Testes

Este projeto implementa uma estratégia de testes robusta que garante a integridade do banco de dados e testa migrações automaticamente.

## Scripts Disponíveis

### Scripts Principais

- `npm run test` - Executa todos os testes (setup + unitários + integração)
- `npm run test:unit` - Executa apenas testes unitários (ignora integration/)
- `npm run test:integration` - Executa apenas testes de integração
- `npm run test:setup` - Reset DB + Migrações + Testes unitários
- `npm run test:full` - Reset DB + Migrações + Todos os testes

### Scripts de Banco de Dados

- `npm run test:db:reset` - Limpa e recria o banco de teste do zero
- `npm run test:migration:up` - Executa todas as migrações no banco de teste
- `npm run test:migration:down` - Reverte migrações no banco de teste

## Processo de Teste Automatizado

### 1. Reset do Banco

O script `reset-test-db.js` faz:

- Conecta no PostgreSQL server
- Termina conexões ativas no banco de teste
- Remove o banco de teste completamente
- Recria o banco vazio

### 2. Execução de Migrações

- Roda todas as migrações disponíveis em `infra/migrations/`
- Cria a tabela `pgmigrations` para controle
- Simula o processo de deploy real

### 3. Testes de Setup

O arquivo `tests/setup/database.test.js` verifica:

- ✅ Reset do banco executado com sucesso
- ✅ Migrações aplicadas corretamente
- ✅ Conexão com banco funcional
- ✅ Tabela de migrações criada

## Configuração

### Variáveis de Ambiente (.env.test)

```env
NODE_ENV=test
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=cursodev_test
DATABASE_URL=postgres://postgres:postgres@localhost:5433/cursodev_test
```

### Sequenciador de Testes

O arquivo `tests/sequencer.js` garante que:

1. **Testes de setup rodem primeiro** (pasta `/setup/`)
2. Demais testes sigam ordem alfabética

## Benefícios

### 🔒 **Isolamento Total**

- Cada run de teste começa com banco limpo
- Sem dados "fantasma" de execuções anteriores

### 🚀 **Testa Migrações**

- Valida se migrações funcionam do zero
- Simula processo real de deploy
- Detecta problemas de migração cedo

### 🎯 **Ambiente Previsível**

- Estado inicial sempre idêntico
- Testes determinísticos
- Fácil debugging

### 📊 **Flexibilidade**

- Rode só testes unitários (rápido)
- Rode só testes de integração
- Rode tudo com reset completo

## Uso Recomendado

### Durante Desenvolvimento

```bash
# Desenvolvimento rápido (sem servidor)
npm run test:unit

# Teste completo das migrações
npm run test:setup
```

### Antes de Commit/Deploy

```bash
# Teste completo com reset
npm run test:full
```

### CI/CD

```bash
# Garante ambiente limpo sempre
npm run test:setup
```

## Estrutura de Diretórios

```
tests/
├── setup/
│   └── database.test.js    # Testes de configuração do banco
├── integration/
│   └── api/                # Testes que precisam do servidor rodando
└── sequencer.js           # Controla ordem de execução
```

## Troubleshooting

### Erro de Autenticação

- Verifique se Docker está rodando: `npm run services:up`
- Confirme credenciais no `.env.test`

### Migrações Falhando

- Execute manualmente: `npm run test:migration:up`
- Verifique arquivos em `infra/migrations/`

### Testes Lentos

- Use `npm run test:unit` para pular integração
- Considere executar Docker localmente
