# MorgarAkt Portfolio

This is the source code for my personal portfolio website, hosted on GitHub Pages.

## Local Development

**1. Clone the Repository**

Clones the project from GitHub and changes the directory.
```bash
git clone https://github.com/MorgarAkt/MorgarAkt.github.io
cd MorgarAkt.github.io
```

**2. Install Dependencies**

Installs required Node.js packages (like Tailwind CSS). Requires Node.js and npm to be installed first.
```bash
npm install
```

**3. Build CSS**

Compiles the Tailwind CSS into the final `styles.css` file needed by `index.html`.
```bash
npm run build:css
```

**4. (Optional) Run Development Watch**

Use this command during development to automatically rebuild CSS when source files change. Run this *instead* of `npm run build:css` if you are actively developing.
```bash
npm run watch:css
```
