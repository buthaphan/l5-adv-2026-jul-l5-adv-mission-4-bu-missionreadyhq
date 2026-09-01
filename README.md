# AI Insurance Recommendation Assistant

An AI-powered conversational application that helps users identify suitable vehicle insurance products based on their individual circumstances.

The application uses **Tina**, an AI insurance consultant, to have a dynamic conversation with the user, gather relevant information about their vehicle and coverage needs, and recommend one or more suitable insurance products.

The application combines **generative AI** for conversational reasoning with a **deterministic backend rules engine** for policy eligibility checks.

The application currently supports **Google Gemini** and **Azure AI**. The Azure implementation also uses an **AI agent in Microsoft Foundry with Retrieval-Augmented Generation (RAG)** to support claim-policy information.

## Features

- Conversational insurance consultation with Tina
- User opt-in before personal questions are asked
- Dynamic questions based on information already provided by the user
- Conversation history maintained throughout the session
- AI-powered insurance recommendations
- Deterministic policy eligibility validation
- Support for Google Gemini and Azure AI
- AI function/tool calling for policy evaluation
- Azure AI Agent integration
- Retrieval-Augmented Generation (RAG) for claim-policy information
- Markdown-formatted AI responses
- Loading and typing indicators
- Automated backend testing using Vitest and Supertest
- AI provider abstraction designed to support additional providers in the future
- Docker containerisation for frontend and backend
- Docker Compose support for running the complete application

## How It Works

The application follows a conversational workflow:

1. Tina displays an introduction and asks the user for permission to ask personal questions.
2. The user opts in to continue.
3. Tina asks questions dynamically based on information that is still missing.
4. Previous conversation history is provided to the AI so that previously supplied information is not requested again.
5. Once enough information has been gathered, Tina can invoke the `evaluate_policy` tool.
6. The backend evaluates the vehicle and requested policy against deterministic business rules.
7. The eligibility result is returned to the application.
8. Tina provides a recommendation with reasons based on the gathered information and policy eligibility.

For claim-policy questions, the Azure AI implementation can use an AI agent and RAG to retrieve relevant information before generating a response.

## AI Architecture

The application separates conversational AI responsibilities from deterministic business logic.

```text
                         Frontend
                            │
                            │ POST /api/chat/message
                            ▼
                     Express Chat API
                            │
                            ▼
                    Tina AI Service
                            │
                     AI_PROVIDER
                      /           \
                     ▼             ▼
                  Gemini       Azure AI
                                Foundry
                                  │
                           AI Agent + RAG
                                  │
                        Claim Policy Knowledge
                                  │
                     ┌────────────┴────────────┐
                     │                         │
                     ▼                         ▼
              AI Response              evaluate_policy
                                               │
                                               ▼
                                        Rules Engine
                                               │
                                               ▼
                                      Eligibility Result
                                               │
                                               ▼
                                        Recommendation
```

### Generative AI

The AI provider is responsible for:

- conducting the conversation;
- determining which information is still required;
- asking questions dynamically;
- interpreting the user's responses;
- deciding when policy evaluation is required;
- providing the final recommendation and supporting reasons.

### Backend Rules Engine

The backend rules engine is responsible for deterministic policy eligibility.

This separation prevents generative AI from being solely responsible for enforcing fixed business rules.

### Azure AI Agent and RAG

The Azure implementation uses an **AI agent in Microsoft Foundry** to support insurance-related conversations and claim-policy questions.

For claim-policy questions, the Azure AI agent uses a **Retrieval-Augmented Generation (RAG)** approach. Relevant information is retrieved from the configured knowledge source before the AI generates a response.

This allows the Azure implementation to provide responses grounded in the available claim-policy information rather than relying solely on the language model's general knowledge.

The RAG capability is specific to the Azure AI implementation and is not required for the standard Gemini recommendation workflow.

## Supported Insurance Products

### Mechanical Breakdown Insurance (MBI)

Provides cover for mechanical or electrical failure of the vehicle, such as engine or transmission issues.

MBI does not cover accidental damage or damage to third parties.

### Comprehensive Car Insurance

Provides cover for accidental damage to the user's own vehicle as well as damage caused to other people's vehicles or property.

### Third Party Car Insurance

Provides cover for damage the user causes to other people's vehicles or property.

It does not cover damage to the user's own vehicle.

## Business Rules

The application currently enforces the following eligibility rules:

| Insurance Product | Rule |
| ------------------------------------ | --------------------------------------------------------------- |
| Mechanical Breakdown Insurance (MBI) | Not available for trucks |
| Mechanical Breakdown Insurance (MBI) | Not available for racing cars |
| Comprehensive Car Insurance | Only available for vehicles less than 10 years old |
| Third Party Car Insurance | No exclusion rule currently defined in the backend rules engine |

The eligibility rules are implemented in the backend rather than relying on the AI model to determine eligibility.

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

### AI and Knowledge Retrieval

- Google Gemini
- Microsoft Azure AI
- Microsoft Foundry
- Azure AI Agent
- Retrieval-Augmented Generation (RAG)
- AI function/tool calling

### Testing

- Vitest
- Supertest
- Test-Driven Development (TDD) approach

### Containerisation

- Docker
- Docker Desktop
- Docker Compose
- Node.js Alpine images
- Nginx Alpine image

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
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── index.js
│   ├── server.js
│   └── package.json
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── ChatWindow.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── chat.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── index.html
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
├── docker-compose.yml
├── README.md
└── package.json
```

## Prerequisites

Before running the application, make sure the following are installed:

- Node.js
- npm
- Git
- Docker Desktop
- Docker Compose

You will also need credentials for at least one supported AI provider.

## Environment Variables

Environment-specific configuration is stored outside the source code.

### Backend

Create a `.env` file in the `backend` directory based on `backend/.env.example`.

#### Google Gemini

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key
```

#### Azure AI Workflow

```env
AI_PROVIDER=azure_workflow
PROJECT_ENDPOINT=your_project_endpoint
WORKFLOW_NAME=your_workflow_name
PROJECT_API_KEY=your_project_api_key
```

For Docker-based execution, Azure authentication uses Microsoft Entra ID through a service principal:

```env
AZURE_CLIENT_ID=your_azure_client_id
AZURE_TENANT_ID=your_azure_tenant_id
AZURE_CLIENT_SECRET=your_azure_client_secret
```

These credentials are used by `DefaultAzureCredential` inside the backend container.

Do not commit the client secret or any other credentials to the repository.

### Frontend

Create a `.env` file in the `client` directory based on `client/.env.example`.

For local development:

```env
VITE_API_ENDPOINT=http://localhost:3000/api/chat/message
```

For the Docker production build, the frontend uses:

```text
/api/chat/message
```

This allows Nginx to route API requests to the backend container through the Docker Compose network.

Do not commit `.env` files or API credentials to the repository.

## Installation

Clone the repository and install dependencies for both applications.

### Backend

From the repository root:

```bash
cd backend
npm install
```

### Frontend

Open another terminal from the repository root:

```bash
cd client
npm install
```

## Running the Application

For local development, the backend and frontend can be run as separate development processes. The application can also be run as a containerised deployment using Docker Compose.

### Start the Backend

From the `backend` directory:

```bash
npm start
```

The backend runs on port `3000` by default.

A health-check endpoint is available at:

```text
GET http://localhost:3000/health
```

### Start the Frontend

From the `client` directory:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

The frontend communicates with the backend using the endpoint configured by `VITE_API_ENDPOINT`.

## Running with Docker

The application can be run as two Docker containers:

- Frontend container using Nginx
- Backend container using Node.js

Docker Compose creates a network between the two containers.

### Build and Start

From the repository root:

```bash
docker compose up --build
```

The frontend is available at:

```text
http://localhost:8080
```

The backend is available at:

```text
http://localhost:3000
```

The backend health check can be tested at:

```text
http://localhost:3000/health
```

### Stop the Containers

```bash
docker compose down
```

### Restart the Application

The containers can be recreated from the Compose configuration using:

```bash
docker compose up
```

The backend receives its environment configuration from:

```text
backend/.env
```

The frontend Docker build uses:

```text
/api/chat/message
```

as the production API endpoint so that requests are routed through Nginx to the backend container.

## Docker Architecture

```text
                         Browser
                            │
                            │ http://localhost:8080
                            ▼
                  ┌───────────────────┐
                  │ Frontend Container│
                  │       Nginx       │
                  │       :80         │
                  └─────────┬─────────┘
                            │
                      /api requests
                            │
                            ▼
                  ┌───────────────────┐
                  │ Backend Container │
                  │    Node.js        │
                  │      :3000        │
                  └─────────┬─────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │ Microsoft Foundry │
                  │ Tina AI Agent     │
                  │       + RAG       │
                  └───────────────────┘
```

The frontend and backend containers communicate through the Docker Compose network.

Nginx serves the React production build and routes API requests to the backend service.

## Task 4 — Containerise the Application

The application was containerised using separate frontend and backend Docker containers.

### Backend Container

The backend is packaged using Node.js 22 Alpine.

The container:

- installs production dependencies;
- exposes port `3000`;
- starts the Express application using `npm start`;
- receives required environment variables from `backend/.env`.

### Frontend Container

The frontend uses a multi-stage Docker build.

The build stage:

- installs frontend dependencies;
- builds the React application using Vite.

The production stage uses Nginx to serve the generated static files.

The production frontend is configured to use:

```text
/api/chat/message
```

instead of `http://localhost:3000/api/chat/message`.

This allows API requests to be routed through the Nginx container to the backend container.

### Docker Compose

Docker Compose is used to run and connect the frontend and backend containers.

The two services communicate through the Docker Compose network.

The frontend does not need to know the backend container's internal IP address. Nginx routes `/api` requests to the backend service.

### Azure Authentication in Docker

The Azure implementation uses `DefaultAzureCredential`.

During local development, `DefaultAzureCredential` can use the developer's Azure CLI authentication.

Inside the Docker container, Azure CLI is not available, so the backend uses service-principal credentials supplied through environment variables:

```env
AZURE_CLIENT_ID=your_azure_client_id
AZURE_TENANT_ID=your_azure_tenant_id
AZURE_CLIENT_SECRET=your_azure_client_secret
```

The credentials are kept in the local `.env` file and are excluded from Git.

### Verification

The containerised application was tested by:

1. Building the backend Docker image successfully.
2. Building the frontend Docker image successfully.
3. Confirming the frontend production build does not contain `localhost:3000`.
4. Confirming the frontend production build uses `/api/chat/message`.
5. Starting both containers using Docker Compose.
6. Confirming the backend health endpoint.
7. Confirming the frontend loads through Nginx.
8. Sending a message through the Tina interface.
9. Confirming communication with the Azure AI service.
10. Confirming the Azure AI authentication works from inside the backend container.
11. Stopping the containers using `docker compose down`.
12. Starting them again using `docker compose up`.
13. Confirming the application continued to function after the clean restart.

This demonstrates that the application can be packaged and run in a portable containerised environment.

## Testing

The backend uses **Vitest** and **Supertest** for automated testing.

From the `backend` directory:

```bash
npm test
```

The test suite covers areas including:

- policy API behaviour;
- policy request validation;
- deterministic business-rule evaluation.

The backend separates the Express application from server startup, allowing the application to be imported and tested independently.

The current test suite contains:

- 4 rules engine tests;
- 3 policy validator tests;
- 2 policy API tests.

All 9 tests currently pass.

The backend testing approach follows a **Test-Driven Development (TDD)** workflow.

## API

### Chat

Send a message to Tina:

```text
POST /api/chat/message
```

Request body:

```json
{
  "message": "I drive a family SUV",
  "history": []
}
```

The `history` property contains previous conversation messages.

A successful text response has the following structure:

```json
{
  "success": true,
  "data": {
    "type": "text",
    "reply": "..."
  }
}
```

When Tina requests policy evaluation, the backend processes the `evaluate_policy` tool and returns the eligibility result.

### Policy Evaluation

The backend also exposes a deterministic policy evaluation endpoint:

```text
POST /api/policies/evaluate-policy
```

Example request:

```json
{
  "vehicle": {
    "type": "sedan",
    "age": 5
  },
  "requestedPolicy": "Comprehensive"
}
```

The request is validated using Zod before being passed to the rules engine.

## AI Provider Configuration

The application supports multiple AI providers through the `AI_PROVIDER` environment variable.

### Google Gemini

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_api_key
```

### Azure AI Workflow

```env
AI_PROVIDER=azure_workflow
PROJECT_ENDPOINT=your_project_endpoint
WORKFLOW_NAME=your_workflow_name
PROJECT_API_KEY=your_project_api_key
```

For Docker-based Azure authentication:

```env
AZURE_CLIENT_ID=your_azure_client_id
AZURE_TENANT_ID=your_azure_tenant_id
AZURE_CLIENT_SECRET=your_azure_client_secret
```

The provider abstraction allows the same Tina service interface to be used regardless of the selected supported AI provider.

The Azure implementation additionally supports claim-policy conversations through an AI agent and RAG.

Additional AI providers may be integrated in the future if development time and project requirements allow.

## Development Approach

The backend separates responsibilities between AI services, tools, business rules, and API routes:

```text
AI
→ Conversational reasoning and information gathering

Tool
→ Requests deterministic policy evaluation

Rules Engine
→ Enforces policy eligibility rules

API
→ Coordinates requests and responses

Frontend
→ Presents the conversation to the user
```

The backend testing approach follows a **Test-Driven Development (TDD)** workflow using Vitest and Supertest.

## Security and Configuration

Sensitive configuration is kept outside the source code.

The following files are excluded from Git:

```text
.env
.env.development.local
.env.test.local
.env.production.local
.env.local
```

Docker build contexts also exclude environment files using `.dockerignore`.

API keys, Azure client secrets, and other credentials should never be committed to the repository.

For production deployments, environment variables or a dedicated secrets-management solution should be used instead of committing credentials to configuration files.

# Architectural Refactoring & Future Roadmap

To keep scope manageable while maintaining a high quality bar, recent refactoring focused on separating state and business logic from UI components (e.g., extracting `useChat`). Given more time, the following incremental refactors are planned:

## 1. Presentational UI Sub-Components

* **Header & Status Indicator (`ChatHeader`):** Extract header rendering and status state logic into a dedicated presentation component.
* **Message List & Threading (`ChatMessageList`):** Separate individual message bubbles and the typing indicator to reduce rendering responsibilities in `ChatWindow`.
* **Input Action Bar (`ChatInput`):** Isolate the multi-line textarea and keydown event handlers into a re-usable input component.

## 2. State & API Architecture

* **Custom Hook Unit Testing:** Add isolated tests for `useChat` using `@testing-library/react-hooks` to validate error states and retry logic without rendering full DOM trees.
* **API Resilience Layer:** Move fetch timeouts and `AbortController` instantiation into a general-purpose API client wrapper to keep service methods purely declarative.


The AI provider architecture is designed so that additional providers can be integrated in the future if development time and project requirements allow.

## Project Context

This project was developed as part of the **Mission Ready Level 5 Advanced** programme.
