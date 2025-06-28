# Alephium Frontend Sample

A beautifully designed, modern dApp showcase for the Alephium blockchain featuring vibrant UI, responsive design, and comprehensive blockchain integration.

![](https://i.imgur.com/K98O2SR.png)

## ✨ Features

- ⚡️ **Vite 7** - Lightning fast build tool with HMR
- ⚛️ **React 19** - Latest React with concurrent features
- 🎨 **TailwindCSS 4** - Next-generation utility-first CSS
- 🧩 **Shadcn UI** - Beautiful, accessible component library
- 🔌 **Alephium Web3 v2** - Latest blockchain integration
- 🌈 **Modern Dark Theme** - Vibrant gradients and glass morphism effects
- 📱 **Fully Responsive** - Mobile-first with hamburger navigation
- 🎯 **TypeScript** - Full type safety throughout
- 🔄 **TanStack Router** - Modern file-based routing

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/whereissam/alephium-frontend-sample.git
cd alephium-frontend-sample
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
# or  
bun run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎨 Design System

This project features a modern, vibrant design system with:

- **Gradient backgrounds** with animated blur effects
- **Glass morphism** cards with backdrop blur
- **Color-coded sections** for visual hierarchy  
- **Hover animations** and micro-interactions
- **Mobile-optimized** touch targets and navigation

## 📁 Project Structure
```plaintext
/src
  /components      # Reusable UI components
    /ui           # Shadcn UI components  
    Navbar.tsx    # Mobile-responsive navigation
  /lib            # Utility functions and configurations
  /pages          # Page components
    Home.tsx      # Landing page with wallet integration
    About.tsx     # Project information
    Transaction.tsx # Send ALPH tokens
    NetworkInfo.tsx # Blockchain data
    ContractExplorer.tsx # Smart contract tools
  main.tsx        # Application entry point
  router.tsx      # TanStack Router configuration
```

## 🔗 Pages Overview

### 🏠 **Home Page**
- Wallet connection with beautiful UI
- Network status and balance display  
- Feature highlights with hover effects
- Responsive 50/50 layout

### 📄 **About Page**
- Comprehensive Alephium information
- Interactive feature cards
- Technical details about BlockFlow and PoLW
- Token information and ecosystem details

### 💸 **Transaction Page**  
- Send ALPH tokens with intuitive form
- Real-time balance checking
- Transaction status tracking
- Mobile-optimized input controls

### 🌐 **Network Info Page**
- Live blockchain statistics
- Node information and performance metrics
- Chain parameters and mining data
- Visual data presentation with gradients

### 🔍 **Contract Explorer Page**
- Smart contract state inspection
- Event browsing and filtering
- Contract ID to address conversion
- Token ID converter with official token list
## 🛠️ Technical Details

### Blockchain Integration
- **Alephium Web3 v2.0.0-rc.2** - Latest SDK with enhanced features
- **Multi-network support** - Mainnet, Testnet, and Devnet
- **Wallet integration** - Connect, disconnect, and account management
- **Real-time data** - Live blockchain statistics and updates

### Modern Stack
- **TailwindCSS 4.x** - Latest version with PostCSS plugin architecture
- **React 19** - Concurrent features and improved performance  
- **Vite 7** - Fastest build tool with optimized HMR
- **TypeScript** - Full type safety and IntelliSense

### Mobile Experience
- **Responsive design** - Works perfectly on all device sizes
- **Touch-optimized** - Proper touch targets and gestures
- **Hamburger navigation** - Clean mobile menu with smooth animations
- **Progressive enhancement** - Desktop-first features, mobile-optimized UX

## 🚀 Deployment

Build your application for production:

```bash
npm run build
# or
bun run build
```

The build artifacts will be stored in the `dist/` directory, ready to be deployed to your hosting provider of choice.

### Deployment Platforms
- **Vercel** - Zero-config deployment  
- **Netlify** - Continuous deployment from Git
- **GitHub Pages** - Free static hosting
- **Any static host** - Works with any CDN or static file server

## 📚 Alephium Resources

- 🌐 [Mainnet Node](https://node.mainnet.alephium.org/) - Production network
- 🔧 [Mainnet API Docs](https://node.mainnet.alephium.org/docs/) - API reference
- 🧪 [Testnet Node](https://node.testnet.alephium.org/) - Testing network  
- 📖 [Testnet API Docs](https://node.testnet.alephium.org/docs/) - Testing API
- 📝 [Ralph Documentation](https://ralph.alephium.org/) - Smart contract language
- 🔗 [Official Website](https://alephium.org/) - Learn more about Alephium
- 💬 [Discord Community](https://discord.gg/alephium) - Join the community

## 🤝 Contributing

Contributions are welcome! This project showcases modern web development practices for blockchain applications.

### Development Guidelines
- Follow the existing code style and patterns
- Ensure mobile responsiveness for all new features  
- Maintain type safety with TypeScript
- Test on multiple screen sizes and devices
- Keep the vibrant design language consistent

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for the Alephium ecosystem**
