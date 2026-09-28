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
; Highlight named grammar rules rather than raw keyword literals. The grammar
; does not expose every keyword as an anonymous node type to Zed's query API.
(define_objects) @keyword
(define_missions) @keyword
(cleo_directive) @preproc
(include_directive) @preproc
(var_block) @keyword
(const_declaration) @keyword
(alloc_statement) @keyword
(goto_statement) @keyword
(gosub_statement) @keyword
(return_statement) @keyword
(break_statement) @keyword
(continue_statement) @keyword
(terminate_script) @keyword
(declare_mission_flag) @keyword
(script_name_statement) @keyword
(function_def) @keyword
(while_loop) @keyword
(repeat_loop) @keyword
(if_statement) @keyword
(logical_expr) @keyword.operator
(negation) @keyword.operator

; ==================== Operators ====================
["==" "!=" "<" ">" "<=" ">="] @operator
["+" "-" "*" "/" "%" "&" "|"] @operator
"=" @operator

; ==================== Punctuation ====================
["(" ")"] @punctuation.bracket
["{" "}"] @punctuation.bracket
["[" "]"] @punctuation.bracket
["," ":"] @punctuation.delimiter
