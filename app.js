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
  
  // ---- ADDITIONAL JAVASCRIPT BLOCKS (expanded) ----
  // Advanced Variables
  { id:'js_const',    label:'Create Constant',  icon:'🔒', color:C.VAR, category:'Variables',
    fields:[{name:'name',type:'text',placeholder:'MAX_SIZE'},{name:'value',type:'text',placeholder:'100'}],
    desc:'Create an immutable constant',
    toCode:(f)=>`const ${f.name||'CONST'} = ${smartVal(f.value)};` },
  { id:'js_typeof',   label:'Type Of',          icon:'❔', color:C.VAR, category:'Variables',
    fields:[{name:'result',type:'text',placeholder:'type'},{name:'value',type:'text',placeholder:'myVar'}],
    desc:'Get data type of value',
    toCode:(f)=>`let ${f.result||'type'} = typeof ${f.value||'undefined'};` },
  { id:'js_isnan',    label:'Is NaN',           icon:'❓', color:C.VAR, category:'Variables',
    fields:[{name:'result',type:'text',placeholder:'result'},{name:'value',type:'text',placeholder:'val'}],
    desc:'Check if value is NaN',
    toCode:(f)=>`let ${f.result||'result'} = isNaN(${f.value||0});` },
  { id:'js_parseint', label:'Parse Integer',    icon:'🔢', color:C.VAR, category:'Variables',
    fields:[{name:'result',type:'text',placeholder:'num'},{name:'str',type:'text',placeholder:'"42"'}],
    desc:'Convert string to integer',
    toCode:(f)=>`let ${f.result||'num'} = parseInt(${f.str||'0'});` },
  { id:'js_parsefloat',label:'Parse Float',     icon:'📊', color:C.VAR, category:'Variables',
    fields:[{name:'result',type:'text',placeholder:'num'},{name:'str',type:'text',placeholder:'"3.14"'}],
    desc:'Convert string to float',
    toCode:(f)=>`let ${f.result||'num'} = parseFloat(${f.str||'0'});` },
  { id:'js_tostring', label:'To String',        icon:'🔤', color:C.VAR, category:'Variables',
    fields:[{name:'result',type:'text',placeholder:'str'},{name:'value',type:'text',placeholder:'42'}],
    desc:'Convert to string',
    toCode:(f)=>`let ${f.result||'str'} = String(${f.value||''});` },
  { id:'js_tofixed',  label:'To Fixed Decimals',icon:'📏', color:C.VAR, category:'Variables',
    fields:[{name:'result',type:'text',placeholder:'fixed'},{name:'value',type:'text',placeholder:'3.14159'},{name:'decimals',type:'text',placeholder:'2'}],
    desc:'Round to decimal places',
    toCode:(f)=>`let ${f.result||'fixed'} = (${f.value||0}).toFixed(${f.decimals||2});` },
  { id:'js_reverse',  label:'Reverse String',   icon:'↩️', color:C.VAR, category:'Variables',
    fields:[{name:'result',type:'text',placeholder:'rev'},{name:'str',type:'text',placeholder:'myStr'}],
    desc:'Reverse a string',
    toCode:(f)=>`let ${f.result||'rev'} = ${f.str||'""'}.split('').reverse().join('');` },

  // Advanced Control Flow
  { id:'js_switch',   label:'Switch',           icon:'🎛️', color:C.FLOW, category:'Control Flow',
    fields:[{name:'value',type:'text',placeholder:'dayNum'},{name:'cases',type:'text',placeholder:'1:Monday, 2:Tuesday'}],
    desc:'Multi-way switch statement',
    isContainer:true,
    toCode:(f)=>`switch(${f.value||'x'}) { // ${f.cases||'cases here'}\ncase 1: break;\ndefault: break; }` },
  { id:'js_ternary',  label:'Ternary',          icon:'❔', color:C.FLOW, category:'Control Flow',
    fields:[{name:'result',type:'text',placeholder:'x'},{name:'condition',type:'text',placeholder:'a > b'},{name:'true',type:'text',placeholder:'a'},{name:'false',type:'text',placeholder:'b'}],
    desc:'Conditional expression (? :)',
    toCode:(f)=>`let ${f.result||'x'} = (${f.condition||'false'}) ? ${smartVal(f.true||'a')} : ${smartVal(f.false||'b')};` },
  { id:'js_dowhile',  label:'Do While',         icon:'🔄', color:C.FLOW, category:'Control Flow',
    fields:[{name:'condition',type:'text',placeholder:'x < 10'}],
    desc:'Do-while loop (executes at least once)',
    isContainer:true,
    toCode:(f,ch,indent)=>`do {\n${indent}${ch}\n${indent.slice(2)}} while (${f.condition||'true'});` },
  { id:'js_tryCatch', label:'Try Catch',        icon:'⚠️', color:C.FLOW, category:'Control Flow',
    fields:[],
    desc:'Error handling block',
    isContainer:true,
    toCode:(f,ch,indent)=>`try {\n${indent}${ch}\n${indent.slice(2)}} catch (error) {\n${indent}console.error(error);\n${indent.slice(2)}}` },
  { id:'js_throw',    label:'Throw Error',      icon:'💥', color:C.FLOW, category:'Control Flow',
    fields:[{name:'message',type:'text',placeholder:'Something went wrong!'}],
    desc:'Throw an error',
    toCode:(f)=>`throw new Error(${smartVal(f.message||'error')});` },

  // Advanced Functions
  { id:'js_async',    label:'Async Function',   icon:'⚡', color:C.FUNC, category:'Functions',
    fields:[{name:'name',type:'text',placeholder:'asyncFunc'},{name:'params',type:'text',placeholder:''}],
    desc:'Define async function',
    isContainer:true,
    toCode:(f,ch,indent)=>`async function ${f.name||'asyncFunc'}(${f.params||''}) {\n${indent}${ch}\n${indent.slice(2)}}` },
  { id:'js_await',    label:'Await',            icon:'⏳', color:C.FUNC, category:'Functions',
    fields:[{name:'result',type:'text',placeholder:'data'},{name:'promise',type:'text',placeholder:'fetchData()'}],
    desc:'Await a promise',
    toCode:(f)=>`let ${f.result||'data'} = await ${f.promise||'Promise'};` },
  { id:'js_callback', label:'Callback Func',    icon:'📲', color:C.FUNC, category:'Functions',
    fields:[{name:'varname',type:'text',placeholder:'cb'},{name:'params',type:'text',placeholder:'result, error'}],
    desc:'Define callback function',
    isContainer:true,
    toCode:(f,ch,indent)=>`const ${f.varname||'cb'} = (${f.params||'result'}) => {\n${indent}${ch}\n${indent.slice(2)}};` },
  { id:'js_spread',   label:'Spread Operator',  icon:'📡', color:C.FUNC, category:'Functions',
    fields:[{name:'target',type:'text',placeholder:'newArr'},{name:'source',type:'text',placeholder:'oldArr'}],
    desc:'Spread array/object',
    toCode:(f)=>`let ${f.target||'newArr'} = [...${f.source||'oldArr'}];` },
  { id:'js_destructure',label:'Destructure',    icon:'🔓', color:C.FUNC, category:'Functions',
    fields:[{name:'vars',type:'text',placeholder:'a, b, c'},{name:'array',type:'text',placeholder:'arr'}],
    desc:'Destructure array/object',
    toCode:(f)=>`const [${f.vars||'a, b'}] = ${f.array||'[1,2,3]'};` },
  { id:'js_promise',  label:'Create Promise',   icon:'🤝', color:C.FUNC, category:'Functions',
    fields:[{name:'varname',type:'text',placeholder:'myPromise'}],
    desc:'Create a new promise',
    isContainer:true,
    toCode:(f,ch,indent)=>`const ${f.varname||'myPromise'} = new Promise((resolve, reject) => {\n${indent}${ch}\n${indent.slice(2)}});` },

  // Advanced Arrays
  { id:'js_map',      label:'Map Array',        icon:'🗺️', color:C.ARR, category:'Arrays',
    fields:[{name:'result',type:'text',placeholder:'doubled'},{name:'arr',type:'text',placeholder:'numbers'}],
    desc:'Transform array elements',
    toCode:(f)=>`let ${f.result||'doubled'} = ${f.arr||'[]'}.map(x => x * 2);` },
  { id:'js_filter',   label:'Filter Array',     icon:'🔎', color:C.ARR, category:'Arrays',
    fields:[{name:'result',type:'text',placeholder:'evens'},{name:'arr',type:'text',placeholder:'numbers'}],
    desc:'Filter array by condition',
    toCode:(f)=>`let ${f.result||'evens'} = ${f.arr||'[]'}.filter(x => x % 2 === 0);` },
  { id:'js_reduce',   label:'Reduce Array',     icon:'∑', color:C.ARR, category:'Arrays',
    fields:[{name:'result',type:'text',placeholder:'sum'},{name:'arr',type:'text',placeholder:'numbers'}],
    desc:'Reduce to single value',
    toCode:(f)=>`let ${f.result||'sum'} = ${f.arr||'[]'}.reduce((acc, x) => acc + x, 0);` },
  { id:'js_find',     label:'Find Element',     icon:'🎯', color:C.ARR, category:'Arrays',
    fields:[{name:'result',type:'text',placeholder:'found'},{name:'arr',type:'text',placeholder:'items'},{name:'condition',type:'text',placeholder:'x > 5'}],
    desc:'Find first matching element',
    toCode:(f)=>`let ${f.result||'found'} = ${f.arr||'[]'}.find(x => ${f.condition||'true'});` },
  { id:'js_includes', label:'Array Includes',   icon:'✓', color:C.ARR, category:'Arrays',
    fields:[{name:'result',type:'text',placeholder:'has'},{name:'arr',type:'text',placeholder:'items'},{name:'value',type:'text',placeholder:'42'}],
    desc:'Check if array contains value',
    toCode:(f)=>`let ${f.result||'has'} = ${f.arr||'[]'}.includes(${smartVal(f.value)});` },
  { id:'js_join',     label:'Join Array',       icon:'🔗', color:C.ARR, category:'Arrays',
    fields:[{name:'result',type:'text',placeholder:'str'},{name:'arr',type:'text',placeholder:'items'},{name:'sep',type:'text',placeholder:', '}],
    desc:'Join array into string',
    toCode:(f)=>`let ${f.result||'str'} = ${f.arr||'[]'}.join(${smartVal(f.sep||', ')});` },
  { id:'js_sort',     label:'Sort Array',       icon:'📊', color:C.ARR, category:'Arrays',
    fields:[{name:'arr',type:'text',placeholder:'items'}],
    desc:'Sort array in place',
    toCode:(f)=>`${f.arr||'items'}.sort((a,b) => a - b);` },
  { id:'js_reverse',  label:'Reverse Array',    icon:'↩️', color:C.ARR, category:'Arrays',
    fields:[{name:'arr',type:'text',placeholder:'items'}],
    desc:'Reverse array in place',
    toCode:(f)=>`${f.arr||'items'}.reverse();` },
  { id:'js_slice',    label:'Slice Array',      icon:'✂️', color:C.ARR, category:'Arrays',
    fields:[{name:'result',type:'text',placeholder:'part'},{name:'arr',type:'text',placeholder:'items'},{name:'start',type:'text',placeholder:'0'},{name:'end',type:'text',placeholder:'3'}],
    desc:'Extract portion of array',
    toCode:(f)=>`let ${f.result||'part'} = ${f.arr||'[]'}.slice(${f.start||0}, ${f.end||3});` },
  { id:'js_splice',   label:'Splice Array',     icon:'✏️', color:C.ARR, category:'Arrays',
    fields:[{name:'arr',type:'text',placeholder:'items'},{name:'index',type:'text',placeholder:'1'},{name:'count',type:'text',placeholder:'1'},{name:'newItems',type:'text',placeholder:'99'}],
    desc:'Remove/insert array elements',
    toCode:(f)=>`${f.arr||'items'}.splice(${f.index||0}, ${f.count||1}, ${smartVal(f.newItems)});` },
  { id:'js_flatmap', label:'FlatMap Array',     icon:'🗺️', color:C.ARR, category:'Arrays',
    fields:[{name:'result',type:'text',placeholder:'flat'},{name:'arr',type:'text',placeholder:'arr'}],
    desc:'Map then flatten array',
    toCode:(f)=>`let ${f.result||'flat'} = ${f.arr||'[]'}.flatMap(x => [x, x*2]);` },

  // Object/Dictionary Operations
  { id:'js_object',   label:'Create Object',    icon:'🔷', color:C.VAR, category:'Objects',
    fields:[{name:'varname',type:'text',placeholder:'obj'},{name:'properties',type:'text',placeholder:'name:John, age:25'}],
    desc:'Create object literal',
    toCode:(f)=>`let ${f.varname||'obj'} = { ${f.properties||'key:value'} };` },
  { id:'js_objkey',   label:'Object Property',  icon:'🔑', color:C.VAR, category:'Objects',
    fields:[{name:'obj',type:'text',placeholder:'myObj'},{name:'key',type:'text',placeholder:'name'},{name:'value',type:'text',placeholder:'John'}],
    desc:'Set object property',
    toCode:(f)=>`${f.obj||'obj'}.${f.key||'key'} = ${smartVal(f.value)};` },
  { id:'js_objget',   label:'Get Property',     icon:'📖', color:C.VAR, category:'Objects',
    fields:[{name:'result',type:'text',placeholder:'value'},{name:'obj',type:'text',placeholder:'myObj'},{name:'key',type:'text',placeholder:'name'}],
    desc:'Get object property',
    toCode:(f)=>`let ${f.result||'value'} = ${f.obj||'obj'}.${f.key||'key'};` },
  { id:'js_objkeys',  label:'Object Keys',      icon:'🔑', color:C.VAR, category:'Objects',
    fields:[{name:'result',type:'text',placeholder:'keys'},{name:'obj',type:'text',placeholder:'myObj'}],
    desc:'Get all object keys',
    toCode:(f)=>`let ${f.result||'keys'} = Object.keys(${f.obj||'obj'});` },
  { id:'js_objvalues',label:'Object Values',    icon:'📋', color:C.VAR, category:'Objects',
    fields:[{name:'result',type:'text',placeholder:'values'},{name:'obj',type:'text',placeholder:'myObj'}],
    desc:'Get all object values',
    toCode:(f)=>`let ${f.result||'values'} = Object.values(${f.obj||'obj'});` },

  // Advanced Math
  { id:'js_sqrt',     label:'Square Root',      icon:'√', color:C.MATH, category:'Math',
    fields:[{name:'result',type:'text',placeholder:'root'},{name:'value',type:'text',placeholder:'16'}],
    desc:'Square root',
    toCode:(f)=>`let ${f.result||'root'} = Math.sqrt(${f.value||0});` },
  { id:'js_pow',      label:'Power',            icon:'⚡', color:C.MATH, category:'Math',
    fields:[{name:'result',type:'text',placeholder:'result'},{name:'base',type:'text',placeholder:'2'},{name:'exp',type:'text',placeholder:'3'}],
    desc:'Raise to power',
    toCode:(f)=>`let ${f.result||'result'} = Math.pow(${f.base||2}, ${f.exp||2});` },
  { id:'js_max',      label:'Maximum',          icon:'📈', color:C.MATH, category:'Math',
    fields:[{name:'result',type:'text',placeholder:'max'},{name:'values',type:'text',placeholder:'10, 20, 5'}],
    desc:'Find maximum value',
    toCode:(f)=>`let ${f.result||'max'} = Math.max(${f.values||'0'});` },
  { id:'js_min',      label:'Minimum',          icon:'📉', color:C.MATH, category:'Math',
    fields:[{name:'result',type:'text',placeholder:'min'},{name:'values',type:'text',placeholder:'10, 20, 5'}],
    desc:'Find minimum value',
    toCode:(f)=>`let ${f.result||'min'} = Math.min(${f.values||'0'});` },
  { id:'js_ceil',     label:'Ceiling',          icon:'⬆️', color:C.MATH, category:'Math',
    fields:[{name:'result',type:'text',placeholder:'c'},{name:'value',type:'text',placeholder:'3.2'}],
    desc:'Round up',
    toCode:(f)=>`let ${f.result||'c'} = Math.ceil(${f.value||0});` },
  { id:'js_floor',    label:'Floor',            icon:'⬇️', color:C.MATH, category:'Math',
    fields:[{name:'result',type:'text',placeholder:'f'},{name:'value',type:'text',placeholder:'3.7'}],
    desc:'Round down',
    toCode:(f)=>`let ${f.result||'f'} = Math.floor(${f.value||0});` },
  { id:'js_sin',      label:'Sine',             icon:'〰️', color:C.MATH, category:'Math',
    fields:[{name:'result',type:'text',placeholder:'s'},{name:'radians',type:'text',placeholder:'1'}],
    desc:'Sine trigonometry',
    toCode:(f)=>`let ${f.result||'s'} = Math.sin(${f.radians||0});` },
  { id:'js_cos',      label:'Cosine',           icon:'〰️', color:C.MATH, category:'Math',
    fields:[{name:'result',type:'text',placeholder:'c'},{name:'radians',type:'text',placeholder:'1'}],
    desc:'Cosine trigonometry',
    toCode:(f)=>`let ${f.result||'c'} = Math.cos(${f.radians||0});` },

  // String Advanced
  { id:'js_split',    label:'Split String',     icon:'✂️', color:C.STR, category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'parts'},{name:'str',type:'text',placeholder:'myStr'},{name:'sep',type:'text',placeholder:', '}],
    desc:'Split string into array',
    toCode:(f)=>`let ${f.result||'parts'} = ${f.str||'""'}.split(${smartVal(f.sep||',')});` },
  { id:'js_replace',  label:'Replace Text',     icon:'🔄', color:C.STR, category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'new'},{name:'str',type:'text',placeholder:'myStr'},{name:'find',type:'text',placeholder:'old'},{name:'replaceWith',type:'text',placeholder:'new'}],
    desc:'Replace text in string',
    toCode:(f)=>`let ${f.result||'new'} = ${f.str||'""'}.replace(${smartVal(f.find||'')}, ${smartVal(f.replaceWith||'')});` },
  { id:'js_includes',label:'String Includes',   icon:'✓', color:C.STR, category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'has'},{name:'str',type:'text',placeholder:'myStr'},{name:'substring',type:'text',placeholder:'hello'}],
    desc:'Check if string contains',
    toCode:(f)=>`let ${f.result||'has'} = ${f.str||'""'}.includes(${smartVal(f.substring||'')});` },
  { id:'js_startswith',label:'Starts With',     icon:'▶️', color:C.STR, category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'is'},{name:'str',type:'text',placeholder:'myStr'},{name:'prefix',type:'text',placeholder:'hello'}],
    desc:'Check string prefix',
    toCode:(f)=>`let ${f.result||'is'} = ${f.str||'""'}.startsWith(${smartVal(f.prefix||'')});` },
  { id:'js_endswith', label:'Ends With',        icon:'◀️', color:C.STR, category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'is'},{name:'str',type:'text',placeholder:'myStr'},{name:'suffix',type:'text',placeholder:'.txt'}],
    desc:'Check string suffix',
    toCode:(f)=>`let ${f.result||'is'} = ${f.str||'""'}.endsWith(${smartVal(f.suffix||'')});` },
  { id:'js_trim',     label:'Trim String',      icon:'✂️', color:C.STR, category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'clean'},{name:'str',type:'text',placeholder:'myStr'}],
    desc:'Remove whitespace',
    toCode:(f)=>`let ${f.result||'clean'} = ${f.str||'""'}.trim();` },
  { id:'js_padstart', label:'Pad Start',        icon:'◀️', color:C.STR, category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'padded'},{name:'str',type:'text',placeholder:'myStr'},{name:'length',type:'text',placeholder:'10'},{name:'char',type:'text',placeholder:'0'}],
    desc:'Pad string at start',
    toCode:(f)=>`let ${f.result||'padded'} = ${f.str||'""'}.padStart(${f.length||10}, ${smartVal(f.char||'0')});` },
  { id:'js_padend',   label:'Pad End',          icon:'▶️', color:C.STR, category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'padded'},{name:'str',type:'text',placeholder:'myStr'},{name:'length',type:'text',placeholder:'10'},{name:'char',type:'text',placeholder:'.'}],
    desc:'Pad string at end',
    toCode:(f)=>`let ${f.result||'padded'} = ${f.str||'""'}.padEnd(${f.length||10}, ${smartVal(f.char||'.')});` },
  { id:'js_repeat',   label:'Repeat String',    icon:'🔁', color:C.STR, category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'repeated'},{name:'str',type:'text',placeholder:'abc'},{name:'times',type:'text',placeholder:'3'}],
    desc:'Repeat string N times',
    toCode:(f)=>`let ${f.result||'repeated'} = ${f.str||'""'}.repeat(${f.times||1});` },
  { id:'js_indexof',  label:'Index Of',         icon:'📍', color:C.STR, category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'idx'},{name:'str',type:'text',placeholder:'myStr'},{name:'search',type:'text',placeholder:'needle'}],
    desc:'Find substring position',
    toCode:(f)=>`let ${f.result||'idx'} = ${f.str||'""'}.indexOf(${smartVal(f.search||'')});` },
  { id:'js_substring',label:'Substring',        icon:'📋', color:C.STR, category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'sub'},{name:'str',type:'text',placeholder:'myStr'},{name:'start',type:'text',placeholder:'0'},{name:'end',type:'text',placeholder:'5'}],
    desc:'Extract substring',
    toCode:(f)=>`let ${f.result||'sub'} = ${f.str||'""'}.substring(${f.start||0}, ${f.end||5});` },

  // DOM Advanced
  { id:'js_domclick', label:'On Click',         icon:'👆', color:C.DOM, category:'DOM',
    fields:[{name:'selector',type:'text',placeholder:'#btn'},{name:'handler',type:'text',placeholder:'myFunc'}],
    desc:'Listen for click',
    toCode:(f)=>`document.querySelector('${f.selector||'#btn'}').onclick = ${f.handler||'myFunc'};` },
  { id:'js_domappend',label:'Append Child',     icon:'➕', color:C.DOM, category:'DOM',
    fields:[{name:'parent',type:'text',placeholder:'#container'},{name:'element',type:'text',placeholder:'el'}],
    desc:'Add element as child',
    toCode:(f)=>`document.querySelector('${f.parent||'#parent'}').appendChild(${f.element||'el'});` },
  { id:'js_domclass', label:'Toggle Class',     icon:'🎨', color:C.DOM, category:'DOM',
    fields:[{name:'selector',type:'text',placeholder:'#box'},{name:'className',type:'text',placeholder:'active'}],
    desc:'Toggle CSS class',
    toCode:(f)=>`document.querySelector('${f.selector||'#box'}').classList.toggle(${smartVal(f.className||'active')});` },
  { id:'js_domattr',  label:'Set Attribute',    icon:'🏷️', color:C.DOM, category:'DOM',
    fields:[{name:'selector',type:'text',placeholder:'#img'},{name:'attr',type:'text',placeholder:'src'},{name:'value',type:'text',placeholder:'image.png'}],
    desc:'Set HTML attribute',
    toCode:(f)=>`document.querySelector('${f.selector||'#el'}').setAttribute('${f.attr||'data'}', '${f.value||''}');` },
  { id:'js_domhtml',  label:'Set Inner HTML',   icon:'🔨', color:C.DOM, category:'DOM',
    fields:[{name:'selector',type:'text',placeholder:'#container'},{name:'html',type:'text',placeholder:'<b>Bold</b>'}],
    desc:'Set HTML content',
    toCode:(f)=>`document.querySelector('${f.selector||'#el'}').innerHTML = \`${f.html||''}\`;` },
  { id:'js_domvalue', label:'Get Input Value',  icon:'📝', color:C.DOM, category:'DOM',
    fields:[{name:'result',type:'text',placeholder:'value'},{name:'selector',type:'text',placeholder:'#input'}],
    desc:'Get input/textarea value',
    toCode:(f)=>`let ${f.result||'value'} = document.querySelector('${f.selector||'#input'}').value;` },
  { id:'js_domdisplay',label:'Toggle Display',  icon:'👁️', color:C.DOM, category:'DOM',
    fields:[{name:'selector',type:'text',placeholder:'#box'},{name:'display',type:'text',placeholder:'block'}],
    desc:'Set display property',
    toCode:(f)=>`document.querySelector('${f.selector||'#el'}').style.display = '${f.display||'block'}';` },

  // Custom Script Block
  { id:'js_custom',   label:'Custom Script',    icon:'✏️', color:C.MISC, category:'Custom',
    fields:[{name:'code',type:'text',placeholder:'Your JavaScript code here'}],
    desc:'Write custom JavaScript',
    toCode:(f)=>`${f.code||'// custom code'}` },
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

  // ---- ADDITIONAL PYTHON BLOCKS (expanded) ----
  // Advanced Variables
  { id:'py_tuple',  label:'Create Tuple',      icon:'⊙', color:C.VAR, category:'Variables',
    fields:[{name:'name',type:'text',placeholder:'my_tuple'},{name:'values',type:'text',placeholder:'1, 2, 3'}],
    desc:'Immutable sequence',
    toCode:(f)=>`${f.name||'my_tuple'} = (${f.values||''})` },
  { id:'py_dict',   label:'Create Dictionary', icon:'🔷', color:C.VAR, category:'Variables',
    fields:[{name:'name',type:'text',placeholder:'my_dict'},{name:'pairs',type:'text',placeholder:'key1:val1, key2:val2'}],
    desc:'Key-value pairs',
    toCode:(f)=>`${f.name||'my_dict'} = {${f.pairs||''}}` },
  { id:'py_set',    label:'Create Set',        icon:'∅', color:C.VAR, category:'Variables',
    fields:[{name:'name',type:'text',placeholder:'my_set'},{name:'values',type:'text',placeholder:'1, 2, 3'}],
    desc:'Unique values collection',
    toCode:(f)=>`${f.name||'my_set'} = {${f.values||''}}` },
  { id:'py_global', label:'Global Variable',   icon:'🌍', color:C.VAR, category:'Variables',
    fields:[{name:'var',type:'text',placeholder:'my_global'}],
    desc:'Declare global scope',
    toCode:(f)=>`global ${f.var||'my_global'}` },
  { id:'py_del',    label:'Delete Variable',   icon:'🗑️', color:C.VAR, category:'Variables',
    fields:[{name:'var',type:'text',placeholder:'my_var'}],
    desc:'Delete a variable',
    toCode:(f)=>`del ${f.var||'my_var'}` },

  // Advanced Control Flow
  { id:'py_not',    label:'Not',               icon:'❌', color:C.FLOW, category:'Control Flow',
    fields:[{name:'result',type:'text',placeholder:'result'},{name:'condition',type:'text',placeholder:'x > 0'}],
    desc:'Logical NOT',
    toCode:(f)=>`${f.result||'result'} = not (${f.condition||'False'})` },
  { id:'py_and',    label:'And',               icon:'&', color:C.FLOW, category:'Control Flow',
    fields:[{name:'result',type:'text',placeholder:'result'},{name:'a',type:'text',placeholder:'x > 0'},{name:'b',type:'text',placeholder:'x < 10'}],
    desc:'Logical AND',
    toCode:(f)=>`${f.result||'result'} = (${f.a||'False'}) and (${f.b||'False'})` },
  { id:'py_or',     label:'Or',                icon:'|', color:C.FLOW, category:'Control Flow',
    fields:[{name:'result',type:'text',placeholder:'result'},{name:'a',type:'text',placeholder:'x < 0'},{name:'b',type:'text',placeholder:'x > 10'}],
    desc:'Logical OR',
    toCode:(f)=>`${f.result||'result'} = (${f.a||'False'}) or (${f.b||'False'})` },
  { id:'py_in',     label:'In',                icon:'✓', color:C.FLOW, category:'Control Flow',
    fields:[{name:'result',type:'text',placeholder:'has'},{name:'item',type:'text',placeholder:'5'},{name:'collection',type:'text',placeholder:'my_list'}],
    desc:'Check membership',
    toCode:(f)=>`${f.result||'has'} = ${f.item||'5'} in ${f.collection||'my_list'}` },
  { id:'py_notin',  label:'Not In',            icon:'✗', color:C.FLOW, category:'Control Flow',
    fields:[{name:'result',type:'text',placeholder:'has'},{name:'item',type:'text',placeholder:'5'},{name:'collection',type:'text',placeholder:'my_list'}],
    desc:'Check non-membership',
    toCode:(f)=>`${f.result||'has'} = ${f.item||'5'} not in ${f.collection||'my_list'}` },
  { id:'py_ternary',label:'Ternary',           icon:'❔', color:C.FLOW, category:'Control Flow',
    fields:[{name:'result',type:'text',placeholder:'x'},{name:'true',type:'text',placeholder:'a'},{name:'condition',type:'text',placeholder:'a > b'},{name:'false',type:'text',placeholder:'b'}],
    desc:'Conditional expression (x if c else y)',
    toCode:(f)=>`${f.result||'x'} = ${f.true||'a'} if ${f.condition||'False'} else ${f.false||'b'}` },
  { id:'py_assert', label:'Assert',            icon:'⚠️', color:C.FLOW, category:'Control Flow',
    fields:[{name:'condition',type:'text',placeholder:'x > 0'},{name:'message',type:'text',placeholder:'x must be positive'}],
    desc:'Assert condition (debugging)',
    toCode:(f)=>`assert ${f.condition||'True'}, ${smartVal(f.message||'assertion failed')}` },
  { id:'py_try',    label:'Try Except',        icon:'⚠️', color:C.FLOW, category:'Control Flow',
    fields:[{name:'exception',type:'text',placeholder:'Exception'}],
    desc:'Error handling',
    isContainer:true,
    toCode:(f,ch,indent)=>`try:\n${indent}${ch}\nexcept ${f.exception||'Exception'}:\n${indent}pass` },

  // Advanced Functions
  { id:'py_class',  label:'Define Class',      icon:'📦', color:C.FUNC, category:'Functions',
    fields:[{name:'name',type:'text',placeholder:'MyClass'},{name:'parent',type:'text',placeholder:'object'}],
    desc:'Create a class',
    isContainer:true,
    toCode:(f,ch,indent)=>`class ${f.name||'MyClass'}(${f.parent||'object'}):\n${indent}${ch}` },
  { id:'py_init',   label:'Constructor',       icon:'🔨', color:C.FUNC, category:'Functions',
    fields:[{name:'params',type:'text',placeholder:'self, name'}],
    desc:'Class constructor (__init__)',
    isContainer:true,
    toCode:(f,ch,indent)=>`def __init__(${f.params||'self'}):\n${indent}${ch}` },
  { id:'py_self',   label:'Self Property',     icon:'📌', color:C.FUNC, category:'Functions',
    fields:[{name:'property',type:'text',placeholder:'name'},{name:'value',type:'text',placeholder:'value'}],
    desc:'Set instance property',
    toCode:(f)=>`self.${f.property||'name'} = ${smartVal(f.value)}` },
  { id:'py_method', label:'Method',            icon:'🧩', color:C.FUNC, category:'Functions',
    fields:[{name:'name',type:'text',placeholder:'my_method'},{name:'params',type:'text',placeholder:'self, x'}],
    desc:'Define class method',
    isContainer:true,
    toCode:(f,ch,indent)=>`def ${f.name||'my_method'}(${f.params||'self'}):\n${indent}${ch}` },
  { id:'py_decorator',label:'Decorator',       icon:'✨', color:C.FUNC, category:'Functions',
    fields:[{name:'decorator',type:'text',placeholder:'@property'}],
    desc:'Function decorator',
    toCode:(f)=>`${f.decorator||'@decorator'}` },
  { id:'py_yield',  label:'Yield',             icon:'〰️', color:C.FUNC, category:'Functions',
    fields:[{name:'value',type:'text',placeholder:'item'}],
    desc:'Yield value (generator)',
    toCode:(f)=>`yield ${f.value||'item'}` },
  { id:'py_generator',label:'Generator',       icon:'⚡', color:C.FUNC, category:'Functions',
    fields:[{name:'name',type:'text',placeholder:'my_gen'},{name:'var',type:'text',placeholder:'i'},{name:'range',type:'text',placeholder:'10'}],
    desc:'Create generator function',
    isContainer:true,
    toCode:(f,ch,indent)=>`def ${f.name||'my_gen'}():\n${indent}for ${f.var||'i'} in range(${f.range||10}):\n${indent}    ${ch}` },

  // Advanced Lists
  { id:'py_listcomp',label:'List Comprehension',icon:'[🔷]',color:C.ARR, category:'Lists',
    fields:[{name:'result',type:'text',placeholder:'result'},{name:'expr',type:'text',placeholder:'x*2'},{name:'var',type:'text',placeholder:'x'},{name:'collection',type:'text',placeholder:'range(5)'}],
    desc:'List comprehension',
    toCode:(f)=>`${f.result||'result'} = [${f.expr||'x'} for ${f.var||'x'} in ${f.collection||'range(10)'}]` },
  { id:'py_dictcomp',label:'Dict Comprehension',icon:'{🔷}',color:C.ARR, category:'Lists',
    fields:[{name:'result',type:'text',placeholder:'result'},{name:'key',type:'text',placeholder:'x'},{name:'val',type:'text',placeholder:'x*2'},{name:'var',type:'text',placeholder:'x'},{name:'collection',type:'text',placeholder:'range(5)'}],
    desc:'Dictionary comprehension',
    toCode:(f)=>`${f.result||'result'} = {${f.key||'x'}: ${f.val||'x*2'} for ${f.var||'x'} in ${f.collection||'range(10)'}}` },
  { id:'py_extend', label:'Extend List',       icon:'➕', color:C.ARR, category:'Lists',
    fields:[{name:'lst',type:'text',placeholder:'my_list'},{name:'other',type:'text',placeholder:'other_list'}],
    desc:'Add multiple items',
    toCode:(f)=>`${f.lst||'my_list'}.extend(${f.other||'other_list'})` },
  { id:'py_insert', label:'Insert Item',       icon:'⬆️', color:C.ARR, category:'Lists',
    fields:[{name:'lst',type:'text',placeholder:'my_list'},{name:'index',type:'text',placeholder:'0'},{name:'value',type:'text',placeholder:'42'}],
    desc:'Insert at specific position',
    toCode:(f)=>`${f.lst||'my_list'}.insert(${f.index||0}, ${smartVal(f.value)})` },
  { id:'py_remove', label:'Remove Item',       icon:'🗑️', color:C.ARR, category:'Lists',
    fields:[{name:'lst',type:'text',placeholder:'my_list'},{name:'value',type:'text',placeholder:'42'}],
    desc:'Remove first occurrence',
    toCode:(f)=>`${f.lst||'my_list'}.remove(${smartVal(f.value)})` },
  { id:'py_clear',  label:'Clear List',        icon:'🧹', color:C.ARR, category:'Lists',
    fields:[{name:'lst',type:'text',placeholder:'my_list'}],
    desc:'Remove all items',
    toCode:(f)=>`${f.lst||'my_list'}.clear()` },
  { id:'py_count',  label:'Count Items',       icon:'🔢', color:C.ARR, category:'Lists',
    fields:[{name:'result',type:'text',placeholder:'count'},{name:'lst',type:'text',placeholder:'my_list'},{name:'value',type:'text',placeholder:'42'}],
    desc:'Count occurrences',
    toCode:(f)=>`${f.result||'count'} = ${f.lst||'my_list'}.count(${smartVal(f.value)})` },
  { id:'py_index',  label:'Index Of',          icon:'📍', color:C.ARR, category:'Lists',
    fields:[{name:'result',type:'text',placeholder:'idx'},{name:'lst',type:'text',placeholder:'my_list'},{name:'value',type:'text',placeholder:'42'}],
    desc:'Find item position',
    toCode:(f)=>`${f.result||'idx'} = ${f.lst||'my_list'}.index(${smartVal(f.value)})` },
  { id:'py_reverse',label:'Reverse List',      icon:'↩️', color:C.ARR, category:'Lists',
    fields:[{name:'lst',type:'text',placeholder:'my_list'}],
    desc:'Reverse in place',
    toCode:(f)=>`${f.lst||'my_list'}.reverse()` },
  { id:'py_sort',   label:'Sort List',         icon:'📊', color:C.ARR, category:'Lists',
    fields:[{name:'lst',type:'text',placeholder:'my_list'}],
    desc:'Sort in place',
    toCode:(f)=>`${f.lst||'my_list'}.sort()` },
  { id:'py_copy',   label:'Copy List',         icon:'📋', color:C.ARR, category:'Lists',
    fields:[{name:'result',type:'text',placeholder:'copy'},{name:'lst',type:'text',placeholder:'my_list'}],
    desc:'Create list copy',
    toCode:(f)=>`${f.result||'copy'} = ${f.lst||'my_list'}.copy()` },

  // Advanced Math
  { id:'py_sqrt',   label:'Square Root',       icon:'√', color:C.MATH, category:'Math',
    fields:[{name:'result',type:'text',placeholder:'root'},{name:'value',type:'text',placeholder:'16'}],
    desc:'Square root',
    toCode:(f)=>`import math\n${f.result||'root'} = math.sqrt(${f.value||0})` },
  { id:'py_pow',    label:'Power',             icon:'⚡', color:C.MATH, category:'Math',
    fields:[{name:'result',type:'text',placeholder:'result'},{name:'base',type:'text',placeholder:'2'},{name:'exp',type:'text',placeholder:'3'}],
    desc:'Raise to power',
    toCode:(f)=>`${f.result||'result'} = ${f.base||2} ** ${f.exp||2}` },
  { id:'py_max',    label:'Maximum',           icon:'📈', color:C.MATH, category:'Math',
    fields:[{name:'result',type:'text',placeholder:'max'},{name:'values',type:'text',placeholder:'10, 20, 5'}],
    desc:'Find maximum',
    toCode:(f)=>`${f.result||'max'} = max(${f.values||'0'})` },
  { id:'py_min',    label:'Minimum',           icon:'📉', color:C.MATH, category:'Math',
    fields:[{name:'result',type:'text',placeholder:'min'},{name:'values',type:'text',placeholder:'10, 20, 5'}],
    desc:'Find minimum',
    toCode:(f)=>`${f.result||'min'} = min(${f.values||'0'})` },
  { id:'py_sum',    label:'Sum',               icon:'∑', color:C.MATH, category:'Math',
    fields:[{name:'result',type:'text',placeholder:'total'},{name:'values',type:'text',placeholder:'1, 2, 3'}],
    desc:'Sum values',
    toCode:(f)=>`${f.result||'total'} = sum([${f.values||'0'}])` },
  { id:'py_sin',    label:'Sine',              icon:'〰️', color:C.MATH, category:'Math',
    fields:[{name:'result',type:'text',placeholder:'s'},{name:'radians',type:'text',placeholder:'1'}],
    desc:'Sine trigonometry',
    toCode:(f)=>`import math\n${f.result||'s'} = math.sin(${f.radians||0})` },
  { id:'py_cos',    label:'Cosine',            icon:'〰️', color:C.MATH, category:'Math',
    fields:[{name:'result',type:'text',placeholder:'c'},{name:'radians',type:'text',placeholder:'1'}],
    desc:'Cosine trigonometry',
    toCode:(f)=>`import math\n${f.result||'c'} = math.cos(${f.radians||0})` },
  { id:'py_tan',    label:'Tangent',           icon:'〰️', color:C.MATH, category:'Math',
    fields:[{name:'result',type:'text',placeholder:'t'},{name:'radians',type:'text',placeholder:'1'}],
    desc:'Tangent trigonometry',
    toCode:(f)=>`import math\n${f.result||'t'} = math.tan(${f.radians||0})` },

  // Advanced Strings
  { id:'py_find',   label:'Find String',       icon:'🔍', color:C.STR, category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'idx'},{name:'str',type:'text',placeholder:'my_str'},{name:'substring',type:'text',placeholder:'hello'}],
    desc:'Find substring position',
    toCode:(f)=>`${f.result||'idx'} = ${f.str||'my_str'}.find(${smartVal(f.substring||'')})` },
  { id:'py_rfind',  label:'Right Find',        icon:'🔍', color:C.STR, category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'idx'},{name:'str',type:'text',placeholder:'my_str'},{name:'substring',type:'text',placeholder:'hello'}],
    desc:'Find from right',
    toCode:(f)=>`${f.result||'idx'} = ${f.str||'my_str'}.rfind(${smartVal(f.substring||'')})` },
  { id:'py_count',  label:'Count Substring',   icon:'🔢', color:C.STR, category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'count'},{name:'str',type:'text',placeholder:'my_str'},{name:'substring',type:'text',placeholder:'a'}],
    desc:'Count occurrences',
    toCode:(f)=>`${f.result||'count'} = ${f.str||'my_str'}.count(${smartVal(f.substring||'')})` },
  { id:'py_islower', label:'Is Lowercase',     icon:'🔡', color:C.STR, category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'is'},{name:'str',type:'text',placeholder:'my_str'}],
    desc:'Check if lowercase',
    toCode:(f)=>`${f.result||'is'} = ${f.str||'my_str'}.islower()` },
  { id:'py_isupper', label:'Is Uppercase',     icon:'🔠', color:C.STR, category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'is'},{name:'str',type:'text',placeholder:'my_str'}],
    desc:'Check if uppercase',
    toCode:(f)=>`${f.result||'is'} = ${f.str||'my_str'}.isupper()` },
  { id:'py_isdigit', label:'Is Digit',         icon:'🔢', color:C.STR, category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'is'},{name:'str',type:'text',placeholder:'my_str'}],
    desc:'Check if all digits',
    toCode:(f)=>`${f.result||'is'} = ${f.str||'my_str'}.isdigit()` },
  { id:'py_isalpha', label:'Is Alpha',         icon:'🔤', color:C.STR, category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'is'},{name:'str',type:'text',placeholder:'my_str'}],
    desc:'Check if all alphabetic',
    toCode:(f)=>`${f.result||'is'} = ${f.str||'my_str'}.isalpha()` },
  { id:'py_strip',  label:'Strip Whitespace',  icon:'✂️', color:C.STR, category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'clean'},{name:'str',type:'text',placeholder:'my_str'}],
    desc:'Remove leading/trailing whitespace',
    toCode:(f)=>`${f.result||'clean'} = ${f.str||'my_str'}.strip()` },
  { id:'py_lstrip', label:'Left Strip',        icon:'◀️', color:C.STR, category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'clean'},{name:'str',type:'text',placeholder:'my_str'}],
    desc:'Remove leading whitespace',
    toCode:(f)=>`${f.result||'clean'} = ${f.str||'my_str'}.lstrip()` },
  { id:'py_rstrip', label:'Right Strip',       icon:'▶️', color:C.STR, category:'Strings',
    fields:[{name:'result',type:'text',placeholder:'clean'},{name:'str',type:'text',placeholder:'my_str'}],
    desc:'Remove trailing whitespace',
    toCode:(f)=>`${f.result||'clean'} = ${f.str||'my_str'}.rstrip()` },

  // File Operations
  { id:'py_open',   label:'Open File',         icon:'📂', color:C.MISC, category:'Files',
    fields:[{name:'varname',type:'text',placeholder:'f'},{name:'filepath',type:'text',placeholder:'file.txt'},{name:'mode',type:'select',options:['r','w','a','rb','wb']}],
    desc:'Open file',
    toCode:(f)=>`${f.varname||'f'} = open(${smartVal(f.filepath||'file.txt')}, ${smartVal(f.mode||'r')})` },
  { id:'py_read',   label:'Read File',         icon:'📖', color:C.MISC, category:'Files',
    fields:[{name:'result',type:'text',placeholder:'content'},{name:'file',type:'text',placeholder:'f'}],
    desc:'Read entire file',
    toCode:(f)=>`${f.result||'content'} = ${f.file||'f'}.read()` },
  { id:'py_readline',label:'Read Line',        icon:'📄', color:C.MISC, category:'Files',
    fields:[{name:'result',type:'text',placeholder:'line'},{name:'file',type:'text',placeholder:'f'}],
    desc:'Read one line',
    toCode:(f)=>`${f.result||'line'} = ${f.file||'f'}.readline()` },
  { id:'py_write',  label:'Write File',        icon:'✏️', color:C.MISC, category:'Files',
    fields:[{name:'file',type:'text',placeholder:'f'},{name:'content',type:'text',placeholder:'text'}],
    desc:'Write to file',
    toCode:(f)=>`${f.file||'f'}.write(${smartVal(f.content||'')})` },
  { id:'py_close',  label:'Close File',        icon:'📁', color:C.MISC, category:'Files',
    fields:[{name:'file',type:'text',placeholder:'f'}],
    desc:'Close file',
    toCode:(f)=>`${f.file||'f'}.close()` },

  // Imports
  { id:'py_import', label:'Import Module',     icon:'📦', color:C.MISC, category:'Imports',
    fields:[{name:'module',type:'text',placeholder:'math'},{name:'alias',type:'text',placeholder:''}],
    desc:'Import a module',
    toCode:(f)=>`import ${f.module||'module'}${f.alias?' as '+f.alias:''}` },
  { id:'py_from',   label:'From Import',       icon:'📦', color:C.MISC, category:'Imports',
    fields:[{name:'module',type:'text',placeholder:'math'},{name:'item',type:'text',placeholder:'sqrt'}],
    desc:'Import specific item',
    toCode:(f)=>`from ${f.module||'module'} import ${f.item||'function'}` },

  // Custom Script Block
  { id:'py_custom', label:'Custom Script',     icon:'✏️', color:C.MISC, category:'Custom',
    fields:[{name:'code',type:'text',placeholder:'Your Python code here'}],
    desc:'Write custom Python',
    toCode:(f)=>`${f.code||'# custom code'}` },
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

  // ---- STYLING PRESETS (HTML) ----
  { id:'html_preset_modern',label:'Preset: Modern',    icon:'✨', color:C.HTML, category:'Styling',
    fields:[], desc:'Modern clean design',
    toCode:()=>`<style>
body { font-family: 'Segoe UI', Tahoma, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #333; margin: 0; padding: 20px; }
.container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); padding: 40px; }
button { background: #667eea; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 600; transition: 0.3s; }
button:hover { background: #764ba2; transform: translateY(-2px); }
</style>` },
  { id:'html_preset_retro', label:'Preset: Retro',     icon:'📼', color:C.HTML, category:'Styling',
    fields:[], desc:'Retro 80s style',
    toCode:()=>`<style>
body { font-family: 'Courier New', monospace; background: #1a1a2e; color: #00ff00; margin: 0; padding: 20px; text-shadow: 0 0 10px #00ff00; }
.container { border: 3px solid #00ff00; padding: 20px; background: #0f0f1e; }
button { background: #00ff00; color: #1a1a2e; border: 2px solid #00ff00; padding: 10px 20px; cursor: pointer; font-weight: bold; font-family: 'Courier New'; }
button:hover { background: #1a1a2e; color: #00ff00; }
</style>` },
  { id:'html_preset_minimal',label:'Preset: Minimal',   icon:'◻️', color:C.HTML, category:'Styling',
    fields:[], desc:'Minimal monochrome',
    toCode:()=>`<style>
body { font-family: -apple-system, system-ui, sans-serif; background: #ffffff; color: #000000; margin: 0; padding: 30px; }
.container { max-width: 600px; margin: 0 auto; }
button { background: #000000; color: #ffffff; border: 1px solid #000000; padding: 10px 20px; cursor: pointer; }
button:hover { background: #333333; }
a { color: #000000; text-decoration: underline; }
</style>` },
  { id:'html_preset_dark',   label:'Preset: Dark Mode',  icon:'🌙', color:C.HTML, category:'Styling',
    fields:[], desc:'Dark theme',
    toCode:()=>`<style>
body { font-family: system-ui, sans-serif; background: #121212; color: #e0e0e0; margin: 0; padding: 20px; }
.container { background: #1e1e1e; border: 1px solid #333333; padding: 30px; border-radius: 8px; }
button { background: #1f1f1f; color: #e0e0e0; border: 1px solid #444444; padding: 10px 20px; cursor: pointer; border-radius: 4px; }
button:hover { background: #2a2a2a; border-color: #666666; }
</style>` },
  { id:'html_preset_gradient',label:'Preset: Gradient',  icon:'🌈', color:C.HTML, category:'Styling',
    fields:[], desc:'Colorful gradient',
    toCode:()=>`<style>
body { background: linear-gradient(135deg, #ff6b6b, #ffa502, #fff200, #00ff00, #00b4d8, #7209b7); background-size: 400% 400%; animation: gradient 8s ease infinite; color: white; font-family: sans-serif; }
@keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
button { background: rgba(255,255,255,0.2); color: white; border: 2px solid white; padding: 12px 24px; cursor: pointer; border-radius: 8px; backdrop-filter: blur(10px); }
</style>` },
  { id:'html_preset_glassmorphism',label:'Preset: Glassmorphism',icon:'🔮',color:C.HTML, category:'Styling',
    fields:[], desc:'Glassmorphism design',
    toCode:()=>`<style>
body { background: url('data:image/svg+xml,<svg></svg>'); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: system-ui; margin: 0; padding: 20px; min-height: 100vh; }
.container { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 16px; padding: 40px; max-width: 600px; margin: 0 auto; color: white; }
button { background: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.3); color: white; padding: 12px 24px; border-radius: 8px; cursor: pointer; }
</style>` },
  { id:'html_preset_neon',   label:'Preset: Neon',      icon:'💡', color:C.HTML, category:'Styling',
    fields:[], desc:'Neon cyberpunk',
    toCode:()=>`<style>
body { background: #0a0e27; color: #0ff; font-family: 'Courier New', monospace; margin: 0; padding: 20px; }
.container { border: 2px solid #0ff; padding: 30px; box-shadow: 0 0 20px #0ff, inset 0 0 20px rgba(0,255,255,0.1); background: rgba(0,255,255,0.05); }
button { background: #0ff; color: #0a0e27; border: 2px solid #0ff; padding: 10px 20px; cursor: pointer; font-weight: bold; box-shadow: 0 0 10px #0ff; }
button:hover { box-shadow: 0 0 20px #0ff; }
</style>` },
  { id:'html_preset_colorful',label:'Preset: Colorful',  icon:'🎨', color:C.HTML, category:'Styling',
    fields:[], desc:'Vibrant colors',
    toCode:()=>`<style>
body { background: linear-gradient(to right, #ff3c87, #ffc900, #26de81, #0084ff); color: white; font-family: 'Comic Sans MS', cursive; margin: 0; padding: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
.container { background: rgba(255,255,255,0.15); padding: 30px; border-radius: 20px; border: 3px dashed #ff3c87; }
button { background: white; color: #ff3c87; border: none; padding: 12px 24px; border-radius: 20px; cursor: pointer; font-weight: bold; font-size: 16px; }
</style>` },
  { id:'html_preset_professional',label:'Preset: Professional',icon:'💼',color:C.HTML, category:'Styling',
    fields:[], desc:'Corporate professional',
    toCode:()=>`<style>
body { font-family: 'Georgia', serif; background: #f5f5f5; color: #333; margin: 0; padding: 20px; }
.container { background: white; max-width: 900px; margin: 0 auto; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-top: 4px solid #2c3e50; }
h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
button { background: #3498db; color: white; border: none; padding: 12px 30px; cursor: pointer; font-size: 14px; }
button:hover { background: #2980b9; }
</style>` },
  { id:'html_preset_soft',     label:'Preset: Soft Pastels',icon:'🎀', color:C.HTML, category:'Styling',
    fields:[], desc:'Soft pastel colors',
    toCode:()=>`<style>
body { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); font-family: 'Trebuchet MS', sans-serif; color: #666; margin: 0; padding: 20px; }
.container { background: rgba(255, 255, 255, 0.8); padding: 40px; border-radius: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
button { background: #ffb3d9; border: none; color: white; padding: 10px 20px; border-radius: 20px; cursor: pointer; }
button:hover { background: #ff9bc7; }
</style>` },
  { id:'html_preset_nature',   label:'Preset: Nature',    icon:'🌿', color:C.HTML, category:'Styling',
    fields:[], desc:'Nature green theme',
    toCode:()=>`<style>
body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: system-ui; color: #2d5016; margin: 0; padding: 20px; }
body { background: linear-gradient(135deg, #2d5016 0%, #548c2f 100%); color: white; }
.container { background: rgba(255, 255, 255, 0.9); padding: 40px; border-radius: 12px; border-left: 5px solid #548c2f; }
button { background: #548c2f; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
button:hover { background: #3a6618; }
</style>` },
  { id:'html_preset_ocean',    label:'Preset: Ocean',     icon:'🌊', color:C.HTML, category:'Styling',
    fields:[], desc:'Ocean blue theme',
    toCode:()=>`<style>
body { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); font-family: system-ui; color: white; margin: 0; padding: 20px; }
.container { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(5px); padding: 40px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.2); }
button { background: #00a8ff; border: 2px solid #00a8ff; color: white; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
button:hover { background: #0088cc; border-color: #0088cc; }
</style>` },

  // Additional Presets (9 more to reach 20)
  { id:'html_preset_cyberpunk', label:'Preset: Cyberpunk', icon:'🤖', color:C.HTML, category:'Styling',
    fields:[], desc:'High-tech cyberpunk aesthetic',
    toCode:()=>`<style>
body { background: #0a0a1a; color: #ff00ff; font-family: 'Courier New', monospace; margin: 0; padding: 20px; text-shadow: 0 0 10px #ff00ff; }
.container { background: rgba(0,0,0,0.8); border: 2px solid #00ffff; padding: 30px; box-shadow: 0 0 20px #ff00ff, inset 0 0 20px rgba(255,0,255,0.1); }
button { background: transparent; border: 2px solid #00ffff; color: #00ffff; padding: 10px 20px; cursor: pointer; text-transform: uppercase; font-weight: bold; }
button:hover { background: #00ffff; color: #0a0a1a; }
</style>` },

  { id:'html_preset_sunset', label:'Preset: Sunset', icon:'🌅', color:C.HTML, category:'Styling',
    fields:[], desc:'Warm sunset colors',
    toCode:()=>`<style>
body { background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #fdb833 100%); font-family: 'Georgia', serif; color: #2d3142; margin: 0; padding: 20px; }
.container { background: rgba(255,255,255,0.95); padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(255,107,53,0.3); }
button { background: #ff6b35; color: white; border: none; padding: 12px 25px; border-radius: 25px; cursor: pointer; font-weight: 600; }
button:hover { background: #f7931e; transform: translateY(-2px); }
</style>` },

  { id:'html_preset_arctic', label:'Preset: Arctic', icon:'❄️', color:C.HTML, category:'Styling',
    fields:[], desc:'Cold arctic theme',
    toCode:()=>`<style>
body { background: linear-gradient(135deg, #e0f7ff 0%, #b3e5fc 100%); font-family: system-ui; color: #004d7a; margin: 0; padding: 20px; }
.container { background: rgba(255,255,255,0.9); padding: 40px; border-radius: 12px; border-left: 5px solid #0091ad; box-shadow: 0 4px 20px rgba(0,145,173,0.15); }
button { background: #0091ad; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
button:hover { background: #006b7f; }
</style>` },

  { id:'html_preset_midnight', label:'Preset: Midnight', icon:'⭐', color:C.HTML, category:'Styling',
    fields:[], desc:'Deep midnight theme',
    toCode:()=>`<style>
body { background: linear-gradient(135deg, #0f0f2e 0%, #1a1a4d 100%); font-family: system-ui; color: #e0e0ff; margin: 0; padding: 20px; }
.container { background: rgba(26,26,77,0.6); padding: 40px; border-radius: 12px; border: 1px solid rgba(224,224,255,0.2); }
button { background: #5a5aff; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
button:hover { background: #7a7aff; box-shadow: 0 0 15px rgba(90,90,255,0.4); }
</style>` },

  { id:'html_preset_forest', label:'Preset: Forest', icon:'🌲', color:C.HTML, category:'Styling',
    fields:[], desc:'Earthy forest theme',
    toCode:()=>`<style>
body { background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%); font-family: 'Georgia', serif; color: #fff; margin: 0; padding: 20px; }
.container { background: rgba(0,0,0,0.3); padding: 40px; border-radius: 12px; border-left: 5px solid #52b788; }
button { background: #52b788; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
button:hover { background: #74c69d; }
</style>` },

  { id:'html_preset_bubblegum', label:'Preset: Bubble Gum', icon:'🎀', color:C.HTML, category:'Styling',
    fields:[], desc:'Sweet bubblegum colors',
    toCode:()=>`<style>
body { background: linear-gradient(135deg, #ff1493 0%, #ff69b4 50%, #ffb6d9 100%); font-family: 'Comic Sans MS', cursive; color: white; margin: 0; padding: 20px; }
.container { background: rgba(255,255,255,0.9); padding: 40px; border-radius: 30px; box-shadow: 0 10px 30px rgba(255,20,147,0.3); }
button { background: #ff1493; color: white; border: none; padding: 12px 25px; border-radius: 20px; cursor: pointer; font-weight: bold; }
button:hover { background: #ff69b4; }
</style>` },

  { id:'html_preset_gold', label:'Preset: Gold Luxury', icon:'✨', color:C.HTML, category:'Styling',
    fields:[], desc:'Elegant gold theme',
    toCode:()=>`<style>
body { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); font-family: 'Georgia', serif; color: #f0e68c; margin: 0; padding: 20px; }
.container { background: rgba(212,175,55,0.1); padding: 40px; border-radius: 12px; border: 2px solid #d4af37; box-shadow: 0 0 20px rgba(212,175,55,0.2); }
button { background: #d4af37; color: #1a1a1a; border: none; padding: 12px 25px; border-radius: 6px; cursor: pointer; font-weight: bold; }
button:hover { background: #f0e68c; }
</style>` },

  { id:'html_preset_vintage', label:'Preset: Vintage', icon:'📻', color:C.HTML, category:'Styling',
    fields:[], desc:'Retro vintage style',
    toCode:()=>`<style>
body { background: #d4c5a0; font-family: 'Courier New', monospace; color: #3e3225; margin: 0; padding: 20px; }
.container { background: #e8dcc8; padding: 40px; border-radius: 12px; border: 3px double #8b7355; box-shadow: inset 0 0 20px rgba(0,0,0,0.1); }
button { background: #8b7355; color: #e8dcc8; border: 2px solid #3e3225; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
button:hover { background: #5d4e37; }
</style>` },

  { id:'html_preset_mint', label:'Preset: Mint Fresh', icon:'🌬️', color:C.HTML, category:'Styling',
    fields:[], desc:'Fresh mint colors',
    toCode:()=>`<style>
body { background: linear-gradient(135deg, #b2f2e1 0%, #a8e6db 100%); font-family: system-ui; color: #0a5f4e; margin: 0; padding: 20px; }
.container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(10,95,78,0.15); }
button { background: #0a5f4e; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
button:hover { background: #157a6a; }
</style>` },

  // Custom Script Block
  // Make Custom Preset
  { id:'html_custom_preset', label:'Make New Style Preset', icon:'🎭', color:C.HTML, category:'Styling',
    fields:[
      {name:'bgColor',type:'text',placeholder:'#ffffff'},
      {name:'textColor',type:'text',placeholder:'#000000'},
      {name:'accentColor',type:'text',placeholder:'#2979ff'},
      {name:'fontFamily',type:'text',placeholder:'system-ui, sans-serif'},
      {name:'borderRadius',type:'text',placeholder:'8px'},
      {name:'padding',type:'text',placeholder:'20px'},
      {name:'boxShadow',type:'text',placeholder:'0 2px 8px rgba(0,0,0,0.1)'},
      {name:'buttonColor',type:'text',placeholder:'#2979ff'},
      {name:'buttonRadius',type:'text',placeholder:'6px'},
      {name:'transition',type:'text',placeholder:'0.3s ease'}
    ],
    desc:'Create a custom style preset with your own colors and settings',
    toCode:(f)=>`<style>
body { 
  background: ${f.bgColor||'#ffffff'}; 
  color: ${f.textColor||'#000000'}; 
  font-family: ${f.fontFamily||'system-ui, sans-serif'};
  margin: 0; 
  padding: ${f.padding||'20px'};
}
.container { 
  background: ${f.bgColor||'#ffffff'}; 
  padding: ${f.padding||'20px'}; 
  border-radius: ${f.borderRadius||'8px'};
  box-shadow: ${f.boxShadow||'0 2px 8px rgba(0,0,0,0.1)'};
  max-width: 1000px;
  margin: 0 auto;
}
button { 
  background: ${f.buttonColor||'#2979ff'}; 
  color: white; 
  border: none; 
  padding: 10px 20px; 
  border-radius: ${f.buttonRadius||'6px'};
  cursor: pointer; 
  transition: ${f.transition||'0.3s ease'};
  font-weight: 600;
}
button:hover { 
  opacity: 0.9; 
  transform: translateY(-2px);
}
a { color: ${f.accentColor||'#2979ff'}; text-decoration: none; transition: ${f.transition||'0.3s ease'}; }
a:hover { opacity: 0.8; }
</style>` },

  { id:'html_custom', label:'Custom Script',     icon:'✏️', color:C.MISC, category:'Custom',
    fields:[{name:'code',type:'text',placeholder:'Your HTML/CSS/JS here'}],
    desc:'Write custom HTML',
    isHTMLElement:true,
    toCode:(f)=>`${f.code||'<!-- custom html -->'}` },
];

// ---- BUILD GAME BLOCKS (formerly GENERIC) ----
const BUILD_GAME_BLOCKS = [
  // Game Structure
  { id:'g_step',   label:'Step',         icon:'▶️', color:C.MISC, category:'Logic',
    fields:[{name:'text',type:'text',placeholder:'Do something...'}],
    desc:'A named step',
    toCode:(f)=>`// STEP: ${f.text||'...'}` },
  { id:'g_note',   label:'Note',         icon:'📌', color:C.MISC, category:'Logic',
    fields:[{name:'text',type:'text',placeholder:'Remember to...'}],
    desc:'A sticky note',
    toCode:(f)=>`// NOTE: ${f.text||''}` },
  
  // Game Logic
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
  
  // Game Output
  { id:'g_output', label:'Output',       icon:'💬', color:C.OUT,  category:'Logic',
    fields:[{name:'text',type:'text',placeholder:'Show something'}],
    desc:'Output/display something',
    toCode:(f)=>`OUTPUT: ${f.text||'...'}` },
  { id:'g_input',  label:'Input',        icon:'⌨️', color:C.OUT,  category:'Logic',
    fields:[{name:'varname',type:'text',placeholder:'answer'},{name:'prompt',type:'text',placeholder:'Ask user:'}],
    desc:'Get input from user',
    toCode:(f)=>`${f.varname||'answer'} = INPUT("${f.prompt||'?'}")` },
  
  // Game Timing & Animation
  { id:'g_wait',   label:'Wait',         icon:'⏱️', color:C.TIME, category:'Logic',
    fields:[{name:'duration',type:'text',placeholder:'2 seconds'}],
    desc:'Wait for a duration',
    toCode:(f)=>`WAIT ${f.duration||'1s'}` },
  { id:'g_animate',label:'Animate',      icon:'✨', color:C.TIME, category:'Logic',
    fields:[{name:'object',type:'text',placeholder:'sprite'},{name:'property',type:'text',placeholder:'x'},{name:'target',type:'text',placeholder:'100'},{name:'duration',type:'text',placeholder:'1s'}],
    desc:'Animate property change',
    toCode:(f)=>`ANIMATE ${f.object||'obj'}.${f.property||'x'} TO ${f.target||'100'} IN ${f.duration||'1s'}` },
  { id:'g_frame',  label:'Frame Event',  icon:'🎬', color:C.TIME, category:'Logic',
    fields:[],
    desc:'Execute every frame',
    isContainer:true,
    toCode:(f,ch,indent)=>`ON_FRAME {\n${indent}${ch}\n${indent.slice(2)}}` },
  
  // Game Math & Variables
  { id:'g_math',   label:'Calculate',    icon:'🔢', color:C.MATH, category:'Logic',
    fields:[{name:'result',type:'text',placeholder:'result'},{name:'expr',type:'text',placeholder:'a + b * 2'}],
    desc:'Calculate an expression',
    toCode:(f)=>`${f.result||'result'} = ${f.expr||'0'}` },
  { id:'g_random', label:'Random',       icon:'🎲', color:C.MATH, category:'Logic',
    fields:[{name:'result',type:'text',placeholder:'num'},{name:'min',type:'text',placeholder:'1'},{name:'max',type:'text',placeholder:'100'}],
    desc:'Generate random number',
    toCode:(f)=>`${f.result||'num'} = RANDOM(${f.min||1}, ${f.max||100})` },
  
  // Sprite/Graphics
  { id:'g_sprite', label:'Create Sprite',icon:'🎨', color:C.CANVAS, category:'Graphics',
    fields:[{name:'name',type:'text',placeholder:'player'},{name:'image',type:'text',placeholder:'sprite.png'},{name:'x',type:'text',placeholder:'0'},{name:'y',type:'text',placeholder:'0'}],
    desc:'Create a drawable sprite',
    toCode:(f)=>`SPRITE ${f.name||'sprite'} = IMAGE(${smartVal(f.image||'')}) AT ${f.x||0},${f.y||0}` },
  { id:'g_draw',   label:'Draw Shape',   icon:'⬜', color:C.CANVAS, category:'Graphics',
    fields:[{name:'shape',type:'select',options:['rectangle','circle','line','triangle']},{name:'x',type:'text',placeholder:'10'},{name:'y',type:'text',placeholder:'10'},{name:'size',type:'text',placeholder:'50'},{name:'color',type:'text',placeholder:'red'}],
    desc:'Draw geometric shape',
    toCode:(f)=>`DRAW ${f.shape||'rectangle'} AT ${f.x||0},${f.y||0} SIZE ${f.size||50} COLOR ${f.color||'red'}` },
  { id:'g_color',  label:'Set Color',    icon:'🎨', color:C.CANVAS, category:'Graphics',
    fields:[{name:'color',type:'text',placeholder:'#ff0000'}],
    desc:'Set drawing color',
    toCode:(f)=>`COLOR = ${smartVal(f.color||'red')}` },
  { id:'g_text',   label:'Draw Text',    icon:'🔤', color:C.CANVAS, category:'Graphics',
    fields:[{name:'text',type:'text',placeholder:'Score: 100'},{name:'x',type:'text',placeholder:'10'},{name:'y',type:'text',placeholder:'20'},{name:'size',type:'text',placeholder:'16'}],
    desc:'Render text on screen',
    toCode:(f)=>`TEXT(${smartVal(f.text||'')}) AT ${f.x||0},${f.y||0} SIZE ${f.size||16}` },
  
  // Game Physics/Collision
  { id:'g_collision',label:'Check Collision',icon:'💥', color:C.FLOW, category:'Physics',
    fields:[{name:'obj1',type:'text',placeholder:'player'},{name:'obj2',type:'text',placeholder:'enemy'}],
    desc:'Check if objects collide',
    toCode:(f)=>`IF COLLIDE(${f.obj1||'a'}, ${f.obj2||'b'}) { ... }` },
  { id:'g_velocity',label:'Set Velocity',   icon:'⚡', color:C.MATH, category:'Physics',
    fields:[{name:'object',type:'text',placeholder:'player'},{name:'vx',type:'text',placeholder:'5'},{name:'vy',type:'text',placeholder:'0'}],
    desc:'Set object speed/direction',
    toCode:(f)=>`VELOCITY ${f.object||'obj'} = (${f.vx||0}, ${f.vy||0})` },
  { id:'g_gravity', label:'Apply Gravity',  icon:'⬇️', color:C.MATH, category:'Physics',
    fields:[{name:'object',type:'text',placeholder:'player'},{name:'strength',type:'text',placeholder:'9.8'}],
    desc:'Apply gravity force',
    toCode:(f)=>`GRAVITY(${f.object||'obj'}, ${f.strength||9.8})` },
  
  // Game Input/Events
  { id:'g_keypress',label:'On Key Press',   icon:'⌨️', color:C.OUT, category:'Input',
    fields:[{name:'key',type:'text',placeholder:'up'},{name:'handler',type:'text',placeholder:'moveUp'}],
    desc:'Handle key press',
    isContainer:true,
    toCode:(f,ch,indent)=>`ON_KEY(${smartVal(f.key||'space')}) {\n${indent}${ch}\n${indent.slice(2)}}` },
  { id:'g_click',   label:'On Click',       icon:'👆', color:C.OUT, category:'Input',
    fields:[],
    desc:'Handle mouse click',
    isContainer:true,
    toCode:(f,ch,indent)=>`ON_CLICK {\n${indent}${ch}\n${indent.slice(2)}}` },
  { id:'g_touch',   label:'On Touch',       icon:'👆', color:C.OUT, category:'Input',
    fields:[],
    desc:'Handle touch event',
    isContainer:true,
    toCode:(f,ch,indent)=>`ON_TOUCH {\n${indent}${ch}\n${indent.slice(2)}}` },
  
  // Game Audio
  { id:'g_playsound',label:'Play Sound',    icon:'🔊', color:C.TIME, category:'Audio',
    fields:[{name:'file',type:'text',placeholder:'sound.mp3'}],
    desc:'Play sound effect',
    toCode:(f)=>`PLAY_SOUND(${smartVal(f.file||'sound.mp3')})` },
  { id:'g_music',   label:'Play Music',     icon:'🎵', color:C.TIME, category:'Audio',
    fields:[{name:'file',type:'text',placeholder:'music.mp3'},{name:'loop',type:'select',options:['true','false']}],
    desc:'Play background music',
    toCode:(f)=>`PLAY_MUSIC(${smartVal(f.file||'music.mp3')}, LOOP=${f.loop||'true'})` },
  { id:'g_stopsound',label:'Stop Sound',    icon:'🔇', color:C.TIME, category:'Audio',
    fields:[],
    desc:'Stop all sounds',
    toCode:()=>`STOP_SOUND()` },
  
  // Game State
  { id:'g_score',   label:'Update Score',   icon:'🏆', color:C.VAR, category:'State',
    fields:[{name:'amount',type:'text',placeholder:'10'}],
    desc:'Add to game score',
    toCode:(f)=>`SCORE += ${f.amount||1}` },
  { id:'g_health',  label:'Change Health',  icon:'❤️', color:C.VAR, category:'State',
    fields:[{name:'amount',type:'text',placeholder:'-10'}],
    desc:'Add/subtract health',
    toCode:(f)=>`HEALTH += ${f.amount||-1}` },
  { id:'g_level',   label:'Next Level',     icon:'⬆️', color:C.VAR, category:'State',
    fields:[],
    desc:'Advance to next level',
    toCode:()=>`NEXT_LEVEL()` },
  { id:'g_gameover',label:'Game Over',      icon:'💀', color:C.VAR, category:'State',
    fields:[{name:'message',type:'text',placeholder:'You lost!'}],
    desc:'End the game',
    toCode:(f)=>`GAME_OVER(${smartVal(f.message||'Game Over')})` },
  
  // Comments
  { id:'g_comment',label:'Comment',      icon:'💭', color:C.MISC, category:'Logic',
    fields:[{name:'text',type:'text',placeholder:'Notes here...'}],
    desc:'A comment',
    toCode:(f)=>`// ${f.text||''}` },

  // Custom Script Block
  { id:'g_custom', label:'Custom Script', icon:'✏️', color:C.MISC, category:'Custom',
    fields:[{name:'code',type:'text',placeholder:'Your code here'}],
    desc:'Write custom game code',
    toCode:(f)=>`${f.code||'// custom code'}` },
];

const LANG_BLOCKS = {
  js:        JS_BLOCKS,
  python:    PY_BLOCKS,
  html:      HTML_BLOCKS,
  buildgame: BUILD_GAME_BLOCKS,
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
  view: 'library', // 'library', 'editor', 'newproject', 'preferences', 'games'
  editorMode: 'blocks',
  searchQuery: '',
  blockPickerOpen: false,
  blockPickerCategory: 'All',
  blockPickerParentPath: null,
  selectedPath: null,
  runOutput: null,
  toast: null,
  expandedBlocks: new Set(),
  gameLibrary: [], // Array of games exported from Build Game projects
  currentGamePlaying: null, // ID of game being played
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
  else if (state.view==='games')       renderGamesTab(app);
  else if (state.view==='playing')     renderGamePlaying(app);

  // Add bottom navigation (except in editor and playing modes)
  if (state.view !== 'editor' && state.view !== 'newproject' && state.view !== 'preferences' && state.view !== 'playing') {
    renderBottomNav(app);
  }
}

function renderBottomNav(app) {
  const navHtml = `
  <div style="position:fixed;bottom:0;left:0;right:0;height:70px;background:var(--bg2);border-top:1px solid var(--border);display:flex;align-items:flex-end;z-index:30;padding-bottom:env(safe-area-inset-bottom)">
    <button id="nav-creator" style="flex:1;height:60px;background:none;border:none;color:var(--text);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;font-size:12px;font-weight:600">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
      </svg>
      Creator
    </button>
    <button id="nav-games" style="flex:1;height:60px;background:none;border:none;color:var(--text);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;font-size:12px;font-weight:600">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="6" y1="9" x2="6" y2="20"></line>
        <line x1="18" y1="9" x2="18" y2="20"></line>
        <path d="M6 20h12M9 9h6M9 5h2M13 5h2"></path>
      </svg>
      Games
    </button>
  </div>`;
  app.insertAdjacentHTML('beforeend', navHtml);
  
  app.querySelector('#nav-creator')?.addEventListener('click', () => { state.view = 'library'; render(); });
  app.querySelector('#nav-games')?.addEventListener('click', () => { state.view = 'games'; render(); });
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
  const LANG_COLORS = {js:'#f0c040',python:'#4fc3f7',html:'#ff7043',buildgame:'#66bb6a'};
  const LANG_LABELS = {js:'JavaScript',python:'Python',html:'HTML',buildgame:'Game'};

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
        ${[['js','⚡','JavaScript'],['python','🐍','Python'],['html','🌐','HTML'],['buildgame','🎮','Build Game']].map(([l,ic,lb])=>`
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
  const langLabel = {js:'JS',python:'PY',html:'HTML',buildgame:'GAME'}[project.lang]||'?';
  const isBuildGame = project.lang === 'buildgame';
  const spriteMode = state.editorMode === 'sprites';

  app.insertAdjacentHTML('beforeend', `
  <div class="header animate-fadein" id="editor-header">
    <button class="icon-btn" id="btn-back">←</button>
    <input class="proj-name-input" id="proj-name-live" value="${escHtml(project.name)}" maxlength="40">
    <div class="header-actions">
      <span class="lang-badge-sm">${langLabel}</span>
      ${isBuildGame ? `<button class="icon-btn" id="btn-add-library" title="Add to library">📚</button>` : ''}
      <button class="icon-btn run-btn" id="btn-run">▶</button>
    </div>
  </div>
  <div class="mode-toggle-bar animate-fadein" style="animation-delay:.04s">
    ${isBuildGame ? `
      <button class="mode-btn ${state.editorMode==='blocks'?'mode-active':''}" id="mode-blocks">🎮 Game Code</button>
      <button class="mode-btn ${state.editorMode==='sprites'?'mode-active':''}" id="mode-sprites">🎨 Sprites</button>
    ` : `
      <button class="mode-btn ${state.editorMode==='blocks'?'mode-active':''}" id="mode-blocks">🧩 Blocks</button>
      <button class="mode-btn ${state.editorMode==='code'?'mode-active':''}" id="mode-code">💻 Code</button>
    `}
  </div>
  <div class="editor-body" id="editor-body">
    ${spriteMode ? renderSpriteEditor(project) : (state.editorMode==='blocks' ? renderBlockCanvas(project) : renderCodeEditor(project))}
  </div>
  <div class="editor-fab-row animate-fadein" style="animation-delay:.1s">
    ${spriteMode ? '' : `<button class="fab" id="btn-add-block">+</button>`}
  </div>
  ${state.runOutput ? renderRunOutput(project) : ''}
  ${state.blockPickerOpen ? renderBlockPicker(project) : ''}`);

  app.querySelector('#btn-back')?.addEventListener('click', ()=>{ state.view='library'; render(); });
  app.querySelector('#proj-name-live')?.addEventListener('input', e=>{
    project.name=e.target.value; project.modified=Date.now(); saveProjects();
  });
  app.querySelector('#btn-add-library')?.addEventListener('click', () => {
    const inLibrary = Object.values(state.projects).some(p => p.id !== project.id && p._gameSourceId === project.id);
    if (inLibrary) {
      showToast('Already in library!', 'error');
    } else {
      project._addedToLibrary = true;
      project.modified = Date.now();
      saveProjects();
      showToast('Added to game library!');
    }
  });
  app.querySelector('#btn-run')?.addEventListener('click', ()=>{ state.runOutput=runProject(project); render(); });
  app.querySelector('#mode-blocks')?.addEventListener('click', ()=>{ state.editorMode='blocks'; render(); });
  app.querySelector('#mode-code')?.addEventListener('click', ()=>{ state.editorMode='code'; render(); });
  app.querySelector('#mode-sprites')?.addEventListener('click', ()=>{ state.editorMode='sprites'; render(); });
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

  if (!spriteMode) {
    setupBlockCanvasEvents(app, project);
    setupBlockPickerEvents(app, project);
  } else {
    setupSpriteEditorEvents(app, project);
  }
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

  // ===== DRAG AND DROP =====
  let draggedPath = null;
  let draggedBlock = null;

  // Make blocks draggable
  app.querySelectorAll('.block-item').forEach(el => {
    el.draggable = true;
    el.addEventListener('dragstart', (e) => {
      draggedPath = el.dataset.select?.split('-').map(Number);
      draggedBlock = draggedPath ? getBlockAt(project.blocks, draggedPath) : null;
      if (draggedBlock) {
        e.dataTransfer.effectAllowed = 'move';
        el.style.opacity = '0.6';
      }
    });

    el.addEventListener('dragend', (e) => {
      el.style.opacity = '1';
      draggedPath = null;
      draggedBlock = null;
    });

    el.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      el.style.borderTop = '2px solid var(--blue)';
    });

    el.addEventListener('dragleave', (e) => {
      el.style.borderTop = '';
    });

    el.addEventListener('drop', (e) => {
      e.preventDefault();
      el.style.borderTop = '';
      if (!draggedBlock || !draggedPath) return;
      
      const targetPath = el.dataset.select?.split('-').map(Number);
      if (!targetPath || draggedPath.join('-') === targetPath.join('-')) return;

      // Move block to new position
      deleteBlockAt(project.blocks, draggedPath);
      const target = targetPath.length > 0 ? getBlockAt(project.blocks, targetPath) : null;
      
      if (target?.isContainer && target?.children) {
        target.children.push(draggedBlock);
      } else {
        // Insert after target block in parent
        const parentPath = targetPath.slice(0, -1);
        const targetIndex = targetPath[targetPath.length - 1];
        if (parentPath.length === 0) {
          project.blocks.splice(targetIndex + 1, 0, draggedBlock);
        } else {
          const parent = getBlockAt(project.blocks, parentPath);
          if (!parent.children) parent.children = [];
          parent.children.splice(targetIndex + 1, 0, draggedBlock);
        }
      }
      
      project.modified = Date.now();
      saveProjects();
      render();
    });
  });

  // Block canvas drop zone (for blocks from picker)
  const canvas = app.querySelector('#block-canvas');
  if (canvas) {
    canvas.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });

    canvas.addEventListener('drop', (e) => {
      e.preventDefault();
      const blockId = e.dataTransfer.getData('blockId');
      if (!blockId) return;
      
      const def = LANG_BLOCKS[project.lang]?.find(b => b.id === blockId);
      if (!def) return;
      
      const newBlock = { id: def.id, fields: {}, children: [] };
      project.blocks.push(newBlock);
      project.modified = Date.now();
      saveProjects();
      state.blockPickerOpen = false;
      render();
    });
  }
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

  // Drag blocks from picker
  app.querySelectorAll('.picker-block-item').forEach(item => {
    item.draggable = true;
    item.addEventListener('dragstart', (e) => {
      const blockId = item.dataset.blockId;
      e.dataTransfer.effectAllowed = 'copy';
      e.dataTransfer.setData('blockId', blockId);
      e.dataTransfer.setData('blockDef', JSON.stringify((LANG_BLOCKS[project.lang]||[]).find(x=>x.id===blockId)));
      item.style.opacity = '0.5';
    });
    item.addEventListener('dragend', (e) => {
      item.style.opacity = '1';
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
//  SPRITE EDITOR (Vector Drawing for Build Game)
// ============================================================
function renderSpriteEditor(project) {
  if (!project._sprites) project._sprites = [];
  const spriteList = project._sprites.map((s,i) => `<div class="sprite-item" data-sprite-id="${i}">
    <div class="sprite-thumb" style="background: ${s.color||'#4a90e2'}; width: 40px; height: 40px; border-radius: 4px; border: 1px solid var(--border);"></div>
    <div style="flex: 1; font-size: 12px;">Sprite ${i+1}</div>
    <button class="sprite-del-btn" data-id="${i}" style="background: transparent; border: none; cursor: pointer; font-size: 12px; padding: 2px; color: #ff6b6b; font-weight: 600;">DEL</button>
  </div>`).join('');

  return `<div style="display: flex; height: 100%; flex-direction: column;">
    <div style="display: flex; gap: 10px; padding: 12px; border-bottom: 1px solid var(--border); flex-wrap: wrap; background: var(--bg2); align-items: center;">
      <button id="sprite-tool-brush" class="sprite-tool-btn active" title="Brush" style="font-size: 12px;">Brush</button>
      <button id="sprite-tool-line" class="sprite-tool-btn" title="Line" style="font-size: 12px;">Line</button>
      <button id="sprite-tool-rect" class="sprite-tool-btn" title="Rectangle" style="font-size: 12px;">Rect</button>
      <button id="sprite-tool-circle" class="sprite-tool-btn" title="Circle" style="font-size: 12px;">Circle</button>
      <button id="sprite-tool-hex" class="sprite-tool-btn" title="Hexagon" style="font-size: 12px;">Hex</button>
      <button id="sprite-tool-fill" class="sprite-tool-btn" title="Fill Bucket" style="font-size: 12px;">Fill</button>
      <button id="sprite-tool-text" class="sprite-tool-btn" title="Text" style="font-size: 12px;">Text</button>
      <div style="flex: 1;"></div>
      <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text2);">
        <input type="color" id="sprite-color" value="#4a90e2" title="Color" style="width: 32px; height: 32px; cursor: pointer; border-radius: 4px; border: 1px solid var(--border);">
      </label>
      <label style="display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--text2);">
        <input type="checkbox" id="sprite-outline" title="Outline"> Outline
      </label>
      <button id="sprite-clear-btn" style="background: #ff6b6b; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600;">Clear</button>
      <button id="sprite-new-btn" style="background: var(--blue); color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600;">+ New</button>
    </div>
    <div style="display: flex; flex: 1; gap: 10px; padding: 10px;">
      <canvas id="sprite-canvas" style="flex: 1; border: 1px solid var(--border); border-radius: 8px; background: white; cursor: crosshair;"></canvas>
      <div style="width: 120px; border: 1px solid var(--border); border-radius: 8px; overflow-y: auto; padding: 8px; background: var(--bg2);">
        <div style="font-size: 11px; font-weight: 700; margin-bottom: 10px; color: var(--text3);">SPRITES</div>
        ${spriteList}
      </div>
    </div>
  </div>`;
}

function setupSpriteEditorEvents(app, project) {
  const canvas = app.querySelector('#sprite-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!canvas) return;
  
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  
  let currentTool = 'brush';
  let isDrawing = false;
  let startX, startY;
  const drawColor = () => app.querySelector('#sprite-color')?.value || '#4a90e2';
  const hasOutline = () => app.querySelector('#sprite-outline')?.checked || false;
  
  // Draw current sprite on canvas
  function redrawCanvas() {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  redrawCanvas();
  
  app.querySelectorAll('.sprite-tool-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      app.querySelectorAll('.sprite-tool-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentTool = e.target.id.replace('sprite-tool-', '');
    });
  });
  
  canvas.addEventListener('mousedown', (e) => {
    if (currentTool === 'fill') return;
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
  });
  
  canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    redrawCanvas();
    ctx.strokeStyle = drawColor();
    ctx.fillStyle = drawColor();
    ctx.lineWidth = 2;
    
    if (currentTool === 'brush') {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI*2);
      ctx.fill();
    } else if (currentTool === 'rect') {
      const w = x - startX, h = y - startY;
      ctx.fillRect(startX, startY, w, h);
      if (hasOutline()) { ctx.strokeRect(startX, startY, w, h); }
    } else if (currentTool === 'circle') {
      const r = Math.sqrt((x-startX)**2 + (y-startY)**2);
      ctx.beginPath(); ctx.arc(startX, startY, r, 0, Math.PI*2);
      ctx.fill();
      if (hasOutline()) ctx.stroke();
    } else if (currentTool === 'line') {
      ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(x, y); ctx.stroke();
    }
  });
  
  canvas.addEventListener('mouseup', () => { isDrawing = false; });
  canvas.addEventListener('mouseleave', () => { isDrawing = false; });
  
  app.querySelector('#sprite-clear-btn')?.addEventListener('click', () => { redrawCanvas(); });
  app.querySelector('#sprite-new-btn')?.addEventListener('click', () => {
    if (!project._sprites) project._sprites = [];
    project._sprites.push({ color: drawColor(), data: canvas.toDataURL() });
    project.modified = Date.now();
    saveProjects();
    showToast('Sprite created!');
    render();
  });
  
  app.querySelectorAll('.sprite-del-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.dataset.id);
      project._sprites.splice(id, 1);
      project.modified = Date.now();
      saveProjects();
      render();
    });
  });
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
    // HTML Browser Imitator with topbar
    const browserHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
    body { margin: 0; padding: 0; background: #fff; font-family: system-ui; }
    .browser-topbar { background: #f0f0f0; border-bottom: 1px solid #ddd; padding: 10px 12px; display: flex; gap: 8px; align-items: center; height: 44px; }
    .browser-btn { width: 32px; height: 32px; border: 1px solid #ccc; background: #fff; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; }
    .browser-btn:hover { background: #f5f5f5; }
    .browser-btn:active { background: #e0e0e0; }
    .browser-search { flex: 1; background: white; border: 1px solid #ccc; border-radius: 20px; padding: 6px 12px; font-size: 13px; color: #666; }
    .browser-content { width: 100%; height: calc(100% - 44px); overflow: auto; }
    html, body { height: 100%; }
    svg { width: 18px; height: 18px; stroke: #333; stroke-width: 2; fill: none; }
    </style></head><body>
    <div class="browser-topbar">
      <button class="browser-btn" id="browser-back" title="Back"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button>
      <button class="browser-btn" id="browser-reload" title="Reload"><svg viewBox="0 0 24 24"><path d="M1 4v6h6M23 20v-6h-6" stroke="#333" stroke-width="2"/><path d="M20.3 5C18.8 3.4 16.6 2 14 2 8.5 2 4 6.5 4 12"/><path d="M3.7 19C5.2 20.6 7.4 22 10 22c5.5 0 10-4.5 10-10"/></svg></button>
      <input class="browser-search" placeholder="www.mypage.com" readonly>
    </div>
    <div class="browser-content" id="browser-content"></div>
    <script>
      const contentDiv = document.getElementById('browser-content');
      const backBtn = document.getElementById('browser-back');
      const reloadBtn = document.getElementById('browser-reload');
      
      function loadPage() {
        contentDiv.innerHTML = \`${code.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
        // Re-execute scripts if any
        contentDiv.querySelectorAll('script').forEach(script => {
          const newScript = document.createElement('script');
          newScript.textContent = script.textContent;
          contentDiv.appendChild(newScript);
        });
      }
      
      backBtn.onclick = () => window.history.back();
      reloadBtn.onclick = () => loadPage();
      loadPage();
    </script>
    </body></html>`;
    return { type: 'iframe', html: browserHtml };
  }
  if (lang === 'python' || lang === 'buildgame') {
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
  const lines = ['[Build.Make Simulator]', lang==='buildgame'?'Build Game (visual editor):':'Python (simulated — no runtime in browser):', '─'.repeat(40)];
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
  if (p.lang === 'buildgame') {
    // Game export - offer "Build.Make Game" (.json) format
    const gameData = { name: p.name, blocks: p.blocks, type: 'buildgame' };
    const blob = new Blob([JSON.stringify(gameData, null, 2)], {type: 'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (p.name.replace(/\s+/g, '_') || 'game') + '.buildgame';
    a.click();
    showToast('Game exported as .buildgame!');
  } else {
    // Regular project export
    const blob = new Blob([JSON.stringify(p, null, 2)], {type: 'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (p.name.replace(/\s+/g, '_') || 'project') + '.bdmproject';
    a.click();
    showToast('Project exported as .bdmproject!');
  }
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
      saveProjects(); render(); showToast('Project/Game imported!');
    } catch { showToast('Invalid file','error'); }
  };
  reader.readAsText(file);
}

// ============================================================
//  GAMES TAB
// ============================================================
function renderGamesTab(app) {
  const games = Object.values(state.projects).filter(p => p.lang === 'buildgame');
  
  const html = `
  <div class="header animate-fadein" id="games-header">
    <div class="header-logo">
      <span class="logo-dot"></span>
      <span class="logo-text">Build<span class="logo-dot-char">.</span>Make</span>
    </div>
    <div class="header-actions">
      <button class="icon-btn" id="btn-import-game">📥</button>
      <input type="file" id="import-game-input" accept=".buildgame" style="display:none">
    </div>
  </div>
  <div class="library-body animate-fadein" style="animation-delay:.06s;padding-bottom:100px">
    ${games.length === 0 
      ? `<div class="empty-state"><div class="empty-icon">🎮</div><p>No games yet.<br>Create one or import!</p></div>` 
      : `<div class="project-list" style="gap:16px;padding-top:20px">${games.map(g => `
        <div class="project-card animate-slidein" data-game-id="${g.id}" style="cursor:pointer;position:relative;overflow:hidden;transition:transform 0.2s">
          <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:var(--blue-glow);z-index:-1"></div>
          <div class="project-card-top">
            <div class="project-name" style="font-size:18px;margin-bottom:8px">${escHtml(g.name)}</div>
          </div>
          <div class="project-meta">🎮 Game · ${new Date(g.modified).toLocaleDateString('en-CA',{month:'short',day:'numeric'})}</div>
          <button class="btn-open btn-card" style="margin-top:12px;width:100%" data-play="${g.id}">▶ Play</button>
        </div>
      `).join('')}</div>`}
  </div>`;
  app.insertAdjacentHTML('beforeend', html);
  
  app.querySelector('#btn-import-game')?.addEventListener('click', () => app.querySelector('#import-game-input').click());
  app.querySelector('#import-game-input')?.addEventListener('change', e => { if(e.target.files[0]) importProject(e.target.files[0]); });
  app.querySelectorAll('[data-play]').forEach(btn => {
    btn.addEventListener('click', () => {
      const gameId = btn.dataset.play;
      state.currentGamePlaying = gameId;
      state.view = 'playing';
      render();
    });
  });
}

function renderGamePlaying(app) {
  const gameId = state.currentGamePlaying;
  const game = state.projects[gameId];
  if (!game || game.lang !== 'buildgame') { state.view = 'games'; render(); return; }
  
  const code = generateCode(game.blocks, 'buildgame');
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 100%; height: 100%; background: #1a1a1a; color: white; font-family: system-ui; display: flex; flex-direction: column; }
    .game-topbar { background: #0a0a0a; border-bottom: 1px solid #333; padding: 12px; display: flex; gap: 8px; }
    .game-btn { width: 32px; height: 32px; border: 1px solid #444; background: #222; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: white; }
    .game-btn:hover { background: #333; }
    .game-canvas { flex: 1; background: black; display: flex; align-items: center; justify-content: center; }
    #gameCanvas { max-width: 100%; max-height: 100%; }
    svg { width: 18px; height: 18px; stroke: white; stroke-width: 2; fill: none; }
  </style></head><body>
  <div class="game-topbar">
    <button class="game-btn" id="game-back"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button>
    <button class="game-btn" id="game-reload"><svg viewBox="0 0 24 24"><path d="M1 4v6h6M23 20v-6h-6" stroke="white" stroke-width="2"/><path d="M20.3 5C18.8 3.4 16.6 2 14 2 8.5 2 4 6.5 4 12"/><path d="M3.7 19C5.2 20.6 7.4 22 10 22c5.5 0 10-4.5 10-10"/></svg></button>
  </div>
  <div class="game-canvas">
    <canvas id="gameCanvas"></canvas>
  </div>
  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    
    // Inject game code
    ${code}
    
    document.getElementById('game-back').onclick = () => window.history.back();
    document.getElementById('game-reload').onclick = () => location.reload();
  </script>
  </body></html>`;

  app.insertAdjacentHTML('beforeend', `
  <div class="run-overlay animate-fadein">
    <div class="run-panel animate-slideup" style="height:100dvh;border-radius:0;bottom:0">
      <div class="run-panel-header">
        <span>🎮 ${escHtml(game.name)}</span>
        <button class="icon-btn" id="btn-close-game">✕</button>
      </div>
      <iframe class="run-iframe" sandbox="allow-scripts" srcdoc="${escAttr(html)}" style="border-radius:0"></iframe>
    </div>
  </div>`);
  
  app.querySelector('#btn-close-game')?.addEventListener('click', () => { state.currentGamePlaying = null; state.view = 'games'; render(); });
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