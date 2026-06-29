/* ============================================================
   js/compare.js — Job-Kart Job Comparison Page Logic
   ============================================================ */

(function() {
  'use strict';

  var COMPARE_JOBS_KEY = 'jobkart-compare-jobs';

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

  // Find full job details from COMPANIES_DATA to enrich comparison
  function findFullJob(jobId) {
    var companies = window.COMPANIES_DATA;
    if (!companies) return null;

    for (var key in companies) {
      if (companies.hasOwnProperty(key)) {
        var company = companies[key];
        if (company.jobs) {
          var found = company.jobs.find(function(j) { return j.id === jobId; });
          if (found) {
            return {
              job: found,
              company: company
            };
          }
        }
      }
    }
    return null;
  }

  // Build enriched job data (merge localStorage selection + full data)
  function enrichJobData(selectedJob) {
    var full = findFullJob(selectedJob.id);
    if (full) {
      return {
        id: selectedJob.id,
        title: full.job.title,
        company: full.company.name,
        companyId: full.company.id,
        exp: full.job.exp || selectedJob.exp || 'Not specified',
        sal: full.job.sal || selectedJob.sal || 'Not specified',
        location: full.job.location || selectedJob.location || full.company.hq || 'Not specified',
        type: full.job.type || selectedJob.type || 'Full-Time',
        skills: full.job.skills || selectedJob.skills || [],
        benefits: full.job.benefits || selectedJob.benefits || []
      };
    }
    // Fallback to localStorage data
    return {
      id: selectedJob.id,
      title: selectedJob.title || 'Untitled Job',
      company: selectedJob.company || 'Unknown Company',
      companyId: '',
      exp: selectedJob.exp || 'Not specified',
      sal: selectedJob.sal || 'Not specified',
      location: selectedJob.location || 'Not specified',
      type: selectedJob.type || 'Full-Time',
      skills: selectedJob.skills || [],
      benefits: selectedJob.benefits || []
    };
  }

  // Find common skills between two jobs
  function findCommonSkills(skills1, skills2) {
    if (!skills1.length || !skills2.length) return [];
    return skills1.filter(function(s) {
      return skills2.indexOf(s) !== -1;
    });
  }

  // Render comparison table
  function renderComparison(jobs) {
    var container = document.getElementById('compareContent');
    var ctaSection = document.getElementById('compareCta');
    if (!container) return;

    if (jobs.length < 2) {
      container.innerHTML =
        '<div class="compare-empty">' +
          '<span class="compare-empty__icon">⚖️</span>' +
          '<h2 class="compare-empty__title">Select Two Jobs to Compare</h2>' +
          '<p class="compare-empty__desc">Browse job openings and click the <strong>Compare</strong> button on two different jobs. Then return here to see a detailed side-by-side comparison.</p>' +
          '<a href="openings.html" class="btn-primary" style="padding: 14px 36px;">Browse Open Positions</a>' +
        '</div>';
      if (ctaSection) ctaSection.style.display = 'none';
      return;
    }

    var job1 = enrichJobData(jobs[0]);
    var job2 = enrichJobData(jobs[1]);
    var commonSkills = findCommonSkills(job1.skills, job2.skills);

    var html = '<table class="compare-table">';

    // Header row
    html += '<thead><tr class="compare-table__header">' +
      '<th>Feature</th>' +
      '<th>' +
        '<div class="compare-job-cell">' +
          '<span class="compare-job-cell__title">' + escapeHtml(job1.title) + '</span>' +
          '<span class="compare-job-cell__company">' + escapeHtml(job1.company) + '</span>' +
        '</div>' +
      '</th>' +
      '<th>' +
        '<div class="compare-job-cell">' +
          '<span class="compare-job-cell__title">' + escapeHtml(job2.title) + '</span>' +
          '<span class="compare-job-cell__company">' + escapeHtml(job2.company) + '</span>' +
        '</div>' +
      '</th>' +
    '</tr></thead><tbody>';

    // Company row
    html += '<tr>' +
      '<td class="row-label">Company</td>' +
      '<td>' + (job1.companyId ? '<a href="company.html?id=' + job1.companyId + '" style="color:var(--accent); font-weight:600; text-decoration:none;">' + escapeHtml(job1.company) + '</a>' : escapeHtml(job1.company)) + '</td>' +
      '<td>' + (job2.companyId ? '<a href="company.html?id=' + job2.companyId + '" style="color:var(--accent); font-weight:600; text-decoration:none;">' + escapeHtml(job2.company) + '</a>' : escapeHtml(job2.company)) + '</td>' +
    '</tr>';

    // Salary row
    html += '<tr>' +
      '<td class="row-label">Salary</td>' +
      '<td class="' + (job1.sal !== job2.sal ? 'value-highlight' : '') + '">' + escapeHtml(job1.sal) + '</td>' +
      '<td class="' + (job1.sal !== job2.sal ? 'value-highlight' : '') + '">' + escapeHtml(job2.sal) + '</td>' +
    '</tr>';

    // Experience row
    html += '<tr>' +
      '<td class="row-label">Experience</td>' +
      '<td>' + escapeHtml(job1.exp) + '</td>' +
      '<td>' + escapeHtml(job2.exp) + '</td>' +
    '</tr>';

    // Job Type row
    html += '<tr>' +
      '<td class="row-label">Job Type</td>' +
      '<td>' + escapeHtml(job1.type) + '</td>' +
      '<td>' + escapeHtml(job2.type) + '</td>' +
    '</tr>';

    // Location row
    html += '<tr>' +
      '<td class="row-label">Location</td>' +
      '<td class="' + (job1.location !== job2.location ? 'value-highlight' : '') + '">' + escapeHtml(job1.location) + '</td>' +
      '<td class="' + (job1.location !== job2.location ? 'value-highlight' : '') + '">' + escapeHtml(job2.location) + '</td>' +
    '</tr>';

    // Skills row
    html += '<tr>' +
      '<td class="row-label">Skills</td>' +
      '<td>' + renderSkillTags(job1.skills, commonSkills) + '</td>' +
      '<td>' + renderSkillTags(job2.skills, commonSkills) + '</td>' +
    '</tr>';

    // Benefits row
    html += '<tr>' +
      '<td class="row-label">Benefits</td>' +
      '<td>' + renderBenefitsList(job1.benefits) + '</td>' +
      '<td>' + renderBenefitsList(job2.benefits) + '</td>' +
    '</tr>';

    html += '</tbody></table>';

    // Common skills summary
    if (commonSkills.length > 0) {
      html += '<div style="margin-top:20px; padding:16px 20px; background:var(--bg-soft); border-radius:var(--radius); border:1px solid var(--border-soft);">' +
        '<strong style="color:var(--text-dark); font-size:0.9rem;">Common Skills:</strong> ' +
        '<span style="color:var(--accent); font-size:0.9rem;">' + commonSkills.join(', ') + '</span>' +
      '</div>';
    }

    container.innerHTML = html;

    if (ctaSection) ctaSection.style.display = 'flex';
  }

  // Render skill tags with common skill highlighting
  function renderSkillTags(skills, commonSkills) {
    if (!skills || !skills.length) return '<span style="color:var(--text-muted);">N/A</span>';
    var html = '<div class="compare-skill-tags">';
    skills.forEach(function(skill) {
      var isCommon = commonSkills.indexOf(skill) !== -1;
      html += '<span class="compare-skill-tag' + (isCommon ? ' compare-skill-tag--common' : '') + '">' + escapeHtml(skill) + '</span>';
    });
    html += '</div>';
    return html;
  }

  // Render benefits list
  function renderBenefitsList(benefits) {
    if (!benefits || !benefits.length) return '<span style="color:var(--text-muted);">N/A</span>';
    var html = '<ul class="compare-benefits-list">';
    benefits.forEach(function(benefit) {
      // Handle benefit objects (icon + label) or plain strings
      var text = typeof benefit === 'object' ? benefit.label : benefit;
      html += '<li>' + escapeHtml(text) + '</li>';
    });
    html += '</ul>';
    return html;
  }

  // Simple HTML escape
  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Initialize comparison page
  function initComparePage() {
    var jobs = getCompareJobs();
    renderComparison(jobs);

    // Clear comparison button
    var clearBtn = document.getElementById('clearCompareBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        setCompareJobs([]);
        renderComparison([]);

        // Sync compare buttons on any open pages
        if (typeof window.syncCompareButtons === 'function') {
          window.syncCompareButtons();
        }
      });
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComparePage);
  } else {
    initComparePage();
  }

})();
