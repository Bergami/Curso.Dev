# Curso.Dev

> Projeto desenvolvido para estudo de novas tecnologias, baseado no curso.dev

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React para produção
- **TypeScript 5** - Tipagem estática e tooling moderno
- **PostgreSQL** - Banco de dados relacional
- **Docker** - Containerização dos serviços
- **Jest** - Framework de testes
- **Prettier** - Formatação de código
- **node-pg-migrate** - Migrações de banco de dados

## 📁 Estrutura do Projeto

```
├── pages/
│   └── api/v1/status/       # API de status do sistema
├── infra/
│   ├── database.ts          # Configuração do banco de dados
│   ├── run-migrations.ts    # Runner programático de migrações
│   ├── compose.yml          # Docker compose para serviços
│   └── migrations/          # Arquivos de migração do banco
├── tests/
│   ├── setup/               # Testes de configuração (executam primeiro)
│   ├── integration/         # Testes de integração
│   ├── sequencer.cjs        # Controlador de ordem dos testes
│   └── README.md           # Documentação dos testes
├── scripts/
│   ├── reset-dev-db.ts      # Reset do banco de desenvolvimento
│   ├── reset-test-db.ts     # Reset do banco de teste
│   └── queries_status.ts    # Queries para status da API
├── models/                  # Modelos de dados
└── ...
```

## 🔧 Arquitetura de Ambientes

Este projeto implementa **ambientes completamente separados** com bancos de dados independentes:

### 📊 **Banco de Desenvolvimento** (`cursodev_development`)

- **Porta**: 5433
- **Dados**: Persistentes para desenvolvimento local
- **Uso**: `npm run dev`, testes manuais, desenvolvimento de features

### 🧪 **Banco de Teste** (`cursodev_test`)

- **Porta**: 5434
- **Dados**: Temporários, limpos a cada execução de teste
- **Uso**: Testes automatizados, CI/CD

## ⚙️ Configuração de Ambiente

### `.env.development` - Ambiente de Desenvolvimento

```env
NODE_ENV=development
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=cursodev_development
SSL=false
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/cursodev_development
```

### `.env.test` - Ambiente de Testes

```env
NODE_ENV=test
POSTGRES_HOST=localhost
POSTGRES_PORT=5434
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=cursodev_test
SSL=false
DATABASE_URL=postgresql://postgres:postgres@localhost:5434/cursodev_test
```

## 🛠️ Instalação e Configuração

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd Curso.Dev
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure os arquivos de ambiente

Crie os arquivos de ambiente baseados nos exemplos acima:

- `.env.development` - Para desenvolvimento
- `.env.test` - Para testes

### 4. Inicie os serviços Docker

```bash
# Inicia ambos os bancos
npm run services:up

# Ou inicia apenas um ambiente específico
npm run services:dev:up    # Só desenvolvimento
npm run services:test:up   # Só testes
```

### 5. Configure o ambiente de desenvolvimento

```bash
# Configura banco de desenvolvimento
npm run dev:setup
```

### 6. Rode o projeto

```bash
npm run dev
```

O projeto estará disponível em: http://localhost:3001

## 📋 Scripts Disponíveis

### 🔧 **Desenvolvimento**

```bash
npm run dev                # Inicia servidor (sobe banco dev + Next.js)
npm run dev:setup          # Configura ambiente: banco + migrações
npm run dev:db:reset       # Reset completo do banco de desenvolvimento
npm run dev:migration:up   # Aplica migrações no banco dev
npm run dev:migration:down # Desfaz última migração no banco dev
```

### 🧪 **Testes**

```bash
npm test                   # Todos os testes (requer banco configurado)
npm run test:setup         # Sobe serviços + testes unitários (setup faz reset+migrações)
npm run test:full          # Sobe serviços + todos os testes (setup faz reset+migrações)
npm run test:unit          # Apenas testes unitários
npm run test:integration   # Apenas testes de integração
npm run test:watch         # Modo watch dos testes
npm run typecheck          # Verificação estática TypeScript
```

### 🐳 **Gerenciamento de Serviços**

```bash
npm run services:up        # Sobe ambos os bancos
npm run services:down      # Para ambos os bancos
npm run services:dev:up    # Sobe apenas banco de desenvolvimento
npm run services:dev:down  # Para apenas banco de desenvolvimento
npm run services:test:up   # Sobe apenas banco de teste
npm run services:test:down # Para apenas banco de teste
```

### 🗃️ **Migrações**

```bash
npm run migration:create <nome>    # Cria nova migração
npm run migration:up              # Aplica migrações (desenvolvimento)
npm run migration:down            # Desfaz migração (desenvolvimento)

# Para ambiente de teste (automático via scripts)
npm run test:migration:up         # Aplica migrações no teste
npm run test:migration:status     # Status das migrações no teste
```

### 🎨 **Formatação**

```bash
npm run lint:check         # Verifica formatação do código
npm run lint:fix           # Corrige formatação automaticamente
```

## 🧪 **Sistema de Testes Avançado**

### **Arquitetura de Testes**

Este projeto implementa um sistema de testes robusto com:

- ✅ **Banco isolado** para testes (porta 5434)
- ✅ **Reset automático** antes de cada execução
- ✅ **Migrações testadas** como em produção
- ✅ **Ordem controlada** de execução (setup primeiro)

### **Fluxo de Execução dos Testes**

```bash
npm run test:full
```

**O que acontece:**

1. 🔍 **Sobe banco de teste** (Docker)
2. 🗑️ **Limpa banco completamente**
3. 🏗️ **Aplica todas as migrações**
4. 🧪 **Executa testes** em ambiente limpo
5. ✅ **Resultado confiável e reproduzível**

### **Tipos de Teste**

- **Setup** (`tests/setup/`): Configuram ambiente, executam primeiro
- **Unitários**: Testam funções isoladamente, rápidos
- **Integração** (`tests/integration/`): Testam API + Banco, mais lentos

### **Comandos Recomendados**

```bash
# Desenvolvimento rápido
npm run test:setup         # Reset + migrações + unitários

# Antes de commit
npm run test:full          # Teste completo com tudo

# Debug específico
npm run test:unit          # Só unitários (rápido)
npm run test:integration   # Só integração (precisa do servidor)
```

## 🐳 **Docker**

### **Arquitetura dos Serviços**

O projeto usa Docker Compose com **dois bancos PostgreSQL separados**:

```yaml
# docker-compose.yml
services:
  database_dev: # Banco de desenvolvimento (porta 5433)
  database_test: # Banco de teste (porta 5434)
```

### **Comandos Úteis**

```bash
# Gerenciamento completo
npm run services:up           # Sobe ambos os bancos
npm run services:down         # Para ambos os bancos

# Por ambiente específico
npm run services:dev:up       # Só desenvolvimento
npm run services:test:up      # Só testes

# Debug e monitoramento
docker-compose -f infra/compose.yml logs database_dev
docker-compose -f infra/compose.yml ps
docker exec -it cursodev_development psql -U postgres -d cursodev_development
```

### **Volumes Persistentes**

- **`postgres_dev_data`**: Dados de desenvolvimento (persistem)
- **`postgres_test_data`**: Dados de teste (podem ser limpos)

## 🔧 **API Endpoints**

### **Status da Aplicação**

```http
GET /api/v1/status
```

**Retorna informações sobre:**

- Status da aplicação
- Versão do banco de dados
- Conexões ativas do banco
- Número máximo de conexões

**Resposta de exemplo:**

```json
{
  "status": "ok",
  "updatedAt": "2026-03-03T20:59:22.852Z",
  "dependency": {
    "database": {
      "version": "PostgreSQL 16.11...",
      "max_connections": 100,
      "opened_connections": 1
    }
  }
}
```

## 📚 **Arquitetura e Boas Práticas**

### **TypeScript + ESM**

- **Runtime principal**: ESM (`"type": "module"` em `package.json`)
- **Código da aplicação**: `.ts` / `.tsx`
- **Jest**: config em `jest.config.cjs` para compatibilidade do runner
- **Execução de scripts TS**: via `tsx`

### **Gerenciamento de Ambiente**

- **Next.js**: Carrega automaticamente `.env.local` em desenvolvimento
- **Jest**: Usa `dotenv-cli` para carregar `.env.test`
- **Scripts**: Usam `dotenv-cli` para carregar ambiente específico

### **Banco de Dados**

- **Conexões**: Cada consulta abre/fecha conexão (adequado para desenvolvimento)
- **Configuração**: Centralizada em `infra/database.js`
- **Migrações**: Controladas via `node-pg-migrate`
- **Isolamento**: Ambientes completamente separados

### **Testes**

- **Sequenciamento**: Setup sempre executa primeiro
- **Isolamento**: Banco dedicado para testes
- **Consistência**: Estado limpo a cada execução
- **Performance**: Execução sequencial com `--runInBand`

## 🚧 **Roteiro de Desenvolvimento**

### **Implementado ✅**

- [x] Configuração de ambiente com Docker
- [x] Sistema de migrações robusto
- [x] Arquitetura de testes avançada
- [x] Separação completa de ambientes
- [x] API de status funcional
- [x] Sequenciador de testes customizado

### **Próximos Passos 🔄**

- [ ] Pool de conexões do banco de dados
- [ ] Sistema de seeds para dados iniciais
- [ ] Implementação de cache (Redis)
- [ ] Autenticação e autorização
- [ ] Mais endpoints da API
- [ ] Logs estruturados
- [ ] Monitoramento e métricas

## 📖 **Documentação Adicional**

- **[Testes](tests/README.md)** - Documentação completa do sistema de testes
- **[Migrações](infra/migrations/)** - Histórico de mudanças no banco

## 🤝 **Contribuição**

1. Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Execute os testes: `npm run test:full`
4. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
5. Push para a branch (`git push origin feature/AmazingFeature`)
6. Abra um Pull Request

## 📄 **Licença**

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 **Autor**

**Wander V. Bergami** - Projeto desenvolvido para estudos baseado no curso.dev

---

> 💡 **Dica**: Para desenvolvimento rápido, use `npm run dev:setup` seguido de `npm run dev`  
> 🧪 **Para testes**: Use `npm run test:setup` durante desenvolvimento e `npm run test:full` antes de commits

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

## 👨‍💻 Autor

**Wander V. Bergami**

---

> Projeto desenvolvido com foco em aprendizado de tecnologias modernas e boas práticas de desenvolvimento.
