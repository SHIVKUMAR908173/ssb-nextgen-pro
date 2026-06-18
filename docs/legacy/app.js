
const pages = {
  dashboard: {
    title: 'Dashboard',
    render: () => `
      <div class="dashboard-grid">
        <div class="welcome-banner">
          <div class="welcome-tag"><i class="fa-solid fa-shield-halved"></i> COMMAND CENTER</div>
          <h1>Welcome Back, <span>Cadet</span></h1>
          <p>Your SSB preparation journey continues. Track your progress, practice psychology tests, and get AI-powered interview feedback — all in one place.</p>
        </div>
        <div class="stats-row">
          <div class="stat-card"><div class="stat-icon yellow"><i class="fa-solid fa-trophy"></i></div><div><div class="stat-val">72%</div><div class="stat-lbl">Overall Progress</div></div></div>
          <div class="stat-card"><div class="stat-icon blue"><i class="fa-solid fa-brain"></i></div><div><div class="stat-val">14</div><div class="stat-lbl">Tests Completed</div></div></div>
          <div class="stat-card"><div class="stat-icon green"><i class="fa-solid fa-fire"></i></div><div><div class="stat-val">7 Days</div><div class="stat-lbl">Current Streak</div></div></div>
          <div class="stat-card"><div class="stat-icon purple"><i class="fa-solid fa-star"></i></div><div><div class="stat-val">88</div><div class="stat-lbl">OIR Score (Avg)</div></div></div>
        </div>
        <div>
          <div class="section-header"><h2>Training Modules</h2><a href="#">View All →</a></div>
          <div class="modules-grid">
            <div class="module-card yellow" onclick="navigate('oir')"><div class="module-icon yellow"><i class="fa-solid fa-lightbulb"></i></div><h3>OIR Test</h3><p>Officer Intelligence Rating — Verbal & Non-verbal reasoning tests with 96 sets.</p><span class="module-tag tag-test"><i class="fa-solid fa-clock"></i> 96 Sets</span></div>
            <div class="module-card purple" onclick="navigate('tat')"><div class="module-icon purple"><i class="fa-solid fa-image"></i></div><h3>TAT (Psychology)</h3><p>Thematic Apperception Test — Write stories based on images shown.</p><span class="module-tag tag-psych"><i class="fa-solid fa-brain"></i> Psychology</span></div>
            <div class="module-card blue" onclick="navigate('wat')"><div class="module-icon blue"><i class="fa-solid fa-comment-dots"></i></div><h3>WAT (Psychology)</h3><p>Word Association Test — Write responses to 60 words in 30 seconds each.</p><span class="module-tag tag-psych"><i class="fa-solid fa-brain"></i> Psychology</span></div>
            <div class="module-card green" onclick="navigate('srt')"><div class="module-icon green"><i class="fa-solid fa-circle-question"></i></div><h3>SRT (Psychology)</h3><p>Situation Reaction Test — How would you react in 60 situations?</p><span class="module-tag tag-psych"><i class="fa-solid fa-brain"></i> Psychology</span></div>
            <div class="module-card cyan" onclick="navigate('interview')"><div class="module-icon cyan"><i class="fa-solid fa-robot"></i></div><h3>AI Virtual Interview</h3><p>Practice your personal interview with our AI-powered interviewer.</p><span class="module-tag tag-ai"><i class="fa-solid fa-wand-magic-sparkles"></i> AI Powered</span></div>
            <div class="module-card red" onclick="navigate('ppdt')"><div class="module-icon red"><i class="fa-solid fa-images"></i></div><h3>PPDT Round</h3><p>Picture Perception & Discussion Test preparation with sample images.</p><span class="module-tag tag-test"><i class="fa-solid fa-clock"></i> Practice</span></div>
          </div>
        </div>
        <div class="progress-section">
          <div class="card">
            <h2>Module Progress</h2>
            ${[['OIR Test','fill-yellow',72],['TAT Psychology','fill-purple',45],['WAT Psychology','fill-blue',60],['SRT Psychology','fill-green',30]].map(([l,c,v])=>`
              <div class="progress-item">
                <div class="progress-label"><span>${l}</span><span>${v}%</span></div>
                <div class="progress-bar"><div class="progress-fill ${c}" style="width:${v}%"></div></div>
              </div>`).join('')}
          </div>
          <div class="card">
            <h2>Recent Activity</h2>
            ${[['yellow','Completed OIR Set #42','2 hours ago'],['blue','WAT Practice — 60 words','Yesterday'],['purple','TAT Story — Image #7','2 days ago'],['green','SRT Test — 60 situations','3 days ago']].map(([c,t,ti])=>`
              <div class="activity-item"><div class="activity-dot ${c}"></div><div class="activity-text">${t}</div><div class="activity-time">${ti}</div></div>`).join('')}
          </div>
        </div>
      </div>`
  },
  assessment: {
    title: 'Assessment Center',
    render: () => `
      <div class="page-hero">
        <div class="page-tag"><i class="fa-solid fa-clipboard-check"></i> ASSESSMENT CENTER</div>
        <h1>Your <span>Assessment</span> Hub</h1>
        <p>Take comprehensive tests across all SSB stages. Track performance and identify areas for improvement.</p>
      </div>
      <div class="modules-grid">
        ${[
          ['yellow','fa-lightbulb','OIR Test','96 sets of verbal & non-verbal reasoning','oir'],
          ['purple','fa-image','PPDT Round','Picture story writing & discussion','ppdt'],
          ['blue','fa-brain','TAT Psychology','Thematic story writing from images','tat'],
          ['green','fa-comment-dots','WAT Psychology','Word association — 60 words','wat'],
          ['cyan','fa-circle-question','SRT Psychology','60 real-life situation reactions','srt'],
          ['red','fa-pen-to-square','Self Description','Write about yourself in 4 aspects','sd'],
        ].map(([c,i,h,p,pg])=>`
          <div class="module-card ${c}" onclick="navigate('${pg}')">
            <div class="module-icon ${c}"><i class="fa-solid ${i}"></i></div>
            <h3>${h}</h3><p>${p}</p>
            <span class="module-tag tag-test">Start Test →</span>
          </div>`).join('')}
      </div>`
  },
  resources: {
    title: 'Free Resources',
    render: () => `
      <div class="page-hero">
        <div class="page-tag"><i class="fa-solid fa-book-open"></i> KNOWLEDGE VAULT</div>
        <h1>DEFENSE ASPIRANT <span>RESOURCE LIBRARY</span></h1>
        <p>Free curated study material for SSB Interview preparation. Access static GK, GD topics, Interview questions, and daily defense current affairs.</p>
      </div>
      <div class="tabs">
        ${['Static Defence GK','GD Topics','Interview Questions','Daily Defence Blog'].map((t,i)=>`
          <button class="tab-btn ${i===0?'active':''}" onclick="setTab(this)">${t}</button>`).join('')}
      </div>
      <div class="resource-grid">
        ${[
          ['Indian Army','Seva Paramo Dharma — Service Before Self','green'],
          ['Indian Navy','Sham No Varunah — May the Lord of Water be auspicious','blue'],
          ['Indian Air Force','Nabha Sparsham Diptam — Touch the sky with glory','cyan'],
          ['NDA Overview','National Defence Academy — The premier military academy','yellow'],
          ['Ranks & Insignia','Complete guide to Indian Armed Forces ranks','purple'],
          ['Gallantry Awards','PVC, MVC, VrC and other honours','red'],
        ].map(([h,p,c])=>`
          <div class="resource-card">
            <span class="resource-badge" style="background:var(--bg-${c==='yellow'?'card2':'card'});color:var(--${c})">${c.toUpperCase()}</span>
            <h3>${h}</h3><p>${p}</p>
          </div>`).join('')}
      </div>`
  },
  oir: {
    title: 'OIR Test',
    render: () => `
      <div class="page-hero">
        <div class="page-tag"><i class="fa-solid fa-lightbulb"></i> INTELLIGENCE RATING</div>
        <h1>OIR <span>Test Bank</span></h1>
        <p>96 complete sets of Officer Intelligence Rating tests — Verbal & Non-Verbal reasoning. Each set has 40 questions with answer keys.</p>
      </div>
      <div class="tabs">
        <button class="tab-btn active" onclick="setTab(this)">All Sets</button>
        <button class="tab-btn" onclick="setTab(this)">Verbal</button>
        <button class="tab-btn" onclick="setTab(this)">Non-Verbal</button>
        <button class="tab-btn" onclick="setTab(this)">Completed</button>
      </div>
      <div class="oir-grid">
        ${Array.from({length:24},(_,i)=>`
          <div class="oir-set-card" onclick="startOIR(${i+1})">
            <div class="oir-set-num">#${String(i+1).padStart(2,'0')}</div>
            <div class="oir-set-lbl">OIR Set ${i+1}</div>
            <div class="oir-set-status" style="color:${i<5?'var(--green)':i<10?'var(--accent)':'var(--text-muted)'}">
              <i class="fa-solid ${i<5?'fa-check-circle':i<10?'fa-clock':'fa-lock'}"></i>
              ${i<5?'Completed':i<10?'In Progress':'Locked'}
            </div>
          </div>`).join('')}
      </div>`
  },
  tat: {
    title: 'TAT (Psychology)',
    render: () => `
      <div class="page-hero">
        <div class="page-tag"><i class="fa-solid fa-brain"></i> PSYCHOLOGY TEST</div>
        <h1>Thematic Apperception <span>Test</span></h1>
        <p>You will be shown 11 images (including one blank). Write a story for each image within 4 minutes. Your story reveals your personality traits.</p>
      </div>
      <div class="stats-row" style="margin-bottom:20px">
        <div class="stat-card"><div class="stat-icon purple"><i class="fa-solid fa-image"></i></div><div><div class="stat-val">11</div><div class="stat-lbl">Images per Set</div></div></div>
        <div class="stat-card"><div class="stat-icon blue"><i class="fa-solid fa-clock"></i></div><div><div class="stat-val">4 Min</div><div class="stat-lbl">Per Image</div></div></div>
        <div class="stat-card"><div class="stat-icon yellow"><i class="fa-solid fa-pencil"></i></div><div><div class="stat-val">~60</div><div class="stat-lbl">Words Target</div></div></div>
        <div class="stat-card"><div class="stat-icon green"><i class="fa-solid fa-check"></i></div><div><div class="stat-val">5</div><div class="stat-lbl">Completed</div></div></div>
      </div>
      <div class="card">
        <h2>TAT Tips & Guidelines</h2>
        <div style="margin-top:12px;display:grid;gap:10px">
          ${['Always write a positive, constructive story with a happy ending.','Hero of the story should always overcome obstacles and succeed.','Reflect OLQ traits: Courage, Initiative, Determination, Leadership.','Keep language simple and direct — avoid complex vocabulary.','Minimum 60 words, maximum 80 words per story.'].map(t=>`
          <div style="display:flex;gap:12px;align-items:flex-start;padding:10px;background:var(--bg-secondary);border-radius:8px;font-size:13px">
            <i class="fa-solid fa-chevron-right" style="color:var(--accent);margin-top:2px"></i>${t}
          </div>`).join('')}
        </div>
      </div>
      <div style="margin-top:20px;text-align:center"><button class="btn-start" onclick="showToast('TAT Session starting...')"><i class="fa-solid fa-play"></i> START TAT PRACTICE</button></div>`
  },
  wat: {
    title: 'WAT (Psychology)',
    render: () => `
      <div class="page-hero">
        <div class="page-tag"><i class="fa-solid fa-comment-dots"></i> PSYCHOLOGY TEST</div>
        <h1>Word Association <span>Test</span></h1>
        <p>60 words are flashed one by one for 15 seconds each. Write the first meaningful sentence that comes to your mind. Reveals subconscious personality.</p>
      </div>
      <div class="stats-row" style="margin-bottom:20px">
        <div class="stat-card"><div class="stat-icon blue"><i class="fa-solid fa-w"></i></div><div><div class="stat-val">60</div><div class="stat-lbl">Words</div></div></div>
        <div class="stat-card"><div class="stat-icon yellow"><i class="fa-solid fa-clock"></i></div><div><div class="stat-val">15 Sec</div><div class="stat-lbl">Per Word</div></div></div>
        <div class="stat-card"><div class="stat-icon purple"><i class="fa-solid fa-brain"></i></div><div><div class="stat-val">OLQ</div><div class="stat-lbl">Based Scoring</div></div></div>
        <div class="stat-card"><div class="stat-icon green"><i class="fa-solid fa-check"></i></div><div><div class="stat-val">3</div><div class="stat-lbl">Completed</div></div></div>
      </div>
      <div style="text-align:center;margin-top:30px"><button class="btn-start" onclick="showToast('WAT Session starting...')"><i class="fa-solid fa-play"></i> START WAT PRACTICE</button></div>`
  },
  srt: {
    title: 'SRT (Psychology)',
    render: () => `
      <div class="page-hero">
        <div class="page-tag"><i class="fa-solid fa-circle-question"></i> PSYCHOLOGY TEST</div>
        <h1>Situation Reaction <span>Test</span></h1>
        <p>60 real-life situations are presented. Write what you would DO, SAY, FEEL & THINK in each. 30 seconds per situation. Tests your decision-making under pressure.</p>
      </div>
      <div style="text-align:center;margin-top:40px"><button class="btn-start" onclick="showToast('SRT Session starting...')"><i class="fa-solid fa-play"></i> START SRT PRACTICE</button></div>`
  },
  sd: {
    title: 'Self Description',
    render: () => `
      <div class="page-hero">
        <div class="page-tag"><i class="fa-solid fa-pen-to-square"></i> PSYCHOLOGY TEST</div>
        <h1>Self <span>Description</span></h1>
        <p>Write what your Parents, Teachers, Friends, and YOU think about yourself. Each in ~60 words within 4 minutes. Be honest and positive.</p>
      </div>
      <div style="text-align:center;margin-top:40px"><button class="btn-start" onclick="showToast('SD Practice starting...')"><i class="fa-solid fa-play"></i> START SD PRACTICE</button></div>`
  },
  ppdt: {
    title: 'PPDT Round',
    render: () => `
      <div class="page-hero">
        <div class="page-tag"><i class="fa-solid fa-images"></i> GROUP TESTING</div>
        <h1>PPDT <span>Round</span></h1>
        <p>Picture Perception & Description Test — Observe a hazy image for 30 seconds. Write a story in 4 minutes. Then narrate and discuss in a group.</p>
      </div>
      <div style="text-align:center;margin-top:40px"><button class="btn-start" onclick="showToast('PPDT Practice starting...')"><i class="fa-solid fa-play"></i> START PPDT PRACTICE</button></div>`
  },
  interview: {
    title: 'AI Virtual Interview',
    render: () => `
      <div class="ai-hero">
        <div class="ai-badge"><i class="fa-solid fa-robot"></i> AI POWERED — BETA</div>
        <h1>AI Virtual <span style="color:var(--accent)">Interview</span></h1>
        <p>Practice your SSB Personal Interview with our intelligent AI interviewer. Get real-time feedback on your answers, body language cues, and confidence score.</p>
        <button class="btn-start" onclick="showToast('AI Interview session initializing...')"><i class="fa-solid fa-video"></i> START AI INTERVIEW</button>
      </div>
      <div class="modules-grid">
        ${[
          ['yellow','fa-microphone','Voice Interview','Speak your answers — AI evaluates tone & content'],
          ['blue','fa-keyboard','Text Interview','Type your answers for detailed AI analysis'],
          ['green','fa-chart-bar','Performance Report','View your past interview scores & feedback'],
        ].map(([c,i,h,p])=>`
          <div class="module-card ${c}"><div class="module-icon ${c}"><i class="fa-solid ${i}"></i></div><h3>${h}</h3><p>${p}</p></div>`).join('')}
      </div>`
  },
  piq: {
    title: 'PIQ Form',
    render: () => `
      <div class="page-hero">
        <div class="page-tag"><i class="fa-solid fa-id-card"></i> PIQ FORM</div>
        <h1>Personal Information <span>Questionnaire</span></h1>
        <p>Fill in your PIQ form digitally. Practice answering all sections — Personal, Family, Education, Hobbies, Achievements. Get ready before your SSB date.</p>
      </div>
      <div style="text-align:center;margin-top:40px"><button class="btn-start" onclick="showToast('PIQ Form loaded!')"><i class="fa-solid fa-file-pen"></i> OPEN PIQ FORM</button></div>`
  },
  journey: {
    title: 'SSB Journey',
    render: () => `
      <div class="page-hero">
        <div class="page-tag"><i class="fa-solid fa-map"></i> SSB JOURNEY</div>
        <h1>Your SSB <span>Roadmap</span></h1>
        <p>A complete day-by-day breakdown of the 5-day SSB Interview process. Know exactly what to expect at each stage.</p>
      </div>
      <div style="display:grid;gap:14px">
        ${[
          ['Day 1','Reporting & Screening','OIR Tests (Verbal + Non-Verbal) + PPDT','blue'],
          ['Day 2','Psychology Tests','TAT, WAT, SRT & Self Description','purple'],
          ['Day 3','GTO Day 1','Group Discussion, Group Planning, PGT, HGT','green'],
          ['Day 4','GTO Day 2','Individual Obstacles, Command Task, FGT','yellow'],
          ['Day 5','Personal Interview','IO + GTO + Psych Conference, Results','red'],
        ].map(([d,h,p,c])=>`
          <div class="stat-card" style="gap:20px">
            <div class="stat-icon ${c}"><span style="font-family:Rajdhani;font-size:18px;font-weight:700">${d}</span></div>
            <div><div style="font-weight:700;margin-bottom:4px">${h}</div><div style="font-size:12px;color:var(--text-secondary)">${p}</div></div>
          </div>`).join('')}
      </div>`
  },
  practice: { title: 'Daily Practice', render: () => `<div class="page-hero"><div class="page-tag"><i class="fa-solid fa-clock-rotate-left"></i> DAILY PRACTICE</div><h1>Daily <span>Practice Hub</span></h1><p>Structured daily practice schedule to maximize your SSB preparation efficiency.</p></div><div style="text-align:center;margin-top:40px"><button class="btn-start" onclick="showToast('Loading today\'s practice...')"><i class="fa-solid fa-play"></i> START TODAY'S PRACTICE</button></div>` },
  news: { title: 'Daily News', render: () => `<div class="page-hero"><div class="page-tag"><i class="fa-solid fa-globe"></i> LIVE UPDATES</div><h1>Daily Defence <span>News</span></h1><p>Stay updated with the latest defence current affairs, important for your SSB interview.</p></div>` },
  guide: { title: 'Platform Guide (SOP)', render: () => `<div class="page-hero"><div class="page-tag"><i class="fa-solid fa-book-open"></i> PLATFORM GUIDE</div><h1>Platform <span>Guide (SOP)</span></h1><p>Learn how to use SSBPREP.ONLINE effectively. A complete walkthrough of all features and modules.</p></div>` },
  fitness: { title: 'Fitness Tracker', render: () => `<div class="page-hero"><div class="page-tag"><i class="fa-solid fa-dumbbell"></i> FITNESS</div><h1>Fitness <span>Tracker</span></h1><p>Track your physical fitness progress. Daily exercise logs, CPSS standards, and personalized workout plans.</p></div>` },
  leaderboard: { title: 'Leaderboard', render: () => `<div class="page-hero"><div class="page-tag"><i class="fa-solid fa-trophy"></i> LEADERBOARD</div><h1>Top <span>Cadets</span></h1><p>Compete with thousands of SSB aspirants across India. See where you stand!</p></div>` },
  gd: { title: 'GD (Group Discussions)', render: () => `<div class="page-hero"><div class="page-tag"><i class="fa-solid fa-users"></i> GROUP DISCUSSION</div><h1>Group <span>Discussion</span></h1><p>Practice GD topics relevant to SSB — Defence, Current Affairs, Social Issues, Abstract topics.</p></div>` },
};

function navigate(page) {
  const p = pages[page];
  if (!p) return;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.page === page));
  document.getElementById('pageTitle').textContent = p.title;
  document.getElementById('content').innerHTML = p.render();
}

function setTab(btn) {
  btn.closest('.tabs').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function startOIR(n) { showToast(`Loading OIR Set #${n}...`); }

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<i class="fa-solid fa-check-circle"></i>${msg}`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// Sidebar toggle
document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

// Nav clicks
document.querySelectorAll('.nav-item').forEach(el => {
  el.addEventListener('click', e => { e.preventDefault(); navigate(el.dataset.page); });
});

// Login modal
document.getElementById('loginBtn').addEventListener('click', () => {
  document.getElementById('loginModal').classList.add('hidden');
  navigate('dashboard');
  showToast('Welcome back, Cadet!');
});
document.getElementById('modalBack').addEventListener('click', () => {
  document.getElementById('loginModal').classList.add('hidden');
  navigate('dashboard');
});

// Init
navigate('dashboard');
