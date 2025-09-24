# Token Burn-Bridge-to-Vest

A modern DeFi application that enables users to bridge ERC20 tokens from Base network to Solana with automatic vesting contracts.

## Features

- Cross-chain token bridging from Base to Solana
- Automatic vesting contract creation
- Support for popular tokens like PENGU and AIKA
- Real-time transaction monitoring
- Modern, responsive UI with shadcn/ui components

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod validation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=your_api_url
VITE_AUTH_TOKEN=your_auth_token

# Network Configuration
VITE_BASE_CHAIN_ID=8453
VITE_SOLANA_NETWORK=devnet
VITE_DEFAULT_VESTING_DURATION=90

# Explorer URLs
VITE_BASE_EXPLORER_URL=https://basescan.org
VITE_SOLANA_EXPLORER_URL=https://explorer.solana.com
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/          # React components
│   ├── bridge/         # Bridge-specific components
│   └── ui/            # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── services/          # API services
├── store/             # State management
├── types/             # TypeScript type definitions
└── App.tsx            # Main app component
```

## How It Works

1. **Token Selection**: Users select from supported ERC20 tokens (PENGU, AIKA)
2. **Bridge Configuration**: Set vesting duration and destination Solana wallet
3. **Token Burn**: Tokens are burned on the Base network
4. **Vesting Creation**: Automatic vesting contract creation on Solana
5. **Monitoring**: Real-time tracking of transaction status

## License

This project is licensed under the MIT License.