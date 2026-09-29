# AI Insurance Recommendation Assistant

An AI-powered conversational application that helps users identify suitable vehicle insurance products based on their individual circumstances.

The application uses **Tina**, an AI insurance consultant, to gather information about a user's vehicle and coverage needs, ask dynamic questions, and provide insurance recommendations.

The architecture combines **generative AI** for conversational reasoning with a **deterministic backend rules engine** for policy eligibility. The application supports **Google Gemini** and **Azure AI**. The Azure implementation also uses a **Microsoft Foundry AI agent with Retrieval-Augmented Generation (RAG)** for claim-policy information.

## Key Features

- Conversational insurance consultation with Tina
- Dynamic questions based on information already provided
- Conversation history maintained throughout the session
- AI-powered insurance recommendations
- Deterministic policy eligibility validation
- Multiple AI providers through a common provider abstraction
- AI function/tool calling for policy evaluation
- Microsoft Foundry AI agent integration
- RAG support for claim-policy information
- Markdown-formatted AI responses
- Loading, typing, error, and service-availability states
- Automated backend testing with Vitest and Supertest
- Docker containerisation for frontend and backend
- Docker Compose support
- Nginx reverse proxy for frontend/API routing
- GitHub Actions CI/CD
- GitHub Container Registry (GHCR)
- Azure Container Apps deployment using Bicep and OIDC

## How It Works

The application follows a conversational workflow:

1. Tina introduces the consultation and asks the user for permission to ask personal questions.
2. Tina gathers the information required to understand the user's vehicle and coverage needs.
3. Conversation history is provided to the AI so previously supplied information can be retained.
4. When enough information has been gathered, Tina can request the `evaluate_policy` tool.
5. The backend passes the request to the deterministic rules engine.
6. The rules engine evaluates the vehicle and requested insurance product against defined eligibility rules.
7. The eligibility result is returned to the application.
8. Tina provides a recommendation based on the gathered information and policy eligibility.

For claim-policy questions, the Azure implementation can use a Microsoft Foundry AI agent and RAG to retrieve relevant information before generating the response.

## Architecture

The application separates conversational AI responsibilities from deterministic business logic.

```text
                         Frontend
                            │
                            │ POST /api/chat/message
                            ▼
                     Express Chat API
                            │
                            ▼
                     Chat Service
                            │
                            ▼
                    AI Provider Layer
                     /             \
                    ▼               ▼
                 Gemini          Azure AI
                                  Foundry
                                    │
                             AI Agent + RAG
                                    │
                         Claim Policy Knowledge
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
             AI Response                    evaluate_policy
                                                    │
                                                    ▼
                                             Rules Engine
                                                    │
                                                    ▼
                                           Eligibility Result
```

### AI Provider Abstraction

The AI layer exposes a common response structure for the supported providers:

```text
AI Provider
    │
    ├── Gemini
    │
    └── Azure AI Workflow
            │
            └── Microsoft Foundry Agent
```

The selected provider is controlled through the `AI_PROVIDER` environment variable. The common provider interface allows the chat service to remain independent of the underlying AI platform.

AI responses are normalised into either:

- a standard text response; or
- a tool-call request containing the tool name and arguments.

### Deterministic Policy Evaluation

Generative AI is responsible for conversational reasoning and deciding when policy evaluation is required. It does not independently enforce the fixed eligibility rules.

The `evaluate_policy` tool passes the relevant vehicle and policy information to the backend rules engine.

The rules engine then returns a deterministic eligibility result.

This separation keeps fixed business rules in application code rather than relying solely on a generative model.

## Business Rules

The current backend rules engine enforces these eligibility rules:

| Insurance Product                    | Rule                                               |
| ------------------------------------ | -------------------------------------------------- |
| Mechanical Breakdown Insurance (MBI) | Not available for trucks                           |
| Mechanical Breakdown Insurance (MBI) | Not available for racing cars                      |
| Comprehensive Car Insurance          | Only available for vehicles less than 10 years old |
| Third Party Car Insurance            | No exclusion rule currently defined                |

The rules are represented as explicit exclusion rules and evaluated by the backend.

## Azure AI and RAG

The Azure implementation uses Microsoft Foundry through the Azure AI provider.

For relevant claim-policy conversations, the application can use an AI agent and Retrieval-Augmented Generation (RAG) to retrieve information from the configured insurance knowledge source before generating a customer-facing response.

The Azure workflow also includes a compliance-review path for selected insurance-related questions, where a draft response can be reviewed by the configured compliance reviewer agent before being returned to the user.

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Vanilla Extract CSS
- React Markdown
- Zod
- Oxlint
- Nginx

### Backend

- Node.js
- Express
- Zod
- Google Gemini API
- Azure AI Projects
- Azure Identity

### AI

- Google Gemini
- Microsoft Azure AI
- Microsoft Foundry
- Azure AI Agent
- Retrieval-Augmented Generation (RAG)
- AI function/tool calling
- Multiple AI provider abstraction

### Testing

- Vitest
- Supertest
- Test-Driven Development (TDD) approach

### Containerisation & Deployment

- Docker
- Docker Compose
- Node.js Alpine
- Nginx Alpine
- GitHub Actions
- GitHub Container Registry
- Azure Container Apps
- Azure Bicep
- OpenID Connect (OIDC)

## Project Structure

```text
.
├── backend/
│   ├── config/
│   │   ├── prompts.js
│   │   └── tools.js
│   ├── routes/
│   │   ├── chatRouter.js
│   │   └── policyRouter.js
│   ├── scripts/
│   ├── services/
│   │   └── ai/
│   │       ├── azureWorkFlowProvider.js
│   │       ├── geminiProvider.js
│   │       └── index.js
│   ├── tests/
│   │   ├── policyApi.test.js
│   │   ├── policyValidator.test.js
│   │   └── rulesEngine.test.js
│   ├── utils/
│   │   └── rulesEngine.js
│   ├── validators/
│   │   └── policyValidator.js
│   ├── .env.example
│   ├── Dockerfile
│   └── server.js
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatWindow.tsx
│   │   ├── hooks/
│   │   │   └── useChat.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── chat.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vite.config.ts
│
├── infra/
│   ├── container-app.bicep
│   ├── environment.bicep
│   └── main.bicep
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── docker-compose.yml
└── package.json
```

## Testing

The backend uses **Vitest** and **Supertest** for automated testing.

The current test suite covers:

- deterministic rules-engine behaviour
- policy request validation
- policy API behaviour

The documented test suite contains:

- 4 rules engine tests
- 3 policy validator tests
- 2 policy API tests

The backend separates the Express application from server startup, allowing the application to be imported and tested independently.

## Docker

The application is containerised as separate frontend and backend services.

### Backend

The backend uses a Node.js Alpine image and runs the Express application on port `3000`.

### Frontend

The frontend uses a multi-stage Docker build:

1. Vite builds the React application.
2. Nginx serves the production build.
3. Nginx routes `/api` requests to the backend.

### Docker Compose

Docker Compose connects the frontend and backend services on a shared network.

```text
Browser
   │
   ▼
Frontend Container
     Nginx :80
   │
   │ /api
   ▼
Backend Container
   Node.js :3000
   │
   ▼
AI Provider
```

## CI/CD and Azure Deployment

The repository includes GitHub Actions workflows for:

- backend testing
- frontend builds
- Docker image builds
- publishing images to GHCR
- Azure infrastructure deployment

The infrastructure is defined using **Azure Bicep** and the deployment workflow uses **OpenID Connect (OIDC)** for Azure authentication.

The CI workflow builds the backend and frontend images after the application checks have completed, then publishes the resulting container images to GitHub Container Registry.

## Configuration

Environment-specific configuration is kept outside the source code.

### Backend

Create `backend/.env` from `backend/.env.example`.

Supported configuration includes:

```env
# Server
PORT=3000

# AI Provider
AI_PROVIDER=gemini

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# Azure AI / Microsoft Foundry
PROJECT_ENDPOINT=your_project_endpoint
WORKFLOW_NAME=your_workflow_name
PROJECT_API_KEY=your_project_api_key

# Azure Authentication for Docker
AZURE_CLIENT_ID=your_azure_client_id
AZURE_TENANT_ID=your_azure_tenant_id
AZURE_CLIENT_SECRET=your_azure_client_secret
```

For local Gemini development, set:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key
```

For the Azure workflow, configure the required Microsoft Foundry project and Azure authentication values.

### Frontend

Create `client/.env` from `client/.env.example`.

For local development:

```env
VITE_API_ENDPOINT=http://localhost:3000/api/chat/message
```

Environment files and credentials should not be committed to the repository.

## Running Locally

### Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd client
npm install
```

### Start the backend

From `backend/`:

```bash
npm start
```

The backend runs on port `3000` by default.

Health check:

```text
GET http://localhost:3000/health
```

### Start the frontend

From `client/`:

```bash
npm run dev
```

Vite will display the local development URL.

### Run with Docker Compose

From the repository root:

```bash
docker compose up --build
```

The frontend is available on port `8080` and the backend on port `3000`.

Stop the containers with:

```bash
docker compose down
```

## Project Status

This project demonstrates a full-stack AI application combining conversational AI, deterministic business rules, automated testing, containerisation, CI/CD, and Azure cloud infrastructure.

The project is currently structured as a prototype and development project rather than a production insurance service.

## Author

**Banphot Uthaphan**

AI-Powered Full Stack Developer
