# GitLab Icon Generator

A modern web application for generating custom project icons for GitLab repositories. Create beautiful, professional icons with customizable colors, sizes, and icon types.

## ✨ Features

- **🎨 Icon Selection**: Choose from generic icons and brand icons
- **🌈 Color Customization**:
  - Wide range of pre-defined color palettes
  - Dark/Light mode themes with intelligent color mapping
  - Real-time color preview
  - Custom colors *(coming soon)*
- **📏 Size Control**:
  - Adjustable output size
  - Icon size percentage control
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🔗 Shareable Links**: Generate and copy shareable URLs with all settings preserved
- **📥 Multiple Export Formats**: Download as PNG or SVG

## 🚀 Live Demo

[View Live Demo](https://giacomoferretti.github.io/gitlab-icon-generator/) 

## 📦 Installation

### Prerequisites

- Node.js 24+
- pnpm 10.15.0+

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/giacomoferretti/gitlab-icon-generator.git
   cd gitlab-icon-generator
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start development server**

   ```bash
   pnpm dev
   ```

## 🎨 Customization

### Adding New Icons

1. **Generic Icons** (Lucide):

   ```typescript
   // Add to genericIcons array in app.tsx
   {
     type: "lucide",
     name: "NewIcon",
     icon: NewIcon, // from lucide
     previewComponent: NewIconComponent, // from lucide-react
   }
   ```

2. **Brand Icons** (Simple Icons):

   ```typescript
   // Add to brandIcons array in app.tsx
   {
     type: "simple",
     name: "BrandName",
     icon: siBrandname, // from simple-icons
     previewComponent: SiBrandname, // from @icons-pack/react-simple-icons
   }
   ```

### Adding Color Palettes

```typescript
// Add to lightColorPalette or darkColorPalette in app.tsx
NewColor: { bg: "#BACKGROUND_HEX", icon: "#ICON_HEX" }
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Lucide](https://lucide.dev/) for the beautiful icon set
- [Simple Icons](https://simpleicons.org/) for brand icons
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives
- [Satori](https://github.com/vercel/satori) for SVG generation
- [RESVG](https://github.com/RazrFalcon/resvg) for PNG conversion

## 💖 Support My Work

If you find my projects useful, consider supporting me:  

[![Donate on Liberapay](https://img.shields.io/badge/Liberapay-giacomoferretti-F6C915.svg?style=flat-square&logo=liberapay)](https://liberapay.com/giacomoferretti)  
[![Support me on Ko-fi](https://img.shields.io/badge/Ko--fi-giacomoferretti-ff5f5f?style=flat-square&logo=ko-fi)](https://ko-fi.com/giacomoferretti)  
[![Donate via PayPal](https://img.shields.io/badge/PayPal-hexile0-0070ba?style=flat-square&logo=paypal)](https://www.paypal.me/hexile0)  

Your support helps me continue improving these tools and creating new ones. Thank you! 🙌

If you can't donate, I also appreciate **stars** ⭐ on my repositories!
