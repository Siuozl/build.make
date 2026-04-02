// ============================================================
//  Build.Make — app.js  (v2)
// ============================================================

// ============================================================
//  BLOCK DEFINITIONS  (per-language)
// ============================================================

// Block structure:
//  id, label, icon, color, category, desc
//  fields: [ { name, type, placeholder, options } ]
//  toCode(fields, children, lang) → string
//  isContainer: bool  — can hold child blocks
//  closedBy: id      — if this block auto-creates a matching closer
//  isClose: bool     — this is a closing block (rendered differently)
//  noClose: bool     — container that doesn't need explicit close (Python style)

const C = {
  VAR:     '#1565c0',
  OUT:     '#00695c',
  FLOW:    '#6a1b9a',
  FUNC:    '#b71c1c',
  ARR:     '#e65100',
  MATH:    '#1a237e',
  STR:     '#004d40',
  DOM:     '#33691e',
  CANVAS:  '#ad1457',
  TIME:    '#4e342e',
  HTML:    '#01579b',
  MISC:    '#37474f',
};

// ---- JAVASCRIPT BLOCKS ----
const JS_BLOCKS = [
  // Variables
  { id:'js_var',      label:'Set Variable',    icon:'📦', color:C.VAR,  category:'Variables',
    fields:[{name:'name',type:'text',placeholder:'myVar'},{name:'value',type:'text',placeholder:'0'}],
    desc:'Declare or update a variable',
    toCode:(f)=>`let ${f.name||'myVar'} = ${smartVal(f.value)};` },
  { id:'js_varinc',   label:'Increment',       icon:'➕', color:C.VAR,  category:'Variables',
    fields:[{name:'name',type:'text',placeholder:'counter'},{name:'by',type:'text',placeholder:'1'}],
    desc:'Add to a variable',
    toCode:(f)=>`${f.name||'counter'} += ${f.by||1};` },
  { id:'js_vardec',   label:'Decrement',       icon:'➖', color:C.VAR,  category:'Variables',
    fields:[{name:'name',type:'text',placeholder:'counter'},{name:'by',type:'text',placeholder:'1'}],
    desc:'Subtract from a variable',
    toCode:(f)=>`${f.name||'counter'} -= ${f.by||1};` },
  { id:'js_varlog',   label:'Log Variable',    icon:'🖨️', color:C.VAR,  category:'Variables',
    fields:[{name:'name',type:'text',placeholder:'myVar'}],
    desc:'Print a variable to console',
    toCode:(f)=>`console.log(${f.name||'myVar'});` },

  // Output
  { id:'js_print',    label:'Print',           icon:'💬', color:C.OUT,  category:'Output',
    fields:[{name:'text',type:'text',placeholder:'Hello!'}],
    desc:'Print text to console',
    toCode:(f)=>`console.log(${smartVal(f.text||'Hello!')});` },
  { id:'js_alert',    label:'Alert',           icon:'🔔', color:C.OUT,  category:'Output',
    fields:[{name:'text',type:'text',placeholder:'Message'}],
    desc:'Show a popup',
    toCode:(f)=>`alert(${smartVal(f.text||'Message')});` },
  { id:'js_clear',    label:'Clear Console',   icon:'🧹', color:C.OUT,  category:'Output',
    fields:[],
    desc:'Clear the console',
    toCode:()=>`console.clear();` },

  // Control Flow
  { id:'js_if',       label:'If',              icon:'❓', color:C.FLOW, category:'Control Flow',
    fields:[{name:'condition',type:'text',placeholder:'x > 0'}],
    desc:'Run blocks if condition is true',
    isContainer:true,
    toCode:(f,ch,indent)=>`if (${f.condition||'true'}) {\n${indent}${ch}\n${indent.slice(2)}}` },
  { id:'js_else',     label:'Else',            icon:'↩️', color:C.FLOW, category:'Control Flow',
    fields:[],
    desc:'Otherwise block',
    isContainer:true,
    toCode:(f,ch,indent)=>`else {\n${indent}${ch}\n${indent.slice(2)}}` },
  { id:'js_elseif',   label:'Else If',         icon:'🔀', color:C.FLOW, category:'Control Flow',
    fields:[{name:'condition',type:'text',placeholder:'x === 0'}],
    desc:'Another condition branch',
    isContainer:true,
    toCode:(f,ch,indent)=>`else if (${f.condition||'false'}) {\n${indent}${ch}\n${indent.slice(2)}}` },
  { id:'js_for',      label:'For Loop',        icon:'🔁', color:C.FLOW, category:'Control Flow',
    fields:[{name:'var',type:'text',placeholder:'i'},{name:'from',type:'text',placeholder:'0'},{name:'to',type:'text',placeholder:'10'}],
    desc:'Loop from start to end',
    isContainer:true,
    toCode:(f,ch,indent)=>`for (let ${f.var||'i'} = ${f.from||0}; ${f.var||'i'} < ${f.to||10}; ${f.var||'i'}++) {\n${indent}${ch}\n${indent.slice(2)}}` },
  { id:'js_while',    label:'While',           icon:'🔄', color:C.FLOW, category:'Control Flow',
    fields:[{name:'condition',type:'text',placeholder:'running'}],
    desc:'Loop while condition is true',
    isContainer:true,
    toCode:(f,ch,indent)=>`while (${f.condition||'true'}) {\n${indent}${ch}\n${indent.slice(2)}}` },
  { id:'js_break',    label:'Break',           icon:'⛔', color:C.FLOW, category:'Control Flow',
    fields:[], desc:'Exit loop', toCode:()=>`break;` },
  { id:'js_continue', label:'Continue',        icon:'⏭️', color:C.FLOW, category:'Control Flow',
    fields:[], desc:'Skip iteration', toCode:()=>`continue;` },

  // Functions
  { id:'js_func',     label:'Define Function', icon:'🧩', color:C.FUNC, category:'Functions',
    fields:[{name:'name',type:'text',placeholder:'myFunc'},{name:'params',type:'text',placeholder:'a, b'}],
    desc:'Declare a function',
    isContainer:true,
    toCode:(f,ch,indent)=>`function ${f.name||'myFunc'}(${f.params||''}) {\n${indent}${ch}\n${indent.slice(2)}}` },
  { id:'js_arrow',    label:'Arrow Function',  icon:'➡️', color:C.FUNC, category:'Functions',
    fields:[{name:'name',type:'text',placeholder:'fn'},{name:'params',type:'text',placeholder:'x'},{name:'body',type:'text',placeholder:'x * 2'}],
    desc:'Short function expression',
    toCode:(f)=>`const ${f.name||'fn'} = (${f.params||'x'}) => ${f.body||'x'};` },
  { id:'js_call',     label:'Call Function',   icon:'📞', color:C.FUNC, category:'Functions',
    fields:[{name:'name',type:'text',placeholder:'myFunc'},{name:'args',type:'text',placeholder:'1, 2'}],
    desc:'Invoke a function',
    toCode:(f)=>`${f.name||'myFunc'}(${f.args||''});` },
  { id:'js_return',   label:'Return',          icon:'↪️', color:C.FUNC, category:'Functions',
    fields:[{name:'value',type:'text',placeholder:'result'}],
    desc:'Return a value',
    toCode:(f)=>`return ${f.value||''};` },

  // Arrays
  { id:'js_arr',      label:'Create Array',    icon:'📋', color:C.ARR,  category:'Arrays',
    fields:[{name:'name',type:'text',placeholder:'myList'},{name:'values',type:'text',placeholder:'1, 2, 3'}],
    desc:'Make an array',
    toCode:(f)=>`let ${f.name||'myList'} = [${f.values||''}];` },
  { id:'js_push',     label:'Push',            icon:'⬇️', color:C.ARR,  category:'Arrays',
    fields:[{name:'array',type:'text',placeholder:'myList'},{name:'value',type:'text',placeholder:'42'}],
    desc:'Add to end of array',
    toCode:(f)=>`${f.array||'myList'}.push(${smartVal(f.value)});` },
  { id:'js_pop',      label:'Pop',             icon:'⬆️', color:C.ARR,  category:'Arrays',
    fields:[{name:'array',type:'text',placeholder:'myList'}],
    desc:'Remove last item',
    toCode:(f)=>`${f.array||'myList'}.pop();` },
  { id:'js_foreach',  label:'For Each',        icon:'🔂', color:C.ARR,  category:'Arrays',
    fields:[{name:'item',type:'text',placeholder:'item'},{name:'array',type:'text',placeholder:'myList'}],
    desc:'Loop over each item in array',
    isContainer:true,
    toCode:(f,ch,indent)=>`${f.array||'myList'}.forEach(${f.item||'item'} => {\n${indent}${ch}\n${indent.slice(2)}});` },

  // Math
  { id:'js_math',     label:'Math Op',         icon:'🔢', color:C.MATH, category:'Math',
    fields:[{name:'result',type:'text',placeholder:'result'},{name:'a',type:'text',placeholder:'10'},{name:'op',type:'select',options:['+','-','*','/','%','**']},{name:'b',type:'text',placeholder:'5'}],
    desc:'Arithmetic operation',
    toCode:(f)=>`let ${f.result||'result'} = ${f.a||0} ${f.op||'+'} ${f.b||0};` },
  { id:'js_rand',     label:'Random Int',      icon:'🎲', color:C.MATH, category:'Math',
    fields:[{name:'result',type:'text',placeholder:'rand'},{name:'min',type:'text',placeholder:'0'},{name:'max',type:'text',placeholder:'100'}],
    desc:'Random integer in range',
    toCode:(f)=>`let ${f.result||'rand'} = Math.floor(Math.random()*(${f.max||100}-${f.min||0}+1))+${f.min||0};` },
  { id:'js_round',    label:'Round',           icon:'⭕', color:C.MATH, category:'Math',
    fields:[{name:'result',type:'text',placeholder:'r'},{name:'value',type:'text',placeholder:'3.7'}],
    desc:'Round a number',
    toCode:(f)=>`let ${f.result||'r'} = Math.round(${f.value||0});` },
  { id:'js_abs',      label:'Absolute Value',  icon:'📊', color:C.MATH, category:'Math',
    fields:[{name:'result',type:'text',placeholder:'r'},{name:'value',type:'text',placeholder:'-5'}],
    desc:'Absolute value',
    toCode:(f)=>`let ${f.result||'r'} = Math.abs(${f.value||0});` },

  // Strings
  { id:'js_concat',   label:'Concatenate',     icon:'🔗', color:C.STR,  category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'full'},{name:'a',type:'text',placeholder:'Hello '},{name:'b',type:'text',placeholder:'World'}],
    desc:'Join strings',
    toCode:(f)=>`let ${f.result||'full'} = \`${f.a||''}${f.b||''}\`;` },
  { id:'js_strlen',   label:'String Length',   icon:'📐', color:C.STR,  category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'len'},{name:'str',type:'text',placeholder:'myVar'}],
    desc:'Length of a string',
    toCode:(f)=>`let ${f.result||'len'} = ${f.str||'""'}.length;` },
  { id:'js_upper',    label:'Uppercase',       icon:'🔠', color:C.STR,  category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'up'},{name:'str',type:'text',placeholder:'myVar'}],
    desc:'Uppercase a string',
    toCode:(f)=>`let ${f.result||'up'} = ${f.str||'""'}.toUpperCase();` },
  { id:'js_lower',    label:'Lowercase',       icon:'🔡', color:C.STR,  category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'lo'},{name:'str',type:'text',placeholder:'myVar'}],
    desc:'Lowercase a string',
    toCode:(f)=>`let ${f.result||'lo'} = ${f.str||'""'}.toLowerCase();` },

  // DOM
  { id:'js_domget',   label:'Get Element',     icon:'🎯', color:C.DOM,  category:'DOM',
    fields:[{name:'varname',type:'text',placeholder:'el'},{name:'selector',type:'text',placeholder:'#myId'}],
    desc:'Select a DOM element',
    toCode:(f)=>`const ${f.varname||'el'} = document.querySelector('${f.selector||'#id'}');` },
  { id:'js_domtext',  label:'Set Text',        icon:'✏️', color:C.DOM,  category:'DOM',
    fields:[{name:'selector',type:'text',placeholder:'#myId'},{name:'text',type:'text',placeholder:'New content'}],
    desc:'Set element inner text',
    toCode:(f)=>`document.querySelector('${f.selector||'#id'}').innerText = ${smartVal(f.text||'')};` },
  { id:'js_domstyle', label:'Set Style',       icon:'🎨', color:C.DOM,  category:'DOM',
    fields:[{name:'selector',type:'text',placeholder:'#myId'},{name:'prop',type:'text',placeholder:'color'},{name:'value',type:'text',placeholder:'red'}],
    desc:'Set a CSS style',
    toCode:(f)=>`document.querySelector('${f.selector||'#id'}').style.${f.prop||'color'} = '${f.value||''}';` },
  { id:'js_domcreate',label:'Create Element',  icon:'🏗️', color:C.DOM,  category:'DOM',
    fields:[{name:'varname',type:'text',placeholder:'el'},{name:'tag',type:'text',placeholder:'div'},{name:'parent',type:'text',placeholder:'document.body'}],
    desc:'Create and append a DOM element',
    toCode:(f)=>`const ${f.varname||'el'} = document.createElement('${f.tag||'div'}'); ${f.parent||'document.body'}.appendChild(${f.varname||'el'});` },
  { id:'js_event',    label:'On Event',        icon:'👂', color:C.DOM,  category:'DOM',
    fields:[{name:'selector',type:'text',placeholder:'#btn'},{name:'event',type:'text',placeholder:'click'},{name:'handler',type:'text',placeholder:'myFunc'}],
    desc:'Listen for events',
    toCode:(f)=>`document.querySelector('${f.selector||'#btn'}').addEventListener('${f.event||'click'}', ${f.handler||'myFunc'});` },
  { id:'js_keydown',  label:'On Key Press',    icon:'⌨️', color:C.DOM,  category:'DOM',
    fields:[{name:'handler',type:'text',placeholder:'handleKey'}],
    desc:'Global keydown listener',
    toCode:(f)=>`document.addEventListener('keydown', ${f.handler||'handleKey'});` },

  // Canvas / Graphics
  { id:'js_canvas',   label:'Setup Canvas',    icon:'🖼️', color:C.CANVAS, category:'Canvas',
    fields:[{name:'varname',type:'text',placeholder:'canvas'},{name:'width',type:'text',placeholder:'400'},{name:'height',type:'text',placeholder:'300'},{name:'parent',type:'text',placeholder:'document.body'}],
    desc:'Create and attach a canvas element',
    toCode:(f)=>{
      const v=f.varname||'canvas', w=f.width||400, h=f.height||300, p=f.parent||'document.body';
      return `const ${v} = document.createElement('canvas'); ${v}.width=${w}; ${v}.height=${h}; ${p}.appendChild(${v}); const ctx = ${v}.getContext('2d');`; } },
  { id:'js_fill',     label:'Set Fill Color',  icon:'🎨', color:C.CANVAS, category:'Canvas',
    fields:[{name:'color',type:'text',placeholder:'red or #ff0000'}],
    desc:'Set drawing fill color',
    toCode:(f)=>`ctx.fillStyle = '${f.color||'black'}';` },
  { id:'js_stroke',   label:'Set Stroke Color',icon:'✒️', color:C.CANVAS, category:'Canvas',
    fields:[{name:'color',type:'text',placeholder:'blue'},{name:'width',type:'text',placeholder:'2'}],
    desc:'Set outline color and width',
    toCode:(f)=>`ctx.strokeStyle = '${f.color||'black'}'; ctx.lineWidth = ${f.width||1};` },
  { id:'js_rect',     label:'Draw Rectangle',  icon:'⬜', color:C.CANVAS, category:'Canvas',
    fields:[{name:'x',type:'text',placeholder:'10'},{name:'y',type:'text',placeholder:'10'},{name:'w',type:'text',placeholder:'100'},{name:'h',type:'text',placeholder:'60'},{name:'mode',type:'select',options:['fill','stroke','both']}],
    desc:'Draw a rectangle',
    toCode:(f)=>{
      const x=f.x||0, y=f.y||0, w=f.w||100, h=f.h||60, m=f.mode||'fill';
      if(m==='both') return `ctx.fillRect(${x},${y},${w},${h}); ctx.strokeRect(${x},${y},${w},${h});`;
      return `ctx.${m}Rect(${x},${y},${w},${h});`; } },
  { id:'js_circle',   label:'Draw Circle',     icon:'⭕', color:C.CANVAS, category:'Canvas',
    fields:[{name:'x',type:'text',placeholder:'100'},{name:'y',type:'text',placeholder:'100'},{name:'radius',type:'text',placeholder:'40'},{name:'mode',type:'select',options:['fill','stroke','both']}],
    desc:'Draw a circle',
    toCode:(f)=>{
      const x=f.x||100, y=f.y||100, r=f.radius||40, m=f.mode||'fill';
      const base=`ctx.beginPath(); ctx.arc(${x},${y},${r},0,Math.PI*2);`;
      if(m==='both') return `${base} ctx.fill(); ctx.stroke();`;
      return `${base} ctx.${m}();`; } },
  { id:'js_line',     label:'Draw Line',       icon:'📏', color:C.CANVAS, category:'Canvas',
    fields:[{name:'x1',type:'text',placeholder:'0'},{name:'y1',type:'text',placeholder:'0'},{name:'x2',type:'text',placeholder:'100'},{name:'y2',type:'text',placeholder:'100'}],
    desc:'Draw a line',
    toCode:(f)=>`ctx.beginPath(); ctx.moveTo(${f.x1||0},${f.y1||0}); ctx.lineTo(${f.x2||100},${f.y2||100}); ctx.stroke();` },
  { id:'js_text',     label:'Draw Text',       icon:'🔤', color:C.CANVAS, category:'Canvas',
    fields:[{name:'text',type:'text',placeholder:'Hello!'},{name:'x',type:'text',placeholder:'50'},{name:'y',type:'text',placeholder:'50'},{name:'font',type:'text',placeholder:'16px Arial'},{name:'mode',type:'select',options:['fill','stroke']}],
    desc:'Draw text on canvas',
    toCode:(f)=>`ctx.font = '${f.font||'16px Arial'}'; ctx.${f.mode||'fill'}Text(${smartVal(f.text||'Hello!')},${f.x||50},${f.y||50});` },
  { id:'js_clearrect',label:'Clear Canvas',    icon:'🗑️', color:C.CANVAS, category:'Canvas',
    fields:[{name:'canvas',type:'text',placeholder:'canvas'}],
    desc:'Wipe the entire canvas',
    toCode:(f)=>`ctx.clearRect(0,0,${f.canvas||'canvas'}.width,${f.canvas||'canvas'}.height);` },
  { id:'js_image',    label:'Draw Image',      icon:'🖼️', color:C.CANVAS, category:'Canvas',
    fields:[{name:'src',type:'text',placeholder:'image.png'},{name:'x',type:'text',placeholder:'0'},{name:'y',type:'text',placeholder:'0'},{name:'w',type:'text',placeholder:'50'},{name:'h',type:'text',placeholder:'50'}],
    desc:'Draw an image on canvas',
    toCode:(f)=>`const _img=new Image(); _img.src='${f.src||''}'; _img.onload=()=>ctx.drawImage(_img,${f.x||0},${f.y||0},${f.w||50},${f.h||50});` },
  { id:'js_save',     label:'Save Canvas State',icon:'💾', color:C.CANVAS, category:'Canvas',
    fields:[], desc:'Push canvas transform state', toCode:()=>`ctx.save();` },
  { id:'js_restore',  label:'Restore Canvas State',icon:'♻️', color:C.CANVAS, category:'Canvas',
    fields:[], desc:'Pop canvas transform state', toCode:()=>`ctx.restore();` },
  { id:'js_translate',label:'Translate',       icon:'↕️', color:C.CANVAS, category:'Canvas',
    fields:[{name:'x',type:'text',placeholder:'10'},{name:'y',type:'text',placeholder:'10'}],
    desc:'Move canvas origin',
    toCode:(f)=>`ctx.translate(${f.x||0},${f.y||0});` },
  { id:'js_rotate',   label:'Rotate',          icon:'🔃', color:C.CANVAS, category:'Canvas',
    fields:[{name:'degrees',type:'text',placeholder:'45'}],
    desc:'Rotate canvas (degrees)',
    toCode:(f)=>`ctx.rotate((${f.degrees||0})*Math.PI/180);` },
  { id:'js_alpha',    label:'Set Opacity',     icon:'👁️', color:C.CANVAS, category:'Canvas',
    fields:[{name:'value',type:'text',placeholder:'0.5'}],
    desc:'Set global opacity 0–1',
    toCode:(f)=>`ctx.globalAlpha = ${f.value||1};` },

  // Timing
  { id:'js_wait',     label:'Wait (ms)',       icon:'⏱️', color:C.TIME, category:'Timing',
    fields:[{name:'ms',type:'text',placeholder:'1000'}],
    desc:'Pause execution (async/await)',
    toCode:(f)=>`await new Promise(r => setTimeout(r, ${f.ms||1000}));` },
  { id:'js_setinterval',label:'Repeat Every',  icon:'⏰', color:C.TIME, category:'Timing',
    fields:[{name:'varname',type:'text',placeholder:'timer'},{name:'handler',type:'text',placeholder:'tick'},{name:'ms',type:'text',placeholder:'16'}],
    desc:'Call a function on an interval',
    toCode:(f)=>`const ${f.varname||'timer'} = setInterval(${f.handler||'tick'}, ${f.ms||16});` },
  { id:'js_clearinterval',label:'Stop Repeat', icon:'🛑', color:C.TIME, category:'Timing',
    fields:[{name:'varname',type:'text',placeholder:'timer'}],
    desc:'Stop a repeating timer',
    toCode:(f)=>`clearInterval(${f.varname||'timer'});` },
  { id:'js_raf',      label:'Game Loop (RAF)', icon:'🎮', color:C.TIME, category:'Timing',
    fields:[{name:'handler',type:'text',placeholder:'gameLoop'}],
    desc:'Request animation frame',
    toCode:(f)=>`requestAnimationFrame(${f.handler||'gameLoop'});` },
  { id:'js_settimeout',label:'Delay Call',     icon:'🕐', color:C.TIME, category:'Timing',
    fields:[{name:'handler',type:'text',placeholder:'myFunc'},{name:'ms',type:'text',placeholder:'500'}],
    desc:'Call function once after delay',
    toCode:(f)=>`setTimeout(${f.handler||'myFunc'}, ${f.ms||500});` },

  // Comments
  { id:'js_comment',  label:'Comment',         icon:'💭', color:C.MISC, category:'Comments',
    fields:[{name:'text',type:'text',placeholder:'This does...'}],
    desc:'Single line comment',
    toCode:(f)=>`// ${f.text||''}` },
];

// ---- PYTHON BLOCKS ----
const PY_BLOCKS = [
  // Variables
  { id:'py_var',    label:'Set Variable',  icon:'📦', color:C.VAR,  category:'Variables',
    fields:[{name:'name',type:'text',placeholder:'my_var'},{name:'value',type:'text',placeholder:'0'}],
    desc:'Assign a variable',
    toCode:(f)=>`${f.name||'my_var'} = ${smartVal(f.value)}` },
  { id:'py_inc',    label:'Increment',     icon:'➕', color:C.VAR,  category:'Variables',
    fields:[{name:'name',type:'text',placeholder:'counter'},{name:'by',type:'text',placeholder:'1'}],
    desc:'Add to variable',
    toCode:(f)=>`${f.name||'counter'} += ${f.by||1}` },
  { id:'py_dec',    label:'Decrement',     icon:'➖', color:C.VAR,  category:'Variables',
    fields:[{name:'name',type:'text',placeholder:'counter'},{name:'by',type:'text',placeholder:'1'}],
    desc:'Subtract from variable',
    toCode:(f)=>`${f.name||'counter'} -= ${f.by||1}` },

  // Output
  { id:'py_print',  label:'Print',         icon:'💬', color:C.OUT,  category:'Output',
    fields:[{name:'text',type:'text',placeholder:'Hello!'}],
    desc:'Print to console',
    toCode:(f)=>`print(${smartVal(f.text||'Hello!')})` },
  { id:'py_input',  label:'Input',         icon:'⌨️', color:C.OUT,  category:'Output',
    fields:[{name:'varname',type:'text',placeholder:'answer'},{name:'prompt',type:'text',placeholder:'Enter value: '}],
    desc:'Get user input',
    toCode:(f)=>`${f.varname||'answer'} = input(${smartVal(f.prompt||'Enter: ')})` },

  // Control Flow
  { id:'py_if',     label:'If',            icon:'❓', color:C.FLOW, category:'Control Flow',
    fields:[{name:'condition',type:'text',placeholder:'x > 0'}],
    desc:'If condition', isContainer:true,
    toCode:(f,ch,indent)=>`if ${f.condition||'True'}:\n${indent}${ch}` },
  { id:'py_elif',   label:'Elif',          icon:'🔀', color:C.FLOW, category:'Control Flow',
    fields:[{name:'condition',type:'text',placeholder:'x == 0'}],
    desc:'Else if', isContainer:true,
    toCode:(f,ch,indent)=>`elif ${f.condition||'False'}:\n${indent}${ch}` },
  { id:'py_else',   label:'Else',          icon:'↩️', color:C.FLOW, category:'Control Flow',
    fields:[], desc:'Else block', isContainer:true,
    toCode:(f,ch,indent)=>`else:\n${indent}${ch}` },
  { id:'py_for',    label:'For Loop',      icon:'🔁', color:C.FLOW, category:'Control Flow',
    fields:[{name:'var',type:'text',placeholder:'i'},{name:'from',type:'text',placeholder:'0'},{name:'to',type:'text',placeholder:'10'}],
    desc:'Loop from start to end', isContainer:true,
    toCode:(f,ch,indent)=>`for ${f.var||'i'} in range(${f.from||0}, ${f.to||10}):\n${indent}${ch}` },
  { id:'py_while',  label:'While',         icon:'🔄', color:C.FLOW, category:'Control Flow',
    fields:[{name:'condition',type:'text',placeholder:'running'}],
    desc:'While loop', isContainer:true,
    toCode:(f,ch,indent)=>`while ${f.condition||'True'}:\n${indent}${ch}` },
  { id:'py_foreach',label:'For Each',      icon:'🔂', color:C.FLOW, category:'Control Flow',
    fields:[{name:'item',type:'text',placeholder:'item'},{name:'lst',type:'text',placeholder:'my_list'}],
    desc:'Iterate list', isContainer:true,
    toCode:(f,ch,indent)=>`for ${f.item||'item'} in ${f.lst||'my_list'}:\n${indent}${ch}` },
  { id:'py_break',  label:'Break',         icon:'⛔', color:C.FLOW, category:'Control Flow',
    fields:[], desc:'Exit loop', toCode:()=>`break` },
  { id:'py_continue',label:'Continue',     icon:'⏭️', color:C.FLOW, category:'Control Flow',
    fields:[], desc:'Skip iteration', toCode:()=>`continue` },
  { id:'py_pass',   label:'Pass',          icon:'🔲', color:C.FLOW, category:'Control Flow',
    fields:[], desc:'Placeholder (do nothing)', toCode:()=>`pass` },

  // Functions
  { id:'py_def',    label:'Define Function',icon:'🧩', color:C.FUNC, category:'Functions',
    fields:[{name:'name',type:'text',placeholder:'my_func'},{name:'params',type:'text',placeholder:'a, b'}],
    desc:'Define a function', isContainer:true,
    toCode:(f,ch,indent)=>`def ${f.name||'my_func'}(${f.params||''}):\n${indent}${ch}` },
  { id:'py_return', label:'Return',         icon:'↪️', color:C.FUNC, category:'Functions',
    fields:[{name:'value',type:'text',placeholder:'result'}],
    desc:'Return value', toCode:(f)=>`return ${f.value||''}` },
  { id:'py_call',   label:'Call Function',  icon:'📞', color:C.FUNC, category:'Functions',
    fields:[{name:'name',type:'text',placeholder:'my_func'},{name:'args',type:'text',placeholder:'1, 2'}],
    desc:'Call a function', toCode:(f)=>`${f.name||'my_func'}(${f.args||''})` },
  { id:'py_lambda', label:'Lambda',         icon:'λ', color:C.FUNC, category:'Functions',
    fields:[{name:'name',type:'text',placeholder:'fn'},{name:'params',type:'text',placeholder:'x'},{name:'expr',type:'text',placeholder:'x*2'}],
    desc:'Short anonymous function',
    toCode:(f)=>`${f.name||'fn'} = lambda ${f.params||'x'}: ${f.expr||'x'}` },

  // Lists
  { id:'py_list',   label:'Create List',    icon:'📋', color:C.ARR,  category:'Lists',
    fields:[{name:'name',type:'text',placeholder:'my_list'},{name:'values',type:'text',placeholder:'1, 2, 3'}],
    desc:'Make a list', toCode:(f)=>`${f.name||'my_list'} = [${f.values||''}]` },
  { id:'py_append', label:'Append',         icon:'⬇️', color:C.ARR,  category:'Lists',
    fields:[{name:'lst',type:'text',placeholder:'my_list'},{name:'value',type:'text',placeholder:'42'}],
    desc:'Add to list', toCode:(f)=>`${f.lst||'my_list'}.append(${smartVal(f.value)})` },
  { id:'py_pop',    label:'Pop',            icon:'⬆️', color:C.ARR,  category:'Lists',
    fields:[{name:'lst',type:'text',placeholder:'my_list'}],
    desc:'Remove last item', toCode:(f)=>`${f.lst||'my_list'}.pop()` },
  { id:'py_len',    label:'Length',         icon:'📏', color:C.ARR,  category:'Lists',
    fields:[{name:'result',type:'text',placeholder:'n'},{name:'lst',type:'text',placeholder:'my_list'}],
    desc:'Length of list/string', toCode:(f)=>`${f.result||'n'} = len(${f.lst||'my_list'})` },

  // Math
  { id:'py_math',   label:'Math Op',        icon:'🔢', color:C.MATH, category:'Math',
    fields:[{name:'result',type:'text',placeholder:'result'},{name:'a',type:'text',placeholder:'10'},{name:'op',type:'select',options:['+','-','*','/','//','%','**']},{name:'b',type:'text',placeholder:'5'}],
    desc:'Arithmetic', toCode:(f)=>`${f.result||'result'} = ${f.a||0} ${f.op||'+'} ${f.b||0}` },
  { id:'py_rand',   label:'Random Int',     icon:'🎲', color:C.MATH, category:'Math',
    fields:[{name:'result',type:'text',placeholder:'rand'},{name:'min',type:'text',placeholder:'0'},{name:'max',type:'text',placeholder:'100'}],
    desc:'Random integer', toCode:(f)=>`import random\n${f.result||'rand'} = random.randint(${f.min||0}, ${f.max||100})` },
  { id:'py_abs',    label:'Absolute',       icon:'📊', color:C.MATH, category:'Math',
    fields:[{name:'result',type:'text',placeholder:'r'},{name:'value',type:'text',placeholder:'-5'}],
    desc:'Absolute value', toCode:(f)=>`${f.result||'r'} = abs(${f.value||0})` },
  { id:'py_round',  label:'Round',          icon:'⭕', color:C.MATH, category:'Math',
    fields:[{name:'result',type:'text',placeholder:'r'},{name:'value',type:'text',placeholder:'3.7'}],
    desc:'Round number', toCode:(f)=>`${f.result||'r'} = round(${f.value||0})` },

  // Strings
  { id:'py_concat', label:'Concatenate',    icon:'🔗', color:C.STR, category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'full'},{name:'a',type:'text',placeholder:'Hello '},{name:'b',type:'text',placeholder:'World'}],
    desc:'Join strings', toCode:(f)=>`${f.result||'full'} = f"${f.a||''}{${f.b||''}}"` },
  { id:'py_upper',  label:'Uppercase',      icon:'🔠', color:C.STR, category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'up'},{name:'var',type:'text',placeholder:'my_str'}],
    desc:'Uppercase string', toCode:(f)=>`${f.result||'up'} = ${f.var||'my_str'}.upper()` },
  { id:'py_lower',  label:'Lowercase',      icon:'🔡', color:C.STR, category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'lo'},{name:'var',type:'text',placeholder:'my_str'}],
    desc:'Lowercase string', toCode:(f)=>`${f.result||'lo'} = ${f.var||'my_str'}.lower()` },

  // Timing
  { id:'py_wait',   label:'Wait (seconds)', icon:'⏱️', color:C.TIME, category:'Timing',
    fields:[{name:'seconds',type:'text',placeholder:'1'}],
    desc:'Pause execution',
    toCode:(f)=>`import time\ntime.sleep(${f.seconds||1})` },

  // Comments
  { id:'py_comment',label:'Comment',        icon:'💭', color:C.MISC, category:'Comments',
    fields:[{name:'text',type:'text',placeholder:'This does...'}],
    desc:'Add a comment', toCode:(f)=>`# ${f.text||''}` },
  { id:'py_docstring',label:'Docstring',    icon:'📄', color:C.MISC, category:'Comments',
    fields:[{name:'text',type:'text',placeholder:'Description...'}],
    desc:'Multi-line docstring', toCode:(f)=>`"""\n${f.text||''}\n"""` },
];

// ---- HTML BLOCKS ----
// HTML projects build the <body> visually. Script blocks live inside a <script> section.
// Two zones: PAGE (HTML elements) and SCRIPT (JS logic).
const HTML_BLOCKS = [
  // Page Structure
  { id:'html_heading',  label:'Heading',         icon:'H1', color:C.HTML, category:'Page',
    fields:[{name:'level',type:'select',options:['1','2','3','4']},{name:'text',type:'text',placeholder:'My Title'},{name:'id',type:'text',placeholder:'myHeading'},{name:'color',type:'text',placeholder:'#000000'},{name:'align',type:'select',options:['left','center','right']}],
    desc:'Add a heading', isHTMLElement:true,
    toCode:(f)=>`<h${f.level||1} id="${f.id||''}" style="color:${f.color||'inherit'};text-align:${f.align||'left'}">${f.text||'Heading'}</h${f.level||1}>` },
  { id:'html_para',     label:'Paragraph',       icon:'¶', color:C.HTML, category:'Page',
    fields:[{name:'text',type:'text',placeholder:'Some text...'},{name:'id',type:'text',placeholder:'myPara'},{name:'color',type:'text',placeholder:'#000000'},{name:'size',type:'text',placeholder:'16px'},{name:'align',type:'select',options:['left','center','right']}],
    desc:'Add a paragraph', isHTMLElement:true,
    toCode:(f)=>`<p id="${f.id||''}" style="color:${f.color||'inherit'};font-size:${f.size||'16px'};text-align:${f.align||'left'}">${f.text||'Paragraph'}</p>` },
  { id:'html_button',   label:'Button',          icon:'🔲', color:C.HTML, category:'Page',
    fields:[{name:'text',type:'text',placeholder:'Click me'},{name:'id',type:'text',placeholder:'myBtn'},{name:'onclick',type:'text',placeholder:'myFunc()'},{name:'bg',type:'text',placeholder:'#2979ff'},{name:'color',type:'text',placeholder:'white'}],
    desc:'Add a button', isHTMLElement:true,
    toCode:(f)=>`<button id="${f.id||''}" onclick="${f.onclick||''}" style="background:${f.bg||'#2979ff'};color:${f.color||'white'};padding:10px 20px;border:none;border-radius:6px;cursor:pointer;font-size:16px">${f.text||'Button'}</button>` },
  { id:'html_input',    label:'Text Input',      icon:'📝', color:C.HTML, category:'Page',
    fields:[{name:'id',type:'text',placeholder:'myInput'},{name:'placeholder',type:'text',placeholder:'Type here...'},{name:'type',type:'select',options:['text','number','password','email']}],
    desc:'Add a text input', isHTMLElement:true,
    toCode:(f)=>`<input id="${f.id||''}" type="${f.type||'text'}" placeholder="${f.placeholder||''}" style="padding:10px;border:1px solid #ccc;border-radius:6px;font-size:16px;width:100%">` },
  { id:'html_div',      label:'Box (div)',        icon:'⬜', color:C.HTML, category:'Page',
    fields:[{name:'id',type:'text',placeholder:'myBox'},{name:'bg',type:'text',placeholder:'#f0f0f0'},{name:'padding',type:'text',placeholder:'20px'},{name:'borderRadius',type:'text',placeholder:'8px'},{name:'width',type:'text',placeholder:'100%'},{name:'height',type:'text',placeholder:'auto'}],
    desc:'Add a container box', isHTMLElement:true,
    toCode:(f)=>`<div id="${f.id||''}" style="background:${f.bg||'#f0f0f0'};padding:${f.padding||'20px'};border-radius:${f.borderRadius||'8px'};width:${f.width||'100%'};height:${f.height||'auto'}"></div>` },
  { id:'html_img',      label:'Image',           icon:'🖼️', color:C.HTML, category:'Page',
    fields:[{name:'src',type:'text',placeholder:'image.png'},{name:'id',type:'text',placeholder:'myImg'},{name:'width',type:'text',placeholder:'200px'},{name:'alt',type:'text',placeholder:'image'}],
    desc:'Add an image', isHTMLElement:true,
    toCode:(f)=>`<img id="${f.id||''}" src="${f.src||''}" alt="${f.alt||''}" style="width:${f.width||'200px'}">` },
  { id:'html_canvas',   label:'Canvas',          icon:'🎨', color:C.HTML, category:'Page',
    fields:[{name:'id',type:'text',placeholder:'myCanvas'},{name:'width',type:'text',placeholder:'400'},{name:'height',type:'text',placeholder:'300'},{name:'bg',type:'text',placeholder:'#000000'}],
    desc:'Add a canvas element', isHTMLElement:true,
    toCode:(f)=>`<canvas id="${f.id||''}" width="${f.width||400}" height="${f.height||300}" style="background:${f.bg||'black'};display:block;border-radius:6px"></canvas>` },
  { id:'html_spacer',   label:'Spacer',          icon:'↕️', color:C.HTML, category:'Page',
    fields:[{name:'height',type:'text',placeholder:'20px'}],
    desc:'Add vertical space', isHTMLElement:true,
    toCode:(f)=>`<div style="height:${f.height||'20px'}"></div>` },
  { id:'html_hr',       label:'Divider Line',    icon:'➖', color:C.HTML, category:'Page',
    fields:[{name:'color',type:'text',placeholder:'#cccccc'}],
    desc:'Horizontal rule', isHTMLElement:true,
    toCode:(f)=>`<hr style="border-color:${f.color||'#ccc'}">` },
  { id:'html_link',     label:'Link',            icon:'🔗', color:C.HTML, category:'Page',
    fields:[{name:'text',type:'text',placeholder:'Click here'},{name:'href',type:'text',placeholder:'https://...'},{name:'color',type:'text',placeholder:'#2979ff'}],
    desc:'Add a hyperlink', isHTMLElement:true,
    toCode:(f)=>`<a href="${f.href||'#'}" style="color:${f.color||'#2979ff'}">${f.text||'Link'}</a>` },
  { id:'html_list',     label:'List',            icon:'📋', color:C.HTML, category:'Page',
    fields:[{name:'id',type:'text',placeholder:'myList'},{name:'type',type:'select',options:['ul','ol']},{name:'items',type:'text',placeholder:'Item 1, Item 2, Item 3'}],
    desc:'Add a bulleted or numbered list', isHTMLElement:true,
    toCode:(f)=>{const t=f.type||'ul'; return `<${t} id="${f.id||''}">${(f.items||'Item').split(',').map(i=>`<li>${i.trim()}</li>`).join('')}</${t}>`; } },

  // Script Section (JS inside HTML)
  { id:'html_scriptfunc',label:'Script: Function',icon:'🧩', color:C.FUNC, category:'Script',
    fields:[{name:'name',type:'text',placeholder:'myFunc'},{name:'params',type:'text',placeholder:''}],
    desc:'Define a JS function in script', isContainer:true, isScript:true,
    toCode:(f,ch,indent)=>`function ${f.name||'myFunc'}(${f.params||''}) {\n${indent}${ch}\n${indent.slice(2)}}` },
  { id:'html_settext',  label:'Script: Set Text',  icon:'✏️', color:C.DOM, category:'Script',
    fields:[{name:'id',type:'text',placeholder:'myHeading'},{name:'text',type:'text',placeholder:'New text'}],
    desc:'Change element text', isScript:true,
    toCode:(f)=>`document.getElementById('${f.id||''}').innerText = ${smartVal(f.text||'')};` },
  { id:'html_setstyle', label:'Script: Set Style',  icon:'🎨', color:C.DOM, category:'Script',
    fields:[{name:'id',type:'text',placeholder:'myBox'},{name:'prop',type:'text',placeholder:'background'},{name:'value',type:'text',placeholder:'red'}],
    desc:'Change element style', isScript:true,
    toCode:(f)=>`document.getElementById('${f.id||''}').style.${f.prop||'color'} = '${f.value||''}';` },
  { id:'html_show',     label:'Script: Show Element',icon:'👁️', color:C.DOM, category:'Script',
    fields:[{name:'id',type:'text',placeholder:'myBox'}],
    desc:'Show a hidden element', isScript:true,
    toCode:(f)=>`document.getElementById('${f.id||''}').style.display = 'block';` },
  { id:'html_hide',     label:'Script: Hide Element',icon:'🙈', color:C.DOM, category:'Script',
    fields:[{name:'id',type:'text',placeholder:'myBox'}],
    desc:'Hide an element', isScript:true,
    toCode:(f)=>`document.getElementById('${f.id||''}').style.display = 'none';` },
  { id:'html_getalert', label:'Script: Alert',      icon:'🔔', color:C.OUT, category:'Script',
    fields:[{name:'text',type:'text',placeholder:'Hello!'}],
    desc:'Show popup alert', isScript:true,
    toCode:(f)=>`alert(${smartVal(f.text||'Hello!')});` },
  { id:'html_scriptvar',label:'Script: Variable',   icon:'📦', color:C.VAR, category:'Script',
    fields:[{name:'name',type:'text',placeholder:'myVar'},{name:'value',type:'text',placeholder:'0'}],
    desc:'Declare a JS variable', isScript:true,
    toCode:(f)=>`let ${f.name||'myVar'} = ${smartVal(f.value)};` },
  { id:'html_onload',   label:'Script: On Load',    icon:'🚀', color:C.FUNC, category:'Script',
    fields:[{name:'handler',type:'text',placeholder:'init'}],
    desc:'Run function when page loads', isScript:true,
    toCode:(f)=>`window.onload = ${f.handler||'init'};` },
  { id:'html_canvasinit',label:'Script: Canvas Init',icon:'🖼️', color:C.CANVAS, category:'Script',
    fields:[{name:'id',type:'text',placeholder:'myCanvas'},{name:'ctxVar',type:'text',placeholder:'ctx'}],
    desc:'Get canvas drawing context', isScript:true,
    toCode:(f)=>`const ${f.ctxVar||'ctx'} = document.getElementById('${f.id||'myCanvas'}').getContext('2d');` },
  { id:'html_drawrect', label:'Script: Draw Rect',  icon:'⬜', color:C.CANVAS, category:'Script',
    fields:[{name:'ctx',type:'text',placeholder:'ctx'},{name:'x',type:'text',placeholder:'10'},{name:'y',type:'text',placeholder:'10'},{name:'w',type:'text',placeholder:'100'},{name:'h',type:'text',placeholder:'60'},{name:'color',type:'text',placeholder:'blue'}],
    desc:'Draw a filled rectangle', isScript:true,
    toCode:(f)=>`${f.ctx||'ctx'}.fillStyle='${f.color||'blue'}'; ${f.ctx||'ctx'}.fillRect(${f.x||0},${f.y||0},${f.w||100},${f.h||60});` },
  { id:'html_drawcircle',label:'Script: Draw Circle',icon:'⭕', color:C.CANVAS, category:'Script',
    fields:[{name:'ctx',type:'text',placeholder:'ctx'},{name:'x',type:'text',placeholder:'100'},{name:'y',type:'text',placeholder:'100'},{name:'r',type:'text',placeholder:'40'},{name:'color',type:'text',placeholder:'red'}],
    desc:'Draw a filled circle', isScript:true,
    toCode:(f)=>`${f.ctx||'ctx'}.fillStyle='${f.color||'red'}'; ${f.ctx||'ctx'}.beginPath(); ${f.ctx||'ctx'}.arc(${f.x||100},${f.y||100},${f.r||40},0,Math.PI*2); ${f.ctx||'ctx'}.fill();` },
];

// ---- GENERIC (BDM) BLOCKS ----
const GENERIC_BLOCKS = [
  { id:'g_step',   label:'Step',         icon:'▶️', color:C.MISC, category:'Logic',
    fields:[{name:'text',type:'text',placeholder:'Do something...'}],
    desc:'A named step',
    toCode:(f)=>`// STEP: ${f.text||'...'}` },
  { id:'g_note',   label:'Note',         icon:'📌', color:C.MISC, category:'Logic',
    fields:[{name:'text',type:'text',placeholder:'Remember to...'}],
    desc:'A sticky note',
    toCode:(f)=>`// NOTE: ${f.text||''}` },
  { id:'g_if',     label:'If',           icon:'❓', color:C.FLOW, category:'Logic',
    fields:[{name:'condition',type:'text',placeholder:'something is true'}],
    desc:'Conditional logic', isContainer:true,
    toCode:(f,ch,indent)=>`IF (${f.condition||'...'}) {\n${indent}${ch}\n${indent.slice(2)}}` },
  { id:'g_loop',   label:'Repeat',       icon:'🔁', color:C.FLOW, category:'Logic',
    fields:[{name:'times',type:'text',placeholder:'10'}],
    desc:'Repeat steps', isContainer:true,
    toCode:(f,ch,indent)=>`REPEAT ${f.times||'N'} TIMES {\n${indent}${ch}\n${indent.slice(2)}}` },
  { id:'g_func',   label:'Procedure',    icon:'🧩', color:C.FUNC, category:'Logic',
    fields:[{name:'name',type:'text',placeholder:'myProcedure'}],
    desc:'A named procedure', isContainer:true,
    toCode:(f,ch,indent)=>`PROCEDURE ${f.name||'myProc'} {\n${indent}${ch}\n${indent.slice(2)}}` },
  { id:'g_output', label:'Output',       icon:'💬', color:C.OUT,  category:'Logic',
    fields:[{name:'text',type:'text',placeholder:'Show something'}],
    desc:'Output/display something',
    toCode:(f)=>`OUTPUT: ${f.text||'...'}` },
  { id:'g_input',  label:'Input',        icon:'⌨️', color:C.OUT,  category:'Logic',
    fields:[{name:'varname',type:'text',placeholder:'answer'},{name:'prompt',type:'text',placeholder:'Ask user:'}],
    desc:'Get input from user',
    toCode:(f)=>`${f.varname||'answer'} = INPUT("${f.prompt||'?'}")` },
  { id:'g_wait',   label:'Wait',         icon:'⏱️', color:C.TIME, category:'Logic',
    fields:[{name:'duration',type:'text',placeholder:'2 seconds'}],
    desc:'Wait for a duration',
    toCode:(f)=>`WAIT ${f.duration||'1s'}` },
  { id:'g_math',   label:'Calculate',    icon:'🔢', color:C.MATH, category:'Logic',
    fields:[{name:'result',type:'text',placeholder:'result'},{name:'expr',type:'text',placeholder:'a + b * 2'}],
    desc:'Calculate an expression',
    toCode:(f)=>`${f.result||'result'} = ${f.expr||'0'}` },
  { id:'g_comment',label:'Comment',      icon:'💭', color:C.MISC, category:'Logic',
    fields:[{name:'text',type:'text',placeholder:'Notes here...'}],
    desc:'A comment',
    toCode:(f)=>`// ${f.text||''}` },
];

const LANG_BLOCKS = {
  js:      JS_BLOCKS,
  python:  PY_BLOCKS,
  html:    HTML_BLOCKS,
  generic: GENERIC_BLOCKS,
};

// ============================================================
//  HELPERS
// ============================================================
function smartVal(v) {
  if (v === undefined || v === null || v === '') return '""';
  const s = String(v).trim();
  if (!isNaN(s) && s !== '') return s;
  if (s === 'true' || s === 'false' || s === 'null' || s === 'undefined') return s;
  if (s.startsWith('"') || s.startsWith("'") || s.startsWith('`')) return s;
  if (/^[a-zA-Z_$][a-zA-Z0-9_$.[\]]*$/.test(s)) return s;
  return `"${s}"`;
}

function escHtml(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function escAttr(s) {
  return String(s||'').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function uid() { return 'b' + Math.random().toString(36).slice(2,9); }

// ============================================================
//  CODE GENERATION  (recursive with nesting)
// ============================================================
function generateCode(blocks, lang, indentLevel = 0) {
  const indent = '  '.repeat(indentLevel);
  const lines = [];
  for (const b of blocks) {
    const def = LANG_BLOCKS[lang]?.find(x => x.id === b.id);
    if (!def) continue;
    if (def.isContainer) {
      const childCode = b.children?.length
        ? generateCode(b.children, lang, indentLevel + 1).split('\n').join('\n' + indent + '  ')
        : (lang === 'python' || lang === 'generic' ? 'pass' : '// empty');
      const childIndent = indent + '  ';
      lines.push(indent + def.toCode(b.fields || {}, childCode, childIndent));
    } else {
      lines.push(indent + def.toCode(b.fields || {}));
    }
  }
  return lines.join('\n');
}

function generateHTML(blocks) {
  const pageBlocks = blocks.filter(b => {
    const def = HTML_BLOCKS.find(x => x.id === b.id);
    return def && def.isHTMLElement;
  });
  const scriptBlocks = blocks.filter(b => {
    const def = HTML_BLOCKS.find(x => x.id === b.id);
    return def && def.isScript;
  });

  const bodyHTML = pageBlocks.map(b => {
    const def = HTML_BLOCKS.find(x => x.id === b.id);
    if (!def) return '';
    if (def.isContainer) {
      const childCode = b.children?.length ? generateHTML_children(b.children) : '';
      return def.toCode(b.fields || {}, childCode, '  ');
    }
    return def.toCode(b.fields || {});
  }).join('\n  ');

  const scriptJS = scriptBlocks.map(b => {
    const def = HTML_BLOCKS.find(x => x.id === b.id);
    if (!def) return '';
    if (def.isContainer) {
      const childCode = b.children?.length
        ? b.children.map(cb => {
            const cdef = HTML_BLOCKS.find(x => x.id === cb.id);
            return cdef ? '    ' + cdef.toCode(cb.fields || {}) : '';
          }).join('\n')
        : '    // empty';
      return '  ' + def.toCode(b.fields || {}, childCode, '    ');
    }
    return '  ' + def.toCode(b.fields || {});
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>My Page</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: system-ui, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
</style>
</head>
<body>
  ${bodyHTML || '<!-- No page elements yet -->'}
${scriptJS ? `<script>\n${scriptJS}\n</script>` : ''}
</body>
</html>`;
}

function generateHTML_children(children) {
  return children.map(b => {
    const def = HTML_BLOCKS.find(x => x.id === b.id);
    return def ? def.toCode(b.fields || {}) : '';
  }).join('\n  ');
}

// ============================================================
//  STATE
// ============================================================
let state = {
  theme: 'dark',
  projects: {},
  currentProject: null,
  view: 'library',
  editorMode: 'blocks',
  searchQuery: '',
  blockPickerOpen: false,
  blockPickerCategory: 'All',
  blockPickerParentPath: null, // null = root, else array path to parent block
  selectedPath: null,          // path array to selected block
  runOutput: null,
  toast: null,
  expandedBlocks: new Set(),
};

const STORAGE_KEY = 'builddotmake_v2_projects';
const PREFS_KEY   = 'builddotmake_v2_prefs';

function saveProjects() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.projects)); } catch(e){} }
function loadProjects() { try { const d=localStorage.getItem(STORAGE_KEY); if(d) state.projects=JSON.parse(d); } catch(e){} }
function savePrefs()    { try { localStorage.setItem(PREFS_KEY, JSON.stringify({theme:state.theme})); } catch(e){} }
function loadPrefs()    { try { const d=localStorage.getItem(PREFS_KEY); if(d){ const p=JSON.parse(d); state.theme=p.theme||'dark'; } } catch(e){} }

function newProject(name, lang) {
  const id = 'p_' + Date.now();
  state.projects[id] = { id, name, lang, created: Date.now(), modified: Date.now(), blocks: [], code: '' };
  saveProjects();
  return id;
}
function deleteProject(id) { delete state.projects[id]; saveProjects(); }

// Block tree utilities
function getBlocksAt(blocks, path) {
  let arr = blocks;
  for (const idx of path) {
    arr = arr[idx].children;
    if (!arr) return null;
  }
  return arr;
}

function getBlockAt(blocks, path) {
  let arr = blocks;
  let block = null;
  for (let i = 0; i < path.length; i++) {
    block = arr[path[i]];
    if (i < path.length-1) arr = block.children;
  }
  return block;
}

function deleteBlockAt(blocks, path) {
  const parentArr = path.length === 1 ? blocks : getBlocksAt(blocks, path.slice(0,-1));
  if (parentArr) parentArr.splice(path[path.length-1], 1);
}

function moveBlockAt(blocks, path, dir) {
  const parentArr = path.length === 1 ? blocks : getBlocksAt(blocks, path.slice(0,-1));
  if (!parentArr) return;
  const idx = path[path.length-1];
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= parentArr.length) return;
  [parentArr[idx], parentArr[newIdx]] = [parentArr[newIdx], parentArr[idx]];
}

// ============================================================
//  RENDER ENTRY
// ============================================================
function render() {
  const app = document.getElementById('app');
  if (!app) return;
  document.body.className = state.theme === 'dark' ? 'dark' : 'light';
  app.innerHTML = '';

  if (state.toast) {
    const t = document.createElement('div');
    t.className = 'toast ' + (state.toast.type==='error' ? 'toast-err' : 'toast-ok');
    t.textContent = state.toast.msg;
    app.appendChild(t);
    requestAnimationFrame(() => t.classList.add('toast-in'));
  }

  if      (state.view==='library')     renderLibrary(app);
  else if (state.view==='editor')      renderEditor(app);
  else if (state.view==='newproject')  renderNewProject(app);
  else if (state.view==='preferences') renderPreferences(app);
}

function showToast(msg, type='success') {
  state.toast = {msg, type};
  render();
  setTimeout(() => { state.toast = null; render(); }, 2200);
}

// ============================================================
//  LIBRARY
// ============================================================
function renderLibrary(app) {
  const projects = Object.values(state.projects).sort((a,b) => b.modified-a.modified);
  const LANG_COLORS = {js:'#f0c040',python:'#4fc3f7',html:'#ff7043',generic:'#b0bec5'};
  const LANG_LABELS = {js:'JavaScript',python:'Python',html:'HTML',generic:'Generic'};

  const html = `
  <div class="header animate-fadein">
    <div class="header-logo">
      <span class="logo-dot"></span>
      <span class="logo-text">Build<span class="logo-dot-char">.</span>Make</span>
    </div>
    <div class="header-actions">
      <button class="icon-btn" id="btn-prefs">⚙️</button>
      <button class="icon-btn" id="btn-import">📥</button>
      <input type="file" id="import-input" accept=".bdmproject" style="display:none">
    </div>
  </div>
  <div class="library-body animate-fadein" style="animation-delay:.06s">
    <div class="library-title-row">
      <h2 class="library-title">My Projects</h2>
      <button class="btn-primary" id="btn-new">+ New</button>
    </div>
    <div class="project-list">
      ${projects.length===0 ? `<div class="empty-state"><div class="empty-icon">🧱</div><p>No projects yet.<br>Tap <b>+ New</b> to start.</p></div>` : ''}
      ${projects.map(p => {
        const lc = LANG_COLORS[p.lang]||'#607d8b';
        const ll = LANG_LABELS[p.lang]||p.lang;
        const d = new Date(p.modified).toLocaleDateString('en-CA',{month:'short',day:'numeric'});
        const blockCount = countBlocks(p.blocks);
        return `<div class="project-card animate-slidein" data-id="${p.id}">
          <div class="project-card-top">
            <div class="project-name">${escHtml(p.name)}</div>
            <span class="lang-badge" style="color:${lc};border-color:${lc}">${ll}</span>
          </div>
          <div class="project-meta">${blockCount} blocks · ${d}</div>
          <div class="project-actions">
            <button class="btn-open btn-card">Open</button>
            <button class="btn-export btn-card btn-ghost">Export</button>
            <button class="btn-delete btn-card btn-danger">Delete</button>
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
  app.insertAdjacentHTML('beforeend', html);

  app.querySelector('#btn-prefs')?.addEventListener('click', ()=>{ state.view='preferences'; render(); });
  app.querySelector('#btn-new')?.addEventListener('click', ()=>{ state.view='newproject'; render(); });
  app.querySelector('#btn-import')?.addEventListener('click', ()=>app.querySelector('#import-input').click());
  app.querySelector('#import-input')?.addEventListener('change', e=>{ if(e.target.files[0]) importProject(e.target.files[0]); });
  app.querySelectorAll('.project-card').forEach(card=>{
    const id = card.dataset.id;
    card.querySelector('.btn-open')?.addEventListener('click', ()=>openEditor(id));
    card.querySelector('.btn-export')?.addEventListener('click', ()=>exportProject(id));
    card.querySelector('.btn-delete')?.addEventListener('click', ()=>{
      if(confirm('Delete this project?')){ deleteProject(id); render(); }
    });
  });
}

function countBlocks(blocks) {
  if (!blocks) return 0;
  return blocks.reduce((sum, b) => sum + 1 + countBlocks(b.children), 0);
}

// ============================================================
//  NEW PROJECT
// ============================================================
function renderNewProject(app) {
  app.insertAdjacentHTML('beforeend', `
  <div class="header animate-fadein">
    <button class="icon-btn" id="btn-back">←</button>
    <span class="header-title">New Project</span>
  </div>
  <div class="form-page animate-fadein" style="animation-delay:.06s">
    <div class="form-group">
      <label>Project Name</label>
      <input class="input-field" id="proj-name" placeholder="My Awesome App" maxlength="40" autocomplete="off">
    </div>
    <div class="form-group">
      <label>Language</label>
      <div class="lang-picker" id="lang-picker">
        ${[['js','⚡','JavaScript'],['python','🐍','Python'],['html','🌐','HTML'],['generic','🔧','Generic']].map(([l,ic,lb])=>`
        <div class="lang-option ${l==='js'?'selected':''}" data-lang="${l}">
          <span class="lang-option-icon">${ic}</span><span>${lb}</span>
        </div>`).join('')}
      </div>
    </div>
    <button class="btn-primary btn-full" id="btn-create">Create Project</button>
  </div>`);

  let selectedLang = 'js';
  app.querySelectorAll('.lang-option').forEach(el=>{
    el.addEventListener('click', ()=>{
      selectedLang = el.dataset.lang;
      app.querySelectorAll('.lang-option').forEach(x=>x.classList.remove('selected'));
      el.classList.add('selected');
    });
  });
  app.querySelector('#btn-back')?.addEventListener('click', ()=>{ state.view='library'; render(); });
  app.querySelector('#btn-create')?.addEventListener('click', ()=>{
    const name = app.querySelector('#proj-name')?.value.trim();
    if (!name) { showToast('Enter a project name','error'); return; }
    openEditor(newProject(name, selectedLang));
  });
  app.querySelector('#proj-name')?.focus();
}

// ============================================================
//  EDITOR
// ============================================================
function openEditor(id) {
  state.currentProject = id;
  state.view = 'editor';
  state.blockPickerOpen = false;
  state.blockPickerParentPath = null;
  state.selectedPath = null;
  state.runOutput = null;
  state.expandedBlocks = new Set();
  render();
}

function renderEditor(app) {
  const project = state.projects[state.currentProject];
  if (!project) { state.view='library'; render(); return; }
  const langLabel = {js:'JS',python:'PY',html:'HTML',generic:'BDM'}[project.lang]||'?';

  app.insertAdjacentHTML('beforeend', `
  <div class="header animate-fadein" id="editor-header">
    <button class="icon-btn" id="btn-back">←</button>
    <input class="proj-name-input" id="proj-name-live" value="${escHtml(project.name)}" maxlength="40">
    <div class="header-actions">
      <span class="lang-badge-sm">${langLabel}</span>
      <button class="icon-btn run-btn" id="btn-run">▶</button>
    </div>
  </div>
  <div class="mode-toggle-bar animate-fadein" style="animation-delay:.04s">
    <button class="mode-btn ${state.editorMode==='blocks'?'mode-active':''}" id="mode-blocks">🧩 Blocks</button>
    <button class="mode-btn ${state.editorMode==='code'?'mode-active':''}" id="mode-code">💻 Code</button>
  </div>
  <div class="editor-body" id="editor-body">
    ${state.editorMode==='blocks' ? renderBlockCanvas(project) : renderCodeEditor(project)}
  </div>
  <div class="editor-fab-row animate-fadein" style="animation-delay:.1s">
    <button class="fab" id="btn-add-block">+</button>
  </div>
  ${state.runOutput ? renderRunOutput(project) : ''}
  ${state.blockPickerOpen ? renderBlockPicker(project) : ''}`);

  app.querySelector('#btn-back')?.addEventListener('click', ()=>{ state.view='library'; render(); });
  app.querySelector('#proj-name-live')?.addEventListener('input', e=>{
    project.name=e.target.value; project.modified=Date.now(); saveProjects();
  });
  app.querySelector('#btn-run')?.addEventListener('click', ()=>{ state.runOutput=runProject(project); render(); });
  app.querySelector('#mode-blocks')?.addEventListener('click', ()=>{ state.editorMode='blocks'; render(); });
  app.querySelector('#mode-code')?.addEventListener('click', ()=>{ state.editorMode='code'; render(); });
  app.querySelector('#btn-add-block')?.addEventListener('click', ()=>{
    state.blockPickerOpen=true;
    state.blockPickerParentPath=null;
    state.blockPickerCategory='All';
    render();
  });
  app.querySelector('#code-editor')?.addEventListener('input', e=>{
    project.code=e.target.value; project.modified=Date.now(); saveProjects();
  });
  app.querySelector('#btn-close-run')?.addEventListener('click', ()=>{ state.runOutput=null; render(); });

  setupBlockCanvasEvents(app, project);
  setupBlockPickerEvents(app, project);
}

// ============================================================
//  BLOCK CANVAS (recursive)
// ============================================================
function renderBlockCanvas(project) {
  if (!project.blocks.length) {
    return `<div class="canvas-empty" id="canvas-empty">
      <div class="canvas-empty-icon">🧩</div>
      <p>Tap <b>+</b> to add your first block</p>
    </div>`;
  }
  return `<div class="block-canvas" id="block-canvas">${renderBlockList(project.blocks, project.lang, [])}</div>`;
}

function renderBlockList(blocks, lang, pathPrefix) {
  return blocks.map((b, i) => renderBlockNode(b, lang, [...pathPrefix, i])).join('');
}

function renderBlockNode(b, lang, path) {
  const def = LANG_BLOCKS[lang]?.find(x => x.id === b.id);
  if (!def) return '';
  const pathKey = path.join('-');
  const isSelected = state.selectedPath && state.selectedPath.join('-') === pathKey;
  const isExpanded = state.expandedBlocks.has(pathKey);
  const depth = path.length - 1;
  const depthColor = `hsl(${200 + depth*30},70%,55%)`;

  // Fields
  const fieldsHtml = (def.fields||[]).map(f => {
    if (f.type==='select') return `
      <div class="field-row">
        <span class="field-label">${f.name}</span>
        <select class="block-field-select" data-field="${f.name}" data-path="${pathKey}">
          ${(f.options||[]).map(o=>`<option value="${o}" ${(b.fields||{})[f.name]===o?'selected':''}>${o}</option>`).join('')}
        </select>
      </div>`;
    return `<div class="field-row">
      <span class="field-label">${f.name}</span>
      <input class="block-field" type="text" placeholder="${f.placeholder||''}" 
        value="${escHtml((b.fields||{})[f.name]||'')}" data-field="${f.name}" data-path="${pathKey}">
    </div>`;
  }).join('');

  const childrenHtml = def.isContainer ? `
    <div class="block-children ${isExpanded?'block-children-open':''}">
      <div class="block-children-inner">
        ${b.children?.length ? renderBlockList(b.children, lang, path) : `<div class="children-empty">Drop blocks here</div>`}
        <button class="add-child-btn" data-path="${pathKey}">+ Add inside</button>
      </div>
    </div>` : '';

  const containerToggle = def.isContainer ? `<button class="container-toggle" data-toggle="${pathKey}">${isExpanded?'▼':'▶'} ${isExpanded?'Hide':'Show'} (${b.children?.length||0})</button>` : '';

  return `
  <div class="block-item ${isSelected?'block-selected':''} ${def.isContainer?'block-container':''} animate-blockslide" 
       data-path="${pathKey}" style="--block-color:${def.color};--depth:${depth};margin-left:${depth*14}px">
    <div class="block-header" data-select="${pathKey}">
      <span class="block-icon">${def.icon}</span>
      <span class="block-label">${def.label}</span>
      <span class="block-cat-badge">${def.category}</span>
      <div class="block-drag-actions">
        <button class="block-action-btn" data-path="${pathKey}" data-action="up">↑</button>
        <button class="block-action-btn" data-path="${pathKey}" data-action="down">↓</button>
        <button class="block-action-btn block-del" data-path="${pathKey}" data-action="delete">✕</button>
      </div>
    </div>
    ${(def.fields?.length||0)>0 ? `<div class="block-fields ${isSelected?'block-fields-open':''}">${fieldsHtml}</div>` : ''}
    ${containerToggle}
    ${childrenHtml}
  </div>`;
}

function setupBlockCanvasEvents(app, project) {
  // Select/expand
  app.querySelectorAll('[data-select]').forEach(el=>{
    el.addEventListener('click', e=>{
      if (e.target.closest('[data-action]') || e.target.closest('.container-toggle') || e.target.closest('.add-child-btn')) return;
      const pathKey = el.dataset.select;
      const path = pathKey.split('-').map(Number);
      state.selectedPath = (state.selectedPath?.join('-')===pathKey) ? null : path;
      render();
    });
  });

  // Container toggle
  app.querySelectorAll('[data-toggle]').forEach(btn=>{
    btn.addEventListener('click', e=>{ e.stopPropagation();
      const pathKey = btn.dataset.toggle;
      if (state.expandedBlocks.has(pathKey)) state.expandedBlocks.delete(pathKey);
      else state.expandedBlocks.add(pathKey);
      render();
    });
  });

  // Add inside container
  app.querySelectorAll('.add-child-btn').forEach(btn=>{
    btn.addEventListener('click', e=>{ e.stopPropagation();
      const path = btn.dataset.path.split('-').map(Number);
      state.blockPickerOpen = true;
      state.blockPickerParentPath = path;
      state.blockPickerCategory = 'All';
      render();
    });
  });

  // Move up/down/delete
  app.querySelectorAll('[data-action]').forEach(btn=>{
    btn.addEventListener('click', e=>{ e.stopPropagation();
      const path = btn.dataset.path.split('-').map(Number);
      const action = btn.dataset.action;
      if (action==='up')     { moveBlockAt(project.blocks, path, -1); }
      if (action==='down')   { moveBlockAt(project.blocks, path, +1); }
      if (action==='delete') { deleteBlockAt(project.blocks, path); state.selectedPath=null; }
      project.modified=Date.now(); saveProjects();
      render();
    });
  });

  // Field inputs
  app.querySelectorAll('.block-field, .block-field-select').forEach(input=>{
    input.addEventListener('input', e=>{
      const path = e.target.dataset.path.split('-').map(Number);
      const field = e.target.dataset.field;
      const block = getBlockAt(project.blocks, path);
      if (block) { if (!block.fields) block.fields={}; block.fields[field]=e.target.value; }
      project.modified=Date.now(); saveProjects();
    });
  });
}

// ============================================================
//  BLOCK PICKER
// ============================================================
function renderBlockPicker(project) {
  const lang = project.lang;
  const allBlocks = LANG_BLOCKS[lang] || [];
  const cats = ['All', ...new Set(allBlocks.map(b=>b.category))];
  const q = state.searchQuery.toLowerCase();
  const cat = state.blockPickerCategory;
  let blocks = q
    ? allBlocks.filter(b=>b.label.toLowerCase().includes(q)||b.desc.toLowerCase().includes(q))
    : (cat==='All' ? allBlocks : allBlocks.filter(b=>b.category===cat));

  const parentLabel = state.blockPickerParentPath
    ? `Adding inside block` : `Adding to root`;

  return `
  <div class="picker-overlay animate-fadein" id="picker-overlay"></div>
  <div class="picker-sheet animate-slideup" id="picker-sheet">
    <div class="picker-handle"></div>
    <div class="picker-header">
      <div>
        <span class="picker-title">Add Block</span>
        <div class="picker-context">${parentLabel}</div>
      </div>
      <button class="icon-btn" id="picker-close">✕</button>
    </div>
    <div class="picker-search-wrap">
      <input class="picker-search" id="picker-search" placeholder="🔍 Search blocks..." value="${escHtml(state.searchQuery)}" autocomplete="off">
    </div>
    <div class="picker-cats">
      ${cats.map(c=>`<button class="picker-cat-btn ${c===cat?'cat-active':''}" data-cat="${c}">${c}</button>`).join('')}
    </div>
    <div class="picker-list" id="picker-list">
      ${blocks.map(b=>`
        <div class="picker-block-item" data-block-id="${b.id}">
          <span class="picker-block-icon" style="background:${b.color}22;border-color:${b.color}">${b.icon}</span>
          <div class="picker-block-info">
            <div class="picker-block-name">${b.label} ${b.isContainer?'<span class="container-tag">container</span>':''}</div>
            <div class="picker-block-desc">${b.desc}</div>
          </div>
          <button class="picker-add-btn" data-block-id="${b.id}">+</button>
        </div>`).join('')}
      ${blocks.length===0 ? '<div class="picker-empty">No blocks found</div>' : ''}
    </div>
  </div>`;
}

function setupBlockPickerEvents(app, project) {
  app.querySelector('#picker-overlay')?.addEventListener('click', ()=>{ state.blockPickerOpen=false; state.searchQuery=''; render(); });
  app.querySelector('#picker-close')?.addEventListener('click', ()=>{ state.blockPickerOpen=false; state.searchQuery=''; render(); });
  app.querySelector('#picker-search')?.addEventListener('input', e=>{ state.searchQuery=e.target.value; render(); setTimeout(()=>app.querySelector('#picker-search')?.focus(),0); });
  app.querySelectorAll('.picker-cat-btn').forEach(btn=>btn.addEventListener('click', ()=>{ state.blockPickerCategory=btn.dataset.cat; state.searchQuery=''; render(); }));
  app.querySelectorAll('.picker-add-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const blockId = btn.dataset.blockId;
      const def = (LANG_BLOCKS[project.lang]||[]).find(x=>x.id===blockId);
      if (!def) return;
      const newBlock = { id: blockId, fields: {}, children: def.isContainer ? [] : undefined };
      const targetArr = state.blockPickerParentPath
        ? getBlockAt(project.blocks, state.blockPickerParentPath)?.children
        : project.blocks;
      if (targetArr) {
        targetArr.push(newBlock);
        if (state.blockPickerParentPath) state.expandedBlocks.add(state.blockPickerParentPath.join('-'));
      }
      project.modified=Date.now(); saveProjects();
      state.blockPickerOpen=false; state.searchQuery='';
      render(); showToast(`Added: ${def.label}`);
    });
  });
}

// ============================================================
//  CODE EDITOR
// ============================================================
function renderCodeEditor(project) {
  let code;
  if (project.lang === 'html') {
    code = project.code || generateHTML(project.blocks);
  } else {
    code = project.code || generateCode(project.blocks, project.lang);
  }
  return `<div class="code-editor-wrap">
    <textarea id="code-editor" class="code-editor" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off">${escHtml(code)}</textarea>
  </div>`;
}

// ============================================================
//  RUN OUTPUT
// ============================================================
function runProject(project) {
  const lang = project.lang;
  let code;
  if (state.editorMode === 'code') {
    code = document.getElementById('code-editor')?.value || '';
  } else {
    code = lang==='html' ? generateHTML(project.blocks) : generateCode(project.blocks, lang);
  }

  if (lang === 'html') {
    return { type: 'iframe', html: code };
  }
  if (lang === 'python' || lang === 'generic') {
    return { type: 'console', output: simulateOutput(project.blocks, lang, code) };
  }
  // JS — wrap in full HTML page
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
    body{background:#0a0e0a;color:#4cff91;font-family:'JetBrains Mono',monospace;padding:14px;font-size:13px;line-height:1.7}
    .err{color:#ff5252}
  </style></head><body>
  <script>
  const __out = document.body;
  const __log = console.log;
  console.log = (...args) => {
    const d = document.createElement('div');
    d.textContent = args.map(String).join(' ');
    __out.appendChild(d);
    __log(...args);
  };
  console.error = (...args) => {
    const d = document.createElement('div');
    d.className = 'err';
    d.textContent = '⚠ ' + args.map(String).join(' ');
    __out.appendChild(d);
  };
  (async () => {
    try {
      ${code}
    } catch(e) {
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = 'Error: ' + e.message;
      document.body.appendChild(d);
    }
  })();
  <\/script></body></html>`;
  return { type: 'iframe', html };
}

function simulateOutput(blocks, lang, code) {
  const lines = ['[Build.Make Simulator]', lang==='generic'?'Generic pseudo-code:':'Python (simulated — no runtime in browser):', '─'.repeat(40)];
  code.split('\n').forEach(l => lines.push(l));
  return lines.join('\n');
}

function renderRunOutput(project) {
  const out = state.runOutput;
  return `
  <div class="run-overlay animate-fadein">
    <div class="run-panel animate-slideup">
      <div class="run-panel-header">
        <span>▶ Output</span>
        <button class="icon-btn" id="btn-close-run">✕</button>
      </div>
      ${out.type==='iframe'
        ? `<iframe class="run-iframe" sandbox="allow-scripts allow-modals allow-same-origin" srcdoc="${escAttr(out.html)}"></iframe>`
        : `<pre class="run-console">${escHtml(out.output||'')}</pre>`}
    </div>
  </div>`;
}

// ============================================================
//  PREFERENCES
// ============================================================
function renderPreferences(app) {
  app.insertAdjacentHTML('beforeend', `
  <div class="header animate-fadein">
    <button class="icon-btn" id="btn-back">←</button>
    <span class="header-title">Preferences</span>
  </div>
  <div class="prefs-page animate-fadein" style="animation-delay:.06s">
    <div class="pref-section">
      <div class="pref-label">Theme</div>
      <div class="theme-toggle-row">
        <button class="theme-btn ${state.theme==='dark'?'theme-active':''}" id="theme-dark">🌙 Dark</button>
        <button class="theme-btn ${state.theme==='light'?'theme-active':''}" id="theme-light">☀️ Light</button>
      </div>
    </div>
    <div class="pref-section">
      <div class="pref-label">About</div>
      <div class="pref-about">
        <span class="logo-text">Build<span class="logo-dot-char">.</span>Make</span>
        <span class="pref-version">v2.0 · ${Object.keys(state.projects).length} project${Object.keys(state.projects).length!==1?'s':''}</span>
      </div>
    </div>
    <div class="pref-section">
      <div class="pref-label">Data</div>
      <button class="btn-danger-full" id="btn-clear-all">Delete All Projects</button>
    </div>
  </div>`);
  app.querySelector('#btn-back')?.addEventListener('click', ()=>{ state.view='library'; render(); });
  app.querySelector('#theme-dark')?.addEventListener('click', ()=>{ state.theme='dark'; savePrefs(); render(); });
  app.querySelector('#theme-light')?.addEventListener('click', ()=>{ state.theme='light'; savePrefs(); render(); });
  app.querySelector('#btn-clear-all')?.addEventListener('click', ()=>{
    if(confirm('Delete ALL projects?')){ state.projects={}; saveProjects(); state.view='library'; render(); showToast('All projects deleted'); }
  });
}

// ============================================================
//  EXPORT / IMPORT
// ============================================================
function exportProject(id) {
  const p = state.projects[id];
  const blob = new Blob([JSON.stringify(p,null,2)],{type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = (p.name.replace(/\s+/g,'_')||'project')+'.bdmproject';
  a.click();
}
function importProject(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const p = JSON.parse(e.target.result);
      p.id = 'p_'+Date.now();
      p.name = (p.name||'Imported')+' (imported)';
      if (!p.blocks) p.blocks = [];
      state.projects[p.id] = p;
      saveProjects(); render(); showToast('Project imported!');
    } catch { showToast('Invalid .bdmproject file','error'); }
  };
  reader.readAsText(file);
}

// ============================================================
//  INIT
// ============================================================
function init() {
  loadPrefs(); loadProjects();
  if (location.search.includes('action=new')) state.view = 'newproject';
  render();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
}
window.addEventListener('DOMContentLoaded', init);