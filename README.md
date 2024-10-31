# Personal Blog with Next.js

A modern blog built with Next.js, TypeScript, and CSS Modules. Features include dark mode, markdown support with syntax highlighting, and search functionality.

## Features

- 🌓 Dark/Light mode
- 📝 Markdown support
- 🎨 Syntax highlighting for code blocks
- 🔍 Search functionality
- 📱 Responsive design
- 🎯 SEO friendly
- 🚀 Fast page loads
- 💅 CSS Modules for styling

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn or pnpm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/your-blog.git
cd your-blog
```

2. Install dependencies:

```bash
npm install
```

3. Add your profile picture:

- Place your profile picture in `public/profile.jpg`

4. Update content:

- Edit `content/about.md` with your information
- Add blog posts in the `posts` directory

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Project Structure

```
├── content/
│   └── about.md        # About page content
├── posts/              # Blog posts in markdown
├── public/             # Static files
│   └── profile.jpg     # Your profile picture
└── src/
    ├── app/           # Next.js app directory
    ├── components/    # React components
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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
