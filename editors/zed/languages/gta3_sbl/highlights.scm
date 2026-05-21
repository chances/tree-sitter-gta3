; ==================== Comments ====================
(comment) @comment
(block_comment) @comment
; Inline comment text inside DEFINE OBJECT lines
(comment_text) @comment

; ==================== Strings ====================
(string) @string

; ==================== Numbers ====================
(integer) @number
(float) @number

; ==================== Types ====================
(type_name) @type

; ==================== Constants ====================
(constant) @constant

; ==================== Variables ====================
(global_var) @variable.special
(local_var) @variable

; ==================== Labels ====================
(label ":" @punctuation.special
  (identifier) @label)
(label_ref "@" @punctuation.special
  (identifier) @label)

; ==================== Functions ====================
(function_def (identifier) @function)
(function_call (identifier) @function)
(function_call (qualified_name) @function)
(parameter_list (identifier) @variable.parameter)

; ==================== Keywords ====================
; Header directives
["DEFINE" "OBJECTS" "OBJECT" "MISSIONS" "MISSION" "AT"] @keyword
["$USE" "$INCLUDE" "CLEO"] @preproc

; Declarations
["var" "const" "end"] @keyword

; Control flow
["goto" "gosub" "return" "break" "continue"] @keyword
"terminate_this_script" @keyword
"declare_mission_flag" @keyword
"script_name" @keyword
"Alloc" @keyword

; Functions
"function" @keyword

; Loops
["while" "repeat" "until"] @keyword

; Conditionals
["if" "then" "else"] @keyword

; Boolean logic — these act as operators in conditions
["and" "or" "not"] @keyword.operator

; Boolean literals
["true" "false"] @boolean

; ==================== Operators ====================
["==" "!=" "<" ">" "<=" ">="] @operator
["+" "-" "*" "/" "%" "&" "|"] @operator
"=" @operator

; ==================== Punctuation ====================
["(" ")"] @punctuation.bracket
["{" "}"] @punctuation.bracket
["[" "]"] @punctuation.bracket
["," ":"] @punctuation.delimiter
