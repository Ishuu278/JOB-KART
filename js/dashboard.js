/* ============================================================
   js/dashboard.js — Job-Kart Dashboard Logic
   Candidate & Recruiter Dashboards
   ============================================================ */

(function () {
  'use strict';

  // ===== MOCK DATA =====
  // Structured like API responses for easy backend replacement

  var CANDIDATE_DATA = {
    user: {
      name: 'Priya Sahoo',
      initials: 'PS',
      email: 'priya.sahoo@email.com'
    },
    stats: {
      totalApplications: 24,
      applied: 8,
      underReview: 6,
      interviewScheduled: 4,
      selected: 3,
      rejected: 3
    },
    profileCompletion: {
      percentage: 72,
      items: [
        { label: 'Profile photo', done: true },
        { label: 'Work experience', done: true },
        { label: 'Education details', done: true },
        { label: 'Upload resume', done: false },
        { label: 'Add skills', done: false },
        { label: 'Portfolio link', done: false }
      ]
    },
    resumeViews: {
      today: 12,
      thisWeek: 47,
      total: 284
    },
    upcomingInterviews: [
      { company: 'Leadjen Media', companyInitials: 'LM', position: 'Marketing Executive', date: 'Jun 30, 2026', time: '10:00 AM', link: '#' },
      { company: 'Algopage Tech', companyInitials: 'AT', position: 'Frontend Developer', date: 'Jul 02, 2026', time: '2:30 PM', link: '#' },
      { company: 'NorthStar Solutions', companyInitials: 'NS', position: 'UI/UX Designer', date: 'Jul 05, 2026', time: '11:00 AM', link: '#' }
    ],
    recentActivity: [
      { type: 'applied', text: 'Applied for <strong>Frontend Developer</strong> at Algopage', time: '2 hours ago', icon: 'blue' },
      { type: 'viewed', text: 'Your resume was viewed by <strong>NorthStar Solutions</strong>', time: '5 hours ago', icon: 'green' },
      { type: 'interview', text: 'Interview scheduled with <strong>Leadjen Media</strong>', time: '1 day ago', icon: 'purple' },
      { type: 'saved', text: 'Saved <strong>Digital Marketing Executive</strong> job', time: '1 day ago', icon: 'yellow' },
      { type: 'selected', text: 'Selected for <strong>Telecaller</strong> at Vertex', time: '3 days ago', icon: 'green' },
      { type: 'rejected', text: 'Application for <strong>Data Entry</strong> was declined', time: '4 days ago', icon: 'red' }
    ],
    savedJobs: [
      { title: 'Digital Marketing Executive', company: 'Leadjen Media', date: 'Jun 25' },
      { title: 'Content Writer', company: 'Bluepoint Digital', date: 'Jun 23' },
      { title: 'Social Media Manager', company: 'Coastline Tech', date: 'Jun 20' },
      { title: 'SEO Specialist', company: 'NorthStar Solutions', date: 'Jun 18' }
    ],
    applicationTimeline: {
      currentStage: 2, // 0-indexed: 0=Applied, 1=Under Review, 2=Shortlisted, 3=Interview, 4=Selected
      stages: ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected']
    },
    charts: {
      applicationsPerMonth: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [3, 5, 2, 7, 4, 3]
      },
      statusDistribution: {
        labels: ['Applied', 'Under Review', 'Interview', 'Selected', 'Rejected'],
        data: [8, 6, 4, 3, 3],
        colors: ['#3B82F6', '#F59E0B', '#8B5CF6', '#10B981', '#EF4444']
      }
    }
  };

  var RECRUITER_DATA = {
    user: {
      name: 'Anita Mishra',
      initials: 'AM',
      company: 'Leadjen Media',
      email: 'anita@leadjenmedia.com'
    },
    stats: {
      activeJobs: 12,
      totalApplications: 156,
      shortlisted: 34,
      totalJobViews: 4820
    },
    pipeline: {
      applied: 156,
      underReview: 89,
      shortlisted: 34,
      interview: 18,
      selected: 12,
      total: 156
    },
    recentApplicants: [
      { name: 'Rohit Kumar', photo: 'https://i.pravatar.cc/150?img=68', role: 'Telecaller', date: 'Jun 27', status: 'review' },
      { name: 'Sneha Patel', photo: 'https://i.pravatar.cc/150?img=47', role: 'Marketing Executive', date: 'Jun 26', status: 'shortlisted' },
      { name: 'Amit Singh', photo: 'https://i.pravatar.cc/150?img=12', role: 'Frontend Developer', date: 'Jun 26', status: 'interview' },
      { name: 'Kavita Nair', photo: 'https://i.pravatar.cc/150?img=45', role: 'Content Writer', date: 'Jun 25', status: 'applied' },
      { name: 'Raj Mehta', photo: 'https://i.pravatar.cc/150?img=53', role: 'Digital Marketer', date: 'Jun 25', status: 'selected' },
      { name: 'Pooja Sharma', photo: 'https://i.pravatar.cc/150?img=26', role: 'Social Media Manager', date: 'Jun 24', status: 'review' },
      { name: 'Vikram Reddy', photo: 'https://i.pravatar.cc/150?img=33', role: 'Telecaller', date: 'Jun 24', status: 'rejected' },
      { name: 'Deepa Joshi', photo: 'https://i.pravatar.cc/150?img=16', role: 'SEO Specialist', date: 'Jun 23', status: 'shortlisted' }
    ],
    recentActivity: [
      { type: 'applicant', text: 'New application from <strong>Rohit Kumar</strong> for Telecaller', time: '1 hour ago', icon: 'blue' },
      { type: 'shortlisted', text: '<strong>Sneha Patel</strong> shortlisted for Marketing Executive', time: '3 hours ago', icon: 'green' },
      { type: 'posted', text: 'Job posted: <strong>Digital Marketing Executive</strong>', time: '1 day ago', icon: 'purple' },
      { type: 'interview', text: 'Interview invitation sent to <strong>Amit Singh</strong>', time: '1 day ago', icon: 'yellow' },
      { type: 'selected', text: '<strong>Raj Mehta</strong> selected for Digital Marketer', time: '2 days ago', icon: 'green' },
      { type: 'applicant', text: 'New application from <strong>Kavita Nair</strong> for Content Writer', time: '3 days ago', icon: 'blue' }
    ],
    charts: {
      applicationsPerJob: {
        labels: ['Telecaller', 'Marketing Exec', 'Frontend Dev', 'Content Writer', 'Digital Mktg', 'SEO'],
        data: [42, 31, 28, 22, 18, 15]
      },
      hiringStatus: {
        labels: ['Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
        data: [89, 34, 18, 12, 3],
        colors: ['#F59E0B', '#06B6D4', '#8B5CF6', '#10B981', '#EF4444']
      },
      jobViewsOverTime: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        data: [620, 780, 950, 850, 1020, 1200]
      }
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


  // ===== CANDIDATE DASHBOARD INIT =====
  function initCandidateDashboard() {
    var d = CANDIDATE_DATA;

    simulateLoading(function () {
      // Animate stats
      animateStatCards();

      // Animate profile ring
      animateProfileRing();

      // Initialize charts
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
  }


  // ===== RECRUITER DASHBOARD INIT =====
  function initRecruiterDashboard() {
    var d = RECRUITER_DATA;

    simulateLoading(function () {
      // Animate stats
      animateStatCards();

      // Animate pipeline bars
      animatePipeline();

      // Initialize charts
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

    // Init applicant search/filter
    initApplicantSearch();
    initApplicantPagination();
  }


  // ===== SEARCH & FILTER (Recruiter Applicants) =====
  function initApplicantSearch() {
    var searchInput = document.getElementById('applicantSearch');
    var filterSelect = document.getElementById('applicantFilter');
    if (!searchInput && !filterSelect) return;

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

  function initApplicantPagination() {
    var rows = document.querySelectorAll('.applicant-row');
    if (rows.length <= itemsPerPage) {
      var pagEl = document.getElementById('applicantPagination');
      if (pagEl) pagEl.style.display = 'none';
      return;
    }

    showPage(1);
    renderPaginationButtons();
  }

  function showPage(page) {
    currentPage = page;
    var rows = document.querySelectorAll('.applicant-row');
    var start = (page - 1) * itemsPerPage;
    var end = start + itemsPerPage;

    rows.forEach(function (row, index) {
      if (row.style.display === 'none') return; // filtered out
      row.style.display = (index >= start && index < end) ? '' : 'none';
    });

    renderPaginationButtons();
  }

  function renderPaginationButtons() {
    var container = document.getElementById('applicantPagination');
    if (!container) return;

    var visibleRows = document.querySelectorAll('.applicant-row:not([style*="display: none"])');
    var totalPages = Math.ceil(document.querySelectorAll('.applicant-row').length / itemsPerPage);

    if (totalPages <= 1) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'flex';
    container.innerHTML = '';

    // Prev button
    var prevBtn = document.createElement('button');
    prevBtn.className = 'dash-pagination-btn';
    prevBtn.innerHTML = ICONS.chevronLeft;
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', function () { showPage(currentPage - 1); });
    container.appendChild(prevBtn);

    // Page buttons
    for (var i = 1; i <= totalPages; i++) {
      var btn = document.createElement('button');
      btn.className = 'dash-pagination-btn' + (i === currentPage ? ' dash-pagination-btn--active' : '');
      btn.textContent = i;
      btn.addEventListener('click', (function (p) {
        return function () { showPage(p); };
      })(i));
      container.appendChild(btn);
    }

    // Next button
    var nextBtn = document.createElement('button');
    nextBtn.className = 'dash-pagination-btn';
    nextBtn.innerHTML = ICONS.chevronRight;
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', function () { showPage(currentPage + 1); });
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


  // ===== MAIN INIT =====
  function init() {
    setCurrentDate();
    initDarkMode();
    initInterviewButtons();

    // Determine which dashboard to initialize
    var pageType = document.body.getAttribute('data-dashboard');

    if (pageType === 'candidate') {
      initCandidateDashboard();
    } else if (pageType === 'recruiter') {
      initRecruiterDashboard();
    }
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
