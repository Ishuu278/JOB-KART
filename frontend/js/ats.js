/* js/ats.js — ATS Scanner page logic */
(function () {
  'use strict';

  var CIRC = 2 * Math.PI * 62; // score ring circumference

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function verdict(score) {
    if (score >= 80) return { text: 'Excellent — recruiter-ready', color: '#10B981' };
    if (score >= 60) return { text: 'Good — a few tweaks away', color: '#2563EB' };
    if (score >= 40) return { text: 'Needs work — follow the fixes', color: '#F59E0B' };
    return { text: 'Weak — rebuild key sections', color: '#EF4444' };
  }

  function fitColor(fit) {
    if (fit >= 60) return '#10B981';
    if (fit >= 35) return '#2563EB';
    if (fit >= 20) return '#F59E0B';
    return '#EF4444';
  }

  function initDarkMode() {
    var saved = localStorage.getItem('jobkart-theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    var toggle = document.getElementById('darkModeToggle');
    if (toggle) toggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('jobkart-theme', next);
    });
  }

  function renderReport(d) {
    document.getElementById('atsLoading').style.display = 'none';
    document.getElementById('atsReport').style.display = 'block';

    var r = d.resume;
    var v = verdict(r.overall);

    // Score ring
    var arc = document.getElementById('scoreArc');
    arc.style.strokeDashoffset = CIRC - (r.overall / 100) * CIRC;
    arc.style.stroke = v.color;
    var num = document.getElementById('scoreNum');
    num.textContent = r.overall;
    num.style.color = v.color;
    var verdictEl = document.getElementById('scoreVerdict');
    verdictEl.textContent = v.text;
    verdictEl.style.color = v.color;

    // Section bars
    var bars = document.getElementById('sectionBars');
    var order = [['skills', 'Skills & Keywords'], ['structure', 'Structure & Format'], ['experience', 'Experience Depth']];
    bars.innerHTML = order.map(function (pair) {
      var sec = r.sections[pair[0]];
      if (!sec) return '';
      var pct = Math.round(sec.score);
      return '<div class="ats-section-row">' +
        '<div class="lbl"><span>' + pair[1] + '</span><span>' + pct + '</span></div>' +
        '<div class="ats-bar"><i style="width:' + pct + '%"></i></div></div>';
    }).join('');

    // Detected skills
    var detected = (r.sections.skills && r.sections.skills.detected) || [];
    document.getElementById('skillCount').textContent = detected.length;
    document.getElementById('skillsList').innerHTML = detected.length
      ? detected.map(function (s) { return '<span class="chip">' + esc(s) + '</span>'; }).join('')
      : '<span style="font-size:0.82rem;color:var(--dash-text-muted,#5A6B87);">No dictionary skills detected — add a Skills section.</span>';

    // Suggestions
    var sugg = document.getElementById('suggestionsList');
    sugg.innerHTML = d.suggestions.length
      ? d.suggestions.map(function (s) {
          return '<div class="ats-sugg ats-sugg--' + s.priority + '">' +
            '<span class="pri">' + s.priority + '</span>' +
            '<div><strong>' + esc(s.area) + ':</strong> ' + esc(s.text) + '</div></div>';
        }).join('')
      : '<div class="ats-sugg ats-sugg--low"><span class="pri">great</span><div>No critical issues found — your resume reads well to ATS parsers.</div></div>';

    // Job matches
    var jobs = document.getElementById('jobMatches');
    jobs.innerHTML = d.jobMatches.length
      ? d.jobMatches.map(function (m) {
          var circ = 2 * Math.PI * 25;
          var col = fitColor(m.fit);
          var have = (m.matchedSkills || []).slice(0, 5).map(function (s) { return '<span class="chip chip--have">' + esc(s) + '</span>'; }).join('');
          var miss = (m.missingSkills || []).slice(0, 4).map(function (s) { return '<span class="chip chip--miss">' + esc(s) + '</span>'; }).join('');
          return '<div class="job-match">' +
            '<div class="meta">' +
              '<h4>' + esc(m.title) + (m.companyId && m.companyId.name ? ' · <span style="font-weight:500;">' + esc(m.companyId.name) + '</span>' : '') + '</h4>' +
              '<p>' + esc([m.type, m.location, m.sal].filter(Boolean).join(' · ')) + '</p>' +
              ((have || miss) ? '<div class="chips">' + have + miss + '</div>' : '') +
            '</div>' +
            '<a href="job-details.html?id=' + m.jobId + '" title="View job" style="text-decoration:none;">' +
              '<div class="fit-ring"><svg width="58" height="58">' +
                '<circle cx="29" cy="29" r="25" stroke="var(--dash-card-border,#E2E8F0)"></circle>' +
                '<circle cx="29" cy="29" r="25" stroke="' + col + '" stroke-dasharray="' + circ + '" stroke-dashoffset="' + (circ - (m.fit / 100) * circ) + '"></circle>' +
              '</svg><div class="fit-text" style="color:' + col + ';">' + m.fit + '</div></div>' +
            '</a>' +
          '</div>';
        }).join('')
      : '<p style="font-size:0.86rem;color:var(--dash-text-muted,#5A6B87);">No active jobs to match against right now.</p>';

    // Checklist — flatten section checks
    var checks = []
      .concat(r.sections.skills.checks, r.sections.structure.checks, r.sections.experience.checks);
    document.getElementById('checksList').innerHTML = checks.map(function (c) {
      var ok = c.ok === true || (c.ok === undefined && (c.value || 0) > 0);
      var icon = c.ok === undefined ? '' : (c.ok ? '<span class="ok">✓</span> ' : '<span class="bad">✗</span> ');
      var note = c.note ? ' — <span style="color:var(--dash-text-muted,#5A6B87);">' + esc(c.note) + '</span>' : '';
      return '<div class="ats-check">' + icon + '<span><strong>' + esc(c.label) + '</strong>' + note + '</span></div>';
    }).join('');
  }

  function renderNoResume(code) {
    document.getElementById('atsLoading').style.display = 'none';
    var el = document.getElementById(code === 'SCANNED_PDF' ? 'atsScannedPdf' : 'atsNoResume');
    if (el) el.style.display = 'block';
  }

  // ===== INIT =====
  initDarkMode();

  if (typeof api === 'undefined' || !api.isLoggedIn()) {
    document.getElementById('atsLoading').innerHTML =
      '<div class="ats-empty"><div class="big">🔐</div><h3 style="margin:0 0 6px;">Please sign in</h3>' +
      '<p style="color:var(--dash-text-muted,#5A6B87);font-size:0.9rem;">The ATS scanner works on your uploaded resume.</p>' +
      '<a class="ats-btn" href="login.html">Sign in</a></div>';
    return;
  }

  var currentUser = api.getUser();
  if (currentUser && currentUser.role !== 'candidate') {
    document.getElementById('atsLoading').innerHTML =
      '<div class="ats-empty"><div class="big">🎯</div><h3 style="margin:0 0 6px;">Candidate feature</h3>' +
      '<p style="color:var(--dash-text-muted,#5A6B87);font-size:0.9rem;">The ATS resume scanner analyses a candidate\'s own resume and job fit. Recruiter accounts do not have a resume profile.</p>' +
      '<a class="ats-btn" href="recruiter-dashboard.html">Back to dashboard</a></div>';
    return;
  }

  api.get('/ats/report')
    .then(renderReport)
    .catch(function (err) {
      if (err && err.code === 'NO_RESUME') return renderNoResume('NO_RESUME');
      if (err && err.code === 'SCANNED_PDF') return renderNoResume('SCANNED_PDF');
      // api.js throws Error(message) — detect by message text for the two known codes
      var msg = (err && err.message) || '';
      if (/Upload a PDF resume first/i.test(msg)) return renderNoResume('NO_RESUME');
      if (/scanned image|no readable text/i.test(msg)) return renderNoResume('SCANNED_PDF');
      document.getElementById('atsLoading').innerHTML =
        '<div class="ats-empty"><div class="big">⚠️</div><h3 style="margin:0 0 6px;">Could not load report</h3>' +
        '<p style="color:var(--dash-text-muted,#5A6B87);font-size:0.9rem;">' + esc(msg || 'Something went wrong.') + '</p></div>';
    });
})();
