# AnswerRank AI

<div align="center">

![AnswerRank AI](https://img.shields.io/badge/AnswerRank-AI-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?style=for-the-badge&logo=vite)

**An intelligent AI-powered question-answering application with multi-turn conversations, smart ranking, and confidence scoring.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Setup](#-local-setup) • [How It Works](#-how-it-works)

</div>

---

## 📖 Overview

AnswerRank AI is a modern web application that leverages OpenAI's GPT-3.5 Turbo to generate multiple answers for any question, intelligently rank them based on relevance and quality, and present them in a beautiful chat interface. The app features multi-turn conversations with context preservation, local chat history, and a sophisticated ranking algorithm.

## ✨ Features

### 🤖 AI-Powered Answer Generation
- **Multi-Style Answers**: Generates 3 distinct answers with different styles:
  - **Concise & Beginner-Friendly**: Simple, easy-to-understand explanations
  - **Detailed & Technical**: Comprehensive, step-by-step technical answers
  - **Practical & Example-Driven**: Real-world, actionable advice

### 🎯 Intelligent Ranking System
- **Multi-Factor Scoring**: Ranks answers based on:
  - Keyword overlap with the question (40%)
  - Answer completeness and length (30%)
  - Structural quality and organization (20%)
  - Clarity penalties for vague content (10%)
- **Confidence Scores**: Each answer includes a confidence score (0-100)
- **Hallucination Detection**: Automatically penalizes uncertain or vague responses

### 💬 Multi-Turn Conversations
- **Context-Aware**: Maintains conversation history for follow-up questions
- **Smart Context Management**: Preserves last 6 conversation turns for optimal performance
- **Natural Flow**: Seamless chat experience similar to ChatGPT

### 📚 Local Chat History
- **Persistent Storage**: All chats saved locally using localStorage
- **Chat Management**: Create, switch, and delete conversations
- **Auto-Restore**: Automatically restores your last active chat on refresh
- **No Backend Required**: Fully client-side, no database needed

### 🎨 Modern UI/UX
- **Beautiful Design**: Glass-morphism effects, smooth animations, and gradient accents
- **3D Background**: Interactive Three.js background for visual appeal
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Theme**: Eye-friendly dark mode interface

### 📄 Product Pages
- **Features Page**: Showcase of application capabilities
- **How It Works**: Step-by-step explanation of the ranking system
- **Pricing Page**: Demo pricing plans (for portfolio purposes)

## 🛠 Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.8.3** - Type safety
- **Vite 5.4.19** - Build tool and dev server
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Framer Motion 12.23.26** - Animation library
- **React Router 6.30.1** - Client-side routing

### 3D Graphics
- **Three.js 0.160.1** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for react-three-fiber

### AI Integration
- **OpenAI GPT-3.5 Turbo** - Language model for answer generation

### State Management
- **React Context API** - Global state management
- **localStorage** - Client-side data persistence

## 🚀 Local Setup

### Prerequisites

- **Node.js** 18+ and npm (or yarn/pnpm)
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/answerrank-ai.git
   cd answerrank-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```env
   VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:8080` (or the port shown in terminal)

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_OPENAI_API_KEY` | Your OpenAI API key | Yes |

**Important**: Never commit your `.env` file. It's already in `.gitignore`.

## 🧠 How It Works

### Answer Generation Process

1. **User asks a question** → Input is captured and validated
2. **Context preparation** → Last 6 conversation turns are prepared for context
3. **Parallel generation** → Three answers are generated simultaneously with different styles:
   - Each uses a unique system prompt
   - Different temperature settings (0.7, 0.8, 0.9)
   - Varied token limits for different answer lengths
4. **Intelligent ranking** → Each answer is scored on multiple factors:
   - **Relevance**: How well it addresses the question keywords
   - **Completeness**: Optimal length (150-350 characters)
   - **Structure**: Use of lists, paragraphs, clear organization
   - **Clarity**: Penalties for vague phrases and repetition
5. **Ranking assignment** → Answers are ranked 1, 2, 3 based on final scores
6. **Display** → Ranked answers shown with confidence scores

### Ranking Algorithm

The ranking system uses a weighted formula:

```
Final Score = (Relevance × 30%) + (Confidence × 60%) - (Hallucination Penalty × 10%)
```

**Confidence Score Breakdown:**
- Keyword Overlap: 40% weight
- Completeness: 30% weight
- Structural Quality: 20% weight
- Clarity Penalty: 10% weight (subtracted)

### Chat History Management

- Chats are stored in browser localStorage
- Each chat includes:
  - Unique ID
  - Auto-generated title (from first question)
  - Message history with timestamps
  - Ranked answers for each assistant response
- Maximum 20 chats stored (oldest removed if limit exceeded)

## 📁 Project Structure

```
answerrank-ai/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   └── ...          # Custom components
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── services/          # API services (OpenAI)
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   │   ├── confidence.ts # Confidence scoring
│   │   ├── ranking.ts    # Ranking algorithm
│   │   └── storage.ts    # localStorage utilities
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
├── package.json         # Dependencies and scripts
├── README.md            # This file
└── vite.config.ts       # Vite configuration
```

## 🎯 Future Improvements

- [ ] Export chat history as JSON/PDF
- [ ] Share chat links with others
- [ ] Customizable ranking weights
- [ ] Support for multiple AI models
- [ ] Voice input/output
- [ ] Markdown rendering in answers
- [ ] Code syntax highlighting
- [ ] Chat search functionality
- [ ] Themes customization
- [ ] Rate limiting and usage tracking

## ⚠️ Important Notes

### OpenAI API Usage

- This application uses OpenAI's GPT-3.5 Turbo API
- **API costs**: You will be charged based on OpenAI's pricing
- **Rate limits**: Subject to OpenAI's rate limits
- **Privacy**: Questions and answers are sent to OpenAI's servers
- **Best practices**: 
  - Keep your API key secure
  - Monitor your usage on OpenAI dashboard
  - Set up usage limits if needed

### Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- localStorage required for chat history
- JavaScript must be enabled

### Data Storage

- All data is stored locally in your browser
- No data is sent to any server except OpenAI
- Clearing browser data will delete chat history
- No account or registration required

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Portfolio: [yourwebsite.com](https://yourwebsite.com)

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for the GPT-3.5 Turbo API
- [shadcn](https://ui.shadcn.com) for the beautiful component library
- [Vite](https://vitejs.dev) for the amazing build tool
- [Three.js](https://threejs.org) for 3D graphics capabilities

---

<div align="center">

Made with ❤️ using React, TypeScript, and OpenAI

⭐ Star this repo if you find it helpful!

</div>
