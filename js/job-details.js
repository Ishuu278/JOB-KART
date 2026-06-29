/* ============================================================
   js/job-details.js — Job-Kart Job Details Logic
   ============================================================ */

(function() {
  'use strict';

  // Helper to retrieve URL parameters
  function getQueryParam(param) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Find job and its parent company in COMPANIES_DATA
  function findJobAndCompany(jobId) {
    var companies = window.COMPANIES_DATA;
    if (!companies) return null;

    for (var companyKey in companies) {
      if (companies.hasOwnProperty(companyKey)) {
        var company = companies[companyKey];
        if (company.jobs && company.jobs.length > 0) {
          var matchedJob = company.jobs.find(function(j) {
            return j.id === jobId;
          });
          if (matchedJob) {
            return {
              job: matchedJob,
              company: company
            };
          }
        }
      }
    }
    return null;
  }

  // Find other similar jobs
  function getSimilarJobs(currentJobId, currentCompanyId) {
    var similar = [];
    var companies = window.COMPANIES_DATA;
    if (!companies) return similar;

    // First try: jobs from the same company (excluding current job)
    var sameCompany = companies[currentCompanyId];
    if (sameCompany && sameCompany.jobs) {
      sameCompany.jobs.forEach(function(j) {
        if (j.id !== currentJobId) {
          similar.push({
            id: j.id,
            title: j.title,
            company: sameCompany.name,
            logo: sameCompany.logo
          });
        }
      });
    }

    // Second try: if we have fewer than 3, add jobs from other companies
    if (similar.length < 3) {
      for (var companyKey in companies) {
        if (companies.hasOwnProperty(companyKey) && companyKey !== currentCompanyId) {
          var otherCompany = companies[companyKey];
          if (otherCompany.jobs) {
            otherCompany.jobs.forEach(function(j) {
              if (similar.length < 3) {
                similar.push({
                  id: j.id,
                  title: j.title,
                  company: otherCompany.name,
                  logo: otherCompany.logo
                });
              }
            });
          }
        }
      }
    }

    return similar.slice(0, 3);
  }

  // LocalStorage saved jobs helpers
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
    } catch (e) {}
  }

  function isJobSaved(jobId) {
    return getSavedJobIds().indexOf(jobId) !== -1;
  }

  // Toast Notification
  function showToast(message) {
    var existing = document.querySelector('.jobkart-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'jobkart-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function() {
      toast.classList.add('jobkart-toast--visible');
    });

    setTimeout(function() {
      toast.classList.remove('jobkart-toast--visible');
      setTimeout(function() {
        toast.remove();
      }, 300);
    }, 2200);
  }

  // Update Save Button UI
  function updateSaveButton(btn, saved) {
    if (!btn) return;
    btn.classList.toggle('btn-save--saved', saved);
    btn.setAttribute('aria-pressed', saved ? 'true' : 'false');
    btn.innerHTML = saved
      ? '<i class="fas fa-bookmark"></i> Saved'
      : '<i class="far fa-bookmark"></i> Save';
    
    if (saved) {
      btn.style.backgroundColor = 'var(--navy-dark)';
      btn.style.color = 'var(--white)';
      btn.style.borderColor = 'var(--navy-dark)';
    } else {
      btn.style.backgroundColor = 'transparent';
      btn.style.color = 'var(--navy)';
      btn.style.borderColor = 'var(--navy)';
    }
  }

  // Toggle Save State
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
    updateSaveButton(btn, nowSaved);

    showToast(
      nowSaved
        ? (jobTitle ? jobTitle + ' saved!' : 'Job saved!')
        : (jobTitle ? jobTitle + ' removed!' : 'Job removed!')
    );

    // Sync count if navbar badge is present
    var countEl = document.getElementById('savedJobsCount');
    if (countEl) {
      countEl.textContent = ids.length;
      countEl.style.display = ids.length > 0 ? 'inline-flex' : 'none';
    }
  }

  // Load and Render Page content
  function initJobDetailsPage() {
    var jobId = getQueryParam('job') || getQueryParam('id') || '101'; // Default to 101 (TechNova Senior Frontend Dev)
    var result = findJobAndCompany(jobId);

    if (!result) {
      document.querySelector('main').innerHTML = `
        <div class="breadcrumbs-container" style="max-width: 1200px; margin: 20px auto; padding: 0 40px;">
          <ul class="breadcrumbs">
            <li><a href="index.html">Home</a></li>
            <li><i class="fas fa-chevron-right"></i></li>
            <li><a href="openings.html">Openings</a></li>
            <li><i class="fas fa-chevron-right"></i></li>
            <li class="current">Job Not Found</li>
          </ul>
        </div>
        <section class="card" style="max-width: 800px; margin: 40px auto; padding: 40px; text-align: center;">
          <h2>Job Posting Not Found</h2>
          <p style="color: var(--text-muted); margin: 16px 0 24px;">The job vacancy ID is invalid or has expired.</p>
          <a href="openings.html" class="btn-primary">Browse Open Positions</a>
        </section>
      `;
      return;
    }

    var job = result.job;
    var company = result.company;

    // Breadcrumb
    var bcJobTitle = document.getElementById('bc-job-title');
    if (bcJobTitle) bcJobTitle.textContent = job.title;

    // Header Content
    var bannerImg = document.getElementById('banner-img');
    if (bannerImg) bannerImg.src = company.cover;

    var companyLogo = document.getElementById('company-logo');
    if (companyLogo) companyLogo.src = company.logo;

    var jobTitle = document.getElementById('job-title');
    if (jobTitle) jobTitle.textContent = job.title;

    var companyName = document.getElementById('company-name');
    if (companyName) {
      companyName.innerHTML = `<a href="company.html?id=${company.id}" style="color:inherit; text-decoration:none;">${company.name}</a>`;
    }

    // Header Tags
    var jobLocation = document.getElementById('job-location');
    if (jobLocation) jobLocation.textContent = job.location || company.hq;

    var jobType = document.getElementById('job-type');
    if (jobType) jobType.textContent = job.type;

    var jobSalary = document.getElementById('job-salary');
    if (jobSalary) jobSalary.textContent = job.sal;

    var jobExperience = document.getElementById('job-experience');
    if (jobExperience) jobExperience.textContent = job.exp;

    // Description, Responsibilities, Skills, Benefits
    var jobDesc = document.getElementById('job-description');
    if (jobDesc) jobDesc.textContent = job.description;

    var jobRespList = document.getElementById('job-responsibilities');
    if (jobRespList && job.responsibilities) {
      jobRespList.innerHTML = '';
      job.responsibilities.forEach(function(resp) {
        var li = document.createElement('li');
        li.textContent = resp;
        jobRespList.appendChild(li);
      });
    }

    var jobSkillsDiv = document.getElementById('job-skills');
    if (jobSkillsDiv && job.skills) {
      jobSkillsDiv.innerHTML = '';
      job.skills.forEach(function(skill) {
        var span = document.createElement('span');
        span.className = 'skill-badge';
        span.textContent = skill;
        jobSkillsDiv.appendChild(span);
      });
    }

    var jobBenefitsList = document.getElementById('job-benefits');
    if (jobBenefitsList && job.benefits) {
      jobBenefitsList.innerHTML = '';
      job.benefits.forEach(function(ben) {
        var li = document.createElement('li');
        li.textContent = ben;
        jobBenefitsList.appendChild(li);
      });
    }

    // Sidebar Content
    var companyOverview = document.getElementById('company-overview');
    if (companyOverview) companyOverview.textContent = company.about;

    var postedDate = document.getElementById('posted-date');
    if (postedDate) postedDate.textContent = job.postedDate || 'Recent';

    var applyBefore = document.getElementById('apply-before') || document.getElementById('applyBefore');
    if (applyBefore) applyBefore.textContent = job.applyBefore || 'N/A';

    // Sidebar View Company Profile Link
    var profileLink = document.querySelector('.company-info-card a.link-navy');
    if (profileLink) {
      profileLink.href = `company.html?id=${company.id}`;
    }

    // Similar Jobs
    var similarList = document.getElementById('similar-jobs-list');
    if (similarList) {
      similarList.innerHTML = '';
      var similarJobs = getSimilarJobs(job.id, company.id);

      if (similarJobs.length === 0) {
        similarList.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem;">No similar jobs found.</p>';
      } else {
        similarJobs.forEach(function(sim) {
          var simEl = document.createElement('a');
          simEl.href = `job-details.html?job=${sim.id}`;
          simEl.className = 'similar-job-item';
          simEl.style.display = 'flex';
          simEl.style.alignItems = 'center';
          simEl.style.gap = '12px';
          simEl.style.textDecoration = 'none';
          simEl.style.marginBottom = '16px';
          
          simEl.innerHTML = `
            <img src="${sim.logo}" alt="${sim.company}" style="width:40px; height:40px; object-fit:cover; border-radius:6px; border:1px solid var(--border-soft);">
            <div>
              <h4 style="margin: 0; color: var(--navy-dark, #0f2548); font-size: 0.95rem; font-family: var(--font-body); font-weight: 600; line-height: 1.3;">${sim.title}</h4>
              <small style="color: var(--text-muted, #64748b); font-size: 0.8rem;">${sim.company}</small>
            </div>
          `;
          similarList.appendChild(simEl);
        });
      }
    }

    // Setup Save Button
    var saveBtn = document.getElementById('btn-save');
    if (saveBtn) {
      updateSaveButton(saveBtn, isJobSaved(job.id));
      saveBtn.onclick = function() {
        toggleSaveJob(job.id, job.title, saveBtn);
      };
    }

    // Setup Apply Button
    var applyBtn = document.getElementById('btn-apply');
    if (applyBtn) {
      applyBtn.onclick = function() {
        // Smoothly redirect to application form or search page
        window.location.href = `openings.html?apply=${job.id}`;
      };
    }

    // Setup Share Button
    var shareBtn = document.getElementById('btn-share');
    if (shareBtn) {
      shareBtn.onclick = function() {
        if (navigator.share) {
          navigator.share({
            title: job.title + ' at ' + company.name,
            text: 'Check out this job opening on Job-Kart!',
            url: window.location.href
          }).catch(console.error);
        } else {
          // Fallback clipboard copy
          navigator.clipboard.writeText(window.location.href);
          showToast('Job listing link copied to clipboard!');
        }
      };
    }

    // Setup Compare Button
    var actionsContainer = document.querySelector('.job-header-actions');
    if (actionsContainer) {
      var compareBtn = document.createElement('button');
      compareBtn.className = 'job-compare-btn';
      compareBtn.id = 'btn-compare';
      compareBtn.setAttribute('data-compare-job', job.id);
      compareBtn.setAttribute('data-compare-title', job.title);
      compareBtn.setAttribute('data-compare-company', company.name);
      compareBtn.setAttribute('data-compare-exp', job.exp || '');
      compareBtn.setAttribute('data-compare-sal', job.sal || '');
      compareBtn.setAttribute('data-compare-location', job.location || company.hq);
      compareBtn.setAttribute('data-compare-type', job.type || 'Full-Time');
      compareBtn.setAttribute('data-compare-skills', (job.skills || []).join('|'));
      compareBtn.setAttribute('data-compare-benefits', (job.benefits || []).join('|'));
      compareBtn.innerHTML =
        '<svg class="job-compare-btn-icon" viewBox="0 0 24 24"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>' +
        '<span class="job-compare-btn-label">Compare</span>';
      actionsContainer.appendChild(compareBtn);

      // Sync with existing compare state
      var COMPARE_JOBS_KEY = 'jobkart-compare-jobs';
      try {
        var raw = localStorage.getItem(COMPARE_JOBS_KEY);
        var compareJobs = raw ? JSON.parse(raw) : [];
        var isCompared = compareJobs.some(function(j) { return j.id === job.id; });
        compareBtn.classList.toggle('job-compare-btn--selected', isCompared);
        var label = compareBtn.querySelector('.job-compare-btn-label');
        if (label) label.textContent = isCompared ? 'Added' : 'Compare';
      } catch(e) {}

      // Click handler for compare toggle
      compareBtn.addEventListener('click', function() {
        var MAX_COMPARE = 2;
        var raw2, currentJobs, idx;
        try {
          raw2 = localStorage.getItem(COMPARE_JOBS_KEY);
          currentJobs = raw2 ? JSON.parse(raw2) : [];
        } catch(e) {
          currentJobs = [];
        }

        idx = currentJobs.findIndex(function(j) { return j.id === job.id; });

        if (idx !== -1) {
          // Remove from compare
          currentJobs.splice(idx, 1);
          compareBtn.classList.remove('job-compare-btn--selected');
          var lbl = compareBtn.querySelector('.job-compare-btn-label');
          if (lbl) lbl.textContent = 'Compare';
          showToast(job.title + ' removed from comparison');
        } else {
          // Add to compare
          if (currentJobs.length >= MAX_COMPARE) {
            showToast('Remove a job first to compare (max 2)');
            return;
          }
          currentJobs.push({
            id: job.id,
            title: job.title,
            company: company.name,
            exp: job.exp || '',
            sal: job.sal || '',
            location: job.location || company.hq,
            type: job.type || 'Full-Time',
            skills: job.skills || [],
            benefits: job.benefits || []
          });
          compareBtn.classList.add('job-compare-btn--selected');
          var lbl2 = compareBtn.querySelector('.job-compare-btn-label');
          if (lbl2) lbl2.textContent = 'Added';
          showToast(job.title + ' added to comparison');
        }

        try {
          localStorage.setItem(COMPARE_JOBS_KEY, JSON.stringify(currentJobs));
        } catch(e) {}

        // Sync comparison bar if main.js is available
        if (typeof window.syncCompareButtons === 'function') {
          window.syncCompareButtons();
        }
        if (typeof window.renderCompareBar === 'function') {
          window.renderCompareBar();
        }
      });
    }
  }

  // Load dynamically
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJobDetailsPage);
  } else {
    initJobDetailsPage();
  }

})();
