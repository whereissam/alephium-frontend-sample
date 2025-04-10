# React Vite Tanstack Starter Template for Alephium

A modern, feature-rich starter template for building dApps on the Alephium blockchain using React, Vite, and TanStack Query.

## Features

- ⚡️ **Vite** - Lightning fast build tool
- ⚛️ **React 18** - The latest React with Hooks
- 🔄 **TanStack Query** - Powerful data fetching and state management
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧩 **Shadcn UI** - Beautiful, accessible UI components
- 🔌 **Alephium Web3** - Seamless blockchain integration
- 🌙 **Dark Mode** - Built-in theme support
- 📱 **Responsive Design** - Mobile-first approach

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- bun

### Installation

1. Clone the repository:

```bash
git clone https://github.com/whereissam/alephium-frontend-sample.git
cd alephium-frontend-sample
```
### 2. Install dependencies:
```bash
bun install
```

### 3. Start the development server:
```bash
bun run dev
```
### 4. Open your browser and navigate to http://localhost:5173

## Project Structure
```plaintext
/src
  /components      # Reusable UI components
  /hooks           # Custom React hooks
  /lib             # Utility functions and configurations
  /pages           # Page components
  main.tsx         # Application entry point
vite.config.ts
```
## Alephium Integration
This template comes with built-in support for Alephium blockchain:
- Wallet connection using @alephium/web3-react
- Network information display
- Ready-to-use components for blockchain interaction

### Network Information
The template includes a Network Information page that displays:

- Node information
- Version details
- Chain parameters
- Mining difficulty and hashrate
- Clique information
## Customization
### Themes
The template uses Tailwind CSS for styling with dark mode support. You can customize the theme in tailwind.config.js .

### Components
UI components are built with Shadcn UI, which provides a collection of accessible, customizable components that you can copy and paste into your project.

## Deployment
Build your application for production:

```bash
bun run build
 ```

The build artifacts will be stored in the dist/ directory, ready to be deployed to your hosting provider of choice.

## Alephium Infos

- [Mainnet Node](https://node.mainnet.alephium.org/)
- [Testnet API](https://node.mainnet.alephium.org/docs/)
- [Testnet Node](https://node.testnet.alephium.org/)
- [Testnet API](https://node.testnet.alephium.org/docs/)
- [Little Ralph's Book](https://ralph.alephium.org/)

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

This completes the README with all the necessary sections including installation instructions, project structure, Alephium integration details, customization options, and deployment instructions.
