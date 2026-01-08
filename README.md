# Curso.Dev

> Projeto desenvolvido para estudo de novas tecnologias, baseado no curso.dev

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React para produção
- **PostgreSQL** - Banco de dados relacional
- **Docker** - Containerização dos serviços
- **Jest** - Framework de testes
- **Prettier** - Formatação de código

## 📁 Estrutura do Projeto

```
├── pages/
│   └── api/v1/status/     # API de status do sistema
├── infra/
│   ├── database.js        # Configuração do banco de dados
│   └── compose.yml        # Docker compose para serviços
├── tests/
│   └── integration/       # Testes de integração
├── models/                # Modelos de dados
├── scripts/               # Scripts de banco (futuro)
│   ├── migrate.js         # Migrações de banco
│   └── seed.js            # Dados iniciais
└── ...
```

## ⚙️ Configuração de Ambiente

O projeto utiliza diferentes arquivos de ambiente para cada contexto:

- **`.env.local`** - Desenvolvimento (Next.js carrega automaticamente)
- **`.env.test`** - Testes (carregado via dotenv-cli)
- **`.env.development`** - Scripts standalone

### Variáveis Necessárias

```env
NODE_ENV=ambiente
POSTGRES_HOST=host
POSTGRES_PORT=porta
POSTGRES_USER=seu_usuário
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=nome_do_banco
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

Copie e configure os arquivos `.env.local` e `.env.test` com suas credenciais.

### 4. Inicie os serviços

```bash
npm run services:up
```

### 5. Rode o projeto

```bash
npm run dev
```

O projeto estará disponível em: http://localhost:3001

## 📋 Scripts Disponíveis

### Desenvolvimento

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run services:up` - Sobe os serviços Docker (banco de dados)
- `npm run services:down` - Para os serviços Docker
- `npm run services:stop` - Para os serviços sem remover

### Testes

- `npm test` - Executa todos os testes
- `npm run test:watch` - Executa testes em modo watch

### Formatação

- `npm run lint:check` - Verifica formatação do código
- `npm run lint:fix` - Corrige formatação automaticamente

### Banco de Dados (Futuros)

- `npm run db:migrate` - Executa migrações de banco
- `npm run db:seed` - Popula banco com dados iniciais

## 🧪 Testes

### Executar testes

```bash
npm test
```

### Tipos de teste

- **Integração**: Testa a API completa incluindo banco de dados
- **Unidade**: Testa funções isoladamente

### Ambiente de teste

Os testes utilizam automaticamente as configurações do arquivo `.env.test` via `dotenv-cli`.

## 🐳 Docker

### Serviços disponíveis

- **PostgreSQL**: Banco de dados principal na porta 5433

### Comandos úteis

```bash
# Subir serviços
npm run services:up

# Ver logs
docker-compose -f infra/compose.yml logs

# Parar serviços
npm run services:down
```

## 🔧 API Endpoints

### Status da Aplicação

```
GET /api/v1/status
```

Retorna informações sobre:

- Status da aplicação
- Versão do banco de dados
- Conexões ativas do banco
- Número máximo de conexões

**Resposta de exemplo:**

```json
{
  "status": "ok",
  "updatedAt": "2026-01-05T20:59:22.852Z",
  "dependency": {
    "database": {
      "version": "PostgreSQL 16.11...",
      "max_Connections": 100,
      "opened_connections": 1
    }
  }
}
```

## 📚 Arquitetura

### Gerenciamento de Ambiente

- **Next.js**: Carrega automaticamente `.env.local` em desenvolvimento
- **Jest**: Usa `dotenv-cli` para carregar `.env.test`
- **Scripts**: Usam `dotenv-cli` para carregar `.env.development`

### Conexão com Banco

- Cada consulta abre e fecha uma conexão (adequado para desenvolvimento)
- Configuração centralizada em `infra/database.js`
- Validação de conexão nos testes

## 🚧 Próximos Passos

- [ ] Implementar sistema de migrações
- [ ] Criar seeds para dados iniciais
- [ ] Adicionar pool de conexões do banco
- [ ] Implementar autenticação
- [ ] Adicionar mais endpoints da API

## 📝 Contribuição

1. Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

## 👨‍💻 Autor

**Wander V. Bergami**

---

> Projeto desenvolvido com foco em aprendizado de tecnologias modernas e boas práticas de desenvolvimento.
