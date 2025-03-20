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
- 🔧 Integrated Prompt Manager for easy content management

## 🛠️ Tech Stack

- **Next.js** - React framework providing server-side rendering and static site generation
- **React** - User interface library
- **TypeScript** - Type-safe JavaScript superset
- **MDX** - Markdown extension for content management
- **CSS Modules** - Component-level style management
- **Tailwind CSS** - Utility-first CSS framework used for Prompt Manager

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

prompt-manager/           # Management tool for prompt content
├── src/                  # Source code
│   ├── components/       # UI components
│   ├── lib/              # Utility functions
│   ├── pages/            # App pages & API routes
│   ├── styles/           # CSS styles
│   └── types/            # TypeScript type definitions
└── public/               # Static assets
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

### Method 1: Manually Adding Files

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

### Method 2: Using Prompt Manager

The Prompt Manager is a web-based tool designed to help you manage your prompt library with an intuitive interface. It provides a user-friendly way to create, edit, and organize your prompts.

#### Starting Prompt Manager

1. Navigate to the prompt-manager directory:

   ```bash
   cd prompt-manager
   ```

2. Install dependencies (first time only):

   ```bash
   npm install
   ```

3. Start the Prompt Manager:

   ```bash
   npm run dev
   # or use the start.bat file on Windows
   ```

4. Open your browser and visit `http://localhost:3000`

#### Key Features of Prompt Manager

- **Dashboard**: View statistics and key information about your prompt library
- **Browse**: List all prompts with search, filter, and sort functionality
- **Create**: Add new prompts with a visual editor and template options
- **Edit**: Modify existing prompt content and properties
- **Categories**: Manage prompt categories
- **Preview**: See how your prompts will look before saving

#### Creating a New Prompt

1. Click on the "Create New Prompt" button in the dashboard or navigation menu
2. Fill in the required fields:
   - Title
   - Description
   - Category
   - Content (supports Markdown format)
3. Optionally customize:
   - File name (or let the system generate one)
   - Rating (1-10)
   - Featured status
   - New status
4. Click "Create Prompt" to save

#### Editing an Existing Prompt

1. Navigate to the prompt list page
2. Find the prompt you want to edit and click on it
3. Click the "Edit" button
4. Make your changes to the content or properties
5. Click "Save Changes" to update the prompt

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
