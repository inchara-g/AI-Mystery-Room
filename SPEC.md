# AI Mystery Room — Software Specification Document

**Project Name:** AI Mystery Room
**Document Version:** 1.0
**Project Type:** AI-powered mystery investigation web application
**Architecture:** MERN stack
**AI Provider:** Google Gemini API
**Status:** Initial specification

---

## 1. Project Overview

AI Mystery Room is an interactive web application that allows users to create and solve AI-generated detective mysteries. Users enter a mystery premise, select a difficulty level, investigate suspects, discover clues, request hints, and accuse the person they believe is responsible.

Google Gemini generates the mystery content, while the backend validates the mystery, stores the case, manages player progress, and calculates the final score.

### 1.1 Problem Statement

Traditional puzzle games often provide fixed stories and limited replayability. AI Mystery Room aims to provide a more engaging experience by generating different mystery scenarios based on user input and difficulty level.

### 1.2 Objectives

- Generate original mysteries using Gemini.
- Provide three difficulty levels: Easy, Medium, and Hard.
- Allow players to investigate suspects and discover clues.
- Provide hints without revealing the solution prematurely.
- Validate accusations and calculate scores on the backend.
- Store cases and progress in MongoDB.
- Deploy a working application accessible through a public URL.

### 1.3 Target Users

- Students interested in AI-powered applications.
- Casual gamers who enjoy detective stories.
- Users interested in puzzles, logical reasoning, and interactive storytelling.

### 1.4 Expected User Experience

The interface should feel like a detective investigation room. Users should be able to understand the story, inspect suspects, discover clues, request hints, and submit an accusation without confusion.

The application must be responsive, beginner-friendly, visually appealing, and easy to navigate.

---

## 2. Technology Stack

### 2.1 Frontend

- React — component-based user interface.
- Vite — frontend development server and build tool.
- Tailwind CSS — responsive styling.
- React Router DOM — page navigation.
- Axios — communication with backend APIs.

### 2.2 Backend

- Node.js — JavaScript runtime.
- Express.js — REST API server.
- Mongoose — MongoDB object modeling.
- Zod — request and AI-output validation.
- `@google/genai` — Gemini API integration.
- `dotenv` — environment configuration.
- `cors` — controlled cross-origin access.

### 2.3 Database and External Services

- MongoDB Atlas — cloud database.
- Google Gemini API — mystery generation.
- Vercel — frontend deployment.
- A Node.js-compatible hosting provider — backend deployment.

Exact package versions and the supported Gemini model must be confirmed during implementation.

---

## 3. Core Features

### 3.1 Required Features

1. Home page with project introduction and start button.
2. Mystery creation using a premise and difficulty.
3. AI-generated story, suspects, clues, and hints.
4. Investigation room with clue discovery.
5. Hint request system.
6. Suspect selection and accusation submission.
7. Backend-controlled scoring.
8. Results page with verdict, culprit, and explanation.
9. Option to start another mystery.
10. Persistent case storage using MongoDB.
11. Loading indicators and clear error messages.
12. Responsive design for desktop, tablet, and mobile.
13. Secure handling of API keys and secret solutions.
14. Production deployment and complete workflow testing.

### 3.2 Optional Enhancements

These features are not required for the first working version:

- Player accounts and authentication.
- Personal case history.
- Leaderboard.
- Sound effects and animations.
- Achievement badges.
- Downloadable case reports.
- Additional languages.
- Daily mystery challenges.

Optional enhancements must not delay the core application.

---

## 4. User Flow

1. The user opens the home page.
2. The user selects **Create Mystery**.
3. The user enters a premise or chooses to use a default premise.
4. The user selects Easy, Medium, or Hard.
5. The frontend sends a request to the backend.
6. The backend validates the request and asks Gemini to generate structured mystery data.
7. The backend validates the generated data and verifies that the solution is consistent with the clues.
8. The backend stores the case in MongoDB, separating the public case data from the secret solution.
9. The frontend opens the investigation room.
10. The user reviews the story and suspects.
11. The user discovers clues and requests hints.
12. The user selects a suspect and submits an accusation.
13. The backend validates the accusation and calculates the score.
14. The results page displays the verdict, correct culprit, explanation, and final score.
15. The user starts a new mystery.

If generation or an API request fails, the application must show an understandable error and allow the user to retry safely.

---

## 5. UI and Page Specifications

### 5.1 Home Page

**Purpose:** Introduce the game and encourage users to begin.

Required elements:

- Project title: AI Mystery Room.
- Short description of the detective experience.
- Start Investigation button.
- Brief explanation of how to play.
- Difficulty overview.
- Responsive navigation.

The Start Investigation button navigates to the Create Mystery page.

### 5.2 Create Mystery Page

**Purpose:** Collect the user's mystery preferences.

Required elements:

- Mystery premise text area.
- Character limit: 10–500 characters when a premise is provided.
- Difficulty selector: Easy, Medium, Hard.
- Generate Mystery button.
- Input validation messages.
- Loading state during generation.
- Error state with retry option.
- Back navigation.

The backend must validate all inputs independently of frontend validation.

### 5.3 Investigation Room

**Purpose:** Allow the user to investigate the generated case.

Required elements:

- Mystery title.
- Story and case description.
- Difficulty indicator.
- Suspect cards containing public descriptions and motives.
- Clue list showing undiscovered and discovered clues.
- Discover Clue action.
- Request Hint action.
- Number of discovered clues.
- Number of hints used.
- Current score.
- Progress indicator.
- Submit Accusation button.

Only one point award is permitted per clue. Repeated discovery requests must not increase the score.

Hints must be revealed one at a time, in order. The application must not expose unrevealed hints or the secret solution through client data.

### 5.4 Accusation Page or Dialog

**Purpose:** Let the user select the suspected culprit.

Required elements:

- Suspect selection.
- Suspect identification and public descriptions.
- Confirmation before submission.
- Submit Accusation button.
- Loading state while the backend processes the accusation.
- Error message for invalid or repeated submissions.

Submitting an accusation ends the active investigation. A completed case cannot be accused again.

### 5.5 Results Page

**Purpose:** Present the final outcome.

Required elements:

- Correct or incorrect verdict.
- Correct culprit's name.
- Explanation of the solution.
- Evidence connecting the culprit to the mystery.
- Final score.
- Score breakdown.
- Play Again button.

The culprit and complete explanation must only be returned after the backend has accepted and processed the first valid accusation.

### 5.6 Shared UI States

All pages must support:

- Loading indicators.
- Empty states where applicable.
- Friendly error messages.
- Disabled buttons during requests.
- Retry actions for recoverable failures.
- Clear navigation.
- Responsive layouts and accessible form controls.

---

## 6. Difficulty Configuration

The backend must enforce the following configuration.

| Setting                    | Easy | Medium | Hard |
| -------------------------- | ---: | -----: | ---: |
| Suspects                   |    3 |      4 |    5 |
| Clues                      |    5 |      7 |    9 |
| Hints                      |    2 |      3 |    3 |
| Correct accusation bonus   |  100 |    150 |  200 |
| Points per discovered clue |    5 |      5 |    5 |
| Points per hint used       |  -10 |    -10 |  -10 |

These values must be defined in backend configuration rather than trusted from the frontend.

The user may discover all available clues, but each clue can award points only once.

---

## 7. AI Behavior and Mystery Generation

### 7.1 Gemini Responsibilities

Gemini must generate:

- A unique mystery title.
- A story describing the incident.
- A list of suspects.
- Suspect identities, motives, and public descriptions.
- The correct culprit.
- A secret solution explaining how the incident occurred.
- The configured number of clues.
- A configured number of hints.
- An explanation connecting the clues to the solution.

### 7.2 Logical Consistency

Each generated mystery must have exactly one intended culprit.

The clues must support the solution through logical reasoning. The solution must not depend on facts that were never established in the story or clues.

Suspect descriptions must be distinct enough to support meaningful investigation.

The solution should explain how the clues establish the culprit's responsibility and why the alternatives are less likely.

If generated content is invalid, incomplete, contradictory, or inconsistent with the selected difficulty, the backend must reject it and retry generation a limited number of times. If retries fail, return a controlled error without saving a broken case.

AI-generated content must be treated as untrusted data and validated before use.

### 7.3 Expected Internal JSON Structure

Gemini must return structured JSON matching the following conceptual schema:

```
{
  "title": "The Clocktower Secret",
  "story": "A detailed mystery story...",
  "suspects": [
    {
      "id": "suspect-1",
      "name": "Alex",
      "description": "Publicly known details...",
      "motive": "A possible reason..."
    }
  ],
  "clues": [
    {
      "id": "clue-1",
      "title": "A Broken Watch",
      "description": "Evidence discovered by the player...",
      "significance": "How it supports the solution..."
    }
  ],
  "hints": [
    "Consider who could access the locked room."
  ],
  "solution": {
    "culpritId": "suspect-1",
    "explanation": "Complete solution...",
    "evidence": [
      "Evidence connecting the culprit to the incident."
    ]
  }
}
```

The example illustrates the structure only. The actual generated mystery must contain the exact number of suspects, clues, and hints required by the selected difficulty.

**Security rule:** This internal structure must never be returned directly to the frontend. The backend must separate the public case representation from the secret solution and unrevealed hints.

The frontend must never receive `culpritId`, the complete solution, clue significance that would reveal the answer, or unrevealed hint content before the appropriate stage.

---

## 8. Scoring System

### 8.1 Scoring Formula

```
Final Score = Correct Accusation Bonus
            + (Discovered Clues × 5)
            - (Hints Used × 10)

Final Score = max(0, Calculated Score)
```

If the accusation is incorrect, the correct accusation bonus is zero.

### 8.2 Maximum Scores

| Difficulty | Bonus | Maximum clue points | Maximum score without hints |
| ---------- | ----: | ------------------: | --------------------------: |
| Easy       |   100 |                  25 |                         125 |
| Medium     |   150 |                  35 |                         185 |
| Hard       |   200 |                  45 |                         245 |

The maximum scores assume every clue is discovered and the player uses no hints.

### 8.3 Scoring Rules

- Each unique clue discovery awards 5 points.
- Each successfully revealed hint deducts 10 points.
- Correct accusations earn the configured difficulty bonus.
- Incorrect accusations earn no accusation bonus.
- Final scores cannot be negative.
- Scores must be calculated on the backend.
- The frontend must never submit a score to be accepted as authoritative.
- Duplicate requests must not award or deduct points multiple times.
- The completed result and score breakdown must be persisted in MongoDB.

---

## 9. Backend API Specification

All routes use the `/api` prefix and JSON request and response bodies.

### 9.1 Generate Mystery

**Endpoint:** `POST /api/cases`

Request:

```
{
  "premise": "A valuable painting disappears from a locked gallery.",
  "difficulty": "easy"
}
```

Success response — HTTP 201:

```
{
  "success": true,
  "data": {
    "id": "case-id",
    "title": "The Gallery Mystery",
    "difficulty": "easy",
    "story": "The public mystery story...",
    "suspects": [],
    "clues": [],
    "progress": {
      "discoveredClueIds": [],
      "hintsUsed": 0,
      "currentScore": 0,
      "status": "active"
    }
  }
}
```

The example arrays are abbreviated. The real response contains the public suspect and clue information, with undiscovered clues represented safely.

### 9.2 Retrieve Active Mystery

**Endpoint:** `GET /api/cases/:id`

Returns the public case information and current progress.

It must not return the secret solution, culprit identifier, unrevealed hints, or other secret fields.

### 9.3 Discover a Clue

**Endpoint:** `POST /api/cases/:id/clues/:clueId/discover`

Request body: empty JSON object.

Success response includes:

- The newly discovered clue.
- Updated discovered clue identifiers.
- Updated score.
- Updated progress.

If the clue has already been discovered, return the existing state without awarding additional points.

### 9.4 Request a Hint

**Endpoint:** `POST /api/cases/:id/hints`

Request:

```
{}
```

Success response:

```
{
  "success": true,
  "data": {
    "hintNumber": 1,
    "hint": "Review the timing of the incident.",
    "hintsUsed": 1,
    "currentScore": 0
  }
}
```

The score shown here is illustrative. The actual score depends on the current case state.

The backend reveals only the next available hint, deducts points once, and rejects requests after all hints have been used.

### 9.5 Submit an Accusation

**Endpoint:** `POST /api/cases/:id/accuse`

Request:

```
{
  "suspectId": "suspect-1"
}
```

Success response:

```
{
  "success": true,
  "data": {
    "status": "completed",
    "correct": true,
    "culprit": {
      "id": "suspect-1",
      "name": "Alex"
    },
    "explanation": "The evidence supports the accusation...",
    "score": {
      "correctAccusationBonus": 100,
      "cluePoints": 10,
      "hintPenalty": 0,
      "finalScore": 110
    }
  }
}
```

The response is illustrative. The backend must calculate the values from stored case data and the actual accusation.

Only the first valid accusation is processed. Later accusation requests must not alter the completed result.

### 9.6 Retrieve Completed Result

**Endpoint:** `GET /api/cases/:id/result`

Returns the completed result only if the case has already been completed.

For an active case, return HTTP 409 with a safe error response. An invalid case identifier returns HTTP 400 or 404, depending on the validation stage.

### 9.7 Standard Error Format

```
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please select a valid difficulty."
  }
}
```

Expected error categories include:

- `VALIDATION_ERROR`
- `CASE_NOT_FOUND`
- `CASE_ALREADY_COMPLETED`
- `INVALID_CLUE`
- `HINT_LIMIT_REACHED`
- `INVALID_ACCUSATION`
- `RATE_LIMIT_EXCEEDED`
- `AI_GENERATION_FAILED`
- `DATABASE_ERROR`
- `INTERNAL_SERVER_ERROR`

Error responses must not include API keys, stack traces, database credentials, secret solutions, or internal prompt content.

---

## 10. Database Design

### 10.1 Mystery Case Model

Create a Mongoose model named `Case`.

Required fields:

- `title`: string.
- `story`: string.
- `premise`: string.
- `difficulty`: enum — `easy`, `medium`, `hard`.
- `suspects`: array of suspect objects.
- `clues`: array of clue objects.
- `hints`: array of hint strings.
- `solution`: embedded secret solution object.
- `progress`: embedded player progress object.
- `result`: embedded completed result, initially null.
- `createdAt`: date.
- `updatedAt`: date.

### 10.2 Suspect Structure

Each suspect contains:

- `id`: unique identifier within the case.
- `name`: string.
- `description`: public description.
- `motive`: public information.

### 10.3 Clue Structure

Each clue contains:

- `id`: unique identifier within the case.
- `title`: string.
- `description`: revealed only after discovery.
- `significance`: private reasoning used to explain the solution.

The backend must return only the clue information appropriate to the current discovery state.

### 10.4 Secret Solution Structure

The solution contains:

- `culpritId`: identifier of the correct suspect.
- `explanation`: complete explanation of the case.
- `evidence`: evidence supporting the conclusion.

The solution is stored only on the backend and is never exposed in an active case response.

### 10.5 Player Progress Structure

Progress contains:

- `discoveredClueIds`: array of discovered clue identifiers.
- `revealedHintCount`: integer.
- `currentScore`: integer.
- `status`: `active` or `completed`.
- `accusedSuspectId`: null until accusation.
- `startedAt`: date.
- `completedAt`: nullable date.

The completed result records whether the accusation was correct and the final score breakdown.

### 10.6 Persistence and Data Integrity

- Validate data before saving.
- Enforce unique clue and suspect identifiers within each case.
- Ensure clue discovery is idempotent.
- Ensure hint penalties cannot be applied twice for the same hint.
- Ensure completed cases cannot be modified by gameplay endpoints.
- Use atomic updates or transactions where necessary to prevent duplicate scoring during concurrent requests.
- Do not allow client-supplied identifiers or score values to override server state.

The first version does not require user accounts. A case identifier is not a substitute for authentication, so case identifiers must be sufficiently unpredictable and protected by rate limits and sensible resource limits.

---

## 11. Security Requirements

1. Store `GEMINI_API_KEY` only in the backend environment.
2. Store `MONGODB_URI` only in the backend environment.
3. Never include secrets in frontend environment variables or client bundles.
4. Exclude `.env` files from Git.
5. Provide `.env.example` with placeholder values only.
6. Validate all incoming request bodies and path parameters using Zod or equivalent validation.
7. Restrict CORS to the configured frontend origin in production.
8. Apply request size limits and rate limits to expensive endpoints.
9. Avoid logging API keys, private prompts, or complete secret solutions.
10. Return only public case fields while a case is active.
11. Keep solution validation and score calculation on the backend.
12. Sanitize user-provided premise text and safely render generated content as text.
13. Never execute generated code or treat AI output as trusted instructions.
14. Handle Gemini and database failures without leaking sensitive information.

The solution must remain private in API responses, errors, browser network responses, and other client-accessible data until the accusation is submitted.

---

## 12. Backend Architecture and Folder Structure

Target structure:

```
AI-Mystery-Room/
├── SPEC.md
├── README.md
├── .gitignore
├── client/
│   ├── index.html
│   ├── package.json
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── ...
└── server/
    ├── package.json
    ├── .env.example
    └── src/
        ├── config/
        ├── models/
        ├── routes/
        ├── controllers/
        ├── services/
        ├── middleware/
        ├── validators/
        ├── utils/
        └── server.js
```

The exact files may change as implementation progresses, but the frontend and backend must remain separate applications.

Use a dedicated Gemini service, case service, controller layer, route layer, and validation layer. Keep business logic out of route definitions wherever practical.

---

## 13. Environment Configuration

Backend `.env`:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

The backend must validate required environment variables at startup and fail with a clear, non-sensitive message if configuration is missing.

Production values must be configured through the hosting provider's environment-variable settings.

The frontend must call the backend through a configurable API base URL. No secret API keys may be placed in the frontend.

---

## 14. Testing Requirements

### 14.1 Mystery Generation

- Generate a mystery at each difficulty level.
- Verify exact suspect, clue, and hint counts.
- Reject malformed AI output.
- Reject a solution referencing a nonexistent suspect.
- Reject duplicate identifiers.
- Verify that logically inconsistent cases are not saved.

### 14.2 Investigation

- Discover a clue and verify the score increases by 5.
- Discover the same clue again and verify the score does not change.
- Request a hint and verify a 10-point penalty.
- Verify that repeated requests cannot apply duplicate penalties.
- Verify that hint limits are enforced.
- Verify that invalid case and clue identifiers are rejected.

### 14.3 Accusation and Results

- Submit a correct accusation.
- Submit an incorrect accusation.
- Verify the correct difficulty bonus is awarded only for a correct accusation.
- Verify that the score cannot fall below zero.
- Verify that a completed case cannot be accused again.
- Verify that the correct culprit and explanation appear in the final result.

### 14.4 Security

- Inspect active-case API responses for secret fields.
- Verify unrevealed hints are not exposed.
- Verify that scores submitted by a client cannot influence the final result.
- Verify API keys are absent from frontend build files.
- Verify CORS, request validation, and rate limiting.
- Verify that failed requests do not corrupt case progress.

### 14.5 User Interface

- Test all five pages or equivalent views.
- Test loading, empty, and error states.
- Test navigation and retry behavior.
- Test desktop, tablet, and mobile layouts.
- Verify the complete workflow after deployment.

---

## 15. Deployment Plan

### Backend

1. Create a MongoDB Atlas database.
2. Configure network access and database credentials securely.
3. Deploy the Express server to a Node.js-compatible hosting provider.
4. Configure production environment variables.
5. Verify the health endpoint and database connection.
6. Test API endpoints using the deployed backend URL.

### Frontend

1. Build the React application using Vite.
2. Configure the production backend API URL.
3. Deploy the frontend to Vercel.
4. Configure the production frontend origin in backend CORS settings.
5. Test the full workflow on the public website.

### Production Verification

- Mystery generation works.
- All three difficulties work.
- Clues and hints update progress correctly.
- Accusations produce correct results.
- Scores are calculated on the backend.
- Secret solutions remain protected.
- Database records persist.
- Errors are handled gracefully.
- The deployed site works on desktop and mobile.

---

## 16. Acceptance Criteria

The project is complete when:

- [ ] `SPEC.md` describes the implementation requirements.
- [ ] Frontend and backend are separate applications.
- [ ] MongoDB connection and case persistence work.
- [ ] Gemini generates valid mysteries at all three difficulty levels.
- [ ] The generated suspect, clue, and hint counts match the configuration.
- [ ] Players can discover clues and request hints.
- [ ] Players can submit an accusation.
- [ ] Correct and incorrect accusations produce the expected outcomes.
- [ ] Backend scoring follows the defined formula.
- [ ] Duplicate requests cannot manipulate scores.
- [ ] The solution remains private before accusation.
- [ ] The results page displays the culprit and explanation.
- [ ] Users can start another mystery.
- [ ] Loading, validation, and API errors are handled.
- [ ] Environment variables and API keys are protected.
- [ ] Core functionality is tested.
- [ ] The production website works end to end.
- [ ] A GitHub repository and live website URL are available.
- [ ] A complete mystery is created and solved on the deployed website.

---

## 17. Implementation Order

Build and verify the application in this order:

1. Finalize this specification.
2. Initialize the React/Vite frontend.
3. Initialize the Express backend.
4. Add environment configuration and a health endpoint.
5. Connect MongoDB Atlas.
6. Create the Mongoose case model.
7. Implement request validation and public/secret data separation.
8. Integrate Gemini and validate generated mysteries.
9. Implement case creation and retrieval endpoints.
10. Implement clue discovery, hint requests, accusations, and scoring.
11. Build the React pages and API service layer.
12. Connect the frontend to the backend.
13. Test the complete investigation workflow.
14. Resolve errors and security issues.
15. Deploy the backend and frontend.
16. Test the live website and prepare the final submission.

Do not implement every feature in one large code-generation step. Complete each stage, run it, verify the expected behavior, and then continue.

---

## 18. Final Deliverables

The final submission must contain:

1. A complete `SPEC.md`.
2. Frontend source code.
3. Backend source code.
4. MongoDB integration.
5. Gemini API integration.
6. Working mystery generation and investigation.
7. Working accusation, scoring, and results.
8. A README with setup and execution instructions.
9. A GitHub repository URL.
10. A live deployed website URL.
11. Evidence of a complete mystery-solving demonstration.

**Final objective:** Build a secure, functional, AI-powered mystery game using spec-driven development, and demonstrate the complete experience on a live website.
