# Quick Start Guide

## 🚀 5-Minute Setup

### 1. Build the Grammar

```bash
cd tree-sitter-gta3
npm install
npm run build
```

You'll get: **`tree-sitter-gta3.wasm`** ✅

### 2. Use with Deno (Recommended)

Create `parse.ts`:

```ts
import { createParser } from "https://deno.land/x/deno_tree_sitter@1.0.1.2/main/main.js";

const parser = await createParser("./tree-sitter-gta3.wasm");

const code = `
var
  $x: int
end
`;

const tree = parser.parse(code);
console.log(tree.rootNode.toString());
```

Run:

```bash
deno run --allow-read parse.ts
```

### 3. Use with Node.js

Install dependency:

```bash
npm install web-tree-sitter
```

Create `parse.js`:

```js
const Parser = require("web-tree-sitter");
(async () => {
  await Parser.init();
  const parser = new Parser();
  const gta3 = await Parser.Language.load("./tree-sitter-gta3.wasm");
  parser.setLanguage(gta3);

  const code = "var $x: int end";
  const tree = parser.parse(code);
  console.log(tree.rootNode.toString());
})();
```

Run:

```bash
node parse.js
```

## 📚 Common Tasks

### Parse a Script File

**Deno:**

```ts
import { createParser } from "https://deno.land/x/deno_tree_sitter@1.0.1.2/main/main.js";

const parser = await createParser("./tree-sitter-gta3.wasm");
const code = await Deno.readTextFile("./main.txt");
const tree = parser.parse(code);
```

**Node.js:**

```js
const fs = require("fs");
const Parser = require("web-tree-sitter");

const code = fs.readFileSync("./main.txt", "utf-8");
const tree = parser.parse(code);
```

### Walk the Parse Tree

```ts
function walk(node) {
  console.log(`${node.type}: ${node.text.slice(0, 20)}...`);

  for (let i = 0; i < node.childCount; i++) {
    walk(node.child(i));
  }
}

walk(tree.rootNode);
```

### Find All Functions

```ts
function findFunctions(node) {
  const functions = [];

  function walk(n) {
    if (n.type === "function_def") {
      const name = n.child(1).text; // identifier after 'function'
      functions.push(name);
    }

    for (let i = 0; i < n.childCount; i++) {
      walk(n.child(i));
    }
  }

  walk(node);
  return functions;
}

const fns = findFunctions(tree.rootNode);
console.log("Functions:", fns);
```

### Extract Variable Declarations

```ts
function findVariables(node) {
  const vars = [];

  function walk(n) {
    if (n.type === "var_declaration") {
      const varNode = n.child(0); // first child is the variable
      vars.push(varNode.text);
    }

    for (let i = 0; i < n.childCount; i++) {
      walk(n.child(i));
    }
  }

  walk(node);
  return vars;
}

const variables = findVariables(tree.rootNode);
console.log("Variables:", variables);
```

### Find All Labels

```ts
function findLabels(node) {
  const labels = [];

  function walk(n) {
    if (n.type === "label" || n.type === "label_definition") {
      labels.push(n.text);
    }

    for (let i = 0; i < n.childCount; i++) {
      walk(n.child(i));
    }
  }

  walk(node);
  return labels;
}
```

## 🧪 Run Tests

```bash
npm test
```

Add your own tests in `test/corpus/mytest.txt`.

## 📖 Learn More

- Full docs: [README.md](./README.md)
- Implementation: [IMPLEMENTATION.md](./IMPLEMENTATION.md)
- Grammar rules: [grammar.js](./grammar.js)
- Example script: [deno_example.ts](./deno_example.ts)

## 💡 Tips

- **WASM is platform-independent** – once built, the `.wasm` file works
  everywhere
- **Always call `await Parser.init()` first** (Node.js/Browser)
- **Deno doesn't need init** – just pass the WASM path to `createParser()`
- **For performance**: parse once, query many times
- **Memory**: WASM instances are lightweight, create multiple parsers if needed

## 🐛 Troubleshooting

**"tree-sitter command not found"**

```bash
npm install -g tree-sitter-cli
```

**"Cannot find module 'web-tree-sitter'"**

```bash
npm install web-tree-sitter
```

**WASM file not loading**

- Check file path is correct
- Ensure WASM is actually built: `npm run build`
- Use absolute paths if relative paths don't work

**Parse tree looks wrong**

- Check your input code matches GTA3 syntax
- Run `npm test` to verify grammar works
- Add a test case to reproduce the issue
