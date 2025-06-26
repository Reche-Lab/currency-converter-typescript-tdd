# Conversor de Moedas API (TypeScript + Express)

API para conversão de moedas usando dados em tempo real, desenvolvida com TypeScript, Express e seguindo princípios SOLID.

## 🚀 Características

- **TypeScript**: Tipagem estática para maior segurança e produtividade
- **Express.js**: Framework web rápido e minimalista
- **Arquitetura SOLID**: Separação clara de responsabilidades
- **TDD com Jest**: Testes unitários e de integração
- **Debug Ready**: Configuração pronta para depuração no VSCode
- **API Externa**: Integração com ExchangeRate-API
- **Validação Robusta**: Validação completa de inputs
- **CORS Habilitado**: Suporte para requisições cross-origin
- **Segurança**: Helmet.js para headers de segurança

## 📁 Estrutura do Projeto

```
/src
  /controllers        # Rotas (Express)
  /services           # Lógica de conversão
  /repositories       # Chamadas à API externa
  /models             # Interfaces/Tipos
  /tests
    /unit             # Testes unitários
    /integration      # Testes de integração
  /config             # Configurações (API keys, etc.)
  /utils              # Utilitários (validação, etc.)
```

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### 1. Clone o repositório

```bash
git clone <repository-url>
cd currency-converter-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure suas variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# Configurações da API
PORT=3000
NODE_ENV=development

# API Externa de Câmbio
EXCHANGE_RATE_API_KEY=sua_chave_aqui
EXCHANGE_RATE_API_URL=https://v6.exchangerate-api.com/v6

# Configurações de CORS
CORS_ORIGIN=*
```

### 4. Obtenha uma chave da API

1. Acesse [ExchangeRate-API](https://exchangerate-api.com/)
2. Registre-se gratuitamente
3. Copie sua chave de API
4. Cole no arquivo `.env`

## 🚀 Executando a Aplicação

### Modo Desenvolvimento

```bash
npm run dev
```

### Modo Produção

```bash
npm run build
npm start
```

### Executando Testes

```bash
# Todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Testes com coverage
npm run test:coverage
```

## 🔧 Debug no VSCode

O projeto inclui configuração pronta para debug no VSCode:

1. Abra o projeto no VSCode
2. Vá para a aba "Run and Debug" (Ctrl+Shift+D)
3. Selecione uma das configurações:
   - **Debug API Server**: Executa o servidor em modo debug
   - **Debug Tests**: Executa todos os testes em modo debug
   - **Debug Current Test File**: Executa apenas o arquivo de teste atual

4. Pressione F5 para iniciar o debug

### Breakpoints

- Coloque breakpoints clicando na margem esquerda do editor
- Use F9 para adicionar/remover breakpoints
- Use F10 para step over, F11 para step into

## 📚 Uso da API

### Endpoints Disponíveis

#### 1. Health Check
```bash
GET /api/health
```

**Resposta:**
```json
{
  "success": true,
  "message": "Currency Converter API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

#### 2. Moedas Suportadas
```bash
GET /api/currencies
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "currencies": ["USD", "BRL", "EUR", "GBP", "JPY", "..."],
    "count": 168
  }
}
```

#### 3. Conversão de Moedas
```bash
GET /api/convert?from=USD&to=BRL&amount=100
```

**Parâmetros:**
- `from`: Moeda de origem (ex: USD)
- `to`: Moeda de destino (ex: BRL)  
- `amount`: Valor a ser convertido (ex: 100)

**Resposta de Sucesso:**
```json
{
  "success": true,
  "data": {
    "from": "USD",
    "to": "BRL",
    "amount": 100,
    "convertedAmount": 525.00,
    "rate": 5.25,
    "timestamp": 1705312200000
  }
}
```

**Resposta de Erro:**
```json
{
  "error": "Validation failed",
  "message": "Invalid request parameters",
  "details": [
    "Amount must be a positive number"
  ]
}
```

### Exemplos de Uso

#### cURL
```bash
# Conversão básica
curl "http://localhost:3000/api/convert?from=USD&to=BRL&amount=100"

# Conversão com valores decimais
curl "http://localhost:3000/api/convert?from=EUR&to=USD&amount=123.45"

# Listar moedas suportadas
curl "http://localhost:3000/api/currencies"
```

#### JavaScript/Fetch
```javascript
// Conversão de moedas
const response = await fetch(
  'http://localhost:3000/api/convert?from=USD&to=BRL&amount=100'
);
const data = await response.json();
console.log(data);

// Moedas suportadas
const currenciesResponse = await fetch(
  'http://localhost:3000/api/currencies'
);
const currencies = await currenciesResponse.json();
console.log(currencies.data.currencies);
```

## 🏗️ Arquitetura SOLID

### Single Responsibility Principle (SRP)
- **Controllers**: Apenas manipulação de requisições HTTP
- **Services**: Apenas lógica de negócio
- **Repositories**: Apenas acesso a dados externos
- **Models**: Apenas definição de tipos e interfaces

### Dependency Inversion Principle (DIP)
- Uso de interfaces para abstrair dependências
- Injeção de dependência nos construtores
- Facilita testes unitários com mocks

### Exemplo de Injeção de Dependência
```typescript
// Interface
interface IExchangeRateRepository {
  getExchangeRate(from: string, to: string): Promise<ExchangeRate>;
}

// Implementação
class ExchangeRateRepository implements IExchangeRateRepository {
  // implementação real
}

// Mock para testes
class MockExchangeRateRepository implements IExchangeRateRepository {
  // implementação mock
}

// Serviço recebe a interface
class CurrencyConversionService {
  constructor(private repository: IExchangeRateRepository) {}
}
```

## 🧪 Estratégia de Testes

### Testes Unitários
- **Services**: Lógica de conversão com mocks
- **Utils**: Funções de validação
- **Isolamento**: Cada unidade testada independentemente

### Testes de Integração
- **Rotas**: Endpoints completos
- **Fluxo E2E**: Da requisição à resposta
- **Validações**: Cenários de sucesso e erro

### Cobertura de Testes
```bash
npm run test:coverage
```

Gera relatório em `coverage/lcov-report/index.html`

## 🔒 Validações

### Códigos de Moeda
- Exatamente 3 caracteres
- Apenas letras (A-Z)
- Case insensitive (USD = usd)

### Valores
- Números positivos
- Suporte a decimais
- Strings numéricas aceitas

### Exemplos de Validação
```typescript
// ✅ Válidos
{ from: "USD", to: "BRL", amount: 100 }
{ from: "usd", to: "brl", amount: "123.45" }

// ❌ Inválidos  
{ from: "US", to: "BRL", amount: 100 }      // Código muito curto
{ from: "USD", to: "BRL", amount: -100 }    // Valor negativo
{ from: "US1", to: "BRL", amount: 100 }     // Caracteres inválidos
```

## 🚨 Tratamento de Erros

### Códigos de Status HTTP
- `200`: Sucesso
- `400`: Erro de validação ou parâmetros inválidos
- `404`: Rota não encontrada
- `500`: Erro interno do servidor

### Estrutura de Erro Padrão
```json
{
  "error": "Tipo do erro",
  "message": "Descrição detalhada",
  "details": ["Lista de erros específicos"] // opcional
}
```

## 🔧 Scripts Disponíveis

```bash
npm run build      # Compila TypeScript para JavaScript
npm start          # Executa versão compilada
npm run dev        # Executa em modo desenvolvimento
npm test           # Executa todos os testes
npm run test:watch # Executa testes em modo watch
npm run test:coverage # Executa testes com relatório de cobertura
npm run lint       # Executa ESLint
npm run lint:fix   # Executa ESLint e corrige automaticamente
```

## 🌐 Deploy

### Variáveis de Ambiente para Produção
```env
NODE_ENV=production
PORT=3000
EXCHANGE_RATE_API_KEY=sua_chave_de_producao
EXCHANGE_RATE_API_URL=https://v6.exchangerate-api.com/v6
CORS_ORIGIN=https://seudominio.com
```

### Docker (Opcional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a [documentação](#-uso-da-api)
2. Consulte os [exemplos de uso](#exemplos-de-uso)
3. Execute os testes para verificar se tudo está funcionando
4. Abra uma issue no repositório

## 📊 Monitoramento

### Logs
A aplicação registra automaticamente:
- Requisições HTTP (método, rota, timestamp)
- Erros de aplicação
- Erros de API externa

### Health Check
Use o endpoint `/api/health` para monitoramento:
```bash
curl http://localhost:3000/api/health
```

---

**Desenvolvido com ❤️ usando TypeScript + Express**

