; Blocks that are closed by "end"
(function_def "end" @end) @indent
(var_block "end" @end) @indent
(while_loop "end" @end) @indent
(if_statement "end" @end) @indent

; repeat..until — indented body between the two keywords
(repeat_loop "until" @end) @indent

; and/or condition blocks
(logical_expr "{" @end) @indent
