// Time-based greeting
var hour = new Date().getHours();
var part = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
document.getElementById('greeting').textContent = part + '! Welcome to my portfolio.';

// Dark mode toggle (remembered with localStorage)
var root = document.documentElement;
var btn = document.getElementById('themeBtn');
function syncButton() { btn.textContent = root.classList.contains('dark') ? 'Light mode' : 'Dark mode'; }
syncButton();
btn.addEventListener('click', function () {
  root.classList.toggle('dark');
  syncButton();
  window.applyAccent();
  syncDots();
  try { localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light'); } catch (e) {}
});

// Typing animation
var words = ['Web Developer', 'B.Tech Student', 'Problem Solver'];
var typed = document.getElementById('typed');
var w = 0, ch = 0, deleting = false;
function type() {
  var word = words[w];
  ch += deleting ? -1 : 1;
  typed.textContent = word.slice(0, ch);
  var delay = deleting ? 50 : 100;
  if (!deleting && ch === word.length) { deleting = true; delay = 1400; }
  else if (deleting && ch === 0) { deleting = false; w = (w + 1) % words.length; delay = 400; }
  setTimeout(type, delay);
}
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) typed.textContent = words[0];
else type();

// Scroll animations: reveal sections as they enter the screen
var items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  items.forEach(function (el) { io.observe(el); });
} else {
  items.forEach(function (el) { el.classList.add('visible'); });
}

// Contact form validation
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  var name = document.getElementById('cname').value.trim();
  var mail = document.getElementById('cmail').value.trim();
  var msg = document.getElementById('cmsg').value.trim();
  var out = document.getElementById('formMsg');
  if (!name || !msg) { out.textContent = 'Please fill in your name and message.'; return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) { out.textContent = 'Enter a valid e-mail address.'; return; }
  var body = msg + '\n\n- ' + name + ' (' + mail + ')';
  window.location.href = 'mailto:satyanarayantripathi047@gmail.com?subject=' + encodeURIComponent('Portfolio message from ' + name) + '&body=' + encodeURIComponent(body);
  out.textContent = 'Thanks, ' + name + '! Your email app should open with the message ready to send.';
  this.reset();
});

// Scroll progress bar
var bar = document.getElementById('progress');
function updateBar() {
  var max = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
}
window.addEventListener('scroll', updateBar, { passive: true });
window.addEventListener('resize', updateBar);
updateBar();

// 3D tilt on project cards (mouse only, skipped for reduced motion)
var canTilt = window.matchMedia('(hover: hover)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (canTilt) {
  document.querySelectorAll('.tilt').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = 'perspective(700px) rotateX(' + (-y * 10).toFixed(1) + 'deg) rotateY(' + (x * 10).toFixed(1) + 'deg)';
    });
    card.addEventListener('mouseleave', function () { card.style.transform = ''; });
  });
}

// Terminal
var out = document.getElementById('termOut');
var input = document.getElementById('termInput');
var cmdHistory = [], hpos = 0;
function print(text, cls, href) {
  var line = document.createElement('div');
  if (cls) line.className = cls;
  if (href) { var a = document.createElement('a'); a.href = href; a.target = '_blank'; a.rel = 'noopener'; a.textContent = text; line.appendChild(a); }
  else line.textContent = text;
  out.appendChild(line);
  out.scrollTop = out.scrollHeight;
}
var replies = {
  help: 'Commands: about, skills, education, certificates, projects, github, email, resume, accent <colour>, neofetch, sudo hire-me, contact, open bookstore, open form, theme, clear',
  about: 'Satyanarayan Tripathi - B.Tech student at GL Bajaj Institute of Technology and Management, learning web development.',
  skills: 'HTML5, CSS3, JavaScript, Git and GitHub, Full-Stack Basics, Cybersecurity Fundamentals, AI Fundamentals',
  education: '2025 - Present  B.Tech, GL Bajaj\n2026  Web Development Lab (BCS353)\n2026  Online Bookstore',
  certificates: '1. Introduction to Full-Stack Web Development - Vodafone Idea Foundation x Edunet (Aug 2026)\n2. Introduction to Cybersecurity - Cisco Networking Academy (Jun 2026)\n3. Introduction to Modern AI - Cisco Networking Academy (Jun 2026)\n4. Apply AI: Update Your Resume - Cisco Networking Academy (Jun 2026)\n-> type: open certificate',
  projects: '1. Online Bookstore  -> type: open bookstore\n2. Form Validation    -> type: open form'
};
function run(cmd) {
  cmd = cmd.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!cmd) return;
  print('$ ' + cmd, 'cmd');
  if (replies[cmd]) print(replies[cmd]);
  else if (cmd === 'clear') out.innerHTML = '';
  else if (cmd === 'github') print('github.com/Satya-1718', '', 'https://github.com/Satya-1718');
  else if (cmd === 'accent' || cmd.indexOf('accent ') === 0) {
    var arg = cmd.slice(7).trim(), names = Object.keys(window.ACCENTS);
    if (!arg) print('Usage: accent <' + names.join('|') + '|reset>  (now: ' + currentAccent() + ')');
    else if (arg === 'reset') { setAccent(null); print('Accent reset to default.'); }
    else if (isAccent(arg)) { setAccent(arg); print('Accent set to ' + arg + '.'); }
    else print('Unknown colour: ' + arg + '. Try: ' + names.join(', ') + ', reset.');
  }
  else if (cmd === 'resume') { print('Opening resume.pdf (click if it does not open)', '', 'resume.pdf'); setTimeout(function () { window.open('resume.pdf', '_blank'); }, 400); }
  else if (cmd === 'neofetch') {
    var nCerts = document.querySelectorAll('.cert').length;
    print([' +-------+  satya@portfolio', ' |  S T  |  -----------------', ' +-------+  Role: B.Tech student',
      '            Uni: GL Bajaj (GLBITM)', '            Stack: HTML CSS JS', '            Certs: ' + nCerts,
      '            GitHub: Satya-1718', '            Theme: ' + (root.classList.contains('dark') ? 'dark' : 'light')].join('\n'));
  }
  else if (cmd === 'sudo hire-me') {
    var nBooks = document.querySelectorAll('.book').length, nC = document.querySelectorAll('.cert').length;
    print('[sudo] password for recruiter: ********');
    setTimeout(function () { print('Checking skills... ' + nBooks + ' found'); }, 600);
    setTimeout(function () { print('Checking certificates... ' + nC + ' found'); }, 1200);
    setTimeout(function () { print('Access granted. Good call!'); }, 1800);
    setTimeout(function () { print('Say hello: satyanarayantripathi047@gmail.com', '', 'mailto:satyanarayantripathi047@gmail.com'); }, 2300);
  }
  else if (cmd.indexOf('sudo') === 0) print('recruiter is not in the sudoers file. This incident will be reported. (Just kidding. Try: sudo hire-me)');
  else if (cmd === 'email') print('satyanarayantripathi047@gmail.com', '', 'mailto:satyanarayantripathi047@gmail.com');
  else if (cmd === 'contact') { print('Opening the contact form...'); document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }); }
  else if (cmd === 'theme') { document.getElementById('themeBtn').click(); print('Theme switched.'); }
  else if (cmd === 'open bookstore') { print('Opening the bookstore...'); setTimeout(function () { location.href = 'bookstore/store/index.html'; }, 600); }
  else if (cmd === 'open certificate') { print('Opening the certificate...'); setTimeout(function () { window.open('certificate_fullstack.pdf', '_blank'); }, 400); }
  else if (cmd === 'open form') { print('Opening the form...'); setTimeout(function () { location.href = 'bookstore/registration.html'; }, 600); }
  else print('command not found: ' + cmd + '. Type help.');
}
print('Welcome! Type help, or tap a command below.');
input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') { run(input.value); if (input.value.trim()) { cmdHistory.push(input.value); hpos = cmdHistory.length; } input.value = ''; }
  else if (e.key === 'ArrowUp' && hpos > 0) { hpos--; input.value = cmdHistory[hpos]; e.preventDefault(); }
  else if (e.key === 'ArrowDown') { hpos = Math.min(hpos + 1, cmdHistory.length); input.value = cmdHistory[hpos] || ''; e.preventDefault(); }
});
document.getElementById('term').addEventListener('click', function () { if (window.getSelection().toString() === '') input.focus({ preventScroll: true }); });
document.querySelectorAll('.term-chips button').forEach(function (b) {
  b.addEventListener('click', function () { run(b.dataset.cmd); });
});

// Bookshelf skills
var books = document.querySelectorAll('.book');
var detail = document.getElementById('bookDetail');
books.forEach(function (b) {
  b.addEventListener('click', function () {
    books.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    detail.textContent = '';
    var t = document.createElement('b'); t.textContent = b.dataset.title;
    var p = document.createElement('span'); p.textContent = b.dataset.proof;
    detail.appendChild(t); detail.appendChild(p);
  });
});

// Live GitHub feed
(function () {
  var USER = 'Satya-1718';
  var grid = document.getElementById('ghGrid'), status = document.getElementById('ghStatus');
  function ago(iso) {
    var d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    return d <= 0 ? 'today' : d === 1 ? 'yesterday' : d < 30 ? d + ' days ago' : new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function show(repos) {
    repos = repos.filter(function (r) { return !r.fork; }).slice(0, 4);
    grid.innerHTML = '';
    if (!repos.length) { status.textContent = 'No public repositories to show yet.'; return; }
    status.textContent = '';
    repos.forEach(function (r) {
      var card = document.createElement('article'); card.className = 'repo';
      var h3 = document.createElement('h3'); h3.textContent = r.name; card.appendChild(h3);
      var p = document.createElement('p'); p.textContent = r.description || 'No description yet.'; card.appendChild(p);
      var m = document.createElement('p'); m.className = 'meta';
      m.textContent = (r.language ? r.language + ' \u00B7 ' : '') + '\u2605 ' + r.stargazers_count + ' \u00B7 pushed ' + ago(r.pushed_at);
      card.appendChild(m);
      var a = document.createElement('a'); a.className = 'open'; a.href = r.html_url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'View on GitHub \u2192';
      var wrap = document.createElement('p'); wrap.appendChild(a); card.appendChild(wrap);
      grid.appendChild(card);
    });
  }
  var cached = null;
  try { cached = JSON.parse(sessionStorage.getItem('ghRepos') || 'null'); } catch (e) {}
  if (cached && Date.now() - cached.t < 600000) { show(cached.d); return; }
  fetch('https://api.github.com/users/' + USER + '/repos?sort=pushed&per_page=10')
    .then(function (res) { if (!res.ok) throw new Error(res.status); return res.json(); })
    .then(function (data) {
      try { sessionStorage.setItem('ghRepos', JSON.stringify({ t: Date.now(), d: data })); } catch (e) {}
      show(data);
    })
    .catch(function () { status.textContent = 'Could not load GitHub right now. Please use the link below.'; });
})();

// Certificate flip cards
document.querySelectorAll('.flipcard').forEach(function (card) {
  var btn = card.querySelector('.flip-toggle'), front = card.querySelector('.front'), back = card.querySelector('.back');
  function flip() {
    var on = card.classList.toggle('flipped');
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.textContent = on ? 'Show certificate' : 'Show details';
    back.inert = !on; front.inert = on;
    back.setAttribute('aria-hidden', on ? 'false' : 'true');
    front.setAttribute('aria-hidden', on ? 'true' : 'false');
  }
  card.addEventListener('click', function (e) { if (e.target.closest('a')) return; flip(); });
});

// Accent colour picker
var dots = document.querySelectorAll('.dot');
function isAccent(n) { return !!n && Object.prototype.hasOwnProperty.call(window.ACCENTS, n); }
function currentAccent() {
  var n = null; try { n = localStorage.getItem('accent'); } catch (e) {}
  return isAccent(n) ? n : (root.classList.contains('dark') ? 'gold' : 'maroon');
}
function syncDots() {
  var cur = currentAccent();
  dots.forEach(function (d) { d.setAttribute('aria-pressed', d.dataset.accent === cur ? 'true' : 'false'); });
}
function setAccent(n) {
  try { if (n) localStorage.setItem('accent', n); else localStorage.removeItem('accent'); } catch (e) {}
  window.applyAccent();
  syncDots();
}
dots.forEach(function (d) { d.addEventListener('click', function () { setAccent(d.dataset.accent); }); });
syncDots();

// ===== Hero counters, skill bars, certificate viewer, active nav =====
(function () {
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canObserve = 'IntersectionObserver' in window;

  // Counters: count up when the stats come into view
  document.querySelectorAll('.stats b').forEach(function (el) {
    var target = el.dataset.from ? document.querySelectorAll(el.dataset.from).length : Number(el.dataset.count);
    el.textContent = target;
    if (calm || !canObserve) return;
    el.textContent = '0';
    new IntersectionObserver(function (entries, obs) {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      var start = null;
      (function tick(t) {
        if (start === null) start = t;
        var p = Math.min((t - start) / 1000, 1);
        el.textContent = Math.round(target * p);
        if (p < 1) requestAnimationFrame(tick);
      })(performance.now());
    }, { threshold: 0.6 }).observe(el);
  });

  // Skill bars: fill when scrolled into view
  var bars = document.querySelector('.bars');
  if (bars) {
    if (!canObserve) bars.classList.add('in');
    else new IntersectionObserver(function (entries, obs) {
      if (entries[0].isIntersecting) { bars.classList.add('in'); obs.disconnect(); }
    }, { threshold: 0.3 }).observe(bars);
  }

  // Certificate viewer (pop-up with previous / next)
  var lb = document.getElementById('lightbox');
  var certs = Array.prototype.slice.call(document.querySelectorAll('.cert'));
  if (lb && lb.showModal && certs.length) {
    var img = document.getElementById('lbImg'), cap = document.getElementById('lbCap'), idx = 0;
    function show(i) {
      idx = (i + certs.length) % certs.length;
      var c = certs[idx], src = c.querySelector('.front img');
      img.src = src.getAttribute('src'); img.alt = src.alt;
      cap.textContent = c.querySelector('.back h3').textContent + ' (' + (idx + 1) + ' of ' + certs.length + ')';
    }
    certs.forEach(function (c, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'zoom-btn'; b.textContent = 'View large';
      b.setAttribute('aria-label', 'View large: ' + c.querySelector('.back h3').textContent);
      b.addEventListener('click', function (e) { e.stopPropagation(); show(i); lb.showModal(); });
      c.appendChild(b);
    });
    document.getElementById('lbPrev').addEventListener('click', function () { show(idx - 1); });
    document.getElementById('lbNext').addEventListener('click', function () { show(idx + 1); });
    lb.querySelector('.lb-close').addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  // Active navigation link follows the section you are reading
  var links = Array.prototype.slice.call(document.querySelectorAll('nav a[href^="#"]'));
  var targets = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  var ticking = false;
  function setActive() {
    ticking = false;
    var cur = -1, atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    targets.forEach(function (t, i) { if (t && t.getBoundingClientRect().top <= 90) cur = i; });
    if (atEnd) cur = links.length - 1;
    links.forEach(function (a, i) {
      a.classList.toggle('active', i === cur);
      if (i === cur) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(setActive); } }, { passive: true });
  setActive();
})();

// ===== Hindi / English switch =====
(function () {
  var HI = {
    nTerminal: 'टर्मिनल', nAbout: 'परिचय', nEducation: 'शिक्षा', nSkills: 'कौशल', nCerts: 'प्रमाणपत्र', nProjects: 'प्रोजेक्ट', nGame: 'गेम', nContact: 'संपर्क', nResume: 'रिज़्यूमे',
    iam: 'मैं एक', typedEnd: ' हूँ',
    heroSub: 'जी.एल. बजाज इंस्टीट्यूट ऑफ टेक्नोलॉजी एंड मैनेजमेंट में बी.टेक छात्र, वेब प्रोजेक्ट बना रहा हूँ।',
    viewProjects: 'प्रोजेक्ट देखें', dlResume: 'रिज़्यूमे डाउनलोड करें',
    stCerts: 'प्रमाणपत्र', stLabs: 'लैब प्रयोग', stProjects: 'प्रोजेक्ट', stBooks: 'मेरे स्टोर में किताबें',
    hTerminal: 'टर्मिनल में मुझसे मिलें', hAbout: 'मेरे बारे में', hEducation: 'शिक्षा और सफ़र', hSkills: 'कौशल', hCerts: 'प्रमाणपत्र', hProjects: 'प्रोजेक्ट', hGithub: 'GitHub से लाइव', hContact: 'संपर्क', hGame: 'टाइपिंग स्पीड टेस्ट',
    hintShelf: 'शेल्फ़ से कोई किताब चुनें और देखें कि मैंने उसे कहाँ इस्तेमाल किया।',
    hintCerts: 'कार्ड पर टैप करके उसे पलटें और विवरण देखें।',
    hintGame: 'नीचे दिया गया टेक्स्ट टाइप करें। पहला अक्षर टाइप करते ही टाइमर शुरू हो जाएगा।',
    barsTitle: 'आत्मविश्वास स्तर', barsNote: '(मेरी अपनी रेटिंग)',
    aboutText: 'जी.एल. बजाज इंस्टीट्यूट ऑफ टेक्नोलॉजी एंड मैनेजमेंट (रोल नं. 2501920110334) में बी.टेक छात्र, वेब डेवलपमेंट सीख रहा हूँ और छोटे प्रोजेक्ट बना रहा हूँ। मेरा कोड GitHub पर है: ',
    mailLine: 'सीधे ईमेल करें: ', lName: 'नाम', lMail: 'ईमेल', lMsg: 'संदेश', send: 'संदेश भेजें'
  };
  var nodes = document.querySelectorAll('[data-i18n]');
  nodes.forEach(function (n) { n.dataset.en = n.textContent; });
  var langBtn = document.getElementById('langBtn');
  var calmMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lang = 'en';

  function greet() {
    var h = new Date().getHours();
    var text = lang === 'hi'
      ? (h < 12 ? 'सुप्रभात!' : h < 17 ? 'शुभ दोपहर!' : 'शुभ संध्या!') + ' मेरे पोर्टफोलियो में आपका स्वागत है।'
      : (h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening') + '! Welcome to my portfolio.';
    document.getElementById('greeting').textContent = text;
  }
  function apply(next, save) {
    lang = next;
    nodes.forEach(function (n) {
      var t = HI[n.dataset.i18n];
      n.textContent = (lang === 'hi' && t !== undefined) ? t : n.dataset.en;
    });
    document.documentElement.lang = lang;
    langBtn.textContent = lang === 'hi' ? 'English' : 'हिंदी';
    words = lang === 'hi' ? ['वेब डेवलपर', 'बी.टेक छात्र', 'समस्या-समाधानकर्ता'] : ['Web Developer', 'B.Tech Student', 'Problem Solver'];
    w = 0; ch = 0; deleting = false;
    if (calmMotion) typed.textContent = words[0];
    greet();
    if (save) { try { localStorage.setItem('lang', lang); } catch (e) {} }
  }
  langBtn.addEventListener('click', function () { apply(lang === 'hi' ? 'en' : 'hi', true); });
  var saved = null; try { saved = localStorage.getItem('lang'); } catch (e) {}
  if (saved === 'hi') apply('hi', false);
})();

// ===== Command palette (Ctrl+K) and Install button =====
(function () {
  var dlg = document.getElementById('palette'), input = document.getElementById('palInput'), list = document.getElementById('palList');
  var palBtn = document.getElementById('palBtn'), ib = document.getElementById('installBtn');
  var deferred = null, shown = [], sel = 0;

  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; ib.hidden = false; });
  window.addEventListener('appinstalled', function () { deferred = null; ib.hidden = true; });
  ib.addEventListener('click', function () {
    if (!deferred) return;
    deferred.prompt();
    deferred.userChoice.then(function () { deferred = null; ib.hidden = true; });
  });
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
  if (!dlg.showModal) { palBtn.hidden = true; return; }

  function go(id) { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }
  function click(id) { document.getElementById(id).click(); }
  function actions() {
    var a = [
      ['Go to Terminal', 'section', '', function () { go('terminal'); }],
      ['Go to About', 'section', '', function () { go('about'); }],
      ['Go to Education', 'section', 'journey timeline', function () { go('education'); }],
      ['Go to Skills', 'section', 'bookshelf bars', function () { go('skills'); }],
      ['Go to Certificates', 'section', 'courses cisco', function () { go('certificates'); }],
      ['Go to Projects', 'section', 'case study', function () { go('projects'); }],
      ['Go to Live GitHub', 'section', 'repositories repos', function () { go('github-feed'); }],
      ['Play typing speed test', 'game', 'game wpm', function () { go('game'); document.getElementById('gInput').focus({ preventScroll: true }); }],
      ['Go to Contact', 'section', 'email message', function () { go('contact'); }],
      ['Open the online bookstore', 'opens store', 'shop cart', function () { location.href = 'bookstore/store/index.html'; }],
      ['Try the form validation', 'opens form', 'registration', function () { location.href = 'bookstore/registration.html'; }],
      ['Download resume', 'PDF', 'cv', function () { window.open('resume.pdf', '_blank'); }],
      ['Open GitHub profile', 'new tab', 'code', function () { window.open('https://github.com/Satya-1718', '_blank', 'noopener'); }],
      ['Send me an email', 'opens mail', 'contact', function () { location.href = 'mailto:satyanarayantripathi047@gmail.com'; }],
      ['Switch dark / light mode', 'theme', 'night day', function () { click('themeBtn'); }],
      ['Switch language: Hindi / English', 'language', 'हिंदी hindi english भाषा', function () { click('langBtn'); }]
    ];
    ['Maroon', 'Gold', 'Green', 'Blue', 'Purple'].forEach(function (n) {
      a.push(['Accent colour: ' + n, 'theme', 'colour color', function () { document.querySelector('.dot[data-accent="' + n.toLowerCase() + '"]').click(); }]);
    });
    if (deferred) a.push(['Install this portfolio as an app', 'install', 'pwa phone', function () { ib.click(); }]);
    return a;
  }
  function render() {
    var terms = input.value.toLowerCase().split(/\s+/).filter(Boolean);
    shown = actions().filter(function (x) {
      var hay = (x[0] + ' ' + x[1] + ' ' + x[2]).toLowerCase();
      return terms.every(function (t) { return hay.indexOf(t) !== -1; });
    });
    sel = 0;
    list.textContent = '';
    shown.forEach(function (x, i) {
      var li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      var s1 = document.createElement('span'); s1.textContent = x[0];
      var s2 = document.createElement('small'); s2.textContent = x[1];
      li.appendChild(s1); li.appendChild(s2);
      li.addEventListener('click', function () { run(i); });
      list.appendChild(li);
    });
    if (!shown.length) { var p = document.createElement('li'); p.textContent = 'No match. Try "projects" or "dark".'; list.appendChild(p); }
  }
  function mark(i) {
    if (!shown.length) return;
    sel = (i + shown.length) % shown.length;
    Array.prototype.forEach.call(list.children, function (li, k) { li.setAttribute('aria-selected', k === sel ? 'true' : 'false'); });
    list.children[sel].scrollIntoView({ block: 'nearest' });
  }
  function run(i) {
    var fn = shown[i] && shown[i][3];
    dlg.close();
    if (fn) setTimeout(fn, 60);
  }
  function open() {
    if (dlg.open) { dlg.close(); return; }
    input.value = ''; render(); dlg.showModal(); input.focus();
  }
  palBtn.addEventListener('click', open);
  input.addEventListener('input', render);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { mark(sel + 1); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { mark(sel - 1); e.preventDefault(); }
    else if (e.key === 'Enter') { run(sel); e.preventDefault(); }
  });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
  });
})();

// ===== Typing speed game =====
(function () {
  var PASSAGES = [
    'A good developer reads the error message first, then the code, and only then asks for help. Small steps, tested often, beat big changes that nobody understands.',
    'HTML gives a page its structure, CSS gives it style, and JavaScript gives it life. Learn the three well and you can build almost anything on the web.',
    'Commit early, commit often, and write messages your future self will thank you for. A clean history makes every bug easier to find.',
    'Before you share a project, open it on a phone, click every link, and try to break the forms. Real users will find the bugs you missed.'
  ];
  var LIMIT = 30;
  var textEl = document.getElementById('gText'), input = document.getElementById('gInput');
  var timeEl = document.getElementById('gTime'), wpmEl = document.getElementById('gWpm'), accEl = document.getElementById('gAcc');
  var bestEl = document.getElementById('gBest'), result = document.getElementById('gResult');
  var passage = '', spans = [], started = 0, timer = null, over = false, last = -1;

  function getBest() { try { return Number(localStorage.getItem('bestWpm')) || 0; } catch (e) { return 0; } }
  function showBest() { var b = getBest(); bestEl.textContent = b ? String(b) : '\u2013'; }
  function correctCount() { return spans.filter(function (s) { return s.className === 'ok'; }).length; }
  function currentWpm() {
    var mins = Math.max(Math.min(Date.now() - started, LIMIT * 1000), 3000) / 60000;
    return Math.round(correctCount() / 5 / mins);
  }
  function mark() {
    var v = input.value;
    spans.forEach(function (s, i) {
      s.className = i < v.length ? (v.charAt(i) === passage.charAt(i) ? 'ok' : 'bad') : (i === v.length ? 'cur' : '');
    });
    accEl.textContent = v.length ? Math.round(correctCount() / v.length * 100) : 100;
  }
  function load() {
    clearInterval(timer);
    started = 0; over = false;
    var i; do { i = Math.floor(Math.random() * PASSAGES.length); } while (i === last && PASSAGES.length > 1);
    last = i; passage = PASSAGES[i];
    textEl.textContent = '';
    spans = passage.split('').map(function (c) { var s = document.createElement('span'); s.textContent = c; textEl.appendChild(s); return s; });
    input.value = ''; input.disabled = false;
    timeEl.textContent = LIMIT; wpmEl.textContent = 0; result.textContent = '';
    mark(); showBest();
  }
  function finish() {
    if (over) return;
    over = true; clearInterval(timer); input.disabled = true;
    var wpm = currentWpm(), acc = accEl.textContent, best = getBest(), msg;
    wpmEl.textContent = wpm;
    msg = 'Your speed: ' + wpm + ' WPM with ' + acc + '% accuracy.';
    if (wpm > best) { try { localStorage.setItem('bestWpm', String(wpm)); } catch (e) {} if (wpm > 0) msg += ' New personal best!'; }
    result.textContent = msg; showBest();
  }
  function tick() {
    var left = Math.max(0, LIMIT - (Date.now() - started) / 1000);
    timeEl.textContent = Math.ceil(left);
    wpmEl.textContent = currentWpm();
    if (left <= 0) finish();
  }
  input.addEventListener('input', function () {
    if (over) return;
    if (!started) { started = Date.now(); timer = setInterval(tick, 100); }
    mark();
    if (input.value.length >= passage.length) finish();
  });
  input.addEventListener('paste', function (e) { e.preventDefault(); });
  document.getElementById('gReset').addEventListener('click', function () { load(); input.focus(); });
  load();
})();
