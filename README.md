# oddrationale.com

My personal website and blog, built with [Astro](https://astro.build). This site serves as a platform for sharing my thoughts, projects, and insights.

🌐 **Live Site**: [https://oddrationale.com](https://oddrationale.com)

## Getting Started

This project uses [pnpm](https://pnpm.io/) as the package manager and Astro for static site generation.

### Prerequisites

- Node.js (latest LTS version recommended)
- pnpm (install with `npm install -g pnpm`)

### Installation

Clone the repository and install dependencies:

```sh
git clone https://github.com/oddrationale/oddrationale.github.io.git
cd oddrationale.github.io
pnpm install
```

### Development

Start the local development server:

```sh
pnpm dev
```

The site will be available at `http://localhost:4321`.

### Building for Production

Build the site for production:

```sh
pnpm build
```

The static files will be generated in the `./dist/` directory.

### Preview Production Build

Preview the production build locally:

```sh
pnpm preview
```

### Available Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`            | Installs dependencies                            |
| `pnpm dev`                | Starts local dev server at `localhost:4321`      |
| `pnpm build`              | Build your production site to `./dist/`          |
| `pnpm preview`            | Preview your build locally, before deploying     |
| `pnpm astro ...`          | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help`    | Get help using the Astro CLI                     |

## License

This project uses a dual licensing approach:

- **Code & Repository**: The GitHub repository, including all code, templates, and configuration files, is licensed under the [MIT License](LICENSE).

- **Blog Content**: The written content of the blog is licensed under [Creative Commons Attribution 4.0 International (CC BY 4.0)](http://creativecommons.org/licenses/by/4.0/).
