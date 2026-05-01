export default grammar({
  name: "gta3",

  conflicts: ($) => [
    [$.define_objects, $.define_objects],
    [$.define_missions, $.define_missions],
    [$.function_call, $.expression],
  ],

  rules: {
    source_file: ($) =>
      repeat(
        choice(
          $.header_directive,
          $.include_directive,
          $.statement,
        ),
      ),

    // ==================== Headers ====================
    header_directive: ($) =>
      choice(
        $.define_objects,
        $.define_missions,
        $.cleo_directive,
      ),

    define_objects: ($) =>
      seq(
        "DEFINE",
        "OBJECTS",
        $.integer,
        repeat($.object_definition),
      ),

    object_definition: ($) =>
      seq(
        "DEFINE",
        "OBJECT",
        $.identifier,
        optional(seq("//", $.comment_text)),
      ),

    define_missions: ($) =>
      seq(
        "DEFINE",
        "MISSIONS",
        $.integer,
        repeat($.mission_definition),
      ),

    mission_definition: ($) =>
      seq(
        "DEFINE",
        "MISSION",
        $.integer,
        optional("0"),
        "AT",
        $.label_ref,
        optional(seq("@", "mission")),
      ),

    cleo_directive: ($) =>
      seq(
        "{",
        "$USE",
        "CLEO",
        "}",
      ),

    // ==================== Includes ====================
    include_directive: ($) =>
      seq(
        "{",
        "$INCLUDE",
        $.string,
        "}",
      ),

    // ==================== Declarations ====================
    var_block: ($) =>
      seq(
        "var",
        repeat($.var_declaration),
        "end",
      ),

    var_declaration: ($) =>
      seq(
        $._variable,
        ":",
        $.type_name,
        optional(seq("[", $.integer, "]")),
      ),

    const_declaration: ($) =>
      seq(
        "const",
        $.identifier,
        "=",
        $.expression,
      ),

    alloc_statement: ($) =>
      seq(
        "Alloc",
        "(",
        $._variable,
        ",",
        $.integer,
        ")",
      ),

    // ==================== Statements ====================
    statement: ($) =>
      choice(
        $.var_block,
        $.const_declaration,
        $.alloc_statement,
        $.label,
        $.function_def,
        $.while_loop,
        $.repeat_loop,
        $.if_statement,
        $.goto_statement,
        $.gosub_statement,
        $.return_statement,
        $.break_statement,
        $.continue_statement,
        $.declare_mission_flag,
        $.script_name_statement,
        $.terminate_script,
        $.function_call,
        $.assignment,
      ),

    // ==================== Control Flow ====================
    label: ($) => seq(":", $.identifier),

    label_ref: ($) => seq("@", $.identifier),

    goto_statement: ($) =>
      seq(
        "goto",
        $.label_ref,
      ),

    gosub_statement: ($) =>
      seq(
        "gosub",
        $.label_ref,
      ),

    return_statement: ($) => "return",

    break_statement: ($) => "break",

    continue_statement: ($) => "continue",

    // ==================== Loops ====================
    while_loop: ($) =>
      seq(
        "while",
        $.condition,
        repeat($.statement),
        "end",
      ),

    repeat_loop: ($) =>
      seq(
        "repeat",
        repeat($.statement),
        "until",
        $.condition,
      ),

    condition: ($) =>
      choice(
        "true",
        "false",
        $.comparison,
        $.logical_expr,
        $.function_call,
        $._variable,
        $.negation,
      ),

    logical_expr: ($) =>
      choice(
        seq("and", "{", repeat($.condition), "}"),
        seq("or", "{", repeat($.condition), "}"),
      ),

    negation: ($) => seq("not", $.condition),

    comparison: ($) =>
      seq(
        $.expression,
        choice("==", "!=", "<", ">", "<=", ">="),
        $.expression,
      ),

    // ==================== Conditionals ====================
    if_statement: ($) =>
      seq(
        "if",
        choice(
          seq("and", repeat($.condition)),
          seq("or", repeat($.condition)),
          $.condition,
        ),
        "then",
        repeat($.statement),
        optional(
          seq("else", repeat($.statement)),
        ),
        "end",
      ),

    // ==================== Functions ====================
    function_def: ($) =>
      seq(
        "function",
        $.identifier,
        "(",
        optional($.parameter_list),
        ")",
        repeat($.statement),
        "end",
      ),

    parameter_list: ($) =>
      seq(
        $.identifier,
        repeat(seq(",", $.identifier)),
      ),

    function_call: ($) =>
      seq(
        choice($.qualified_name, $.identifier),
        "(",
        optional($.argument_list),
        ")",
      ),

    qualified_name: ($) =>
      seq(
        $.identifier,
        repeat1(seq(".", $.identifier)),
      ),

    argument_list: ($) =>
      seq(
        $.expression,
        repeat(seq(",", $.expression)),
      ),

    // ==================== Expressions ====================
    expression: ($) =>
      choice(
        $.function_call,
        $.number,
        $.string,
        $._variable,
        $.identifier,
        $.constant,
        seq("(", $.expression, ")"),
        prec.left(1, seq(
          $.expression,
          choice("+", "-", "*", "/", "%", "&", "|"),
          $.expression,
        )),
      ),

    // ==================== Variables & Values ====================
    _variable: ($) =>
      choice(
        $.local_var,
        $.global_var,
        $.array_access,
      ),

    global_var: ($) => /\$[a-zA-Z_]\w*/,

    local_var: ($) => /\d[a-zA-Z_]\w*/,

    array_access: ($) =>
      seq(
        choice($.global_var, $.local_var),
        "[",
        $.expression,
        "]",
      ),

    assignment: ($) =>
      seq(
        choice($.global_var, $.local_var, $.array_access),
        "=",
        $.expression,
      ),

    // ==================== Other Statements ====================
    declare_mission_flag: ($) =>
      seq(
        "declare_mission_flag",
        $._variable,
      ),

    script_name_statement: ($) =>
      seq(
        "script_name",
        $.string,
      ),

    terminate_script: ($) => "terminate_this_script",

    wait_statement: ($) =>
      seq(
        "wait",
        optional($.integer),
        optional("ms"),
      ),

    // ==================== Types & Identifiers ====================
    type_name: ($) =>
      choice(
        "int",
        "float",
        "Player",
        "Char",
        "Vehicle",
        "Object",
        "Blip",
        /[A-Z][a-zA-Z_]*/,
      ),

    identifier: ($) => /[a-zA-Z_]\w*/,

    constant: ($) =>
      choice(
        seq("#", /[A-Z_]\w*/),
        /[A-Z][A-Z0-9_]*/,
      ),

    number: ($) =>
      choice(
        $.integer,
        $.float,
      ),

    integer: ($) => /-?\d+/,

    float: ($) => /-?\d+\.\d+/,

    string: ($) =>
      choice(
        /"[^"]*"/,
        /'[^']*'/,
      ),

    // ==================== Comments ====================
    comment: ($) =>
      seq(
        "//",
        /[^\n]*/,
      ),

    comment_text: ($) => /[^\n]*/,

    block_comment: ($) =>
      seq(
        "/*",
        /[\s\S]*?/,
        "*/",
      ),
  },

  extras: ($) => [
    /\s+/,
    $.comment,
    $.block_comment,
  ],
});
