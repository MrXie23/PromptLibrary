**English** | [中文](./prompt-library/docs/README.zh-CN.md)

# Prompt Library

> Explore, use, and share carefully curated AI prompts to unlock the full potential of artificial intelligence.

## 📖 About

Prompt Library is an open-source platform focused on collecting, categorizing, and sharing high-quality AI prompts. Our goal is to create a comprehensive collection of prompts categorized by use case, helping everyone from beginners to experts get the most out of AI models.

## 🚀 Live Demo

Visit the website: [Prompt Library](https://mrxie23.github.io/PromptLibrary/)

## ✨ Key Features

- 📋 Browse prompts by categories including content creation, programming, design, and more
- 🔍 Powerful search functionality to quickly find relevant prompts
- ⭐ Rating system to highlight the most effective prompts
- 📱 Responsive design, perfect for all devices
- 🌐 Multi-language interface with Chinese language support

## 🛠️ Tech Stack

- **Next.js** - React framework providing server-side rendering and static site generation
- **React** - User interface library
- **TypeScript** - Type-safe JavaScript superset
- **MDX** - Markdown extension for content management
- **CSS Modules** - Component-level style management

## 📁 Project Structure

```
prompt-library/
├── src/                  # Source code
│   ├── app/              # Next.js app pages
│   ├── components/       # React components
│   ├── lib/              # Utility functions and helper libraries
│   └── types/            # TypeScript type definitions
├── prompts/              # Prompt content (Markdown + JSON)
├── public/               # Static assets
├── scripts/              # Build scripts
└── next.config.js        # Next.js configuration
```

## 🔧 Local Development

### Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn package manager

### Installation Steps

1. Clone the repository

   ```bash
   git clone https://github.com/mrxie23/PromptLibrary.git
   cd prompt-library
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and visit `http://localhost:3000`

## 🏗️ Building and Deployment

```bash
# Generate production build
npm run build

# Preview production build locally
npm run start
```

## 📝 Adding New Prompts

1. Create a new Markdown file in the `prompts/` directory
2. Add frontmatter metadata:
   ```md
   ---
   title: Prompt Title
   description: Brief description
   category: Category Name
   ---
   ```
3. Write the prompt content
4. Create a JSON file with the same name, containing additional information:
   ```json
   {
     "slug": "prompt-slug",
     "rating": 9.5,
     "createdAt": "YYYY-MM-DD",
     "featured": false,
     "isNew": true
   }
   ```

## 🤝 Contributing

We welcome contributions of all kinds!

1. Fork and clone the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add an amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Submit a Pull Request

## 📜 License

This project is licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgements

Thanks to all the developers and community members who have contributed to this project!
