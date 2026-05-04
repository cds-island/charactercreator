# Character Creator

Note: “Character Creator” is a placeholder name and may change in the future.

A web-based character creation tool inspired by systems like Mii Maker. This project focuses on a simple, responsive interface for building stylized characters using selectable features and layered assets.

Overview

Character Creator is designed to replicate the feel of a console-style avatar editor in the browser. Users can customize different parts of a character—such as hair, eyes, and other features—through a structured, button-driven interface.

The project is intentionally lightweight and modular, making it easy to expand or integrate into other applications such as games or creative tools.

Features
Console-style character creation interface
Customizable character features (hair, eyes, etc.)
Layer-based rendering system
Button-based navigation for selecting options
Support for background audio
Runs entirely in the browser

Installation

Clone the repository:
```
git clone https://github.com/cds-island/charactercreator.git
cd charactercreator
```
No build step is required for basic usage.

Usage

Open the project directly:

open index.html

Or run a local server:

# Python
`python -m http.server`

# Node
`npx serve`

Then navigate to:

`http://localhost:8000`

# How It Works

Each character is built using a layered system. Individual assets (such as hair or eyes) are stacked visually, and selecting a new option replaces only that specific layer.

The interface is structured around categories, allowing users to switch between different feature groups and apply changes in real time.

Project Structure
```
charactercreator/
├── index.html
├── style.css
├── script.js
├── assets/
└── README.md
```

# Customization

The project is designed to be easily extended:

Add new assets to the assets/ directory
Introduce new categories or features
Modify the UI layout or controls
Implement save and load functionality

Roadmap
```
Additional customization options
Character save/export system
Improved UI transitions
Mobile support
```
# Contributing

Contributions are welcome. Fork the repository, create a branch, and submit a pull request with your changes.

# License

MIT License

# Acknowledgements

Inspired by Mii Maker and similar avatar creation systems.
Thank you @Asa-DB for helping me out with some things



im gonna rewrite this eventually...
