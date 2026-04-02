// ============================================================
//  Build.Make — app.js
// ============================================================

// ---------- Block Definitions (30+ commands) ----------
const BLOCK_CATEGORIES = {
  "Variables": [
    {
      id: "var_set", label: "Set Variable", icon: "📦",
      color: "#1565c0",
      fields: [
        { name: "name", type: "text", placeholder: "myVar" },
        { name: "value", type: "text", placeholder: "value" }
      ],
      desc: "Create or update a variable",
      toJS: (f) => `let ${f.name || 'myVar'} = ${isNaN(f.value) ? `"${f.value}"` : f.value};`,
      toPY: (f) => `${f.name || 'my_var'} = ${isNaN(f.value) ? `"${f.value}"` : f.value}`,
    },
    {
      id: "var_log", label: "Log Variable", icon: "🖨️",
      color: "#1565c0",
      fields: [{ name: "name", type: "text", placeholder: "myVar" }],
      desc: "Print variable to console",
      toJS: (f) => `console.log(${f.name || 'myVar'});`,
      toPY: (f) => `print(${f.name || 'my_var'})`,
    },
    {
      id: "var_inc", label: "Increment", icon: "➕",
      color: "#1565c0",
      fields: [
        { name: "name", type: "text", placeholder: "counter" },
        { name: "by", type: "text", placeholder: "1" }
      ],
      desc: "Increase variable by amount",
      toJS: (f) => `${f.name || 'counter'} += ${f.by || 1};`,
      toPY: (f) => `${f.name || 'counter'} += ${f.by || 1}`,
    },
    {
      id: "var_dec", label: "Decrement", icon: "➖",
      color: "#1565c0",
      fields: [
        { name: "name", type: "text", placeholder: "counter" },
        { name: "by", type: "text", placeholder: "1" }
      ],
      desc: "Decrease variable by amount",
      toJS: (f) => `${f.name || 'counter'} -= ${f.by || 1};`,
      toPY: (f) => `${f.name || 'counter'} -= ${f.by || 1}`,
    }
  ],
  "Output": [
    {
      id: "print", label: "Print", icon: "💬",
      color: "#00695c",
      fields: [{ name: "text", type: "text", placeholder: "Hello, world!" }],
      desc: "Print a message",
      toJS: (f) => `console.log("${f.text || 'Hello, world!'}");`,
      toPY: (f) => `print("${f.text || 'Hello, world!'}")`,
    },
    {
      id: "alert", label: "Alert", icon: "🔔",
      color: "#00695c",
      fields: [{ name: "text", type: "text", placeholder: "Message!" }],
      desc: "Show a popup alert (JS only)",
      toJS: (f) => `alert("${f.text || 'Message!'}");`,
      toPY: (f) => `# alert("${f.text}") — not available in Python`,
    },
    {
      id: "html_write", label: "Write to Page", icon: "📝",
      color: "#00695c",
      fields: [{ name: "html", type: "text", placeholder: "<h1>Hi</h1>" }],
      desc: "Inject HTML into the page",
      toJS: (f) => `document.body.innerHTML += \`${f.html || '<h1>Hi</h1>'}\`;`,
      toPY: (f) => `# Not available in Python`,
    },
    {
      id: "clear_console", label: "Clear Console", icon: "🧹",
      color: "#00695c",
      fields: [],
      desc: "Clear the console output",
      toJS: () => `console.clear();`,
      toPY: () => `import os; os.system('cls' if os.name == 'nt' else 'clear')`,
    }
  ],
  "Control Flow": [
    {
      id: "if_block", label: "If", icon: "❓",
      color: "#6a1b9a",
      fields: [{ name: "condition", type: "text", placeholder: "x > 0" }],
      desc: "Conditional block",
      toJS: (f) => `if (${f.condition || 'true'}) {`,
      toPY: (f) => `if ${f.condition || 'True'}:`,
    },
    {
      id: "else_block", label: "Else", icon: "↩️",
      color: "#6a1b9a",
      fields: [],
      desc: "Else branch",
      toJS: () => `} else {`,
      toPY: () => `else:`,
    },
    {
      id: "end_block", label: "End Block", icon: "🔚",
      color: "#6a1b9a",
      fields: [],
      desc: "Close a block (JS only)",
      toJS: () => `}`,
      toPY: () => `# (Python uses indentation — no end block needed)`,
    },
    {
      id: "for_loop", label: "For Loop", icon: "🔁",
      color: "#6a1b9a",
      fields: [
        { name: "var", type: "text", placeholder: "i" },
        { name: "from", type: "text", placeholder: "0" },
        { name: "to", type: "text", placeholder: "10" }
      ],
      desc: "Loop from start to end",
      toJS: (f) => `for (let ${f.var||'i'} = ${f.from||0}; ${f.var||'i'} < ${f.to||10}; ${f.var||'i'}++) {`,
      toPY: (f) => `for ${f.var||'i'} in range(${f.from||0}, ${f.to||10}):`,
    },
    {
      id: "while_loop", label: "While Loop", icon: "🔄",
      color: "#6a1b9a",
      fields: [{ name: "condition", type: "text", placeholder: "x < 10" }],
      desc: "Loop while condition is true",
      toJS: (f) => `while (${f.condition || 'true'}) {`,
      toPY: (f) => `while ${f.condition || 'True'}:`,
    },
    {
      id: "break", label: "Break", icon: "⛔",
      color: "#6a1b9a",
      fields: [],
      desc: "Break out of a loop",
      toJS: () => `break;`,
      toPY: () => `break`,
    },
    {
      id: "continue", label: "Continue", icon: "⏭️",
      color: "#6a1b9a",
      fields: [],
      desc: "Skip to next iteration",
      toJS: () => `continue;`,
      toPY: () => `continue`,
    }
  ],
  "Functions": [
    {
      id: "func_def", label: "Define Function", icon: "🧩",
      color: "#b71c1c",
      fields: [
        { name: "name", type: "text", placeholder: "myFunction" },
        { name: "params", type: "text", placeholder: "a, b" }
      ],
      desc: "Declare a function",
      toJS: (f) => `function ${f.name||'myFunction'}(${f.params||''}) {`,
      toPY: (f) => `def ${f.name||'my_function'}(${f.params||''}):`,
    },
    {
      id: "func_call", label: "Call Function", icon: "📞",
      color: "#b71c1c",
      fields: [
        { name: "name", type: "text", placeholder: "myFunction" },
        { name: "args", type: "text", placeholder: "1, 2" }
      ],
      desc: "Invoke a function",
      toJS: (f) => `${f.name||'myFunction'}(${f.args||''});`,
      toPY: (f) => `${f.name||'my_function'}(${f.args||''})`,
    },
    {
      id: "return", label: "Return", icon: "↪️",
      color: "#b71c1c",
      fields: [{ name: "value", type: "text", placeholder: "result" }],
      desc: "Return a value from a function",
      toJS: (f) => `return ${f.value || ''};`,
      toPY: (f) => `return ${f.value || ''}`,
    },
    {
      id: "arrow_func", label: "Arrow Function", icon: "➡️",
      color: "#b71c1c",
      fields: [
        { name: "name", type: "text", placeholder: "fn" },
        { name: "params", type: "text", placeholder: "x" },
        { name: "body", type: "text", placeholder: "x * 2" }
      ],
      desc: "Short arrow function (JS only)",
      toJS: (f) => `const ${f.name||'fn'} = (${f.params||'x'}) => ${f.body||'x'};`,
      toPY: (f) => `${f.name||'fn'} = lambda ${f.params||'x'}: ${f.body||'x'}`,
    }
  ],
  "Arrays / Lists": [
    {
      id: "array_create", label: "Create Array", icon: "📋",
      color: "#e65100",
      fields: [
        { name: "name", type: "text", placeholder: "myList" },
        { name: "values", type: "text", placeholder: "1, 2, 3" }
      ],
      desc: "Create an array/list",
      toJS: (f) => `let ${f.name||'myList'} = [${f.values||''}];`,
      toPY: (f) => `${f.name||'my_list'} = [${f.values||''}]`,
    },
    {
      id: "array_push", label: "Push to Array", icon: "➕",
      color: "#e65100",
      fields: [
        { name: "array", type: "text", placeholder: "myList" },
        { name: "value", type: "text", placeholder: "42" }
      ],
      desc: "Add item to end of array",
      toJS: (f) => `${f.array||'myList'}.push(${f.value||''});`,
      toPY: (f) => `${f.array||'my_list'}.append(${f.value||''})`,
    },
    {
      id: "array_pop", label: "Pop from Array", icon: "⬆️",
      color: "#e65100",
      fields: [{ name: "array", type: "text", placeholder: "myList" }],
      desc: "Remove last item",
      toJS: (f) => `${f.array||'myList'}.pop();`,
      toPY: (f) => `${f.array||'my_list'}.pop()`,
    },
    {
      id: "array_length", label: "Array Length", icon: "📏",
      color: "#e65100",
      fields: [
        { name: "result", type: "text", placeholder: "len" },
        { name: "array", type: "text", placeholder: "myList" }
      ],
      desc: "Get length of array",
      toJS: (f) => `let ${f.result||'len'} = ${f.array||'myList'}.length;`,
      toPY: (f) => `${f.result||'len'} = len(${f.array||'my_list'})`,
    }
  ],
  "Math": [
    {
      id: "math_op", label: "Math Operation", icon: "🔢",
      color: "#1a237e",
      fields: [
        { name: "result", type: "text", placeholder: "result" },
        { name: "a", type: "text", placeholder: "10" },
        { name: "op", type: "select", options: ["+", "-", "*", "/", "%", "**"], placeholder: "+" },
        { name: "b", type: "text", placeholder: "5" }
      ],
      desc: "Arithmetic between two values",
      toJS: (f) => `let ${f.result||'result'} = ${f.a||0} ${f.op||'+'} ${f.b||0};`,
      toPY: (f) => `${f.result||'result'} = ${f.a||0} ${f.op||'+'} ${f.b||0}`,
    },
    {
      id: "math_random", label: "Random Number", icon: "🎲",
      color: "#1a237e",
      fields: [
        { name: "result", type: "text", placeholder: "rand" },
        { name: "min", type: "text", placeholder: "0" },
        { name: "max", type: "text", placeholder: "100" }
      ],
      desc: "Generate random integer in range",
      toJS: (f) => `let ${f.result||'rand'} = Math.floor(Math.random() * (${f.max||100} - ${f.min||0} + 1)) + ${f.min||0};`,
      toPY: (f) => `import random\n${f.result||'rand'} = random.randint(${f.min||0}, ${f.max||100})`,
    },
    {
      id: "math_round", label: "Round", icon: "⭕",
      color: "#1a237e",
      fields: [
        { name: "result", type: "text", placeholder: "rounded" },
        { name: "value", type: "text", placeholder: "3.7" }
      ],
      desc: "Round a number",
      toJS: (f) => `let ${f.result||'rounded'} = Math.round(${f.value||0});`,
      toPY: (f) => `${f.result||'rounded'} = round(${f.value||0})`,
    }
  ],
  "Strings": [
    {
      id: "str_concat", label: "Concatenate", icon: "🔗",
      color: "#004d40",
      fields: [
        { name: "result", type: "text", placeholder: "full" },
        { name: "a", type: "text", placeholder: "Hello " },
        { name: "b", type: "text", placeholder: "World" }
      ],
      desc: "Join two strings",
      toJS: (f) => `let ${f.result||'full'} = "${f.a||''}" + "${f.b||''}";`,
      toPY: (f) => `${f.result||'full'} = "${f.a||''}" + "${f.b||''}"`,
    },
    {
      id: "str_length", label: "String Length", icon: "📐",
      color: "#004d40",
      fields: [
        { name: "result", type: "text", placeholder: "len" },
        { name: "str", type: "text", placeholder: "hello" }
      ],
      desc: "Get length of a string",
      toJS: (f) => `let ${f.result||'len'} = "${f.str||''}".length;`,
      toPY: (f) => `${f.result||'len'} = len("${f.str||''}")`,
    },
    {
      id: "str_upper", label: "To Uppercase", icon: "🔠",
      color: "#004d40",
      fields: [
        { name: "result", type: "text", placeholder: "up" },
        { name: "str", type: "text", placeholder: "hello" }
      ],
      desc: "Uppercase a string",
      toJS: (f) => `let ${f.result||'up'} = "${f.str||''}".toUpperCase();`,
      toPY: (f) => `${f.result||'up'} = "${f.str||''}".upper()`,
    },
    {
      id: "str_lower", label: "To Lowercase", icon: "🔡",
      color: "#004d40",
      fields: [
        { name: "result", type: "text", placeholder: "lo" },
        { name: "str", type: "text", placeholder: "HELLO" }
      ],
      desc: "Lowercase a string",
      toJS: (f) => `let ${f.result||'lo'} = "${f.str||''}".toLowerCase();`,
      toPY: (f) => `${f.result||'lo'} = "${f.str||''}".lower()`,
    }
  ],
  "DOM": [
    {
      id: "dom_get", label: "Get Element", icon: "🎯",
      color: "#33691e",
      fields: [
        { name: "varname", type: "text", placeholder: "el" },
        { name: "selector", type: "text", placeholder: "#myId" }
      ],
      desc: "Select a DOM element",
      toJS: (f) => `let ${f.varname||'el'} = document.querySelector("${f.selector||'#id'}");`,
      toPY: (f) => `# DOM not available in Python`,
    },
    {
      id: "dom_set_text", label: "Set Text", icon: "✏️",
      color: "#33691e",
      fields: [
        { name: "selector", type: "text", placeholder: "#myId" },
        { name: "text", type: "text", placeholder: "New content" }
      ],
      desc: "Set element inner text",
      toJS: (f) => `document.querySelector("${f.selector||'#id'}").innerText = "${f.text||''}";`,
      toPY: (f) => `# DOM not available in Python`,
    },
    {
      id: "dom_style", label: "Set Style", icon: "🎨",
      color: "#33691e",
      fields: [
        { name: "selector", type: "text", placeholder: "#myId" },
        { name: "prop", type: "text", placeholder: "color" },
        { name: "value", type: "text", placeholder: "red" }
      ],
      desc: "Set a CSS style on an element",
      toJS: (f) => `document.querySelector("${f.selector||'#id'}").style.${f.prop||'color'} = "${f.value||''}";`,
      toPY: (f) => `# DOM not available in Python`,
    },
    {
      id: "dom_event", label: "Add Event Listener", icon: "👂",
      color: "#33691e",
      fields: [
        { name: "selector", type: "text", placeholder: "#btn" },
        { name: "event", type: "text", placeholder: "click" },
        { name: "handler", type: "text", placeholder: "myFunction" }
      ],
      desc: "Listen for events on an element",
      toJS: (f) => `document.querySelector("${f.selector||'#btn'}").addEventListener("${f.event||'click'}", ${f.handler||'myFunction'});`,
      toPY: (f) => `# DOM not available in Python`,
    }
  ],
  "Comments": [
    {
      id: "comment", label: "Comment", icon: "💭",
      color: "#455a64",
      fields: [{ name: "text", type: "text", placeholder: "This does something..." }],
      desc: "Add a code comment",
      toJS: (f) => `// ${f.text||'comment'}`,
      toPY: (f) => `# ${f.text||'comment'}`,
    },
    {
      id: "comment_block", label: "Block Comment", icon: "📄",
      color: "#455a64",
      fields: [{ name: "text", type: "text", placeholder: "Multi-line description..." }],
      desc: "Multi-line comment block",
      toJS: (f) => `/*\n  ${f.text||'block comment'}\n*/`,
      toPY: (f) => `"""\n${f.text||'block comment'}\n"""`,
    }
  ]
};

// Flatten all blocks for search
const ALL_BLOCKS = Object.entries(BLOCK_CATEGORIES).flatMap(([cat, blocks]) =>
  blocks.map(b => ({ ...b, category: cat }))
);

// ---------- State ----------
let state = {
  theme: 'dark',
  projects: {},
  currentProject: null,
  view: 'library',  // 'library' | 'editor'
  editorMode: 'blocks', // 'blocks' | 'code'
  searchQuery: '',
  blockPickerOpen: false,
  blockPickerCategory: 'All',
  selectedBlockIdx: null,
  runOutput: null,
  toast: null
};

// ---------- Storage ----------
const STORAGE_KEY = 'builddotmake_projects';
const PREFS_KEY = 'builddotmake_prefs';

function saveProjects() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.projects));
}
function loadProjects() {
  try {
    const d = localStorage.getItem(STORAGE_KEY);
    if (d) state.projects = JSON.parse(d);
  } catch(e) {}
}
function savePrefs() {
  localStorage.setItem(PREFS_KEY, JSON.stringify({ theme: state.theme }));
}
function loadPrefs() {
  try {
    const d = localStorage.getItem(PREFS_KEY);
    if (d) { const p = JSON.parse(d); state.theme = p.theme || 'dark'; }
  } catch(e) {}
}
function newProject(name, lang) {
  const id = 'p_' + Date.now();
  state.projects[id] = {
    id, name, lang,
    created: Date.now(),
    modified: Date.now(),
    blocks: [],
    code: ''
  };
  saveProjects();
  return id;
}
function deleteProject(id) {
  delete state.projects[id];
  saveProjects();
}

// ---------- Code Generation ----------
function blocksToCode(blocks, lang) {
  return blocks.map(b => {
    const def = ALL_BLOCKS.find(x => x.id === b.id);
    if (!def) return '';
    const fn = lang === 'python' ? def.toPY : def.toJS;
    return fn ? fn(b.fields || {}) : '';
  }).filter(Boolean).join('\n');
}

// ---------- Run Engine ----------
function runProject(project) {
  const lang = project.lang;
  let code = state.view === 'editor'
    ? (state.editorMode === 'code'
        ? document.getElementById('code-editor')?.value || ''
        : blocksToCode(project.blocks, lang))
    : '';

  if (lang === 'python' || lang === 'generic') {
    return { type: 'console', output: simulatePython(code, project.blocks) };
  }
  // JS / HTML
  const html = lang === 'html'
    ? code
    : `<!DOCTYPE html><html><head><style>body{background:#111;color:#eee;font-family:monospace;padding:12px}</style></head><body><script>
const _log = [];
const _origLog = console.log;
console.log = (...a) => { _log.push(a.map(String).join(' ')); _origLog(...a); document.getElementById('__out')?.insertAdjacentHTML('beforeend','<div>'+a.map(String).join(' ')+'</div>'); };
try {
${code}
} catch(e) { document.body.insertAdjacentHTML('beforeend','<div style="color:#ff5252">Error: '+e.message+'</div>'); }
<\/script><div id="__out"></div></body></html>`;

  return { type: 'iframe', html };
}

function simulatePython(code, blocks) {
  // Simulated output for Python/generic (can't exec in browser)
  let out = ['[Build.Make] Simulated Python output:\n'];
  blocks.forEach(b => {
    const def = ALL_BLOCKS.find(x => x.id === b.id);
    if (!def) return;
    if (b.id === 'print') out.push(`> ${b.fields?.text || ''}`);
    if (b.id === 'var_set') out.push(`> ${b.fields?.name} = ${b.fields?.value}`);
    if (b.id === 'var_log') out.push(`> [log] ${b.fields?.name}`);
    if (b.id === 'comment') out.push(`# ${b.fields?.text}`);
  });
  if (out.length === 1) out.push('(No output blocks found)');
  return out.join('\n');
}

// ---------- Export / Import ----------
function exportProject(id) {
  const p = state.projects[id];
  const blob = new Blob([JSON.stringify(p, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = (p.name.replace(/\s+/g,'_') || 'project') + '.bdmproject';
  a.click();
}
function importProject(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const p = JSON.parse(e.target.result);
      p.id = 'p_' + Date.now();
      p.name = (p.name || 'Imported') + ' (imported)';
      state.projects[p.id] = p;
      saveProjects();
      render();
      showToast('Project imported!');
    } catch {
      showToast('Invalid .bdmproject file', 'error');
    }
  };
  reader.readAsText(file);
}

// ---------- Toast ----------
function showToast(msg, type='success') {
  state.toast = { msg, type };
  render();
  setTimeout(() => { state.toast = null; render(); }, 2200);
}

// ---------- Render ----------
function render() {
  const app = document.getElementById('app');
  if (!app) return;
  const dark = state.theme === 'dark';
  document.body.className = dark ? 'dark' : 'light';
  app.innerHTML = '';

  // Toast
  if (state.toast) {
    const t = document.createElement('div');
    t.className = 'toast ' + (state.toast.type === 'error' ? 'toast-err' : 'toast-ok');
    t.textContent = state.toast.msg;
    app.appendChild(t);
    requestAnimationFrame(() => t.classList.add('toast-in'));
  }

  if (state.view === 'library') renderLibrary(app);
  else if (state.view === 'editor') renderEditor(app);
  else if (state.view === 'newproject') renderNewProject(app);
  else if (state.view === 'preferences') renderPreferences(app);
}

// ---------- Library View ----------
function renderLibrary(app) {
  const projects = Object.values(state.projects).sort((a,b) => b.modified - a.modified);

  app.insertAdjacentHTML('beforeend', `
    <div class="header animate-fadein">
      <div class="header-logo">
        <span class="logo-dot"></span>
        <span class="logo-text">Build<span class="logo-dot-char">.</span>Make</span>
      </div>
      <div class="header-actions">
        <button class="icon-btn" id="btn-prefs" aria-label="Preferences">⚙️</button>
        <button class="icon-btn" id="btn-import" aria-label="Import">📥</button>
        <input type="file" id="import-input" accept=".bdmproject" style="display:none">
      </div>
    </div>

    <div class="library-body animate-fadein" style="animation-delay:.06s">
      <div class="library-title-row">
        <h2 class="library-title">My Projects</h2>
        <button class="btn-primary" id="btn-new">+ New</button>
      </div>
      <div class="project-list" id="project-list">
        ${projects.length === 0 ? `<div class="empty-state">
          <div class="empty-icon">🧱</div>
          <p>No projects yet.<br>Tap <b>+ New</b> to start building.</p>
        </div>` : ''}
        ${projects.map(p => renderProjectCard(p)).join('')}
      </div>
    </div>
  `);

  document.getElementById('btn-prefs')?.addEventListener('click', () => { state.view = 'preferences'; render(); });
  document.getElementById('btn-new')?.addEventListener('click', () => { state.view = 'newproject'; render(); });
  document.getElementById('btn-import')?.addEventListener('click', () => document.getElementById('import-input').click());
  document.getElementById('import-input')?.addEventListener('change', e => { if(e.target.files[0]) importProject(e.target.files[0]); });

  document.querySelectorAll('.project-card').forEach(card => {
    const id = card.dataset.id;
    card.querySelector('.btn-open')?.addEventListener('click', () => openEditor(id));
    card.querySelector('.btn-export')?.addEventListener('click', () => exportProject(id));
    card.querySelector('.btn-delete')?.addEventListener('click', () => {
      if (confirm('Delete this project?')) { deleteProject(id); render(); }
    });
  });
}

function renderProjectCard(p) {
  const langLabel = { js: 'JavaScript', python: 'Python', html: 'HTML', generic: 'Generic' }[p.lang] || p.lang;
  const langColor = { js: '#f0c040', python: '#4fc3f7', html: '#ff7043', generic: '#b0bec5' }[p.lang] || '#607d8b';
  const d = new Date(p.modified);
  const dateStr = d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
  return `
  <div class="project-card animate-slidein" data-id="${p.id}">
    <div class="project-card-top">
      <div class="project-name">${escHtml(p.name)}</div>
      <span class="lang-badge" style="color:${langColor};border-color:${langColor}">${langLabel}</span>
    </div>
    <div class="project-meta">${p.blocks?.length || 0} blocks · ${dateStr}</div>
    <div class="project-actions">
      <button class="btn-open btn-card">Open</button>
      <button class="btn-export btn-card btn-ghost">Export</button>
      <button class="btn-delete btn-card btn-danger">Delete</button>
    </div>
  </div>`;
}

// ---------- New Project View ----------
function renderNewProject(app) {
  app.insertAdjacentHTML('beforeend', `
    <div class="header animate-fadein">
      <button class="icon-btn" id="btn-back">←</button>
      <span class="header-title">New Project</span>
    </div>
    <div class="form-page animate-fadein" style="animation-delay:.06s">
      <div class="form-group">
        <label>Project Name</label>
        <input class="input-field" id="proj-name" placeholder="My Awesome App" autocomplete="off" maxlength="40">
      </div>
      <div class="form-group">
        <label>Language</label>
        <div class="lang-picker" id="lang-picker">
          ${['js','python','html','generic'].map(l => `
            <div class="lang-option ${l==='js'?'selected':''}" data-lang="${l}">
              <span class="lang-option-icon">${{js:'⚡',python:'🐍',html:'🌐',generic:'🔧'}[l]}</span>
              <span>${{js:'JavaScript',python:'Python',html:'HTML',generic:'Generic'}[l]}</span>
            </div>`).join('')}
        </div>
      </div>
      <button class="btn-primary btn-full" id="btn-create">Create Project</button>
    </div>
  `);

  let selectedLang = 'js';
  document.querySelectorAll('.lang-option').forEach(el => {
    el.addEventListener('click', () => {
      selectedLang = el.dataset.lang;
      document.querySelectorAll('.lang-option').forEach(x => x.classList.remove('selected'));
      el.classList.add('selected');
    });
  });
  document.getElementById('btn-back')?.addEventListener('click', () => { state.view = 'library'; render(); });
  document.getElementById('btn-create')?.addEventListener('click', () => {
    const name = document.getElementById('proj-name')?.value.trim();
    if (!name) { showToast('Enter a project name', 'error'); return; }
    const id = newProject(name, selectedLang);
    openEditor(id);
  });
  document.getElementById('proj-name')?.focus();
}

// ---------- Editor View ----------
function openEditor(id) {
  state.currentProject = id;
  state.view = 'editor';
  state.blockPickerOpen = false;
  state.selectedBlockIdx = null;
  state.runOutput = null;
  render();
}

function renderEditor(app) {
  const project = state.projects[state.currentProject];
  if (!project) { state.view = 'library'; render(); return; }

  const langLabel = { js: 'JS', python: 'PY', html: 'HTML', generic: 'BDM' }[project.lang] || '?';
  const code = blocksToCode(project.blocks, project.lang);

  app.insertAdjacentHTML('beforeend', `
    <div class="header animate-fadein" id="editor-header">
      <button class="icon-btn" id="btn-back">←</button>
      <input class="proj-name-input" id="proj-name-live" value="${escHtml(project.name)}" maxlength="40">
      <div class="header-actions">
        <span class="lang-badge-sm">${langLabel}</span>
        <button class="icon-btn run-btn" id="btn-run" title="Run">▶</button>
      </div>
    </div>

    <div class="mode-toggle-bar animate-fadein" style="animation-delay:.04s">
      <button class="mode-btn ${state.editorMode==='blocks'?'mode-active':''}" id="mode-blocks">🧩 Blocks</button>
      <button class="mode-btn ${state.editorMode==='code'?'mode-active':''}" id="mode-code">💻 Code</button>
    </div>

    <div class="editor-body" id="editor-body">
      ${state.editorMode === 'blocks' ? renderBlockCanvas(project) : renderCodeEditor(project, code)}
    </div>

    <div class="editor-fab-row animate-fadein" style="animation-delay:.1s">
      <button class="fab" id="btn-add-block" title="Add block">+</button>
    </div>

    ${state.runOutput ? renderRunOutput(project) : ''}
    ${state.blockPickerOpen ? renderBlockPicker() : ''}
  `);

  // Header events
  document.getElementById('btn-back')?.addEventListener('click', () => { state.view='library'; render(); });
  document.getElementById('proj-name-live')?.addEventListener('input', e => {
    project.name = e.target.value;
    project.modified = Date.now();
    saveProjects();
  });
  document.getElementById('btn-run')?.addEventListener('click', () => {
    const result = runProject(project);
    state.runOutput = result;
    render();
  });
  document.getElementById('mode-blocks')?.addEventListener('click', () => { state.editorMode='blocks'; render(); });
  document.getElementById('mode-code')?.addEventListener('click', () => { state.editorMode='code'; render(); });
  document.getElementById('btn-add-block')?.addEventListener('click', () => {
    state.blockPickerOpen = true;
    render();
  });

  // Code editor sync
  document.getElementById('code-editor')?.addEventListener('input', e => {
    project.code = e.target.value;
    project.modified = Date.now();
    saveProjects();
  });

  // Block canvas events
  setupBlockCanvasEvents(project);

  // Block picker events
  setupBlockPickerEvents(project);

  // Run output events
  document.getElementById('btn-close-run')?.addEventListener('click', () => { state.runOutput = null; render(); });
}

function renderBlockCanvas(project) {
  if (!project.blocks.length) {
    return `<div class="canvas-empty" id="canvas-empty">
      <div class="canvas-empty-icon">🧩</div>
      <p>Tap <b>+</b> to add your first block</p>
    </div>`;
  }
  return `<div class="block-canvas" id="block-canvas">
    ${project.blocks.map((b, i) => renderBlock(b, i)).join('')}
  </div>`;
}

function renderBlock(b, i) {
  const def = ALL_BLOCKS.find(x => x.id === b.id);
  if (!def) return '';
  const selected = state.selectedBlockIdx === i;
  const fieldsHtml = (def.fields || []).map(f => {
    if (f.type === 'select') {
      return `<select class="block-field-select" data-field="${f.name}" data-idx="${i}">
        ${(f.options||[]).map(o => `<option value="${o}" ${b.fields?.[f.name]===o?'selected':''}>${o}</option>`).join('')}
      </select>`;
    }
    return `<input class="block-field" type="text" placeholder="${f.placeholder||''}" 
      value="${escHtml(b.fields?.[f.name]||'')}" data-field="${f.name}" data-idx="${i}">`;
  }).join('');
  return `
  <div class="block-item ${selected?'block-selected':''} animate-blockslide" data-idx="${i}" style="--block-color:${def.color}">
    <div class="block-header" data-idx="${i}" data-action="select">
      <span class="block-icon">${def.icon}</span>
      <span class="block-label">${def.label}</span>
      <span class="block-cat-badge">${def.category}</span>
      <div class="block-drag-actions">
        <button class="block-action-btn" data-idx="${i}" data-action="up" title="Move up">↑</button>
        <button class="block-action-btn" data-idx="${i}" data-action="down" title="Move down">↓</button>
        <button class="block-action-btn block-del" data-idx="${i}" data-action="delete" title="Delete">✕</button>
      </div>
    </div>
    ${def.fields?.length ? `<div class="block-fields ${selected?'block-fields-open':''}">${fieldsHtml}</div>` : ''}
  </div>`;
}

function setupBlockCanvasEvents(project) {
  document.querySelectorAll('[data-action="select"]').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.dataset.action && e.target.dataset.action !== 'select') return;
      const idx = parseInt(el.dataset.idx);
      state.selectedBlockIdx = state.selectedBlockIdx === idx ? null : idx;
      render();
    });
  });
  document.querySelectorAll('[data-action="up"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx);
      if (idx > 0) {
        [project.blocks[idx-1], project.blocks[idx]] = [project.blocks[idx], project.blocks[idx-1]];
        saveProjects();
        state.selectedBlockIdx = idx-1;
        render();
      }
    });
  });
  document.querySelectorAll('[data-action="down"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx);
      if (idx < project.blocks.length-1) {
        [project.blocks[idx], project.blocks[idx+1]] = [project.blocks[idx+1], project.blocks[idx]];
        saveProjects();
        state.selectedBlockIdx = idx+1;
        render();
      }
    });
  });
  document.querySelectorAll('[data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx);
      project.blocks.splice(idx, 1);
      saveProjects();
      state.selectedBlockIdx = null;
      render();
    });
  });
  document.querySelectorAll('.block-field').forEach(input => {
    input.addEventListener('input', e => {
      const idx = parseInt(e.target.dataset.idx);
      const field = e.target.dataset.field;
      if (!project.blocks[idx].fields) project.blocks[idx].fields = {};
      project.blocks[idx].fields[field] = e.target.value;
      project.modified = Date.now();
      saveProjects();
    });
  });
  document.querySelectorAll('.block-field-select').forEach(sel => {
    sel.addEventListener('change', e => {
      const idx = parseInt(e.target.dataset.idx);
      const field = e.target.dataset.field;
      if (!project.blocks[idx].fields) project.blocks[idx].fields = {};
      project.blocks[idx].fields[field] = e.target.value;
      project.modified = Date.now();
      saveProjects();
    });
  });
}

function renderCodeEditor(project, code) {
  return `<div class="code-editor-wrap">
    <textarea id="code-editor" class="code-editor" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off">${escHtml(state.editorMode === 'code' && project.code ? project.code : code)}</textarea>
  </div>`;
}

// ---------- Block Picker ----------
function renderBlockPicker() {
  const cats = ['All', ...Object.keys(BLOCK_CATEGORIES)];
  const q = state.searchQuery.toLowerCase();
  const cat = state.blockPickerCategory;
  let blocks = q
    ? ALL_BLOCKS.filter(b => b.label.toLowerCase().includes(q) || b.desc.toLowerCase().includes(q) || b.category.toLowerCase().includes(q))
    : (cat === 'All' ? ALL_BLOCKS : ALL_BLOCKS.filter(b => b.category === cat));

  return `
  <div class="picker-overlay animate-fadein" id="picker-overlay"></div>
  <div class="picker-sheet animate-slideup" id="picker-sheet">
    <div class="picker-handle"></div>
    <div class="picker-header">
      <span class="picker-title">Add Block</span>
      <button class="icon-btn" id="picker-close">✕</button>
    </div>
    <div class="picker-search-wrap">
      <input class="picker-search" id="picker-search" placeholder="🔍 Search blocks..." value="${escHtml(state.searchQuery)}" autocomplete="off">
    </div>
    <div class="picker-cats" id="picker-cats">
      ${cats.map(c => `<button class="picker-cat-btn ${c===cat?'cat-active':''}" data-cat="${c}">${c}</button>`).join('')}
    </div>
    <div class="picker-list" id="picker-list">
      ${blocks.map(b => `
        <div class="picker-block-item" data-block-id="${b.id}">
          <span class="picker-block-icon" style="background:${b.color}22;border-color:${b.color}">${b.icon}</span>
          <div class="picker-block-info">
            <div class="picker-block-name">${b.label}</div>
            <div class="picker-block-desc">${b.desc}</div>
          </div>
          <button class="picker-add-btn" data-block-id="${b.id}">+</button>
        </div>`).join('')}
      ${blocks.length === 0 ? '<div class="picker-empty">No blocks found</div>' : ''}
    </div>
  </div>`;
}

function setupBlockPickerEvents(project) {
  document.getElementById('picker-overlay')?.addEventListener('click', () => {
    state.blockPickerOpen = false; state.searchQuery = ''; render();
  });
  document.getElementById('picker-close')?.addEventListener('click', () => {
    state.blockPickerOpen = false; state.searchQuery = ''; render();
  });
  document.getElementById('picker-search')?.addEventListener('input', e => {
    state.searchQuery = e.target.value;
    render();
    document.getElementById('picker-search')?.focus();
  });
  document.querySelectorAll('.picker-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.blockPickerCategory = btn.dataset.cat;
      state.searchQuery = '';
      render();
    });
  });
  document.querySelectorAll('.picker-add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const blockId = btn.dataset.blockId;
      const def = ALL_BLOCKS.find(x => x.id === blockId);
      if (!def) return;
      project.blocks.push({ id: blockId, fields: {} });
      project.modified = Date.now();
      saveProjects();
      state.blockPickerOpen = false;
      state.searchQuery = '';
      state.selectedBlockIdx = project.blocks.length - 1;
      render();
      showToast(`Added: ${def.label}`);
    });
  });
}

// ---------- Run Output ----------
function renderRunOutput(project) {
  const out = state.runOutput;
  return `
  <div class="run-overlay animate-fadein" id="run-overlay">
    <div class="run-panel animate-slideup">
      <div class="run-panel-header">
        <span>▶ Output</span>
        <button class="icon-btn" id="btn-close-run">✕</button>
      </div>
      ${out.type === 'iframe'
        ? `<iframe class="run-iframe" sandbox="allow-scripts allow-modals" srcdoc="${escAttr(out.html)}"></iframe>`
        : `<pre class="run-console">${escHtml(out.output || '')}</pre>`}
    </div>
  </div>`;
}

// ---------- Preferences View ----------
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
          <span class="pref-version">v1.0.0 — ${Object.keys(state.projects).length} project${Object.keys(state.projects).length!==1?'s':''}</span>
        </div>
      </div>
      <div class="pref-section">
        <div class="pref-label">Data</div>
        <button class="btn-danger-full" id="btn-clear-all">Delete All Projects</button>
      </div>
    </div>
  `);
  document.getElementById('btn-back')?.addEventListener('click', () => { state.view='library'; render(); });
  document.getElementById('theme-dark')?.addEventListener('click', () => { state.theme='dark'; savePrefs(); render(); });
  document.getElementById('theme-light')?.addEventListener('click', () => { state.theme='light'; savePrefs(); render(); });
  document.getElementById('btn-clear-all')?.addEventListener('click', () => {
    if (confirm('Delete ALL projects? This cannot be undone.')) {
      state.projects = {}; saveProjects(); showToast('All projects deleted'); state.view='library'; render();
    }
  });
}

// ---------- Helpers ----------
function escHtml(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function escAttr(s) {
  return String(s||'').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// ---------- Init ----------
function init() {
  loadPrefs();
  loadProjects();
  // Check if URL has ?action=new
  if (location.search.includes('action=new')) {
    state.view = 'newproject';
  }
  render();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(()=>{});
  }
}

window.addEventListener('DOMContentLoaded', init);
