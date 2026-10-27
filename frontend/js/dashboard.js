/* ============================================================
   js/dashboard.js — Job-Kart Dashboard Logic
   Candidate & Recruiter Dashboards
   ============================================================ */

(function () {
  'use strict';

  // ===== DATA DEFAULTS (populated from API) =====
  // Empty defaults — real data is fetched from the backend

  var CANDIDATE_DATA = {
    user: { name: '', initials: '', email: '' },
    stats: { totalApplications: 0, applied: 0, underReview: 0, interviewScheduled: 0, selected: 0, rejected: 0 },
    profileCompletion: { percentage: 0, items: [] },
    resumeViews: { today: 0, thisWeek: 0, total: 0 },
    upcomingInterviews: [],
    recentActivity: [],
    savedJobs: [],
    applicationTimeline: { currentStage: 0, stages: ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected'] },
    charts: {
      applicationsPerMonth: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], data: [0, 0, 0, 0, 0, 0] },
      statusDistribution: {
        labels: ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
        data: [0, 0, 0, 0, 0, 0],
        colors: ['#3B82F6', '#F59E0B', '#14B8A6', '#8B5CF6', '#10B981', '#EF4444']
      }
    }
  };

  var RECRUITER_DATA = {
    user: { name: '', initials: '', company: '', email: '' },
    stats: { activeJobs: 0, totalApplications: 0, shortlisted: 0, totalJobViews: 0 },
    pipeline: { applied: 0, underReview: 0, shortlisted: 0, interview: 0, selected: 0, total: 0 },
    recentApplicants: [],
    recentActivity: [],
    charts: {
      applicationsPerJob: { labels: [], data: [] },
      hiringStatus: {
        labels: ['Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
        data: [0, 0, 0, 0, 0],
        colors: ['#F59E0B', '#06B6D4', '#8B5CF6', '#10B981', '#EF4444']
      },
      jobViewsOverTime: { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], data: [0, 0, 0, 0] }
    }
  };


  // ===== SVG ICON HELPERS =====
  var ICONS = {
    briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    trendUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    trendDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    barChart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
    chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    inbox: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>'
  };

  function getActivityIcon(type) {
    switch (type) {
      case 'applied': case 'applicant': return ICONS.send;
      case 'viewed': return ICONS.eye;
      case 'interview': return ICONS.video;
      case 'saved': return ICONS.bookmark;
      case 'selected': return ICONS.check;
      case 'rejected': return ICONS.x;
      case 'shortlisted': return ICONS.star;
      case 'posted': return ICONS.briefcase;
      default: return ICONS.clock;
    }
  }


  // ===== USER HELPERS =====
  function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(function(w) { return w.charAt(0); }).join('').toUpperCase().slice(0, 2);
  }

  function populateDashboardHeader(user) {
    if (!user) return;
    var avatarEl = document.getElementById('dashAvatar');
    var welcomeEl = document.getElementById('dashWelcome');
    if (avatarEl) {
      avatarEl.textContent = getInitials(user.name);
      // Show the uploaded photo if present
      if (user.profilePhoto) {
        avatarEl.style.backgroundImage = 'url(' + user.profilePhoto + ')';
        avatarEl.style.backgroundSize = 'cover';
        avatarEl.style.backgroundPosition = 'center';
        avatarEl.style.color = 'transparent';
        avatarEl.textContent = '';
      } else {
        avatarEl.style.backgroundImage = '';
        avatarEl.style.color = '';
      }
    }
    if (welcomeEl) welcomeEl.textContent = 'Welcome back, ' + user.name.split(' ')[0];
  }

  var STATUS_LABELS = {
    applied: 'Applied',
    underReview: 'Under Review',
    shortlisted: 'Shortlisted',
    interview: 'Interview',
    interviewScheduled: 'Interview Scheduled',
    selected: 'Selected',
    rejected: 'Rejected'
  };

  var STATUS_PHOTOS = [
    'https://i.pravatar.cc/150?img=1',
    'https://i.pravatar.cc/150?img=2',
    'https://i.pravatar.cc/150?img=3',
    'https://i.pravatar.cc/150?img=4',
    'https://i.pravatar.cc/150?img=5',
    'https://i.pravatar.cc/150?img=6',
    'https://i.pravatar.cc/150?img=7',
    'https://i.pravatar.cc/150?img=8',
    'https://i.pravatar.cc/150?img=9',
    'https://i.pravatar.cc/150?img=10'
  ];

  function getPhotoForIndex(i) {
    return STATUS_PHOTOS[i % STATUS_PHOTOS.length];
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[d.getMonth()] + ' ' + d.getDate();
  }

  function renderApplicantRow(app, index) {
    var candidate = app.candidateId || {};
    var job = app.jobId || {};
    var name = candidate.name || 'Unknown';
    var photo = candidate.profilePhoto || getPhotoForIndex(index);
    var jobTitle = job.title || 'Unknown Position';
    var status = app.status || 'applied';
    var label = STATUS_LABELS[status] || status;
    var date = formatDate(app.appliedDate || app.createdAt);

    var options = Object.keys(STATUS_LABELS).map(function(s) {
      return '<option value="' + s + '"' + (s === status ? ' selected' : '') + '>' + STATUS_LABELS[s] + '</option>';
    }).join('');

    return '<div class="applicant-row" data-name="' + name + '" data-role="' + jobTitle + '" data-status="' + status + '">' +
      '<img src="' + photo + '" alt="' + name + '" class="applicant-photo">' +
      '<div class="applicant-info">' +
        '<div class="applicant-name">' + name + '</div>' +
        '<div class="applicant-role">' + jobTitle + '</div>' +
      '</div>' +
      '<div class="applicant-date">' + date + '</div>' +
      '<span class="status-badge status-badge--' + status + '">' + label + '</span>' +
      '<select class="applicant-status-select" data-app-id="' + (app._id || '') + '" title="Change application status">' + options + '</select>' +
    '</div>';
  }

  function renderApplicantList(applications, meta) {
    var container = document.getElementById('applicantList');
    if (!container) return;
    meta = meta || {};

    if (!applications || applications.length === 0) {
      if (!__applicantsAppend) {
        container.innerHTML = '<div style="text-align:center; padding:32px 16px; color:var(--text-muted);">No applications found</div>';
      }
      return;
    }

    var html = applications.map(function(app, i) {
      return renderApplicantRow(app, i);
    }).join('');

    if (__applicantsAppend) {
      // strip an old Load More row before appending
      var oldMore = container.querySelector('.applicants-load-more');
      if (oldMore) oldMore.remove();
      container.insertAdjacentHTML('beforeend', html);
    } else {
      container.innerHTML = html;
    }

    // Wire status-update dropdowns (recruiter moves candidates through the pipeline)
    container.querySelectorAll('.applicant-status-select').forEach(function(sel) {
      sel.addEventListener('change', function() {
        var appId = sel.getAttribute('data-app-id');
        var newStatus = sel.value;
        var badge = sel.closest('.applicant-row').querySelector('.status-badge');
        sel.disabled = true;
        api.put('/applications/' + appId + '/status', { status: newStatus })
          .then(function() {
            if (badge) {
              badge.className = 'status-badge status-badge--' + newStatus;
              badge.textContent = STATUS_LABELS[newStatus] || newStatus;
            }
            sel.closest('.applicant-row').setAttribute('data-status', newStatus);
            showToast('Status updated to "' + (STATUS_LABELS[newStatus] || newStatus) + '"', 'success');
          })
          .catch(function(err) {
            sel.value = app.status; // revert on failure
            showToast(err.message || 'Failed to update status', 'error');
          })
          .finally(function() { sel.disabled = false; });
      });
    });

    // Re-init search and pagination for the new rows
    initApplicantSearch();
    updatePagination();

    // Load More (server-side pagination)
    var oldWrap = container.querySelector('.applicants-load-more');
    if (oldWrap) oldWrap.remove();
    if (meta.hasMore) {
      var wrap = document.createElement('div');
      wrap.className = 'applicants-load-more';
      wrap.style.cssText = 'text-align:center; padding:14px;';
      wrap.innerHTML = '<button style="padding:9px 26px; border:1px solid var(--dash-card-border,#E2E8F0); background:var(--dash-bg,#F6F8FC); color:var(--dash-text,#0F1D33); border-radius:999px; font-weight:700; font-size:0.8rem; cursor:pointer;">Load More Applicants</button>';
      container.appendChild(wrap);
      wrap.querySelector('button').addEventListener('click', function () {
        this.textContent = 'Loading…';
        this.disabled = true;
        __applicantsPage += 1;
        __applicantsAppend = true;
        fetchAndRenderApplicants(); // NO reset — advance to next page
      });
    }
    __applicantsAppend = false;
  }

  var __applicantsPage = 1;
  var __applicantsAppend = false;
  var APPLICANT_PAGE_SIZE = 8;

  function fetchAndRenderApplicants(reset) {
    if (typeof api === 'undefined' || !api.isLoggedIn()) return;
    if (reset) { __applicantsPage = 1; __applicantsAppend = false; }

    api.get('/applications/all?page=' + __applicantsPage + '&limit=' + APPLICANT_PAGE_SIZE)
      .then(function(data) {
        renderApplicantList(data.applications || [], data);
      })
      .catch(function() {
        // Silently fail — keep whatever is on screen
      });
  }


  // ===== RECRUITER: POST A JOB MODAL =====
  function initPostJobModal() {
    var openBtn = document.getElementById('postJobBtn');
    var modal = document.getElementById('postJobModal');
    if (!openBtn || !modal) return; // recruiter-only page

    var closeBtn = document.getElementById('postJobClose');
    var cancelBtn = document.getElementById('postJobCancel');
    var form = document.getElementById('postJobForm');

    function open() { modal.style.display = 'block'; document.body.style.overflow = 'hidden'; }
    function close() { modal.style.display = 'none'; document.body.style.overflow = ''; }

    openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (cancelBtn) cancelBtn.addEventListener('click', close);
    modal.addEventListener('click', function(e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') close(); });

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var fd = new FormData(form);
      var skills = (fd.get('skills') || '').split(',').map(function(s) { return s.trim(); }).filter(Boolean);
      var payload = {
        title: fd.get('title'),
        description: fd.get('description'),
        type: fd.get('type'),
        location: fd.get('location'),
        exp: fd.get('exp'),
        sal: fd.get('sal'),
        skills: skills,
        fresher: fd.get('fresher') === 'on'
      };

      var submitBtn = document.getElementById('postJobSubmit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Publishing...';

      api.post('/jobs', payload).then(function() {
        showToast('Job published — it is now live on Openings!', 'success');
        close();
        form.reset();
        setTimeout(function() { window.location.reload(); }, 900);
      }).catch(function(err) {
        showToast(err.message || 'Failed to publish job', 'error');
      }).finally(function() {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Publish Job';
      });
    });
  }

  // ===== MY PROFILE MODAL (candidate) =====
  function initProfileModal() {
    var openBtn = document.getElementById('editProfileBtn');
    var modal = document.getElementById('profileModal');
    if (!modal) return; // candidate-only page

    var avatarWrap = document.getElementById('pmAvatarWrap');
    var avatarImg = document.getElementById('pmAvatarImg');
    var initialsEl = document.getElementById('pmInitials');
    var photoInput = document.getElementById('pmPhotoInput');
    var photoStatus = document.getElementById('pmPhotoStatus');
    var resumeDrop = document.getElementById('pmResumeDrop');
    var resumeInput = document.getElementById('pmResumeInput');
    var resumeText = document.getElementById('pmResumeText');
    var resumeResult = document.getElementById('pmResumeResult');
    var form = document.getElementById('profileForm');
    var saveBtn = document.getElementById('profileSaveBtn');
    var closeBtn = document.getElementById('profileClose');
    var cancelBtn = document.getElementById('profileCancel');

    function currentUser() { return (typeof api !== 'undefined' && api.getUser()) || {}; }

    function open() {
      var user = currentUser();
      // Fill form
      form.elements['name'].value = user.name || '';
      form.elements['phone'].value = user.phone || '';
      form.elements['skills'].value = (user.skills || []).join(', ');
      form.elements['experience'].value = user.experience || '';
      form.elements['education'].value = user.education || '';
      form.elements['portfolioUrl'].value = user.portfolioUrl || '';
      // Fill avatar
      if (user.profilePhoto) {
        avatarImg.src = user.profilePhoto;
        avatarImg.style.display = 'block';
        initialsEl.style.display = 'none';
      } else {
        avatarImg.style.display = 'none';
        initialsEl.style.display = 'block';
        initialsEl.textContent = getInitials(user.name);
      }
      // Fill resume line
      updateResumeLine(user);
      resumeResult.style.display = 'none';
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }

    function updateResumeLine(user) {
      if (user && user.resume) {
        var fname = user.resume.split('/').pop().replace(/^resume-\d+-[0-9a-f]+-?/, '');
        resumeText.innerHTML = '✅ Resume uploaded — <a href="' + user.resume + '" target="_blank" style="color:#2563EB; font-weight:600;">view current file</a> · click to replace';
      } else {
        resumeText.textContent = 'Drag & drop your PDF here, or click to browse';
      }
    }

    function close() {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }

    if (openBtn) openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (cancelBtn) cancelBtn.addEventListener('click', close);
    modal.addEventListener('click', function(e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') close(); });
    if (avatarWrap) avatarWrap.addEventListener('click', function() { photoInput.click(); });
    if (resumeDrop) {
      resumeDrop.addEventListener('click', function() { resumeInput.click(); });
      ['dragover', 'dragenter'].forEach(function(ev) {
        resumeDrop.addEventListener(ev, function(e) {
          e.preventDefault();
          resumeDrop.style.borderColor = '#2563EB';
          resumeDrop.style.background = 'rgba(37,99,235,0.05)';
        });
      });
      ['dragleave', 'drop'].forEach(function(ev) {
        resumeDrop.addEventListener(ev, function(e) {
          e.preventDefault();
          resumeDrop.style.borderColor = '';
          resumeDrop.style.background = '';
        });
      });
      resumeDrop.addEventListener('drop', function(e) {
        var files = e.dataTransfer && e.dataTransfer.files;
        if (files && files[0]) uploadResumeFile(files[0]);
      });
    }
    if (resumeInput) resumeInput.addEventListener('change', function() {
      if (resumeInput.files && resumeInput.files[0]) uploadResumeFile(resumeInput.files[0]);
    });
    if (photoInput) photoInput.addEventListener('change', function() {
      if (photoInput.files && photoInput.files[0]) uploadPhotoFile(photoInput.files[0]);
    });

    // ---- photo upload ----
    function uploadPhotoFile(file) {
      if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
        showToast('Only JPG, PNG or WebP images are allowed', 'error');
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        showToast('Photo too large — max 3 MB', 'error');
        return;
      }
      photoStatus.textContent = 'Uploading…';
      var fd = new FormData();
      fd.append('photo', file);
      var token = api.getToken();
      fetch('/api/auth/photo', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: fd })
        .then(function(r) { return r.json().then(function(d) { return { ok: r.ok, d: d }; }); })
        .then(function(res) {
          if (!res.ok) throw new Error(res.d.message || 'Upload failed');
          var user = api.getUser() || {};
          user.profilePhoto = res.d.profilePhoto;
          api.setUser(user);
          avatarImg.src = res.d.profilePhoto;
          avatarImg.style.display = 'block';
          initialsEl.style.display = 'none';
          photoStatus.textContent = 'Photo updated ✓';
          populateDashboardHeader(user);
          showToast('Profile photo updated', 'success');
        })
        .catch(function(err) {
          photoStatus.textContent = 'JPG/PNG · max 3 MB';
          showToast(err.message || 'Photo upload failed', 'error');
        });
    }

    // ---- resume upload ----
    function uploadResumeFile(file) {
      if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
        showToast('Please choose a PDF file', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast('Resume too large — max 5 MB', 'error');
        return;
      }
      resumeText.innerHTML = '<span style="font-weight:600;">Parsing ' + file.name.replace(/</g, '&lt;') + '…</span>';
      resumeResult.style.display = 'none';
      var fd = new FormData();
      fd.append('resume', file);
      var token = api.getToken();
      fetch('/api/auth/resume', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: fd })
        .then(function(r) { return r.json().then(function(d) { return { ok: r.ok, d: d }; }); })
        .then(function(res) {
          if (!res.ok) throw new Error(res.d.message || 'Upload failed');
          var d = res.d;
          var user = api.getUser() || {};
          user.resume = d.resume;
          user.skills = d.user.skills;
          user.phone = d.user.phone;
          user.education = d.user.education;
          user.profileCompletion = d.profileCompletion;
          api.setUser(user);
          updateResumeLine(user);
          // show what was extracted
          var ex = d.extracted || {};
          var html = '<strong>' + (ex.failed ? 'Resume saved, but no readable text was found (scanned PDF?)' : 'Profile updated from your resume!') + '</strong>';
          if (ex.newSkills && ex.newSkills.length) {
            html += '<div style="margin-top:6px;">New skills added: ' + ex.newSkills.map(escapeHtml).join(', ') + '</div>';
          }
          var filled = [];
          if (ex.updated) {
            if (ex.updated.name) filled.push('name');
            if (ex.updated.phone) filled.push('phone');
            if (ex.updated.education) filled.push('education');
          }
          if (filled.length) html += '<div style="margin-top:3px;">Also filled: ' + filled.join(', ') + '</div>';
          html += '<div style="margin-top:6px; font-weight:700;">Profile completion: ' + d.profileCompletion + '%</div>';
          resumeResult.innerHTML = html;
          resumeResult.style.display = 'block';
          // refresh form fields with merged data
          form.elements['skills'].value = (d.user.skills || []).join(', ');
          if (!form.elements['phone'].value) form.elements['phone'].value = d.user.phone || '';
          if (!form.elements['education'].value) form.elements['education'].value = d.user.education || '';
          renderCompletionRing(d.profileCompletion);
          showToast(d.message, 'success');
        })
        .catch(function(err) {
          resumeText.textContent = 'Drag & drop your PDF here, or click to browse';
          showToast(err.message || 'Resume upload failed', 'error');
        });
    }

    // ---- manual profile save ----
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var skills = form.elements['skills'].value.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
      var payload = {
        name: form.elements['name'].value.trim(),
        phone: form.elements['phone'].value.trim(),
        skills: skills,
        experience: form.elements['experience'].value.trim(),
        education: form.elements['education'].value.trim(),
        portfolioUrl: form.elements['portfolioUrl'].value.trim()
      };
      if (!payload.name) {
        showToast('Name is required', 'error');
        return;
      }
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving…';
      api.put('/auth/profile', payload)
        .then(function(updated) {
          var user = api.getUser() || {};
          user.name = updated.name;
          user.phone = updated.phone;
          user.skills = updated.skills || [];
          user.experience = updated.experience;
          user.education = updated.education;
          user.portfolioUrl = updated.portfolioUrl;
          user.profileCompletion = updated.profileCompletion;
          api.setUser(user);
          populateDashboardHeader(user);
          initialsEl.textContent = getInitials(user.name);
          renderCompletionRing(updated.profileCompletion);
          showToast('Profile saved — completion ' + updated.profileCompletion + '%', 'success');
          close();
        })
        .catch(function(err) {
          showToast(err.message || 'Could not save profile', 'error');
        })
        .finally(function() {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Save Changes';
        });
    });
  }

  // Update the completion ring + suggestions with a given percent
  function renderCompletionRing(pct) {
    var ring = document.querySelector('.profile-ring-fill');
    var ringText = document.querySelector('.profile-ring-text');
    var badgeEl = document.querySelector('.dash-card-badge');
    if (ring) ring.setAttribute('data-percent', pct);
    if (ringText) ringText.textContent = pct + '%';
    if (badgeEl) badgeEl.textContent = pct + '%';
    animateProfileRing();
  }

  // ===== DARK MODE =====
  function initDarkMode() {
    var toggle = document.getElementById('darkModeToggle');
    if (!toggle) return;

    // Restore saved preference
    var saved = localStorage.getItem('jobkart-theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    }

    toggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'light';
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('jobkart-theme', next);

      showToast(next === 'dark' ? 'Dark mode enabled' : 'Light mode enabled', 'info');

      // Re-render charts with new theme colors
      if (window.__dashCharts) {
        updateChartTheme();
      }
    });
  }


  // ===== TOAST NOTIFICATIONS =====
  var toastTimer = null;

  function showToast(message, type) {
    type = type || 'info';
    var existing = document.querySelector('.dash-toast');
    if (existing) existing.remove();

    var iconSvg = '';
    switch (type) {
      case 'success': iconSvg = ICONS.check; break;
      case 'error': iconSvg = ICONS.x; break;
      case 'warning': iconSvg = ICONS.warning; break;
      default: iconSvg = ICONS.clock; break;
    }

    var toast = document.createElement('div');
    toast.className = 'dash-toast dash-toast--' + type;
    toast.innerHTML = '<span class="dash-toast-icon">' + iconSvg + '</span>' + message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.classList.add('dash-toast--visible');
      });
    });

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('dash-toast--visible');
      setTimeout(function () { toast.remove(); }, 350);
    }, 3000);
  }


  // ===== LOADING SIMULATION =====
  function simulateLoading(callback) {
    var content = document.getElementById('dashContent');
    var skeletons = document.getElementById('dashSkeletons');

    if (skeletons) skeletons.style.display = 'block';
    if (content) content.style.display = 'none';

    setTimeout(function () {
      if (skeletons) skeletons.style.display = 'none';
      if (content) {
        content.style.display = 'block';
        content.classList.add('dash-content-loading');
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            content.classList.add('dash-content-loaded');
          });
        });
      }
      if (callback) callback();
    }, 800);
  }


  // ===== DATE DISPLAY =====
  function setCurrentDate() {
    var el = document.getElementById('dashDate');
    if (!el) return;

    var now = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    el.textContent = now.toLocaleDateString('en-IN', options);
  }


  // ===== COUNTER ANIMATION =====
  function animateValue(element, target, duration) {
    duration = duration || 1200;
    var start = performance.now();

    function update(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      element.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function animateStatCards() {
    var cards = document.querySelectorAll('.dash-stat-value[data-target]');
    cards.forEach(function (card) {
      var target = parseInt(card.getAttribute('data-target'), 10);
      animateValue(card, target, 1200);
    });
  }


  // ===== PIPELINE BAR ANIMATION =====
  function animatePipeline() {
    var bars = document.querySelectorAll('.pipeline-bar-fill[data-width]');
    bars.forEach(function (bar) {
      setTimeout(function () {
        bar.style.width = bar.getAttribute('data-width') + '%';
      }, 100);
    });
  }


  // ===== PROFILE RING ANIMATION =====
  function animateProfileRing() {
    var ring = document.querySelector('.profile-ring-fill');
    if (!ring) return;

    var pct = parseInt(ring.getAttribute('data-percent'), 10) || 0;
    var circumference = 2 * Math.PI * 42; // radius = 42
    var offset = circumference - (pct / 100) * circumference;

    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = circumference;

    setTimeout(function () {
      ring.style.strokeDashoffset = offset;
    }, 200);
  }


  // ===== CHART.JS INTEGRATION =====
  window.__dashCharts = {};

  function getChartFontColor() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? '#94A3B8' : '#64748B';
  }

  function getChartGridColor() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  }

  function getChartBgColor() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? '#1E293B' : '#FFFFFF';
  }

  function updateChartTheme() {
    var fontColor = getChartFontColor();
    var gridColor = getChartGridColor();

    Object.keys(window.__dashCharts).forEach(function (key) {
      var chart = window.__dashCharts[key];
      if (!chart) return;

      if (chart.options.scales && chart.options.scales.x) {
        chart.options.scales.x.ticks.color = fontColor;
        chart.options.scales.x.grid.color = gridColor;
      }
      if (chart.options.scales && chart.options.scales.y) {
        chart.options.scales.y.ticks.color = fontColor;
        chart.options.scales.y.grid.color = gridColor;
      }
      if (chart.options.plugins && chart.options.plugins.legend) {
        chart.options.plugins.legend.labels.color = fontColor;
      }

      chart.update();
    });
  }

  function createBarChart(canvasId, labels, data, label) {
    var ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    var chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: label || 'Applications',
          data: data,
          backgroundColor: 'rgba(37, 99, 235, 0.7)',
          borderColor: '#2563EB',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
          hoverBackgroundColor: '#2563EB'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#0F172A',
            titleColor: '#F1F5F9',
            bodyColor: '#CBD5E1',
            borderColor: '#334155',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            titleFont: { family: "'DM Sans', sans-serif", weight: '600' },
            bodyFont: { family: "'DM Sans', sans-serif" }
          }
        },
        scales: {
          x: {
            grid: { color: getChartGridColor(), drawBorder: false },
            ticks: { color: getChartFontColor(), font: { family: "'DM Sans', sans-serif", size: 12 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: getChartGridColor(), drawBorder: false },
            ticks: { color: getChartFontColor(), font: { family: "'DM Sans', sans-serif", size: 12 }, stepSize: 5 }
          }
        },
        animation: {
          duration: 1200,
          easing: 'easeOutQuart'
        }
      }
    });

    return chart;
  }

  function createDonutChart(canvasId, labels, data, colors) {
    var ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    var chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderColor: getChartBgColor(),
          borderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: getChartFontColor(),
              font: { family: "'DM Sans', sans-serif", size: 12 },
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 10
            }
          },
          tooltip: {
            backgroundColor: '#0F172A',
            titleColor: '#F1F5F9',
            bodyColor: '#CBD5E1',
            borderColor: '#334155',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            titleFont: { family: "'DM Sans', sans-serif", weight: '600' },
            bodyFont: { family: "'DM Sans', sans-serif" }
          }
        },
        animation: {
          animateRotate: true,
          duration: 1200,
          easing: 'easeOutQuart'
        }
      }
    });

    return chart;
  }

  function createLineChart(canvasId, labels, data, label) {
    var ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    var chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: label || 'Views',
          data: data,
          borderColor: '#2563EB',
          backgroundColor: 'rgba(37, 99, 235, 0.08)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#2563EB',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#2563EB',
          pointHoverBorderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#0F172A',
            titleColor: '#F1F5F9',
            bodyColor: '#CBD5E1',
            borderColor: '#334155',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            titleFont: { family: "'DM Sans', sans-serif", weight: '600' },
            bodyFont: { family: "'DM Sans', sans-serif" }
          }
        },
        scales: {
          x: {
            grid: { color: getChartGridColor(), drawBorder: false },
            ticks: { color: getChartFontColor(), font: { family: "'DM Sans', sans-serif", size: 12 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: getChartGridColor(), drawBorder: false },
            ticks: { color: getChartFontColor(), font: { family: "'DM Sans', sans-serif", size: 12 } }
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeOutQuart'
        }
      }
    });

    return chart;
  }


  // ===== DYNAMIC DASHBOARD SECTIONS =====
  function renderActivityFeed(applications) {
    var container = document.getElementById('activityFeed');
    if (!container) return;

    if (!applications || applications.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding:24px 16px; color:var(--text-muted);">No recent activity</div>';
      return;
    }

    var html = '';
    var shown = 0;
    applications.forEach(function(app) {
      if (shown >= 6) return;
      var job = app.jobId || {};
      var company = (job.companyId && typeof job.companyId === 'object') ? job.companyId : {};
      var jobTitle = job.title || 'a position';
      var companyName = company.name || '';
      var status = app.status || 'applied';
      var timeAgo = getTimeAgo(app.appliedDate || app.createdAt);

      var iconClass = 'activity-icon--blue';
      var iconSvg = ICONS.send;
      if (status === 'shortlisted') { iconClass = 'activity-icon--green'; iconSvg = ICONS.star; }
      else if (status === 'interview') { iconClass = 'activity-icon--purple'; iconSvg = ICONS.video; }
      else if (status === 'selected') { iconClass = 'activity-icon--green'; iconSvg = ICONS.check; }
      else if (status === 'rejected') { iconClass = 'activity-icon--red'; iconSvg = ICONS.x; }

      var companyLink = company._id ? '<a href="company.html?id=' + company._id + '" style="color:inherit; text-decoration:none;">' + companyName + '</a>' : companyName;
      html += '<div class="activity-item">' +
        '<div class="activity-icon ' + iconClass + '">' + iconSvg + '</div>' +
        '<div class="activity-content">' +
          '<p class="activity-text">Applied for <strong>' + escapeHtml(jobTitle) + '</strong>' + (companyLink ? ' at ' + companyLink : '') + '</p>' +
          '<span class="activity-time">' + timeAgo + '</span>' +
        '</div>' +
      '</div>';
      shown++;
    });

    if (shown === 0) {
      container.innerHTML = '<div style="text-align:center; padding:24px 16px; color:var(--text-muted);">No recent activity</div>';
    } else {
      container.innerHTML = html;
    }
  }

  function renderSavedJobs() {
    var container = document.getElementById('savedJobsList');
    var badgeEl = document.getElementById('savedJobsBadge');
    if (!container) return;

    var savedIds = [];
    try {
      var raw = localStorage.getItem('jobkart-saved-jobs');
      savedIds = raw ? JSON.parse(raw) : [];
    } catch (e) {}

    if (badgeEl) badgeEl.textContent = savedIds.length + ' saved';

    if (savedIds.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding:24px 16px; color:var(--text-muted);">No saved jobs yet. Browse openings and tap Save to bookmark one.</div>';
      return;
    }

    // Fetch all jobs and filter by saved IDs
    api.get('/jobs').then(function(jobs) {
      var savedJobs = jobs.filter(function(j) { return savedIds.indexOf(j._id) !== -1; }).slice(0, 4);
      if (savedJobs.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:24px 16px; color:var(--text-muted);">No saved jobs found.</div>';
        return;
      }
      var html = '';
      savedJobs.forEach(function(job) {
        var company = job.companyId || {};
        var companyName = company.name || '';
        var companyId = company._id || '';
        html += '<div class="saved-job-item">' +
          '<div class="saved-job-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></div>' +
          '<div class="saved-job-info">' +
            '<div class="saved-job-title">' + escapeHtml(job.title) + '</div>' +
            '<div class="saved-job-company">' + (companyId ? '<a href="company.html?id=' + companyId + '" style="color:inherit; text-decoration:none;">' + escapeHtml(companyName) + '</a>' : escapeHtml(companyName)) + '</div>' +
          '</div>' +
          '<span class="saved-job-date">' + formatDate(job.postedDate) + '</span>' +
        '</div>';
      });
      container.innerHTML = html;
    }).catch(function() {
      container.innerHTML = '<div style="text-align:center; padding:24px 16px; color:var(--text-muted);">Failed to load saved jobs.</div>';
    });
  }

  function renderInterviewsTable(applications) {
    var tbody = document.querySelector('#interviewsTable tbody');
    var badgeEl = document.getElementById('interviewsBadge');
    if (!tbody) return;

    var interviews = applications.filter(function(app) {
      return app.status === 'interview' || app.status === 'shortlisted';
    });

    if (badgeEl) badgeEl.textContent = interviews.length + ' scheduled';

    if (interviews.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:24px; color:var(--text-muted);">No upcoming interviews</td></tr>';
      return;
    }

    var html = '';
    interviews.forEach(function(app) {
      var job = app.jobId || {};
      var company = (job.companyId && typeof job.companyId === 'object') ? job.companyId : {};
      var companyName = company.name || 'Company';
      var companyInitials = companyName.split(' ').map(function(w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase();
      var companyId = company._id || '';
      var jobTitle = job.title || 'Position';

      html += '<tr>' +
        '<td><div class="dash-table-company"><div class="dash-table-company-logo">' + escapeHtml(companyInitials) + '</div>' +
          '<span class="dash-table-strong">' + (companyId ? '<a href="company.html?id=' + companyId + '" style="color:inherit; text-decoration:none;">' + escapeHtml(companyName) + '</a>' : escapeHtml(companyName)) + '</span></div></td>' +
        '<td>' + escapeHtml(jobTitle) + '</td>' +
        '<td>TBD</td>' +
        '<td>TBD</td>' +
        '<td><a href="#" class="dash-btn-sm dash-btn-sm--outline" data-action="view-details">Details</a></td>' +
      '</tr>';
    });
    tbody.innerHTML = html;
  }

  // ===== MY APPLICATIONS TABLE (with withdraw) =====
  function renderMyApplications(applications) {
    var tbody = document.querySelector('#myApplicationsTable tbody');
    var badgeEl = document.getElementById('myAppsBadge');
    if (!tbody) return;

    if (badgeEl) badgeEl.textContent = (applications || []).length + ' total';

    if (!applications || applications.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:24px; color:var(--text-muted);">No applications yet. <a href="openings.html" style="color:var(--accent);">Browse openings →</a></td></tr>';
      return;
    }

    var html = '';
    applications.forEach(function(app) {
      var job = app.jobId || {};
      var company = (job.companyId && typeof job.companyId === 'object') ? job.companyId : {};
      var companyName = company.name || 'Company';
      var companyInitials = companyName.split(' ').map(function(w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase();
      var companyId = company._id || '';
      var jobTitle = job.title || 'Position';
      var jobId = (typeof job === 'object') ? job._id : '';
      var status = app.status || 'applied';
      var label = STATUS_LABELS[status] || status;
      var date = formatDate(app.appliedDate || app.createdAt);

      html += '<tr>' +
        '<td><div class="dash-table-company"><div class="dash-table-company-logo">' + escapeHtml(companyInitials) + '</div>' +
          '<span class="dash-table-strong">' + (companyId ? '<a href="company.html?id=' + companyId + '" style="color:inherit; text-decoration:none;">' + escapeHtml(companyName) + '</a>' : escapeHtml(companyName)) + '</span></div></td>' +
        '<td>' + (jobId ? '<a href="job-details.html?id=' + jobId + '" style="color:inherit; text-decoration:none;">' + escapeHtml(jobTitle) + '</a>' : escapeHtml(jobTitle)) + '</td>' +
        '<td>' + date + '</td>' +
        '<td><span class="status-badge status-badge--' + status + '">' + label + '</span></td>' +
        '<td>' + (status === 'applied' || status === 'underReview'
          ? '<button class="dash-btn-sm dash-btn-sm--outline" data-withdraw-app="' + app._id + '" style="color:#DC2626; border-color:#FCA5A5;">Withdraw</button>'
          : '<span style="color:var(--text-muted); font-size:0.82rem;">—</span>') + '</td>' +
      '</tr>';
    });
    tbody.innerHTML = html;

    tbody.querySelectorAll('[data-withdraw-app]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var appId = btn.getAttribute('data-withdraw-app');
        if (!confirm('Withdraw this application? This cannot be undone.')) return;
        api.put('/applications/mine/' + appId + '/withdraw', {})
          .then(function() {
            showToast('Application withdrawn', 'success');
            btn.closest('tr').style.opacity = '0.4';
            setTimeout(function() { window.location.reload(); }, 700);
          })
          .catch(function(err) {
            showToast(err.message || 'Could not withdraw', 'error');
          });
      });
    });
  }

  function renderProfileCompletion(user) {
    if (!user) return;

    var pct = 0;
    var items = [];
    var completed = 0;
    var total = 6;

    if (user.name) { items.push({ text: 'Name added', done: true }); completed++; }
    else { items.push({ text: 'Add your name', done: false }); }

    if (user.email) { items.push({ text: 'Email added', done: true }); completed++; }
    else { items.push({ text: 'Add your email', done: false }); }

    if (user.phone) { items.push({ text: 'Phone number added', done: true }); completed++; }
    else { items.push({ text: 'Add phone number', done: false }); }

    if (user.experience) { items.push({ text: 'Work experience added', done: true }); completed++; }
    else { items.push({ text: 'Add work experience', done: false }); }

    if (user.education) { items.push({ text: 'Education details filled', done: true }); completed++; }
    else { items.push({ text: 'Add education details', done: false }); }

    if (user.skills && user.skills.length > 0) { items.push({ text: 'Skills added', done: true }); completed++; }
    else { items.push({ text: 'Add skills', done: false }); }

    pct = Math.round((completed / total) * 100);

    // Update the ring
    var ring = document.querySelector('.profile-ring-fill');
    var ringText = document.querySelector('.profile-ring-text');
    var badgeEl = document.querySelector('.dash-card-badge');
    if (ring) ring.setAttribute('data-percent', pct);
    if (ringText) ringText.textContent = pct + '%';
    if (badgeEl) badgeEl.textContent = pct + '%';

    // Update suggestions list
    var suggestionsContainer = document.querySelector('.profile-suggestions');
    if (suggestionsContainer) {
      var html = '<h4>Complete your profile to get noticed</h4>';
      items.forEach(function(item) {
        var cls = item.done ? 'profile-suggestion-item profile-suggestion-item--done' : 'profile-suggestion-item';
        var icon = item.done
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
        html += '<div class="' + cls + '">' + icon + item.text + '</div>';
      });
      suggestionsContainer.innerHTML = html;
    }
  }

  function renderCandidateTimeline(stats) {
    var container = document.querySelector('.app-timeline');
    var badgeEl = document.getElementById('timelineBadge');
    if (!container) return;

    var stageIndex = 0;
    if (stats.selected > 0) stageIndex = 4;
    else if (stats.interviewScheduled > 0) stageIndex = 3;
    else if (stats.underReview > 0) stageIndex = 2;
    else if (stats.totalApplications > 0) stageIndex = 1;

    if (badgeEl) badgeEl.textContent = 'Stage ' + (stageIndex + 1) + ' of 5';

    var stages = [
      { label: 'Applied', status: stats.totalApplications > 0 ? 'completed' : '' },
      { label: 'Under Review', status: stats.underReview > 0 ? 'completed' : (stageIndex >= 2 ? 'completed' : '') },
      { label: 'Shortlisted', status: stageIndex >= 2 ? (stageIndex > 2 ? 'completed' : 'active') : '' },
      { label: 'Interview', status: stageIndex >= 3 ? (stageIndex > 3 ? 'completed' : 'active') : '' },
      { label: 'Selected', status: stageIndex >= 4 ? 'active' : '' }
    ];

    var html = '';
    stages.forEach(function(stage) {
      var cls = 'timeline-step';
      if (stage.status === 'completed') cls += ' timeline-step--completed';
      else if (stage.status === 'active') cls += ' timeline-step--active';

      var icon = stage.status === 'completed'
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
        : (stage.status === 'active'
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>');

      html += '<div class="' + cls + '"><div class="timeline-dot">' + icon + '</div><span class="timeline-label">' + stage.label + '</span></div>';
    });
    container.innerHTML = html;
  }

  function getTimeAgo(dateStr) {
    if (!dateStr) return 'Recently';
    var now = new Date();
    var then = new Date(dateStr);
    var diffMs = now - then;
    var diffMins = Math.floor(diffMs / 60000);
    var diffHours = Math.floor(diffMs / 3600000);
    var diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return diffMins + ' min ago';
    if (diffHours < 24) return diffHours + ' hour' + (diffHours > 1 ? 's' : '') + ' ago';
    if (diffDays < 7) return diffDays + ' day' + (diffDays > 1 ? 's' : '') + ' ago';
    return formatDate(dateStr);
  }

  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }


  // ===== RECRUITER DYNAMIC SECTIONS =====
  function renderRecruiterActivity(applications) {
    var container = document.getElementById('recruiterActivityFeed');
    if (!container) return;

    if (!applications || applications.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding:24px 16px; color:var(--text-muted);">No recent activity</div>';
      return;
    }

    var html = '';
    var shown = 0;
    applications.forEach(function(app) {
      if (shown >= 6) return;
      var candidate = app.candidateId || {};
      var job = app.jobId || {};
      var candidateName = candidate.name || 'Someone';
      var jobTitle = job.title || 'a position';
      var status = app.status || 'applied';
      var timeAgo = getTimeAgo(app.appliedDate || app.createdAt);

      var iconClass = 'activity-icon--blue';
      var iconSvg = ICONS.send;
      var actionText = 'New application from <strong>' + escapeHtml(candidateName) + '</strong> for ' + escapeHtml(jobTitle);
      if (status === 'shortlisted') { iconClass = 'activity-icon--green'; iconSvg = ICONS.star; actionText = '<strong>' + escapeHtml(candidateName) + '</strong> shortlisted for ' + escapeHtml(jobTitle); }
      else if (status === 'interview') { iconClass = 'activity-icon--purple'; iconSvg = ICONS.video; actionText = 'Interview invitation sent to <strong>' + escapeHtml(candidateName) + '</strong>'; }
      else if (status === 'selected') { iconClass = 'activity-icon--green'; iconSvg = ICONS.check; actionText = '<strong>' + escapeHtml(candidateName) + '</strong> selected for ' + escapeHtml(jobTitle); }
      else if (status === 'rejected') { iconClass = 'activity-icon--red'; iconSvg = ICONS.x; actionText = '<strong>' + escapeHtml(candidateName) + '</strong> application rejected for ' + escapeHtml(jobTitle); }

      html += '<div class="activity-item">' +
        '<div class="activity-icon ' + iconClass + '">' + iconSvg + '</div>' +
        '<div class="activity-content">' +
          '<p class="activity-text">' + actionText + '</p>' +
          '<span class="activity-time">' + timeAgo + '</span>' +
        '</div>' +
      '</div>';
      shown++;
    });

    if (shown === 0) {
      container.innerHTML = '<div style="text-align:center; padding:24px 16px; color:var(--text-muted);">No recent activity</div>';
    } else {
      container.innerHTML = html;
    }
  }

  function renderRecruiterPipeline(pipelineData, totalApps) {
    var container = document.querySelector('.hiring-pipeline');
    if (!container) return;

    var stages = [
      { key: 'applied', label: 'Applied', dot: 1 },
      { key: 'underReview', label: 'Under Review', dot: 2 },
      { key: 'shortlisted', label: 'Shortlisted', dot: 3 },
      { key: 'interview', label: 'Interview', dot: 4 },
      { key: 'selected', label: 'Selected', dot: 5 }
    ];

    var pipeline = { applied: 0, underReview: 0, shortlisted: 0, interview: 0, selected: 0 };
    if (pipelineData && pipelineData.length > 0) {
      pipelineData.forEach(function(p) {
        if (pipeline[p._id] !== undefined) pipeline[p._id] = p.count;
      });
    }
    pipeline.applied = totalApps || pipeline.applied;

    var maxCount = Math.max(pipeline.applied, 1);

    var html = '';
    stages.forEach(function(stage) {
      var count = pipeline[stage.key];
      var pct = Math.round((count / maxCount) * 100);
      html += '<div class="pipeline-stage">' +
        '<div class="pipeline-dot">' + stage.dot + '</div>' +
        '<div class="pipeline-info">' +
          '<div class="pipeline-label">' + stage.label + '</div>' +
          '<div class="pipeline-bar-track"><div class="pipeline-bar-fill" data-width="' + pct + '"></div></div>' +
        '</div>' +
        '<div class="pipeline-count">' + count + '</div>' +
      '</div>';
    });
    container.innerHTML = html;

    // Animate bars after render
    setTimeout(function() {
      var bars = container.querySelectorAll('.pipeline-bar-fill');
      bars.forEach(function(bar) {
        bar.style.width = bar.getAttribute('data-width') + '%';
      });
    }, 100);
  }


  // ===== CANDIDATE DASHBOARD INIT =====
  function initCandidateDashboard() {
    // Check if user is logged in
    if (typeof api !== 'undefined' && !api.isLoggedIn()) {
      window.location.href = 'login.html';
      return;
    }

    var d = CANDIDATE_DATA;

    // Populate header with real user data
    var user = typeof api !== 'undefined' ? api.getUser() : null;
    if (user) {
      populateDashboardHeader(user);
      var subtitleEl = document.getElementById('dashSubtitle');
      if (subtitleEl) subtitleEl.textContent = "Here's what's happening with your career today.";

      // Render profile completion from real user data
      renderProfileCompletion(user);
    }

    // Fetch real data from API, then render
    var dataPromise;
    if (typeof api !== 'undefined' && api.isLoggedIn()) {
      dataPromise = api.get('/applications/dashboard/candidate')
        .then(function(data) {
          d.stats.totalApplications = data.totalApplied || 0;
          d.stats.underReview = data.underReview || 0;
          d.stats.interviewScheduled = data.interviews || 0;
          d.stats.selected = data.selected || 0;

          // Update stat card data-target attributes in the DOM
          var statMap = {
            'statTotalApps': d.stats.totalApplications,
            'statUnderReview': d.stats.underReview,
            'statInterviews': d.stats.interviewScheduled,
            'statSelected': d.stats.selected
          };
          Object.keys(statMap).forEach(function(id) {
            var card = document.getElementById(id);
            if (card) {
              var el = card.querySelector('.dash-stat-value') || card;
              el.setAttribute('data-target', statMap[id]);
            }
          });

          // Update chart data (monthlyData is a prebuilt rolling 6-month series)
          if (data.monthlyData && data.monthlyData.length > 0) {
            d.charts.applicationsPerMonth.labels = data.monthlyData.map(function(m) { return m.month; });
            d.charts.applicationsPerMonth.data = data.monthlyData.map(function(m) { return m.count; });
          }
          if (data.statusData && data.statusData.length > 0) {
            var statusMap = { applied: 0, underReview: 1, shortlisted: 2, interview: 3, selected: 4, rejected: 5 };
            // Rebuild from scratch so stale counts never linger between loads
            var statusCounts = new Array(d.charts.statusDistribution.data.length).fill(0);
            data.statusData.forEach(function(s) {
              if (statusMap[s._id] !== undefined) {
                statusCounts[statusMap[s._id]] = s.count;
              }
            });
            d.charts.statusDistribution.data = statusCounts;
          }

          // Render timeline from real stats
          renderCandidateTimeline(d.stats);

          // Fetch applications for activity feed, interviews, and saved jobs
          return api.get('/applications/my');
        })
        .then(function(applications) {
          if (applications) {
            renderActivityFeed(applications);
            renderInterviewsTable(applications);
            renderMyApplications(applications);
          }
          renderSavedJobs();
        })
        .catch(function(err) {
          console.error('Failed to load candidate dashboard data:', err);
          renderSavedJobs();
        });
    } else {
      dataPromise = Promise.resolve();
    }

    // Wait for API data, then render everything
    dataPromise.then(function() {
      simulateLoading(function () {
        animateStatCards();
        animateProfileRing();

        window.__dashCharts.appPerMonth = createBarChart(
          'chartAppPerMonth',
          d.charts.applicationsPerMonth.labels,
          d.charts.applicationsPerMonth.data,
          'Applications'
        );

        window.__dashCharts.statusDist = createDonutChart(
          'chartStatusDist',
          d.charts.statusDistribution.labels,
          d.charts.statusDistribution.data,
          d.charts.statusDistribution.colors
        );

        showToast('Dashboard loaded successfully', 'success');
      });
    });
  }


  // ===== RECRUITER DASHBOARD INIT =====
  var recruiterPollTimer = null;

  function showCompanyLinkPrompt() {
    var applicantList = document.getElementById('applicantList');
    if (!applicantList) return;

    applicantList.innerHTML =
      '<div style="text-align:center; padding:32px 16px;">' +
        '<div style="font-size:1.1rem; font-weight:600; margin-bottom:8px; color:var(--text-primary);">No Company Linked</div>' +
        '<p style="color:var(--text-muted); margin-bottom:16px; font-size:0.9rem;">Your account is not linked to any company. Please select your company to view applications.</p>' +
        '<select id="companySelect" style="padding:10px 16px; border:1px solid var(--border-color); border-radius:8px; font-size:0.9rem; background:var(--bg-primary); color:var(--text-primary); width:100%; max-width:300px; margin-bottom:12px;">' +
          '<option value="">Loading companies...</option>' +
        '</select>' +
        '<div>' +
          '<button id="linkCompanyBtn" class="dash-btn-sm dash-btn-sm--primary" style="padding:10px 24px; cursor:pointer; opacity:0.5;" disabled>Link Company</button>' +
        '</div>' +
      '</div>';

    // Fetch available companies
    api.get('/companies').then(function(companies) {
      var select = document.getElementById('companySelect');
      var btn = document.getElementById('linkCompanyBtn');
      if (!select) return;

      select.innerHTML = '<option value="">-- Select your company --</option>';
      companies.forEach(function(c) {
        var opt = document.createElement('option');
        opt.value = c._id;
        opt.textContent = c.name;
        select.appendChild(opt);
      });

      select.addEventListener('change', function() {
        if (btn) {
          btn.disabled = !select.value;
          btn.style.opacity = select.value ? '1' : '0.5';
        }
      });

      if (btn) {
        btn.addEventListener('click', function() {
          var companyId = select.value;
          if (!companyId) return;

          btn.textContent = 'Linking...';
          btn.disabled = true;

          api.put('/auth/profile', { companyId: companyId }).then(function(updatedUser) {
            // Update localStorage user data
            api.setUser(updatedUser);
            showToast('Company linked successfully! Reloading...', 'success');
            setTimeout(function() { window.location.reload(); }, 1000);
          }).catch(function(err) {
            showToast('Failed to link company: ' + err.message, 'error');
            btn.textContent = 'Link Company';
            btn.disabled = false;
          });
        });
      }
    }).catch(function() {
      var select = document.getElementById('companySelect');
      if (select) select.innerHTML = '<option value="">Failed to load companies</option>';
    });
  }

  function initRecruiterDashboard() {
    // Check if user is logged in and is a recruiter
    if (typeof api !== 'undefined' && !api.isLoggedIn()) {
      window.location.href = 'login.html';
      return;
    }

    var d = RECRUITER_DATA;

    // Populate header with real user data
    var user = typeof api !== 'undefined' ? api.getUser() : null;
    if (user) {
      populateDashboardHeader(user);
      var companyEl = document.getElementById('dashCompany');
      if (companyEl) {
        var companyName = user.company || '';
        companyEl.innerHTML = companyName + (companyName ? ' &middot; ' : '') + 'Recruiter Dashboard';
      }
    }

    // Check if recruiter has a companyId — if not, show company linking prompt
    if (!user || !user.companyId) {
      simulateLoading(function () {
        showCompanyLinkPrompt();
        showToast('Please link your company to view applications', 'warning');
      });
      return;
    }

    // Fetch real data from API, then render
    var dataPromise;
    if (typeof api !== 'undefined' && api.isLoggedIn()) {
      dataPromise = api.get('/applications/dashboard/recruiter')
        .then(function(data) {
          d.stats.activeJobs = data.activeJobs || 0;
          d.stats.totalApplications = data.totalApplications || 0;
          d.stats.shortlisted = data.shortlisted || 0;

          // Update stat card data-target attributes
          var statMap = {
            'statActiveJobs': d.stats.activeJobs,
            'statTotalApps': d.stats.totalApplications,
            'statShortlisted': d.stats.shortlisted
          };
          Object.keys(statMap).forEach(function(id) {
            var card = document.getElementById(id);
            if (card) {
              var el = card.querySelector('.dash-stat-value') || card;
              el.setAttribute('data-target', statMap[id]);
            }
          });

          if (data.pipelineData && data.pipelineData.length > 0) {
            data.pipelineData.forEach(function(p) {
              if (d.pipeline[p._id] !== undefined) d.pipeline[p._id] = p.count;
            });
            d.pipeline.total = d.pipeline.applied;
          }

          // Render dynamic pipeline from API data
          renderRecruiterPipeline(data.pipelineData, data.totalApplications);

          if (data.applicationsByJob && data.applicationsByJob.length > 0) {
            d.charts.applicationsPerJob.labels = data.applicationsByJob.map(function(j) { return j.title; });
            d.charts.applicationsPerJob.data = data.applicationsByJob.map(function(j) { return j.count; });
          }

          if (data.hiringData && data.hiringData.length > 0) {
            var hiringMap = { underReview: 0, shortlisted: 1, interview: 2, selected: 3, rejected: 4 };
            data.hiringData.forEach(function(h) {
              if (hiringMap[h._id] !== undefined) {
                d.charts.hiringStatus.data[hiringMap[h._id]] = h.count;
              }
            });
          }
        })
        .catch(function(err) {
          console.error('Failed to load recruiter dashboard data:', err);
        });
    } else {
      dataPromise = Promise.resolve();
    }

    // Fetch real applicant list from API and render activity
    fetchAndRenderApplicants(true);

    // Also fetch applications for activity feed
    if (typeof api !== 'undefined' && api.isLoggedIn()) {
      api.get('/applications/recruiter?limit=50')
        .then(function(data) {
          renderRecruiterActivity(data.applications);
        })
        .catch(function() {});
    }

    simulateLoading(function () {
      animateStatCards();

      window.__dashCharts.appPerJob = createBarChart(
        'chartAppPerJob',
        d.charts.applicationsPerJob.labels,
        d.charts.applicationsPerJob.data,
        'Applications'
      );

      window.__dashCharts.hiringDist = createDonutChart(
        'chartHiringDist',
        d.charts.hiringStatus.labels,
        d.charts.hiringStatus.data,
        d.charts.hiringStatus.colors
      );

      window.__dashCharts.viewsOverTime = createLineChart(
        'chartViewsOverTime',
        d.charts.jobViewsOverTime.labels,
        d.charts.jobViewsOverTime.data,
        'Views'
      );

      showToast('Dashboard loaded successfully', 'success');
    });

    // Poll for new applications every 30 seconds
    startRecruiterPolling();

    // Refresh data when user returns to the tab
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden && document.body.getAttribute('data-dashboard') === 'recruiter') {
        fetchAndRenderApplicants(true);
      }
    });
  }

  function startRecruiterPolling() {
    stopRecruiterPolling();
    recruiterPollTimer = setInterval(function() {
      if (document.hidden) return; // Skip if tab is not visible
      fetchAndRenderApplicants(true);
    }, 30000);
  }

  function stopRecruiterPolling() {
    if (recruiterPollTimer) {
      clearInterval(recruiterPollTimer);
      recruiterPollTimer = null;
    }
  }


  // ===== SEARCH & FILTER (Recruiter Applicants) =====
  var searchInitialized = false;

  function initApplicantSearch() {
    var searchInput = document.getElementById('applicantSearch');
    var filterSelect = document.getElementById('applicantFilter');
    if (!searchInput && !filterSelect) return;

    if (searchInitialized) return;
    searchInitialized = true;

    function filterApplicants() {
      var query = searchInput ? searchInput.value.toLowerCase() : '';
      var status = filterSelect ? filterSelect.value : 'all';
      var rows = document.querySelectorAll('.applicant-row');

      rows.forEach(function (row) {
        var name = (row.getAttribute('data-name') || '').toLowerCase();
        var role = (row.getAttribute('data-role') || '').toLowerCase();
        var rowStatus = row.getAttribute('data-status') || '';

        var matchesQuery = !query || name.indexOf(query) !== -1 || role.indexOf(query) !== -1;
        var matchesStatus = status === 'all' || rowStatus === status;

        row.style.display = (matchesQuery && matchesStatus) ? '' : 'none';
      });

      // Update pagination after filter
      updatePaginationAfterFilter();
    }

    if (searchInput) searchInput.addEventListener('input', filterApplicants);
    if (filterSelect) filterSelect.addEventListener('change', filterApplicants);
  }


  // ===== PAGINATION =====
  var currentPage = 1;
  var itemsPerPage = 5;
  var paginationInitialized = false;

  function initApplicantPagination() {
    if (paginationInitialized) return;
    paginationInitialized = true;

    var pagEl = document.getElementById('applicantPagination');
    if (pagEl) {
      // Bind prev/next event delegation
      pagEl.addEventListener('click', function(e) {
        var btn = e.target.closest('.dash-pagination-btn');
        if (!btn || btn.disabled) return;
        var pageAttr = btn.getAttribute('data-page');
        if (pageAttr === 'prev') { showPage(currentPage - 1); }
        else if (pageAttr === 'next') { showPage(currentPage + 1); }
        else { showPage(parseInt(pageAttr, 10)); }
      });
    }

    updatePagination();
  }

  function updatePagination() {
    // Server-side pagination (Load More) replaced the legacy client pager —
    // keep search filtering, but never hide rows here.
    var pagEl = document.getElementById('applicantPagination');
    if (pagEl) pagEl.style.display = 'none';
  }

  function showPage(page) {
    currentPage = page;
    var rows = document.querySelectorAll('.applicant-row');
    var visibleRows = Array.prototype.filter.call(rows, function(r) {
      return r.style.display !== 'none' || r.getAttribute('data-filtered') === 'true';
    });

    // Reset display for all visible rows first
    Array.prototype.forEach.call(rows, function(row) {
      if (row.style.display === 'none' && !row.getAttribute('data-filtered')) return;
    });

    var startIndex = (page - 1) * itemsPerPage;
    var endIndex = startIndex + itemsPerPage;
    var visibleIndex = 0;

    rows.forEach(function (row) {
      if (row.style.display === 'none' && !row.getAttribute('data-filtered')) return;
      if (visibleIndex >= startIndex && visibleIndex < endIndex) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
      visibleIndex++;
    });

    renderPaginationButtons();
  }

  function renderPaginationButtons() {
    var container = document.getElementById('applicantPagination');
    if (!container) return;

    var rows = document.querySelectorAll('.applicant-row');
    var visibleRows = Array.prototype.filter.call(rows, function(r) {
      return r.style.display !== 'none' || r.getAttribute('data-filtered') === 'true';
    });
    var totalPages = Math.ceil(visibleRows.length / itemsPerPage);

    if (totalPages <= 1) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'flex';
    container.innerHTML = '';

    // Prev button
    var prevBtn = document.createElement('button');
    prevBtn.className = 'dash-pagination-btn';
    prevBtn.setAttribute('data-page', 'prev');
    prevBtn.innerHTML = ICONS.chevronLeft;
    prevBtn.disabled = currentPage === 1;
    container.appendChild(prevBtn);

    // Page buttons
    for (var i = 1; i <= totalPages; i++) {
      var btn = document.createElement('button');
      btn.className = 'dash-pagination-btn' + (i === currentPage ? ' dash-pagination-btn--active' : '');
      btn.textContent = i;
      btn.setAttribute('data-page', i);
      container.appendChild(btn);
    }

    // Next button
    var nextBtn = document.createElement('button');
    nextBtn.className = 'dash-pagination-btn';
    nextBtn.setAttribute('data-page', 'next');
    nextBtn.innerHTML = ICONS.chevronRight;
    nextBtn.disabled = currentPage === totalPages;
    container.appendChild(nextBtn);
  }

  function updatePaginationAfterFilter() {
    currentPage = 1;
    showPage(1);
  }


  // ===== INTERVIEW JOIN BUTTON =====
  function initInterviewButtons() {
    document.querySelectorAll('[data-action="join-interview"]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        showToast('Opening interview link...', 'info');
      });
    });

    document.querySelectorAll('[data-action="view-details"]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        showToast('Loading application details...', 'info');
      });
    });
  }


  // ===== ROLE TOGGLE (Candidate / Recruiter) =====
  function initRoleToggle() {
    var roleToggleBtns = document.querySelectorAll('.role-toggle-btn');
    if (!roleToggleBtns.length) return;

    var user = typeof api !== 'undefined' ? api.getUser() : null;
    var currentRole = user ? user.role : 'candidate';

    // Set active state
    roleToggleBtns.forEach(function(btn) {
      if (btn.getAttribute('data-role') === currentRole) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }

      btn.addEventListener('click', function(e) {
        e.preventDefault();
        var targetRole = btn.getAttribute('data-role');
        if (targetRole === currentRole) return;

        if (!user) return;

        // Update user role in localStorage
        user.role = targetRole;
        api.setUser(user);

        // Redirect to appropriate dashboard
        if (targetRole === 'recruiter') {
          window.location.href = 'recruiter-dashboard.html';
        } else {
          window.location.href = 'candidate-dashboard.html';
        }
      });
    });
  }

  // ===== MAIN INIT =====
  function init() {
    setCurrentDate();
    initDarkMode();
    initInterviewButtons();
    initRoleToggle();
    initPostJobModal();
    initProfileModal();

    // Real-time: connect socket + mount notification bell
    if (window.JobKartSocket) JobKartSocket.initFromStorage();
    if (window.JobKartNotifs) JobKartNotifs.mount('notifBellMount');

    // Recruiter pipeline UI
    initRecruiterPipeline();
    initStageModal();
    initChatPanel();
    initCandidateProfileModal();
    initSavedLeads();

    // Determine which dashboard to initialize
    var pageType = document.body.getAttribute('data-dashboard');

    if (pageType === 'candidate') {
      initCandidateDashboard();
      initCandidateRealtime();
    } else if (pageType === 'recruiter') {
      initRecruiterDashboard();
      initRecruiterRealtime();
    }
  }

  // ===== REAL-TIME (candidate) =====
  function initCandidateRealtime() {
    if (!window.JobKartSocket) return;
    JobKartSocket.on('status:updated', function (data) {
      showToast('Update: Your application for "' + (data.jobTitle || 'a job') + '" is now ' + (STATUS_LABELS[data.newStatus] || data.newStatus) + '!', 'success');
      // re-pull stats + applications so timeline/tables reflect the change live
      if (typeof initCandidateDashboard === 'function') initCandidateDashboard();
    });
    JobKartSocket.on('message:new', function (data) {
      var panelOpen = document.getElementById('candChatPanel') && document.getElementById('candChatPanel').style.display === 'flex';
      if (panelOpen && window.__candConv === data.message.conversationId) {
        appendCandBubble(data.message, false);
        api.put('/messages/' + data.message.conversationId + '/read', {}).catch(function () {});
      } else {
        showToast('💬 New message from ' + (data.sender && data.sender.name ? data.sender.name : 'recruiter'), 'info');
        refreshCandChatBadge();
      }
    });
    JobKartSocket.on('typing:start', function (d) {
      if (window.__candConv === d.conversationId) {
        var el = document.getElementById('candChatTyping');
        if (el) { el.textContent = 'Recruiter is typing…'; el.style.display = 'block'; }
      }
    });
    JobKartSocket.on('typing:stop', function (d) {
      if (window.__candConv === d.conversationId) {
        var el = document.getElementById('candChatTyping');
        if (el) el.style.display = 'none';
      }
    });

    initCandChatUI();
  }

  // ===== CANDIDATE MESSAGES UI =====
  function escHtmlC(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function candBubble(m, mine) {
    var time = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return '<div style="align-self:' + (mine ? 'flex-end' : 'flex-start') + '; max-width:80%;">' +
      '<div style="padding:8px 12px; border-radius:14px; font-size:0.84rem; line-height:1.35; ' +
        (mine ? 'background:#2563EB; color:#fff; border-bottom-right-radius:4px;' : 'background:var(--dash-card-bg,#fff); border:1px solid var(--dash-card-border,#E2E8F0); border-bottom-left-radius:4px;') + '">' +
        escHtmlC(m.text) + '</div>' +
      '<div style="font-size:0.62rem; color:var(--dash-text-muted,#5A6B87); margin-top:2px; text-align:' + (mine ? 'right' : 'left') + ';">' + time + (m.read && mine ? ' ✓✓' : '') + '</div>' +
    '</div>';
  }

  function appendCandBubble(m, mine) {
    var box = document.getElementById('candChatMessages');
    if (!box) return;
    box.insertAdjacentHTML('beforeend', candBubble(m, mine));
    box.scrollTop = box.scrollHeight;
  }

  function refreshCandChatBadge() {
    api.get('/messages/conversations')
      .then(function (d) {
        var unread = (d.conversations || []).reduce(function (s, c) { return s + (c.unread || 0); }, 0);
        var fab = document.getElementById('candChatFab');
        var badge = document.getElementById('candChatFabBadge');
        if (fab) fab.style.display = 'flex';
        if (badge) {
          if (unread > 0) { badge.style.display = 'flex'; badge.textContent = unread; }
          else badge.style.display = 'none';
        }
      })
      .catch(function () {});
  }

  function initCandChatUI() {
    var fab = document.getElementById('candChatFab');
    var panel = document.getElementById('candChatPanel');
    if (!fab || !panel) return;

    fab.addEventListener('click', function () {
      panel.style.display = 'flex';
      fab.style.display = 'none';
      window.__candConv = null;
      document.getElementById('candChatThread').style.display = 'none';
      document.getElementById('candChatList').style.display = 'block';
      loadCandConversations();
    });

    document.getElementById('candChatClose').addEventListener('click', function () {
      panel.style.display = 'none';
      fab.style.display = 'flex';
      window.__candConv = null;
      refreshCandChatBadge();
    });

    document.getElementById('candChatBack').addEventListener('click', function () {
      window.__candConv = null;
      document.getElementById('candChatThread').style.display = 'none';
      document.getElementById('candChatList').style.display = 'block';
      loadCandConversations();
    });

    var send = function () {
      var input = document.getElementById('candChatInput');
      var text = input.value.trim();
      if (!text || !window.__candConv) return;
      api.post('/messages', { conversationId: window.__candConv, text: text })
        .then(function (msg) {
          input.value = '';
          appendCandBubble(msg.toObject ? msg.toObject() : msg, true);
        })
        .catch(function (err) { showToast(err.message || 'Could not send', 'error'); });
    };
    document.getElementById('candChatSend').addEventListener('click', send);
    document.getElementById('candChatInput').addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });

    var typingTimer = null;
    document.getElementById('candChatInput').addEventListener('input', function () {
      if (!window.__candConv || !window.__candPeer) return;
      JobKartSocket.emit('typing:start', { conversationId: window.__candConv, to: window.__candPeer });
      clearTimeout(typingTimer);
      typingTimer = setTimeout(function () {
        JobKartSocket.emit('typing:stop', { conversationId: window.__candConv, to: window.__candPeer });
      }, 1200);
    });

    refreshCandChatBadge();
    setInterval(refreshCandChatBadge, 30000); // periodic badge refresh
  }

  function loadCandConversations() {
    api.get('/messages/conversations')
      .then(function (d) {
        var list = document.getElementById('candChatList');
        var convs = d.conversations || [];
        if (!convs.length) {
          list.innerHTML = '<div style="text-align:center; padding:40px 16px; color:var(--dash-text-muted,#5A6B87); font-size:0.86rem;">No conversations yet.<br/><span style="font-size:0.76rem;">Apply to a job — the recruiter can then message you about it.</span></div>';
          return;
        }
        list.innerHTML = convs.map(function (c) {
          return '<div class="cand-conv" data-conv="' + c.conversationId + '" data-job="' + escHtmlC(c.job ? c.job.title : '') + '" style="display:flex; justify-content:space-between; align-items:center; gap:10px; padding:12px 14px; border-radius:12px; cursor:pointer; margin-bottom:4px;">' +
            '<div style="min-width:0;">' +
              '<div style="font-size:0.84rem; font-weight:700;">' + escHtmlC(c.job ? c.job.title : 'Conversation') + '</div>' +
              '<div style="font-size:0.74rem; color:var(--dash-text-muted,#5A6B87); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:230px;">' + escHtmlC(c.lastMessage || '') + '</div>' +
            '</div>' +
            (c.unread ? '<span style="flex-shrink:0; min-width:20px; height:20px; padding:0 6px; border-radius:99px; background:#EF4444; color:#fff; font-size:0.68rem; font-weight:800; display:flex; align-items:center; justify-content:center;">' + c.unread + '</span>' : '') +
          '</div>';
        }).join('');

        list.querySelectorAll('.cand-conv').forEach(function (el) {
          el.addEventListener('click', function () {
            var convId = el.getAttribute('data-conv');
            var jobTitle = el.getAttribute('data-job');
            window.__candConv = convId;
            window.__candPeer = convId.split('_')[1] ? undefined : undefined; // recruiter id resolved server-side
            // resolve recruiter id for typing events
            api.get('/messages/' + convId).then(function (hist) {
              var recruiterUserId = null;
              (hist.messages || []).forEach(function (m) {
                var me = api.getUser();
                if (String(m.senderId) !== String(me._id)) recruiterUserId = m.senderId;
              });
              window.__candPeer = recruiterUserId;
            });

            document.getElementById('candChatList').style.display = 'none';
            document.getElementById('candChatThread').style.display = 'flex';
            document.getElementById('candChatThreadTitle').textContent = jobTitle || 'Chat';
            document.getElementById('candChatMessages').innerHTML = '';
            api.get('/messages/' + convId)
              .then(function (h) {
                var me = api.getUser();
                (h.messages || []).forEach(function (m) {
                  appendCandBubble(m, String(m.senderId) === String(me._id));
                });
              });
            api.put('/messages/' + convId + '/read', {}).catch(function () {});
            refreshCandChatBadge();
          });
        });
      })
      .catch(function () {});
  }

  // ===== RECRUITER: PIPELINE BOARD + STAGE MODAL + CHAT =====
  var PIPELINE_STAGES = ['applied', 'underReview', 'shortlisted', 'interviewScheduled', 'selected', 'rejected'];
  var STAGE_COLORS = {
    applied: '#64748B', underReview: '#F59E0B', shortlisted: '#2563EB',
    interviewScheduled: '#8B5CF6', selected: '#10B981', rejected: '#EF4444'
  };
  // Quiet accents for Kanban column rules — desaturated, professional
  var STAGE_ACCENTS = {
    applied: '#94A3B8',
    underReview: '#D97706',
    shortlisted: '#0891B2',
    interviewScheduled: '#7C3AED',
    selected: '#059669',
    rejected: '#DC2626'
  };
  var __pipelineApps = [];
  var __onlineUsers = {}; // userId → true (live presence from socket)
  var __chatConv = null; // { conversationId, candidateName, peerId }

  function initRecruiterPipeline() {
    var board = document.getElementById('kanbanBoard');
    if (!board) return;
    api.get('/applications/all?limit=200')
      .then(function (data) {
        __pipelineApps = data.applications || [];
        renderKanban();
      })
      .catch(function () {});
  }

  function renderKanban() {
    var board = document.getElementById('kanbanBoard');
    if (!board) return;
    var totalBadge = document.getElementById('pipelineTotalBadge');
    if (totalBadge) totalBadge.textContent = __pipelineApps.length + ' applicants';

    var ICON_ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
    var ICON_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

    board.innerHTML = PIPELINE_STAGES.map(function (stage) {
      var apps = __pipelineApps.filter(function (a) { return a.status === stage; });
      var cards = apps.slice(0, 6).map(function (a) {
        var cand = a.candidateId || {};
        var job = a.jobId || {};
        var jobTitle = typeof job === 'object' ? job.title : 'Job';
        var isOnline = __onlineUsers[String(cand._id)] || cand.isOnline || false;
        var avatar = cand.profilePhoto
          ? '<img src="' + cand.profilePhoto + '" alt="" />'
          : escHtml(initialsOf(cand.name));
        return '<div class="kcard" data-app-id="' + a._id + '" data-cand-id="' + (cand._id || '') + '">' +
          '<div class="kcard-head">' +
            '<div class="kcard-avatar">' + avatar + '</div>' +
            '<div class="kcard-id">' +
              '<div class="kcard-name">' + escHtml(cand.name || 'Unknown') + (isOnline ? '<span class="kcard-presence" title="Online now"></span>' : '') + '</div>' +
              '<div class="kcard-job" title="' + escHtml(jobTitle) + '">' + escHtml(jobTitle) + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="kcard-actions">' +
            '<button class="kicon-btn kicon-btn--solid kcard-act" data-act="stage" title="Move stage">' + ICON_ARROW + ' Stage</button>' +
            '<button class="kicon-btn kcard-act" data-act="chat" title="Message">' + ICON_CHAT + ' Message</button>' +
          '</div>' +
        '</div>';
      }).join('');
      var accent = STAGE_ACCENTS[stage] || 'var(--dash-info)';
      var more = apps.length > 6 ? '<div class="kanban-more">+' + (apps.length - 6) + ' more</div>' : '';
      return '<div class="kanban-col">' +
        '<div class="kanban-col-head">' +
          '<span class="kanban-dot" style="background:' + accent + ';"></span>' +
          '<span class="kanban-col-title">' + (STATUS_LABELS[stage] || stage) + '</span>' +
          '<span class="kanban-col-count">' + apps.length + '</span>' +
        '</div>' +
        '<div class="kanban-rule" style="--kanban-accent:' + accent + ';"></div>' +
        '<div class="kanban-cards">' + cards + more + '</div>' +
      '</div>';
    }).join('');

    // card click → profile modal; action buttons stop propagation
    board.querySelectorAll('.kcard').forEach(function (card) {
      card.addEventListener('click', function () {
        var app = __pipelineApps.find(function (a) { return a._id === card.getAttribute('data-app-id'); });
        if (app) openCandidateProfile(app);
      });
    });

    board.querySelectorAll('.kcard-act').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var appId = btn.closest('.kcard').getAttribute('data-app-id');
        var app = __pipelineApps.find(function (a) { return a._id === appId; });
        if (!app) return;
        if (btn.getAttribute('data-act') === 'stage') openStageModal(app);
        else openChat(app);
      });
    });
  }

  // ---- Candidate profile modal ----
  var __profileModalCand = null;

  function initialsOf(name) {
    return (name || '?').split(' ').map(function (w) { return w.charAt(0); }).join('').toUpperCase().slice(0, 2);
  }

  function openCandidateProfile(app) {
    var cand = app.candidateId || {};
    if (!cand._id) return;
    var modal = document.getElementById('candProfileModal');
    if (!modal) return;
    modal.style.display = 'block';
    __profileModalCand = cand;

    // skeleton while loading
    document.getElementById('cpName').textContent = cand.name || 'Loading…';
    document.getElementById('cpHistory').innerHTML = '<div style="font-size:0.84rem; color:var(--dash-text-muted,#5A6B87);">Loading history…</div>';

    api.get('/applications/candidate/' + cand._id + '/profile')
      .then(function (data) {
        var c = data.candidate;
        __profileModalCand = c;
        var avatar = document.getElementById('cpAvatar');
        if (c.profilePhoto) {
          avatar.innerHTML = '<img src="' + c.profilePhoto + '" style="width:100%; height:100%; object-fit:cover;" alt="" />';
        } else {
          avatar.textContent = initialsOf(c.name);
        }
        var nameEl = document.getElementById('cpName');
        nameEl.innerHTML = escHtml(c.name) +
          ((c.isOnline || __onlineUsers[String(c._id)]) ? ' <span title="Online now" style="display:inline-block; width:9px; height:9px; border-radius:50%; background:#10B981;"></span>' : '');
        var email = c.email || '—';
        var phone = c.phone || '—';
        document.getElementById('cpContact').innerHTML = escHtml(email) + ' &nbsp;·&nbsp; ' + escHtml(phone) +
          ' &nbsp;·&nbsp; Profile <strong>' + (c.profileCompletion || 0) + '%</strong>';
        document.getElementById('cpOnlineBadge').style.display = (c.isOnline || __onlineUsers[String(c._id)]) ? 'inline-flex' : 'none';

        // stats chips
        var s = data.stats;
        document.getElementById('cpStats').innerHTML =
          '<span class="cp-chip cp-chip--total">' + s.total + ' applications</span>' +
          '<span class="cp-chip cp-chip--selected">' + s.selected + ' selected</span>' +
          '<span class="cp-chip cp-chip--active">' + s.active + ' in progress</span>';

        // details grid — editorial label-over-value pairs
        var skills = (c.skills || []).join(', ') || '—';
        document.getElementById('cpDetails').innerHTML =
          '<div><div class="cp-label">Skills</div><div class="cp-value">' + escHtml(skills) + '</div></div>' +
          '<div><div class="cp-label">Experience</div><div class="cp-value">' + escHtml(c.experience || '—') + '</div></div>' +
          '<div><div class="cp-label">Education</div><div class="cp-value">' + escHtml(c.education || '—') + '</div></div>' +
          '<div><div class="cp-label">Portfolio</div><div class="cp-value">' + (c.portfolioUrl ? '<a href="' + c.portfolioUrl + '" target="_blank" style="color:#2563EB; word-break:break-all;">' + escHtml(c.portfolioUrl) + '</a>' : '<span style="color:var(--text-muted,#64748B);">—</span>') + '</div></div>';

        // resume
        var resumeBtn = document.getElementById('cpResumeBtn');
        if (c.resume) {
          resumeBtn.href = c.resume;
          resumeBtn.style.display = 'inline-block';
        } else {
          resumeBtn.style.display = 'none';
        }

        // history
        document.getElementById('cpHistCount').textContent = '(' + data.applications.length + ')';
        document.getElementById('cpHistory').innerHTML = data.applications.length
          ? data.applications.map(function (a) {
              var col = STAGE_COLORS[a.status] || '#64748B';
              var when = a.appliedDate ? new Date(a.appliedDate).toLocaleDateString() : '';
              var interview = a.status === 'interviewScheduled' && a.interviewDate ? ' · 📅 ' + new Date(a.interviewDate).toLocaleString() : '';
              return '<div style="display:flex; justify-content:space-between; align-items:center; gap:10px; padding:10px 0; border-bottom:1px dashed var(--dash-card-border,#EDF2F7); font-size:0.84rem;">' +
                '<div><strong>' + escHtml(a.job ? a.job.title : 'Job') + '</strong>' +
                  '<div style="font-size:0.72rem; color:var(--dash-text-muted,#5A6B87);">' + escHtml(a.job && a.job.company ? a.job.company.name : '') + ' · applied ' + when + interview + '</div></div>' +
                '<span style="font-size:0.68rem; font-weight:800; color:#fff; background:' + col + '; padding:3px 10px; border-radius:99px; white-space:nowrap;">' + (STATUS_LABELS[a.status] || a.status) + '</span>' +
              '</div>';
            }).join('')
          : '<div style="font-size:0.84rem; color:var(--dash-text-muted,#5A6B87);">No applications found.</div>';
      })
      .catch(function (err) {
        document.getElementById('cpHistory').innerHTML = '<div style="font-size:0.84rem; color:#EF4444;">' + escHtml(err.message || 'Failed to load profile') + '</div>';
      });
  }

  function initCandidateProfileModal() {
    var modal = document.getElementById('candProfileModal');
    if (!modal) return;
    document.getElementById('cpClose').addEventListener('click', function () {
      modal.style.display = 'none';
      __profileModalCand = null;
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) { modal.style.display = 'none'; __profileModalCand = null; }
    });
    document.getElementById('cpMessageBtn').addEventListener('click', function () {
      var c = __profileModalCand;
      if (!c) return;
      // find an application to anchor the conversation (candidateId_jobId)
      api.get('/applications/candidate/' + c._id)
        .then(function (apps) {
          var list = Array.isArray(apps) ? apps : apps.applications || [];
          if (!list.length) { showToast('This candidate has no applications yet', 'error'); return; }
          var firstJobId = list[0].jobId;
          var jobId = typeof firstJobId === 'object' ? firstJobId._id : firstJobId;
          modal.style.display = 'none';
          openChat({ candidateId: c, jobId: { _id: jobId, title: '' }, candidateNameOverride: true });
        })
        .catch(function () { showToast('Could not open chat', 'error'); });
    });
  }

  // ---- Stage modal ----
  var __stageApp = null;
  function openStageModal(app) {
    __stageApp = app;
    var modal = document.getElementById('stageModal');
    if (!modal) return;
    var cand = app.candidateId || {};
    var job = app.jobId || {};
    document.getElementById('stageContext').textContent =
      (cand.name || 'Candidate') + ' — ' + (typeof job === 'object' ? job.title : '') + ' · current: ' + (STATUS_LABELS[app.status] || app.status);
    var sel = document.getElementById('stageSelect');
    sel.value = app.status;
    document.getElementById('stageInterviewFields').style.display = app.status === 'interviewScheduled' ? 'block' : 'none';
    if (app.interviewDate) {
      var d = new Date(app.interviewDate);
      var pad = function (n) { return String(n).padStart(2, '0'); };
      document.getElementById('stageInterviewDate').value = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    }
    document.getElementById('stageInterviewLink').value = app.interviewLink || '';
    document.getElementById('stageNote').value = '';
    modal.style.display = 'block';
  }

  function initStageModal() {
    var modal = document.getElementById('stageModal');
    if (!modal) return;
    var close = function () { modal.style.display = 'none'; };
    document.getElementById('stageClose').addEventListener('click', close);
    document.getElementById('stageCancel').addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });

    document.getElementById('stageSelect').addEventListener('change', function () {
      document.getElementById('stageInterviewFields').style.display = this.value === 'interviewScheduled' ? 'block' : 'none';
    });

    document.getElementById('stageSave').addEventListener('click', function () {
      if (!__stageApp) return;
      var status = document.getElementById('stageSelect').value;
      var note = document.getElementById('stageNote').value.trim();
      var payload = { status: status, note: note };
      if (status === 'interviewScheduled') {
        var idate = document.getElementById('stageInterviewDate').value;
        var ilink = document.getElementById('stageInterviewLink').value.trim();
        if (!idate) { showToast('Pick an interview date first', 'error'); return; }
        payload.interviewDate = new Date(idate).toISOString();
        payload.interviewLink = ilink;
      }
      var btn = this;
      btn.disabled = true; btn.textContent = 'Updating…';
      api.put('/applications/' + __stageApp._id + '/status', payload)
        .then(function () {
          showToast('Stage updated → ' + (STATUS_LABELS[status] || status), 'success');
          close();
          initRecruiterPipeline();
          fetchAndRenderApplicants(true);
        })
        .catch(function (err) { showToast(err.message || 'Update failed', 'error'); })
        .finally(function () { btn.disabled = false; btn.textContent = 'Update Stage'; });
    });
  }

  // ---- Chat panel ----
  function openChat(app) {
    var cand = app.candidateId || {};
    var job = app.jobId || {};
    var jobId = typeof job === 'object' ? job._id : job;
    __chatConv = {
      conversationId: cand._id + '_' + jobId,
      candidateName: app.candidateNameOverride ? cand.name : (cand.name || 'Candidate'),
      peerId: cand._id
    };
    var panel = document.getElementById('chatPanel');
    var jobTitle = typeof job === 'object' ? (job.title || '') : '';
    document.getElementById('chatTitle').textContent = __chatConv.candidateName + (jobTitle ? ' — ' + jobTitle : '');
    panel.style.display = 'flex';
    document.getElementById('chatMessages').innerHTML = '';
    loadChatHistory();
    api.put('/messages/' + __chatConv.conversationId + '/read', {}).catch(function () {});
  }

  // ---- Saved-leads (saved but not applied) ----
  function initSavedLeads() {
    var body = document.getElementById('savedLeadsBody');
    if (!body) return;
    api.get('/applications/saved-leads')
      .then(function (data) {
        var leads = data.leads || [];
        var badge = document.getElementById('savedLeadsBadge');
        if (badge) badge.textContent = leads.length + (leads.length === 1 ? ' lead' : ' leads');
        if (!leads.length) {
          body.innerHTML = '<div style="font-size:0.84rem; color:var(--dash-text-muted,#5A6B87);">No saved-but-not-applied leads yet. When candidates save jobs from listings, they appear here for a nudge.</div>';
          return;
        }
        var ICON_SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
        body.innerHTML = leads.map(function (l) {
          var jobs = l.savedNotApplied.map(function (j) {
            return '<span class="lead-chip">' + escHtml(j.title) +
              '<button class="lead-nudge-btn lead-nudge" data-cand="' + l.candidate._id + '" data-job="' + j._id + '" data-name="' + escHtml(l.candidate.name) + '" data-title="' + escHtml(j.title) + '">' + ICON_SEND + ' Nudge</button></span>';
          }).join('');
          return '<div style="display:flex; justify-content:space-between; align-items:center; gap:14px; padding:12px 0; border-bottom:1px dashed var(--dash-card-border,#EDF2F7);">' +
            '<div>' +
              '<div style="font-size:0.86rem; font-weight:700;">' + escHtml(l.candidate.name) + ' <span style="font-weight:500; color:var(--text-muted,#64748B); font-size:0.74rem;">· profile ' + (l.candidate.profileCompletion || 0) + '%</span></div>' +
              '<div style="margin-top:5px;">' + jobs + '</div>' +
            '</div>' +
          '</div>';
        }).join('');

        body.querySelectorAll('.lead-nudge').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var candId = btn.getAttribute('data-cand');
            var jobId = btn.getAttribute('data-job');
            var name = btn.getAttribute('data-name');
            var title = btn.getAttribute('data-title');
            openChat({ candidateId: { _id: candId, name: name }, jobId: { _id: jobId, title: title }, candidateNameOverride: true });
          });
        });
      })
      .catch(function () {
        body.innerHTML = '<div style="font-size:0.84rem; color:var(--dash-text-muted,#5A6B87);">Could not load saved leads.</div>';
      });
  }

  function loadChatHistory() {
    if (!__chatConv) return;
    api.get('/messages/' + __chatConv.conversationId)
      .then(function (d) {
        var me = api.getUser();
        var box = document.getElementById('chatMessages');
        box.innerHTML = (d.messages || []).map(function (m) {
          var mine = String(m.senderId) === String(me._id);
          return chatBubble(m, mine);
        }).join('');
        box.scrollTop = box.scrollHeight;
      })
      .catch(function () {});
  }

  function chatBubble(m, mine) {
    var time = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return '<div style="align-self:' + (mine ? 'flex-end' : 'flex-start') + '; max-width:78%;">' +
      '<div style="padding:8px 12px; border-radius:14px; font-size:0.84rem; line-height:1.35; ' +
        (mine ? 'background:#2563EB; color:#fff; border-bottom-right-radius:4px;' : 'background:var(--dash-card-bg,#fff); border:1px solid var(--dash-card-border,#E2E8F0); border-bottom-left-radius:4px;') + '">' +
        escHtml(m.text) +
      '</div>' +
      '<div style="font-size:0.62rem; color:var(--dash-text-muted,#5A6B87); margin-top:2px; text-align:' + (mine ? 'right' : 'left') + ';">' + time + (m.read && mine ? ' ✓✓' : '') + '</div>' +
    '</div>';
  }

  function initChatPanel() {
    var panel = document.getElementById('chatPanel');
    if (!panel) return;
    document.getElementById('chatClose').addEventListener('click', function () {
      panel.style.display = 'none'; __chatConv = null;
      if (window.__typingTimer) { clearTimeout(window.__typingTimer); window.__typingTimer = null; }
    });

    var send = function () {
      var input = document.getElementById('chatInput');
      var text = input.value.trim();
      if (!text || !__chatConv) return;
      api.post('/messages', { conversationId: __chatConv.conversationId, text: text })
        .then(function (msg) {
          input.value = '';
          var me = api.getUser();
          var box = document.getElementById('chatMessages');
          box.insertAdjacentHTML('beforeend', chatBubble(msg.toObject ? msg.toObject() : msg, true));
          box.scrollTop = box.scrollHeight;
        })
        .catch(function (err) { showToast(err.message || 'Could not send', 'error'); });
    };
    document.getElementById('chatSend').addEventListener('click', send);
    document.getElementById('chatInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') send();
    });

    // typing indicator → peer
    var typingTimer = null;
    document.getElementById('chatInput').addEventListener('input', function () {
      if (!__chatConv) return;
      JobKartSocket.emit('typing:start', { conversationId: __chatConv.conversationId, to: __chatConv.peerId });
      clearTimeout(typingTimer);
      typingTimer = setTimeout(function () {
        JobKartSocket.emit('typing:stop', { conversationId: __chatConv.conversationId, to: __chatConv.peerId });
      }, 1200);
    });

    // incoming messages + typing
    if (window.JobKartSocket) {
      JobKartSocket.on('message:new', function (data) {
        if (!__chatConv || data.message.conversationId !== __chatConv.conversationId) return;
        var box = document.getElementById('chatMessages');
        box.insertAdjacentHTML('beforeend', chatBubble(data.message, false));
        box.scrollTop = box.scrollHeight;
        api.put('/messages/' + __chatConv.conversationId + '/read', {}).catch(function () {});
      });
      JobKartSocket.on('typing:start', function (d) {
        if (!__chatConv || d.conversationId !== __chatConv.conversationId) return;
        var el = document.getElementById('chatTyping');
        el.textContent = __chatConv.candidateName + ' is typing…';
        el.style.display = 'block';
      });
      JobKartSocket.on('typing:stop', function (d) {
        if (!__chatConv || d.conversationId !== __chatConv.conversationId) return;
        document.getElementById('chatTyping').style.display = 'none';
      });
    }
  }

  function escHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ===== REAL-TIME (recruiter) =====
  function initRecruiterRealtime() {
    if (!window.JobKartSocket) return;
    JobKartSocket.on('application:new', function (data) {
      showToast('🎯 New application from ' + (data.candidate && data.candidate.name ? data.candidate.name : 'a candidate') + ' for ' + (data.job && data.job.title ? data.job.title : 'a job') + '!', 'success');
      if (typeof initRecruiterDashboard === 'function') initRecruiterDashboard();
      if (typeof fetchAndRenderApplicants === 'function') fetchAndRenderApplicants(true);
      if (typeof initRecruiterPipeline === 'function') initRecruiterPipeline();
    });
    JobKartSocket.on('message:new', function (data) {
      showToast('💬 New message from ' + (data.sender && data.sender.name ? data.sender.name : 'a candidate'), 'info');
    });
    JobKartSocket.on('user:online', function (data) {
      // live presence: update the map + refresh any visible green dots
      __onlineUsers[String(data.userId)] = !!data.isOnline;
      document.querySelectorAll('.kcard[data-cand-id="' + data.userId + '"]').forEach(function (card) {
        var nameEl = card.querySelector('div');
        if (!nameEl) return;
        var existing = nameEl.querySelector('span[title="Online now"]');
        if (data.isOnline && !existing) {
          var dot = document.createElement('span');
          dot.title = 'Online now';
          dot.style.cssText = 'display:inline-block; width:8px; height:8px; border-radius:50%; background:#10B981; margin-left:5px; box-shadow:0 0 0 2px rgba(16,185,129,0.2);';
          nameEl.appendChild(dot);
        } else if (!data.isOnline && existing) {
          existing.remove();
        }
      });
      // also update profile modal if open for this candidate
      if (__profileModalCand && String(__profileModalCand._id) === String(data.userId)) {
        __profileModalCand.isOnline = data.isOnline;
        var el = document.getElementById('cpOnlineBadge');
        if (el) el.style.display = data.isOnline ? 'inline-flex' : 'none';
      }
    });
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
