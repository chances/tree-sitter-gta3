/**
 * Example: Using tree-sitter-gta3 with Deno
 *
 * Run with: deno run --allow-read deno_example.ts
 */

import { createParser } from "https://deno.land/x/deno_tree_sitter@1.0.1.2/main/main.js";

// Path to the compiled WASM grammar
const WASM_PATH = "./tree-sitter-gta3.wasm";

/**
 * Parse a GTA3 script and print the syntax tree
 */
async function parseGTA3Script(code: string) {
  try {
    const parser = await createParser(WASM_PATH);
    const tree = parser.parse(code);

    console.log("=== Parse Tree ===");
    console.log(tree.rootNode.toString());
    console.log();

    return tree;
  } catch (error) {
    console.error("Parse error:", error.message);
    throw error;
  }
}

/**
 * Query the parse tree for specific patterns
 */
async function queryFunctions(code: string) {
  const parser = await createParser(WASM_PATH);
  const tree = parser.parse(code);

  console.log("=== Found Function Definitions ===");

  // Walk the tree and find function definitions
  function walk(node: any) {
    if (node.type === "function_def") {
      const nameNode = node.child(1); // identifier after 'function' keyword
      console.log(`Function: ${nameNode.text}`);
    }

    for (let i = 0; i < node.childCount; i++) {
      walk(node.child(i));
    }
  }

  walk(tree.rootNode);
}

/**
 * Find all labels in a script
 */
async function findLabels(code: string) {
  const parser = await createParser(WASM_PATH);
  const tree = parser.parse(code);

  console.log("=== Found Labels ===");

  function walk(node: any) {
    if (node.type === "label" || node.type === "label_definition") {
      console.log(`Label: ${node.text}`);
    }

    for (let i = 0; i < node.childCount; i++) {
      walk(node.child(i));
    }
  }

  walk(tree.rootNode);
}

// Example 1: Simple variable declaration
console.log("📝 Example 1: Variable Declaration\n");
await parseGTA3Script(`var
  $player: Player
  $missionIndex: int
end`);

// Example 2: Function definition
console.log("📝 Example 2: Function Definition\n");
await parseGTA3Script(`function initBlips()
  $SafeBlip = Blip.AddSpriteForCoord(625.8125, 1395.0625, 140.625)
end`);

// Example 3: Control flow
console.log("📝 Example 3: While Loop\n");
await parseGTA3Script(`while true
  wait 250 ms
  if Player.IsPlaying($player) then
    break
  end
end`);

// Example 4: Find functions
console.log("📝 Example 4: Query Functions\n");
await queryFunctions(`function initBlips()
  wait 0
end

function initCars()
  wait 0
end`);

// Example 5: Find labels
console.log("📝 Example 5: Find Labels\n");
await findLabels(`:MAIN
script_name 'MAIN'

:M_TRIG
  return`);

console.log("✅ All examples completed!");
