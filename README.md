# Personal Blog with Next.js

A modern blog built with Next.js 15, React 19, TypeScript, and CSS Modules. Features include dark mode, markdown support with syntax highlighting, search functionality, and Vercel Analytics.

## Features

- 🌓 Dark/Light mode
- 📝 Markdown support
- 🎨 Syntax highlighting for code blocks
- 🔍 Search functionality
- 📱 Responsive design
- 🎯 SEO friendly
- 🚀 Fast page loads
- 💅 CSS Modules for styling
- 📊 Vercel Analytics & Speed Insights
- 💬 Giscus comments integration
- 📦 Exact dependency versions for reproducible builds

## Tech Stack

- **Next.js**: 15.5.12 (App Router)
- **React**: 19.2.4
- **TypeScript**: 5.9.3
- **Markdown**: markdown-to-jsx 9.7.3
- **Syntax Highlighting**: Prism.js 1.30.0
- **Theming**: next-themes 0.4.6
- **Analytics**: Vercel Analytics & Speed Insights
- **Comments**: Giscus
- **Node.js**: 24.0.0+

## Getting Started

### Prerequisites

- Node.js 24.0.0 or later
- npm
- [asdf](https://asdf-vm.com/) (optional, for managing Node.js versions)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/helderberto/helderberto.com.git
cd helderberto.com
```

2. Install Node.js 24 (using asdf):

```bash
asdf install nodejs 24.0.0
```

Or use the `.tool-versions` file:

```bash
asdf install
```

3. Install dependencies:

```bash
npm install
```

Note: This project uses exact dependency versions (`.npmrc` with `save-exact=true`) for reproducible builds.

4. Add your profile picture:

- Place your profile picture in `public/profile.jpg`

5. Update content:

- Edit `content/about.md` with your information
- Add blog posts in the `posts` directory

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Available commands:
- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Build

Create a production build:

```bash
npm run build
```

This will:
1. Compile TypeScript
2. Run linting
3. Generate static pages
4. Optimize bundles
5. Export static site

Start the production server:

```bash
npm start
```

## Project Structure

```
├── .npmrc              # npm config (exact versions)
├── .tool-versions      # asdf version management (Node 24)
├── content/
│   └── about.md        # About page content
├── posts/              # Blog posts in markdown
├── public/             # Static files
│   └── profile.jpg     # Your profile picture
└── src/
    ├── app/
    │   ├── about/     # About page
    │   ├── posts/[slug]/ # Dynamic blog post pages
    │   └── layout.tsx # Root layout with theme provider
    ├── components/
    │   ├── CodeBlock.tsx # Syntax highlighting
    │   ├── Comments.tsx  # Giscus comments
    │   ├── MarkdownContent.tsx # Client-side markdown renderer
    │   ├── ThemeProvider.tsx # Theme management
    │   └── ...
    ├── config/        # Site configuration
    ├── lib/          # Utility functions
    └── types/        # TypeScript type definitions
```

## Adding Blog Posts

Create a new markdown file in the `posts` directory:

```markdown
---
title: "Your Post Title"
date: "YYYY-MM-DD"
excerpt: "A brief description of your post"
---

# Your Post Title

Your content here...
```

Your code blocks here...

```

```

## Customization

### Colors

Edit the color variables in `src/app/globals.css`:

```css
:root {
  --background: #ffffff;
  --foreground: #000000;
  --primary: #3b82f6;
  /* ... other colors */
}
```

### Typography

The project uses the Inter font by default. To change it, edit `src/app/layout.tsx`.

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Next.js and configure the build settings
4. Your site will be deployed with automatic CI/CD

The project uses:
- Static Site Generation (SSG) for blog posts
- Automatic static optimization
- ISR (Incremental Static Regeneration) support

## Key Features

### React 19 & Next.js 15

This project uses the latest versions of React and Next.js with proper server/client component boundaries:
- Server Components for optimal performance
- Client Components only where needed (theme, syntax highlighting, comments)
- Streaming and Suspense support

### Security

- All dependencies use exact versions for reproducible builds
- Regular security updates via Dependabot
- Zero known vulnerabilities (checked with `npm audit`)

### Performance

- Optimized bundle sizes with code splitting
- Lazy loading of components
- Efficient image optimization
- Fast page loads with static generation

## Troubleshooting

### Hydration Errors

If you encounter hydration errors with code blocks:
- Clear the `.next` directory: `rm -rf .next`
- Restart the dev server: `npm run dev`

### Node Version Issues

Ensure you're using Node.js 24.0.0 or later:
```bash
node --version  # Should output v24.x.x
```

If using asdf:
```bash
asdf current nodejs
```

### Build Errors

If the build fails:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Clear Next.js cache: `rm -rf .next`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the project conventions:
   - Use TypeScript
   - Follow existing code style
   - Update tests if applicable
4. Commit your changes with clear, concise messages
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request with a clear description

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
