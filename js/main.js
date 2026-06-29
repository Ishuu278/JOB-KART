/* js/main.js — Job-Kart Shared JavaScript (Corporate Redesign) */

(function () {
  'use strict';

  // ===== ACTIVE NAV LINK =====
  // Auto-highlight current page nav link based on window.location.pathname
  function setActiveNav() {
    var path = window.location.pathname;
    var filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

    var navMap = {
      'index.html': 'nav-home',
      'openings.html': 'nav-openings',
      'about.html': 'nav-about',
      'contact.html': 'nav-contact',
      'company.html': 'nav-openings',
      'compare.html': 'nav-openings',
    };

    // Also handle root "/" as index
    var activeId = navMap[filename] || (filename === '' ? 'nav-home' : null);

    document.querySelectorAll('.nav-links a[data-nav]').forEach(function (link) {
      link.classList.remove('active');
    });

    if (activeId) {
      var el = document.getElementById(activeId);
      if (el) el.classList.add('active');
    }
  }

  // ===== NAVBAR SCROLL SHADOW =====
  // Adds .scrolled class on scroll for subtle box-shadow
  function initNavbarScroll() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ===== SCROLL PROGRESS BAR =====
  function initScrollProgress() {
    var bar = document.getElementById('scrollProgress');
    if (!bar) return;

    window.addEventListener('scroll', function () {
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      var scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      var progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      bar.style.width = progress + '%';
    });
  }

  // ===== INTERSECTION OBSERVER — REVEAL =====
  function initRevealAnimations() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ===== COUNTER ANIMATION =====
  // Animate stat numbers counting up when hero stats enter viewport
  function initCounterAnimation() {
    var statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (!statNumbers.length) return;

    var animated = false;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !animated) {
            animated = true;
            statNumbers.forEach(function (stat) {
              var target = parseInt(stat.getAttribute('data-target'), 10);
              var duration = 2000;
              var start = performance.now();

              function update(now) {
                var elapsed = now - start;
                var progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                var eased = 1 - Math.pow(1 - progress, 3);
                var current = Math.floor(eased * target);
                stat.textContent = current.toLocaleString() + '+';
                if (progress < 1) requestAnimationFrame(update);
              }
              requestAnimationFrame(update);
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    var statsContainer = document.querySelector('.hero-stats');
    if (statsContainer) observer.observe(statsContainer);
  }

  // ===== JOB ACCORDION =====
  function initJobAccordion() {
    var jobHeaders = document.querySelectorAll('.job-header');
    if (!jobHeaders.length) return;

    jobHeaders.forEach(function (header) {
      header.addEventListener('click', function () {
        var card = header.parentElement;
        var body = card.querySelector('.job-body');
        var isActive = card.classList.contains('active');

        // Close all others
        document.querySelectorAll('.job-card.active').forEach(function (c) {
          if (c !== card) {
            c.classList.remove('active');
            c.querySelector('.job-body').style.maxHeight = null;
          }
        });

        if (isActive) {
          card.classList.remove('active');
          body.style.maxHeight = null;
        } else {
          card.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  }

  // ===== FAQ ACCORDION =====
  function initFaqAccordion() {
    var faqQuestions = document.querySelectorAll('.faq-question');
    if (!faqQuestions.length) return;

    faqQuestions.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.parentElement;
        var answer = item.querySelector('.faq-answer');
        var isActive = item.classList.contains('active');

        // Close all others
        document.querySelectorAll('.faq-item.active').forEach(function (i) {
          if (i !== item) {
            i.classList.remove('active');
            i.querySelector('.faq-answer').style.maxHeight = null;
          }
        });

        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  // ===== PARTNER TICKER — PAUSE ON HOVER =====
  function initTickerHover() {
    var track = document.getElementById('tickerTrack');
    if (!track) return;

    track.addEventListener('mouseenter', function () {
      track.classList.add('paused');
    });
    track.addEventListener('mouseleave', function () {
      track.classList.remove('paused');
    });
  }

  // ===== MOBILE NAV TOGGLE =====
  function initMobileNav() {
    var mobileBtn = document.getElementById('mobileMenuBtn');
    var navLinks = document.getElementById('navLinks');

    if (mobileBtn && navLinks) {
      mobileBtn.addEventListener('click', function () {
        mobileBtn.classList.toggle('active');
        navLinks.classList.toggle('open');
      });

      // Close menu on link click
      navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          mobileBtn.classList.remove('active');
          navLinks.classList.remove('open');
        });
      });
    }
  }

  // ===== JOB SELECTION FOR APPLY FORM =====
  function initJobSelection() {
    var jobCards = document.querySelectorAll('.job-card[data-job-id]');
    var hiddenInput = document.getElementById('selectedJobId');
    if (!jobCards.length || !hiddenInput) return;

    jobCards.forEach(function (card) {
      card.addEventListener('click', function () {
        document.querySelectorAll('.job-card.selected').forEach(function (c) {
          c.classList.remove('selected');
        });
        card.classList.add('selected');
        hiddenInput.value = card.getAttribute('data-job-id');
      });
    });
  }

  // ===== FORM HANDLERS (backend-ready) =====

  // Helper: show success state on a form
  function showFormSuccess(formEl, successEl) {
    if (formEl) formEl.style.display = 'none';
    if (successEl) successEl.classList.add('show');
  }

  // contactForm submit
  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var formData = new FormData(form);

      console.log('[Job-Kart] Contact form submitted:');
      formData.forEach(function (value, key) {
        console.log('  ' + key + ':', value);
      });

      /*
        BACKEND INTEGRATION POINT — /api/contact
        fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.fromEntries(formData))
        })
        .then(function(res) { return res.json(); })
        .then(function(data) { showFormSuccess(form, document.getElementById('contactSuccess')); })
        .catch(function(err) { console.error('Contact form error:', err); alert('Something went wrong. Please try again.'); });
      */

      showFormSuccess(form, document.getElementById('contactSuccess'));
    });
  }

  // applyForm submit
  function initApplyForm() {
    var form = document.getElementById('applyForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var formData = new FormData(form);

      console.log('[Job-Kart] Application form submitted:');
      formData.forEach(function (value, key) {
        console.log('  ' + key + ':', value);
      });

      /*
        BACKEND INTEGRATION POINT — /api/apply
        fetch('/api/apply', {
          method: 'POST',
          body: formData
        })
        .then(function(res) { return res.json(); })
        .then(function(data) { showFormSuccess(form, document.getElementById('applySuccess')); })
        .catch(function(err) { console.error('Apply form error:', err); alert('Something went wrong. Please try again.'); });
      */

      showFormSuccess(form, document.getElementById('applySuccess'));
    });
  }

  // ===== SMOOTH SCROLL FOR SAME-PAGE ANCHORS =====
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var hash = this.getAttribute('href');
        if (hash === '#') return;
        var target = document.querySelector(hash);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ===== SCROLL SNAP MOBILE DISABLE =====
  function handleMobileSnap() {
    function check() {
      if (window.innerWidth < 768) {
        document.documentElement.style.scrollSnapType = 'none';
      } else {
        document.documentElement.style.scrollSnapType = 'y mandatory';
      }
    }
    check();
    window.addEventListener('resize', check);
  }

  // ===== SAVE / BOOKMARK JOBS (localStorage-based) =====
  var SAVED_JOBS_KEY = 'jobkart-saved-jobs';

  function getSavedJobIds() {
    try {
      var raw = localStorage.getItem(SAVED_JOBS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function setSavedJobIds(ids) {
    try {
      localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(ids));
    } catch (e) {
      // localStorage unavailable (private mode, quota, etc.) — fail silently
    }
  }

  function isJobSaved(jobId) {
    return getSavedJobIds().indexOf(jobId) !== -1;
  }

  // Lightweight toast (no dependency — mirrors the visual language
  // of card shadows / pill radius already used across the site)
  function showJobToast(message) {
    var existing = document.querySelector('.jobkart-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'jobkart-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('jobkart-toast--visible');
    });

    setTimeout(function () {
      toast.classList.remove('jobkart-toast--visible');
      setTimeout(function () {
        toast.remove();
      }, 300);
    }, 2200);
  }

  function updateSaveButtonUI(btn, saved) {
    btn.classList.toggle('job-save-btn--saved', saved);
    btn.setAttribute('aria-label', saved ? 'Remove from saved jobs' : 'Save this job');
    btn.setAttribute('aria-pressed', saved ? 'true' : 'false');
    var label = btn.querySelector('.job-save-btn-label');
    if (label) label.textContent = saved ? 'Saved' : 'Save';
  }

  function toggleSaveJob(jobId, jobTitle, btn) {
    var ids = getSavedJobIds();
    var index = ids.indexOf(jobId);
    var nowSaved;

    if (index === -1) {
      ids.push(jobId);
      nowSaved = true;
    } else {
      ids.splice(index, 1);
      nowSaved = false;
    }

    setSavedJobIds(ids);
    updateSaveButtonUI(btn, nowSaved);

    showJobToast(
      nowSaved
        ? (jobTitle ? jobTitle + ' saved' : 'Job saved')
        : (jobTitle ? jobTitle + ' removed' : 'Job removed')
    );

    updateSavedJobsCount();
  }

  // Optional: updates a badge showing how many jobs are saved
  // (wire to an element with id="savedJobsCount" in the navbar if desired)
  function updateSavedJobsCount() {
    var countEl = document.getElementById('savedJobsCount');
    if (!countEl) return;
    var count = getSavedJobIds().length;
    countEl.textContent = count;
    countEl.style.display = count > 0 ? 'inline-flex' : 'none';
  }

  // Initializes every [data-save-job] button on the page.
  // Expected markup:
  //   <button class="job-save-btn" data-save-job data-job-id="telecaller-1" data-job-title="Telecaller">
  //     <svg class="job-save-btn-icon" ...bookmark icon...></svg>
  //     <span class="job-save-btn-label">Save</span>
  //   </button>
  function initSaveJobButtons() {
    var buttons = document.querySelectorAll('[data-save-job]');
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      var jobId = btn.getAttribute('data-job-id');
      if (!jobId) return;

      var jobTitle = btn.getAttribute('data-job-title') || '';
      updateSaveButtonUI(btn, isJobSaved(jobId));

      btn.addEventListener('click', function (e) {
        e.stopPropagation(); // don't trigger parent job-card click/accordion toggle
        toggleSaveJob(jobId, jobTitle, btn);
      });
    });

    updateSavedJobsCount();
  }

  // ===== SAVED JOBS PAGE FILTER (optional) =====
  // If a page has a container [data-saved-jobs-only], hide any
  // .job-card / .featured-job-card whose data-job-id is not saved.
  // Useful for a future "My Saved Jobs" view.
  function initSavedJobsOnlyView() {
    var container = document.querySelector('[data-saved-jobs-only]');
    if (!container) return;

    var savedIds = getSavedJobIds();
    var cards = container.querySelectorAll('[data-job-id]');

    cards.forEach(function (card) {
      var id = card.getAttribute('data-job-id');
      if (savedIds.indexOf(id) === -1) {
        card.style.display = 'none';
      }
    });

    if (savedIds.length === 0) {
      var empty = document.createElement('p');
      empty.className = 'saved-jobs-empty';
      empty.textContent = "You haven't saved any jobs yet. Browse openings and tap Save to bookmark one.";
      container.appendChild(empty);
    }
  }


  // ===== JOB COMPARISON (localStorage) =====
  var COMPARE_JOBS_KEY = 'jobkart-compare-jobs';
  var MAX_COMPARE = 2;

  function getCompareJobs() {
    try {
      var raw = localStorage.getItem(COMPARE_JOBS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function setCompareJobs(jobs) {
    try {
      localStorage.setItem(COMPARE_JOBS_KEY, JSON.stringify(jobs));
    } catch (e) {}
  }

  function isJobInCompare(jobId) {
    return getCompareJobs().some(function(j) { return j.id === jobId; });
  }

  function addCompareJob(jobData) {
    var jobs = getCompareJobs();
    if (jobs.length >= MAX_COMPARE) return false;
    if (isJobInCompare(jobData.id)) return false;
    jobs.push(jobData);
    setCompareJobs(jobs);
    return true;
  }

  function removeCompareJob(jobId) {
    var jobs = getCompareJobs().filter(function(j) { return j.id !== jobId; });
    setCompareJobs(jobs);
  }

  function clearCompareJobs() {
    setCompareJobs([]);
  }

  // Render the floating comparison bar
  function renderCompareBar() {
    var bar = document.getElementById('compareBar');
    if (!bar) return;

    var jobs = getCompareJobs();
    var jobsContainer = bar.querySelector('.compare-bar__jobs');
    var actionsContainer = bar.querySelector('.compare-bar__actions');
    var countEl = bar.querySelector('.compare-bar__count');
    var compareBtn = bar.querySelector('.compare-bar__btn');
    var clearBtn = bar.querySelector('.compare-bar__clear');

    if (!jobsContainer || !countEl || !compareBtn) return;

    // Show/hide bar
    if (jobs.length > 0) {
      bar.classList.add('compare-bar--visible');
    } else {
      bar.classList.remove('compare-bar--visible');
      return;
    }

    // Render job items
    jobsContainer.innerHTML = '';
    jobs.forEach(function(job, index) {
      var item = document.createElement('div');
      item.className = 'compare-bar__item';
      item.innerHTML =
        '<div class="compare-bar__item-info">' +
          '<div class="compare-bar__item-title">' + (job.title || 'Untitled') + '</div>' +
          '<div class="compare-bar__item-company">' + (job.company || '') + '</div>' +
        '</div>' +
        '<button class="compare-bar__item-remove" data-compare-remove="' + job.id + '" aria-label="Remove from comparison">&times;</button>';
      jobsContainer.appendChild(item);

      // Add divider between items
      if (index < jobs.length - 1) {
        var divider = document.createElement('span');
        divider.className = 'compare-bar__divider';
        divider.textContent = 'VS';
        jobsContainer.appendChild(divider);
      }
    });

    // Update count and button state
    countEl.textContent = jobs.length + '/' + MAX_COMPARE + ' selected';

    if (jobs.length === MAX_COMPARE) {
      compareBtn.classList.remove('compare-bar__btn--disabled');
      compareBtn.href = 'compare.html';
    } else {
      compareBtn.classList.add('compare-bar__btn--disabled');
      compareBtn.removeAttribute('href');
    }

    // Remove button handlers
    jobsContainer.querySelectorAll('[data-compare-remove]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var id = btn.getAttribute('data-compare-remove');
        removeCompareJob(id);
        syncCompareButtons();
        renderCompareBar();
      });
    });

    // Clear button
    if (clearBtn) {
      clearBtn.onclick = function() {
        clearCompareJobs();
        syncCompareButtons();
        renderCompareBar();
      };
    }

    // Compare button click
    if (compareBtn.classList.contains('compare-bar__btn--disabled')) {
      compareBtn.onclick = function(e) { e.preventDefault(); };
    } else {
      compareBtn.onclick = null;
    }
  }

  // Sync all compare buttons on the page with localStorage state
  function syncCompareButtons() {
    document.querySelectorAll('[data-compare-job]').forEach(function(btn) {
      var id = btn.getAttribute('data-compare-job');
      var selected = isJobInCompare(id);
      btn.classList.toggle('job-compare-btn--selected', selected);
      var label = btn.querySelector('.job-compare-btn-label');
      if (label) label.textContent = selected ? 'Added' : 'Compare';
    });
  }

  // Expose for cross-file access (compare.js uses this)
  window.syncCompareButtons = syncCompareButtons;

  // Initialize compare buttons
  function initCompareButtons() {
    var buttons = document.querySelectorAll('[data-compare-job]');
    if (!buttons.length) return;

    buttons.forEach(function(btn) {
      var jobId = btn.getAttribute('data-compare-job');
      if (!jobId) return;

      var jobTitle = btn.getAttribute('data-compare-title') || '';
      var jobCompany = btn.getAttribute('data-compare-company') || '';
      var jobExp = btn.getAttribute('data-compare-exp') || '';
      var jobSal = btn.getAttribute('data-compare-sal') || '';
      var jobLocation = btn.getAttribute('data-compare-location') || '';
      var jobType = btn.getAttribute('data-compare-type') || '';
      var jobSkills = btn.getAttribute('data-compare-skills') || '';
      var jobBenefits = btn.getAttribute('data-compare-benefits') || '';

      // Set initial state
      btn.classList.toggle('job-compare-btn--selected', isJobInCompare(jobId));
      var label = btn.querySelector('.job-compare-btn-label');
      if (label) label.textContent = isJobInCompare(jobId) ? 'Added' : 'Compare';

      btn.addEventListener('click', function(e) {
        e.stopPropagation();

        if (isJobInCompare(jobId)) {
          removeCompareJob(jobId);
          showJobToast(jobTitle + ' removed from comparison');
        } else {
          var jobData = {
            id: jobId,
            title: jobTitle,
            company: jobCompany,
            exp: jobExp,
            sal: jobSal,
            location: jobLocation,
            type: jobType,
            skills: jobSkills ? jobSkills.split('|') : [],
            benefits: jobBenefits ? jobBenefits.split('|') : []
          };

          if (!addCompareJob(jobData)) {
            var current = getCompareJobs();
            if (current.length >= MAX_COMPARE) {
              showJobToast('Remove a job first to compare (max 2)');
            }
            return;
          }
          showJobToast(jobTitle + ' added to comparison');
        }

        syncCompareButtons();
        renderCompareBar();
      });
    });
  }

  // Create comparison bar DOM (appended to body)
  function createCompareBarDOM() {
    if (document.getElementById('compareBar')) return;

    var bar = document.createElement('div');
    bar.className = 'compare-bar';
    bar.id = 'compareBar';
    bar.innerHTML =
      '<div class="compare-bar__jobs"></div>' +
      '<div class="compare-bar__actions">' +
        '<span class="compare-bar__count">0/2 selected</span>' +
        '<button class="compare-bar__clear">Clear All</button>' +
        '<a class="compare-bar__btn compare-bar__btn--disabled" href="#">Compare Jobs</a>' +
      '</div>';
    document.body.appendChild(bar);
  }

  // Expose for cross-file access (job-details.js uses this)
  window.renderCompareBar = renderCompareBar;

  // ===== INITIALIZE EVERYTHING ON DOM READY =====
  document.addEventListener('DOMContentLoaded', function () {
    setActiveNav();
    initNavbarScroll();
    initScrollProgress();
    initMobileNav();
    initRevealAnimations();
    initCounterAnimation();
    initJobAccordion();
    initFaqAccordion();
    initTickerHover();
    initJobSelection();
    initContactForm();
    initApplyForm();
    initSmoothScroll();
    handleMobileSnap();
    initSaveJobButtons();
    initSavedJobsOnlyView();
    createCompareBarDOM();
    initCompareButtons();
    renderCompareBar();
  });
})();