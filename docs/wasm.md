# WebAssembly Implementation Notes

## Why We Chose WASM Over node-gyp

### The Problem with node-gyp

- 🔴 Requires native compilation for each platform
- 🔴 Needs C++ compiler installed on user's machine
- 🔴 Different binaries for Windows/macOS/Linux
- 🔴 Complex build configuration
- 🔴 Doesn't work in browsers
- 🔴 Not compatible with Deno

### The WASM Solution

- ✅ Single compilation, universal deployment
- ✅ No platform-specific builds needed
- ✅ Works on Windows, macOS, Linux, Web, Deno
- ✅ Simple `npm run build` workflow
- ✅ File size: 200-500KB (reasonable)
- ✅ Performance: near-native parsing speed
- ✅ Safe: sandboxed execution environment

## How WASM Works Here

### Build Process

```
grammar.js (JavaScript DSL)
    ↓
tree-sitter-cli
    ↓
src/parser.c + src/scanner.c (generated C code)
    ↓
Emscripten (C → WebAssembly)
    ↓
tree-sitter-gta3.wasm (compiled binary)
```

### Runtime

```
tree-sitter-gta3.wasm
    ↓
web-tree-sitter (JS wrapper)
    ↓
Deno / Node.js / Browser
```

## Supported Environments

| Environment  | Library          | How                   | Status   |
| ------------ | ---------------- | --------------------- | -------- |
| **Deno**     | deno-tree-sitter | Import from deno.land | ✅ Best  |
| **Node.js**  | web-tree-sitter  | npm install           | ✅ Good  |
| **Browser**  | web-tree-sitter  | CDN/bundler           | ✅ Good  |
| **Tauri**    | web-tree-sitter  | Bundled               | ✅ Works |
| **Electron** | web-tree-sitter  | npm module            | ✅ Works |

## Building & Distribution

### Build Once

```bash
npm run build
# Creates: tree-sitter-gta3.wasm
```

### Use Everywhere

- Deno: direct file path or URL
- Node.js: npm package or relative path
- Browser: CDN, static asset, or bundled
- Tauri/Electron: bundled with app

## File Structure

```
tree-sitter-gta3/
├── grammar.js               # ← Edit this to modify syntax
├── package.json             # Build config
├── README.md                # User docs
├── QUICKSTART.md            # Get started in 5 min
├── IMPLEMENTATION.md        # Deep dive
├── WASM_NOTES.md           # This file
├── deno_example.ts         # Example code
├── tree-sitter-gta3.wasm   # OUTPUT (generated)
└── test/
    └── corpus/             # Test cases
```

## Performance Characteristics

### Parse Time

- **Simple vars**: ~1ms
- **Functions**: ~2-5ms
- **Full scripts (1000+ lines)**: ~50-100ms
- **Incremental updates**: ~1-2ms

### Memory

- **Parser instance**: ~2-5MB
- **WASM module**: ~200-500KB
- **Parsed tree**: varies by size

### Optimization

Tree-sitter is already highly optimized:

- Lexer is state-machine based (fast)
- Parser uses GLR (handles ambiguity)
- Incremental parsing (only re-parse changed nodes)

## Troubleshooting WASM Issues

### "WASM module instantiation failed"

Usually means the WASM file is corrupted or incomplete.

```bash
# Rebuild
npm run build

# Check file exists and has content
ls -lh tree-sitter-gta3.wasm  # Should be ~500KB
```

### "Parser.Language.load() times out"

WASM file isn't found or is on wrong path.

```ts
// Good: explicit path
const gta3 = await Language.load("./tree-sitter-gta3.wasm");

// Also good: from package
const gta3 = await Language.load(
  new URL("./tree-sitter-gta3.wasm", import.meta.url),
);
```

### Performance is slow

Might be initializing parser repeatedly.

```ts
// Bad: creates new instance each time
for (const file of files) {
  const parser = new Parser(); // ← inefficient
  const tree = parser.parse(file);
}

// Good: reuse parser
const parser = new Parser();
for (const file of files) {
  const tree = parser.parse(file); // ← faster
}
```

### WASM works in tests but not in production

Often path issues. Use absolute paths:

```ts
// Deno
const wasm = new URL("./tree-sitter-gta3.wasm", import.meta.url);
const parser = await createParser(wasm);

// Node.js
const path = require("path");
const wasmPath = path.join(__dirname, "tree-sitter-gta3.wasm");
const gta3 = await Language.load(wasmPath);
```

## Extending the Grammar

To modify the grammar:

1. Edit `grammar.js`
2. Run `npm run generate` to create C code
3. Run `npm run build` to compile to WASM
4. Add test cases in `test/corpus/`
5. Run `npm test` to verify

```bash
# Example: add support for new statement type
# 1. Edit grammar.js
# 2. Test locally
npm run build
deno run --allow-read test_script.ts

# 3. Add test case
echo "
==============================
My New Feature
==============================
my_new_statement 'test'
---
(source_file (my_new_statement))
" >> test/corpus/new_feature.txt

# 4. Verify
npm test
```

## Deployment Options

### Option 1: npm Package

```bash
npm publish  # Includes tree-sitter-gta3.wasm
# Users: npm install tree-sitter-gta3
```

### Option 2: GitHub Release

```bash
gh release create v1.0.0 tree-sitter-gta3.wasm
# Users download .wasm directly
```

### Option 3: CDN

```bash
# Upload to jsDelivr, unpkg, etc.
# https://cdn.jsdelivr.net/gh/user/repo/tree-sitter-gta3.wasm
```

### Option 4: Bundle with App

```bash
# Tauri, Electron, etc.
# Include .wasm in app resources
# Load from: file:///.../tree-sitter-gta3.wasm
```

## References

- [tree-sitter WASM docs](https://tree-sitter.github.io/tree-sitter/creating-parsers#using-your-parser)
- [web-tree-sitter repo](https://github.com/tree-sitter/tree-sitter/tree/master/lib/binding_web)
- [Emscripten](https://emscripten.org/) - C to WebAssembly compiler
- [Deno FFI vs WASM](https://docs.deno.com/runtime/fundamentals/ffi/) -
  comparison guide
