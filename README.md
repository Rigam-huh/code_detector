
⚡ CodeLens: AI-Powered Code Reviewer
CodeLens is a sophisticated full-stack application designed to act as a virtual mentor for programming students. It provides deep, automated insights into code quality, algorithmic efficiency, and security anti-patterns using state-of-the-art Large Language Models (LLMs).

🎯 Project Overview
In the journey of learning to code, students often lack immediate, high-quality feedback. CodeLens bridges this gap by providing:

Instant Grading: A holistic 0-100 score based on industry standards.

Visual Analytics: Interactive Radar and Bar charts to visualize abstract concepts like "Readability" and "Best Practices."

Performance Profiling: Automated Big O complexity detection for every function.

Educational Findings: Targeted advice that explains why a change is needed, rather than just pointing out an error.

🏗️ Technical Architecture
Frontend (The UI)
Built with React, the interface is designed for high scannability and "information at a glance."

Visualizations: Powered by Recharts, translating raw AI data into Radar and Bar charts.

State Management: Uses React hooks for real-time loading states and smooth transitions between "Findings" and "Complexity" tabs.

Responsive Design: A sleek, dark-themed dashboard that works across desktop and mobile browsers.

Backend (The Logic)
The Node.js/Express server serves as the orchestrator between the user and the AI.

Intelligent Caching: Uses a SHA-256 hashing algorithm to store results. If the same code is submitted twice, the result is served instantly from a Map cache, saving API costs and processing time.

Validation Layer: Uses Zod to enforce strict typing. This ensures that even if an AI model "hallucinates" a field, the system catches it before it breaks the UI.

Rate Limiting: Integrated express-rate-limit to protect the server from abuse.

The AI Engine (The Brain)
The project supports a dual-engine approach:

Cloud Mode: Integrates with Anthropic’s Claude 3.5 Sonnet for high-precision, industrial-grade analysis.

Local Mode: Integrates with Ollama (Llama 3), allowing the entire system to run offline on the user's machine for 100% privacy and zero cost.

🛠️ Data Processing Pipeline
The system follows a strict 4-step pipeline for every request:

Sanitization: Input code is cleaned and hashed for cache lookup.

Prompt Engineering: The code is wrapped in a "system-level" prompt that forces the AI into "JSON-only mode" to ensure machine-readable output.

JSON Repair: A custom regex-based extractJSON function cleans the LLM response, removing markdown backticks or conversational "chatter" (e.g., "Sure, here is your JSON...").

Schema Enforcement: The data is piped through a Zod schema to transform strings to numbers and ensure all required visualization fields exist.

🚀 Installation & Local Setup
1. Prerequisites
Node.js (v18 or higher)

Ollama (If you wish to run the AI locally)

2. Setup Backend
* Bash
* cd server
* npm install
# Create a .env file and add ANTHROPIC_KEY=your_key (if using Claude)
node server.js
3. Setup Frontend
* Bash
* cd client
* npm install
* npm start
4. Local AI Configuration
To run without an API key:

Install Ollama.

In your terminal, run: ollama pull llama3.

Ensure the backend is configured to point to http://localhost:11434.

📊 Roadmap
[ ] Multi-file Support: Analyze entire folders or GitHub PRs.

[ ] PDF Export: Allow students to download their code "Report Card."

[ ] History Tab: Track score improvements over time.
