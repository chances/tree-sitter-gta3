# tree-sitter-gta3

A tree-sitter grammar for GTA III Sanny Builder scripts, compiled to
WebAssembly.

## Build

### Prerequisites

- Node.js 14+
- `tree-sitter-cli`: `npm install -g tree-sitter-cli`

### Build

```bash
npm install
npm run build
```

Generates `tree-sitter-gta3.wasm`.

## Usage

### Deno (Recommended)

```ts
import { createParser } from "https://deno.land/x/deno_tree_sitter@1.0.1.2/main/main.js";

const parser = await createParser("./tree-sitter-gta3.wasm");
const tree = parser.parse("var $x: int end");
console.log(tree.rootNode.toString());
```

### Node.js

```js
const Parser = require("web-tree-sitter");

await Parser.init();
const parser = new Parser();
const gta3 = await Parser.Language.load("./tree-sitter-gta3.wasm");
parser.setLanguage(gta3);

const tree = parser.parse("var $x: int end");
console.log(tree.rootNode.toString());
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
    const tree = parser.parse("var $x: int end");
  })();
</script>
```

## Supported Syntax

- **Headers**: `DEFINE OBJECTS`, `DEFINE MISSIONS`, `{$USE CLEO}`, `{$INCLUDE}`
- **Variables**: `var ... end`, `const`, `Alloc()`
- **Control Flow**: Labels (`:label`), `goto @label`, `gosub @label`, `return`
- **Loops**: `while condition ... end`, `repeat ... until condition`
- **Conditionals**: `if condition then ... end`, `if and { ... } then ... end`
- **Functions**: `function name() ... end`, `Class.Method(...)`
- **Comments**: `// ...` and `/* ... */`

## Testing

```bash
npm test
```

Tests in `test/corpus/`.

## Documentation

- **[docs/quickstart.md](./docs/quickstart.md)** - 5-minute setup guide
- **[docs/implementation.md](./docs/implementation.md)** - Deep dive into
  grammar & architecture
- **[docs/wasm.md](./docs/wasm.md)** - Why WebAssembly instead of node-gyp
- **[docs/deno_example.ts](./docs/deno_example.ts)** - Full example code

## References

- [Tree-Sitter Docs](https://tree-sitter.github.io)
- [web-tree-sitter](https://www.npmjs.com/package/web-tree-sitter)
- [Sanny Builder Docs](https://docs.sannybuilder.com)
