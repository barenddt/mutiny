<img src="https://iili.io/p0ICt2.png" />

# Mutiny

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Mutiny aims to provide developers with an easy to use experience similar to `create-react-app`, but for developing standalone extensions/addons for Valve's Steam Deck. Mutiny simplifies the process by providing high level abstractions that can be used to inject custom **React** code into the decks user interface.

## Features

- 🔥 Hot reloading
- 💻 Server support for calling OS commands
- ⚙️ CLI for creating new projects (coming soon)
- 🪝 Hooks for the Steam Deck's MobX stores (coming soon)
- 📦 Packager for creating one-click installers (coming soon)

# Getting started (WIP)

> ⚠️ **mutiny** is still under active development and is not ready for production.

Create a new project using the CLI:

```bash
npx create-mutiny-app my-app
```

Start the development server:

```bash
cd my-app
yarn dev
```

# Develop

Clone the repository:

```bash
git clone https://github.com/barenddt/mutiny.git && cd mutiny
```

Install dependencies:

```bash
yarn install
```
