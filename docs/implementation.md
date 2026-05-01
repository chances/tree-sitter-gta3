# Tree-Sitter GTA3 Grammar - WebAssembly Implementation

## Overview

This is a tree-sitter grammar for GTA III Sanny Builder scripts, compiled to
**WebAssembly (WASM)** for universal compatibility and safe execution across all
platforms.

## Why WebAssembly?

- ✅ **Universal** - runs on Windows, macOS, Linux, Web browsers, Deno
- ✅ **No native compilation** - use pre-compiled `.wasm` file
- ✅ **Safe** - sandboxed execution environment
- ✅ **Fast** - near-native parsing speed
- ✅ **Small** - ~200-500KB file size
- ✅ **Easy distribution** - single file, no platform-specific builds

## Grammar Structure

The grammar covers:

1. **Headers & Directives**
   - `DEFINE OBJECTS` / `DEFINE OBJECT`
   - `DEFINE MISSIONS` / `DEFINE MISSION`
   - `{$USE CLEO}`
   - `{$INCLUDE path}`

2. **Variable Declarations**
   - `var ... end` blocks with type annotations
   - `const` declarations
   - `Alloc()` memory allocation

3. **Control Flow**
   - Labels (`:Label`, `@Label`)
   - `goto` and `gosub` jumps
   - `return`, `break`, `continue`

4. **Loops**
   - `while condition ... end`
   - `repeat ... until condition`

5. **Conditionals**
   - `if condition then ... end`
   - `if and { ... } then ... end`
   - `if or { ... } then ... end`
   - Optional `else` clauses

6. **Functions**
   - `function name(...) ... end`
   - Method calls: `Class.Method(...)`
   - Qualified names with dot notation

7. **Expressions**
   - Global variables: `$varName`
   - Local variables: `123var` pattern
   - Array access: `$var[index]`
   - Numbers (int/float) and strings
   - Binary operators: `+`, `-`, `*`, `/`, `%`, `&`, `|`

8. **Comments**
   - Single-line: `// comment`
   - Multi-line: `/* comment */`

## File Organization

```
tree-sitter-gta3/
├── grammar.js           # Main grammar definition
├── package.json         # npm build config
├── README.md            # User documentation
├── IMPLEMENTATION.md    # This file
├── tree-sitter-gta3.wasm  # Compiled output (generated)
└── test/
    └── corpus/
        ├── declarations.txt
        ├── control_flow.txt
        ├── functions.txt
        ├── headers.txt
        └── conditionals.txt
```

## Build Instructions

### Prerequisites

```bash
# Install Node.js 14+
node --version  # Should be v14.0.0 or higher

# Install tree-sitter-cli globally
npm install -g tree-sitter-cli
# or locally
npm install --save-dev tree-sitter-cli
```

### Build Steps

```bash
cd tree-sitter-gta3
npm install
npm run build
```

This generates **`tree-sitter-gta3.wasm`** (the compiled parser).

### Generate Parser Source (Optional)

If modifying `grammar.js`:

```bash
npm run generate
npm run build
```

This regenerates C source code from the grammar before compiling to WASM.

## Usage Examples

### Deno (Recommended)

```ts
import { createParser } from "https://deno.land/x/deno_tree_sitter@1.0.1.2/main/main.js";

const parser = await createParser("./tree-sitter-gta3.wasm");
const tree = parser.parse("var $player: Player end");

console.log(tree.rootNode.toString());
```

Run with: `deno run --allow-read script.ts`

### Node.js

```js
const Parser = require("web-tree-sitter");
(async () => {
  await Parser.init();
  const parser = new Parser();
  const gta3 = await Parser.Language.load("./tree-sitter-gta3.wasm");
  parser.setLanguage(gta3);

  const tree = parser.parse("while true\n  wait 0\nend");
  console.log(tree.rootNode.toString());
})();
```

Install: `npm install web-tree-sitter`

### Browser

```html
<script
  src="https://cdn.jsdelivr.net/npm/web-tree-sitter@0.20.5/tree-sitter.js"
></script>
<script>
  (async () => {
    await TreeSitter.init();
    const parser = new TreeSitter.Parser();
    const gta3 = await TreeSitter.Language.load("./tree-sitter-gta3.wasm");
    parser.setLanguage(gta3);

    const code = "gosub @MyLabel\nreturn";
    const tree = parser.parse(code);

    // Query the tree
    const query = gta3.query("(gosub_statement)");
    const matches = query.matches(tree.rootNode);
    console.log(matches);
  })();
</script>
```

## Testing

Tree-sitter uses a **corpus format** for tests:

```
==============================
Test Name
==============================

// Input code
var
  $x: int
end

---

// Expected parse tree
(source_file
  (var_block
    (var_declaration
      (global_var)
      (type_name))))
```

Run tests:

```bash
npm test
```

Add tests in `test/corpus/` to expand coverage.

## Troubleshooting

### Build fails with "tree-sitter not found"

```bash
npm install -g tree-sitter-cli
# or
npx tree-sitter build --wasm
```

### WASM file is too large

Expected sizes:

- Unoptimized: ~1-2MB
- Optimized: ~200-500KB

The build process should handle optimization automatically.

### Parser crashes on certain input

1. Check that input matches expected syntax
2. Simplify test case to isolate issue
3. Add a test case to `test/corpus/`
4. Run `npm test` to verify parse tree

## Advanced: Querying the Parse Tree

Once parsed, use **tree-sitter queries** to extract information:

```ts
const query = language.query(`
  (function_def
    name: (identifier) @name
    parameters: (parameter_list) @params)
`);

const matches = query.matches(tree.rootNode);
for (const match of matches) {
  const name = match.captures.find((c) => c.name === "name");
  const params = match.captures.find((c) => c.name === "params");
  console.log(`Function: ${name.node.text}`);
}
```

## Distribution & Deployment

### npm Package

1. Build the WASM file
2. Add to `package.json` under `files` or `assets`
3. Publish: `npm publish`

Users then load from the package:

```ts
const parser = await createParser(
  "./node_modules/tree-sitter-gta3/tree-sitter-gta3.wasm",
);
```

### CDN Hosting

Upload `tree-sitter-gta3.wasm` to a CDN (jsDelivr, unpkg, etc.):

```ts
const parser = await createParser(
  "https://cdn.example.com/tree-sitter-gta3.wasm",
);
```

### Direct Distribution

Include the `.wasm` file alongside your application.

## References

- [Tree-Sitter Docs](https://tree-sitter.github.io)
- [web-tree-sitter](https://www.npmjs.com/package/web-tree-sitter)
- [deno-tree-sitter](https://deno.land/x/deno_tree_sitter)
- [Tree-Sitter Queries](https://tree-sitter.github.io/tree-sitter/syntax-highlighting)
- [Sanny Builder Reference](https://docs.sannybuilder.com)
