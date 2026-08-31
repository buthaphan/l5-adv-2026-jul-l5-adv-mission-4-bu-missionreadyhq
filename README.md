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

For claim-policy questions, the Azure AI agent uses a **Retrieval-Augmented Generation (RAG)** approach. Relevant information is retrieved from the configured knowledge source before the AI generates its response.

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

| Insurance Product                    | Rule                                                            |
| ------------------------------------ | --------------------------------------------------------------- |
| Mechanical Breakdown Insurance (MBI) | Not available for trucks                                        |
| Mechanical Breakdown Insurance (MBI) | Not available for racing cars                                   |
| Comprehensive Car Insurance          | Only available for vehicles less than 10 years old              |
| Third Party Car Insurance            | No exclusion rule currently defined in the backend rules engine |

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
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
├── README.md
└── package.json
```

## Prerequisites

Before running the application, make sure the following are installed:

- Node.js
- npm
- Git

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

### Frontend

Create a `.env` file in the `client` directory based on `client/.env.example`.

```env
VITE_API_ENDPOINT=http://localhost:3000/api/chat/message
```

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

The backend and frontend are currently run as separate development processes.

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

The provider abstraction allows the same Tina service interface to be used regardless of the selected supported AI provider.

The Azure implementation additionally supports claim-policy conversations through an AI agent and RAG.

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

## Future Enhancements

Potential future improvements include:

- Adding additional generative AI providers.
- Expanding the insurance product catalogue.
- Adding more policy eligibility rules.
- Improving recommendation explanations.
- Adding persistent conversation or session management.
- Adding automated CI testing through GitHub Actions.
- Improving deployment and production configuration.
- Expanding the Azure RAG knowledge base and claim-policy capabilities.

The AI provider architecture is designed so that additional providers can be integrated in the future if development time and project requirements allow.

## Project Context

This project was developed as part of the **Mission Ready Level 5 Advanced** programme.
