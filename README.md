# ChatGPT Vercel Deployment

A grammar correction assistant powered by OpenAI Agents SDK, deployed on Vercel.

## Features

- Real-time grammar correction using OpenAI's GPT models
- Clean, modern chat interface
- Separate agent workflow script for easy maintenance
- Deployed on Vercel for instant scaling

## Project Structure

```
├── app/
│   ├── api/chat/route.ts    # API endpoint for chat
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main page
│   └── globals.css           # Global styles
├── components/
│   └── ChatInterface.tsx     # Chat UI component
├── lib/
│   └── agent.ts              # Agent workflow script (SEPARATE)
├── package.json
├── tsconfig.json
├── next.config.js
└── vercel.json
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/aivercelcheckpoint)

### Manual Deployment

1. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add your `OPENAI_API_KEY` in the Vercel dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add `OPENAI_API_KEY` with your API key

## Agent Script

The agent workflow is kept separate in `lib/agent.ts`. It includes:

- Grammar correction agent
- Classification system
- OpenAI Agents SDK integration

You can modify the agent behavior by editing this file independently from the rest of the application.

## Usage

1. Type a message in the input field
2. The AI will correct any grammar mistakes
3. View the corrected text in the chat interface

## License

MIT
