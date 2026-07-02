/* ============================================================
   js/company.js — Job-Kart Company Profile Logic
   ============================================================ */

(function() {
  'use strict';

  // Helper to retrieve URL parameters
  function getQueryParam(param) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // LocalStorage follow state helpers
  var FOLLOWED_COMPANIES_KEY = 'jobkart-followed-companies';

  function getFollowedCompanyIds() {
    try {
      var raw = localStorage.getItem(FOLLOWED_COMPANIES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function setFollowedCompanyIds(ids) {
    try {
      localStorage.setItem(FOLLOWED_COMPANIES_KEY, JSON.stringify(ids));
    } catch (e) {}
  }

  function isCompanyFollowed(companyId) {
    return getFollowedCompanyIds().indexOf(companyId) !== -1;
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

  // ===== USER REVIEWS localStorage =====
  var COMPANY_REVIEWS_KEY = 'jobkart-company-reviews';

  function getUserReviews(companyId) {
    try {
      var raw = localStorage.getItem(COMPANY_REVIEWS_KEY);
      var all = raw ? JSON.parse(raw) : {};
      return all[companyId] || [];
    } catch (e) {
      return [];
    }
  }

  function addUserReview(companyId, review) {
    try {
      var raw = localStorage.getItem(COMPANY_REVIEWS_KEY);
      var all = raw ? JSON.parse(raw) : {};
      if (!all[companyId]) all[companyId] = [];
      all[companyId].unshift(review); // newest first
      localStorage.setItem(COMPANY_REVIEWS_KEY, JSON.stringify(all));
      return true;
    } catch (e) {
      return false;
    }
  }

  // Current sort state per page load
  var currentSort = 'newest';

  // Merge mock + user reviews and sort
  function getMergedReviews(companyId, mockReviews) {
    var userReviews = getUserReviews(companyId);
    var merged = (mockReviews || []).map(function(r) {
      return { author: r.author, role: r.role, stars: r.stars, date: r.date, text: r.text, userSubmitted: false };
    }).concat(userReviews.map(function(r) {
      return { author: r.author, role: r.role, stars: r.stars, date: r.date, text: r.text, userSubmitted: true };
    }));

    // Sort
    merged.sort(function(a, b) {
      if (currentSort === 'newest') {
        return parseReviewDate(b.date) - parseReviewDate(a.date);
      } else if (currentSort === 'oldest') {
        return parseReviewDate(a.date) - parseReviewDate(b.date);
      } else if (currentSort === 'highest') {
        return countStars(b.stars) - countStars(a.stars);
      } else if (currentSort === 'lowest') {
        return countStars(a.stars) - countStars(b.stars);
      }
      return 0;
    });

    return merged;
  }

  // Parse date strings like "May 2026", "Jan 2026", "June 28, 2026" to timestamp
  function parseReviewDate(dateStr) {
    if (!dateStr) return 0;
    var d = new Date(dateStr);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  }

  // Count ★ characters
  function countStars(starsStr) {
    if (!starsStr) return 0;
    var count = 0;
    for (var i = 0; i < starsStr.length; i++) {
      if (starsStr[i] === '★') count++;
    }
    return count;
  }

  // Generate star string from number
  function starsFromNumber(num) {
    var s = '';
    for (var i = 0; i < 5; i++) {
      s += i < num ? '★' : '☆';
    }
    return s;
  }

  // Render reviews list (called on sort change and initial load)
  function renderReviewsList(companyId, mockReviews) {
    var container = document.getElementById('cReviews');
    if (!container) return;

    var reviews = getMergedReviews(companyId, mockReviews);
    container.innerHTML = '';

    if (reviews.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem; text-align:center; padding:16px 0;">No reviews yet. Be the first to share your experience!</p>';
      return;
    }

    reviews.forEach(function(rev) {
      var item = document.createElement('div');
      item.className = 'company-review-item';
      var badge = rev.userSubmitted ? '<span class="company-review-badge">Your Review</span>' : '';
      item.innerHTML =
        '<div class="company-reviewer-row">' +
          '<div>' +
            '<span class="company-reviewer-name">' + escapeHtml(rev.author) + badge + '</span>' +
            '<span class="company-reviewer-role">' + escapeHtml(rev.role) + '</span>' +
          '</div>' +
          '<span class="company-review-date">' + escapeHtml(rev.date) + '</span>' +
        '</div>' +
        '<div class="company-review-stars">' + rev.stars + '</div>' +
        '<div class="company-review-text">"' + escapeHtml(rev.text) + '"</div>';
      container.appendChild(item);
    });

    // Update review count — use base rating.total from data + user reviews
    var countEl = document.getElementById('cRatingCount');
    if (countEl) {
      var baseCount = 0;
      var companyData = window.COMPANIES_DATA && window.COMPANIES_DATA[companyId];
      if (companyData && companyData.rating && companyData.rating.total) {
        baseCount = parseInt(companyData.rating.total, 10) || 0;
      }
      var userCount = getUserReviews(companyId).length;
      countEl.textContent = (baseCount + userCount) + ' Reviews';
    }
  }

  // Simple HTML escape
  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Stats Counter Animation
  function animateStatsCounters() {
    var statNumbers = document.querySelectorAll('.company-stat-num[data-target]');
    if (!statNumbers.length) return;

    var observer = new IntersectionObserver(
      function(entries, self) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var target = parseInt(el.getAttribute('data-target'), 10);
            if (isNaN(target)) return;

            var duration = 1500;
            var start = performance.now();

            function update(now) {
              var elapsed = now - start;
              var progress = Math.min(elapsed / duration, 1);
              var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
              var current = Math.floor(eased * target);

              // Formatting representation (K for thousands)
              if (target >= 1000) {
                el.textContent = (current / 1000).toFixed(target % 1000 === 0 ? 0 : 1) + 'K+';
              } else if (el.id === 'stat-hiring-rate') {
                el.textContent = current + '%';
              } else {
                el.textContent = current + '+';
              }

              if (progress < 1) {
                requestAnimationFrame(update);
              } else {
                // Hard reset to exact formatted string at final frame
                if (target >= 1000) {
                  el.textContent = (target / 1000).toFixed(target % 1000 === 0 ? 0 : 1) + 'K+';
                } else if (el.id === 'stat-hiring-rate') {
                  el.textContent = target + '%';
                } else {
                  el.textContent = target + '+';
                }
              }
            }

            requestAnimationFrame(update);
            self.unobserve(el); // Animate once
          }
        });
      },
      { threshold: 0.2 }
    );

    statNumbers.forEach(function(num) {
      observer.observe(num);
    });
  }

  // LocalStorage saved jobs helpers (synchronized with main.js)
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

  function updateSaveButtonUI(btn, saved) {
    if (!btn) return;
    btn.classList.toggle('job-save-btn--saved', saved);
    btn.setAttribute('aria-pressed', saved ? 'true' : 'false');
    btn.setAttribute('aria-label', saved ? 'Remove from saved jobs' : 'Save this job');
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

    showToast(
      nowSaved
        ? (jobTitle ? jobTitle + ' saved!' : 'Job saved!')
        : (jobTitle ? jobTitle + ' removed!' : 'Job removed!')
    );

    // Synchronize navbar count if present
    var countEl = document.getElementById('savedJobsCount');
    if (countEl) {
      countEl.textContent = ids.length;
      countEl.style.display = ids.length > 0 ? 'inline-flex' : 'none';
    }
  }

  // Render company profile info
  function renderCompanyProfile() {
    var companyId = getQueryParam('id') || getQueryParam('company') || 'leadjen';

    // Try API first
    if (typeof api !== 'undefined') {
      api.get('/companies/' + companyId)
        .then(function(data) {
          api.get('/companies/' + companyId + '/jobs').then(function(jobs) {
            renderCompanyFromAPI(data, jobs);
          });
        })
        .catch(function() {
          // Fallback to local data
          var localData = window.COMPANIES_DATA ? window.COMPANIES_DATA[companyId] : null;
          if (localData) {
            renderCompanyFromLocal(localData);
          } else {
            renderCompanyNotFound();
          }
        });
    } else {
      var localData = window.COMPANIES_DATA ? window.COMPANIES_DATA[companyId] : null;
      if (localData) {
        renderCompanyFromLocal(localData);
      } else {
        renderCompanyNotFound();
      }
    }
  }

  function renderCompanyNotFound() {
    document.querySelector('main').innerHTML = `
      <section class="company-card" style="max-width: 600px; margin: 40px auto; text-align: center;">
        <h2>Company Not Found</h2>
        <p style="color: var(--text-muted); margin: 16px 0 24px;">The company profile you are trying to view does not exist.</p>
        <a href="index.html" class="btn-primary">Return Home</a>
      </section>
    `;
  }

  function renderCompanyFromAPI(data, jobs) {
    var company = data;

    document.title = company.name + ' | Company Profile | Job-Kart';

    var breadcrumbCurrent = document.getElementById('cBreadcrumbCurrent');
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = company.name;

    var industryEl = document.getElementById('cIndustry');
    if (industryEl) industryEl.innerHTML = '💼 ' + (company.industry || '');

    var locationEl = document.getElementById('cLocation');
    if (locationEl) locationEl.innerHTML = '📍 ' + (company.hq || '');

    var websiteBtn = document.getElementById('cWebsiteBtn');
    if (websiteBtn && company.website) {
      websiteBtn.href = company.website.indexOf('http') === 0 ? company.website : 'https://' + company.website;
    }

    var coverEl = document.getElementById('cCover');
    if (coverEl) coverEl.src = company.cover || '';

    var logoContainer = document.getElementById('cLogoContainer');
    if (logoContainer) {
      logoContainer.innerHTML = '';
      if (company.logo && company.logo.indexOf('http') === 0) {
        var img = document.createElement('img');
        img.src = company.logo;
        img.alt = company.name;
        img.className = 'company-logo-img';
        logoContainer.appendChild(img);
      } else {
        logoContainer.textContent = company.logoText || 'CO';
      }
    }

    var nameEl = document.getElementById('cName');
    if (nameEl) nameEl.textContent = company.name;

    var aboutEl = document.getElementById('cAbout');
    if (aboutEl) aboutEl.textContent = company.about || '';

    var missionEl = document.getElementById('cMission');
    if (missionEl) missionEl.textContent = company.mission || '';

    var visionEl = document.getElementById('cVision');
    if (visionEl) visionEl.textContent = company.vision || '';

    // MVV cards
    var mvvGrid = document.getElementById('cMVV');
    if (mvvGrid && company.mvv) {
      mvvGrid.innerHTML = '';
      company.mvv.forEach(function(item) {
        var card = document.createElement('div');
        card.className = 'company-mvv-card';
        card.innerHTML = '<span class="company-mvv-icon">' + item.icon + '</span><h4>' + item.label + '</h4><p>' + item.desc + '</p>';
        mvvGrid.appendChild(card);
      });
    }

    // Core Values
    var valuesList = document.getElementById('cCoreValues');
    if (valuesList && company.coreValues) {
      valuesList.innerHTML = '';
      company.coreValues.forEach(function(val, idx) {
        var numStr = String(idx + 1).padStart(2, '0');
        var row = document.createElement('div');
        row.className = 'company-value-row';
        row.innerHTML = '<div class="company-value-num">' + numStr + '</div><div class="company-value-text">' + val + '</div>';
        valuesList.appendChild(row);
      });
    }

    // Gallery
    var galleryGrid = document.getElementById('cGallery');
    if (galleryGrid && company.gallery) {
      galleryGrid.innerHTML = '';
      company.gallery.forEach(function(photo) {
        var item = document.createElement('div');
        item.className = 'company-gallery-item';
        item.innerHTML = '<img src="' + photo.url + '" alt="' + photo.label + '" loading="lazy" /><div class="company-gallery-overlay"><span>' + photo.label + '</span></div>';
        galleryGrid.appendChild(item);
      });
    }

    // Benefits
    var benefitsGrid = document.getElementById('cBenefits');
    if (benefitsGrid && company.benefits) {
      benefitsGrid.innerHTML = '';
      company.benefits.forEach(function(b) {
        var card = document.createElement('div');
        card.className = 'company-benefit-card';
        card.innerHTML = '<span class="company-benefit-icon">' + b.icon + '</span><span>' + b.label + '</span>';
        benefitsGrid.appendChild(card);
      });
    }

    // Sidebar Info
    var sidebarIndustry = document.getElementById('cSidebarIndustry');
    if (sidebarIndustry) sidebarIndustry.textContent = company.industry || '';
    var sidebarHQ = document.getElementById('cSidebarHQ');
    if (sidebarHQ) sidebarHQ.textContent = company.hq || '';
    var sidebarSize = document.getElementById('cSidebarSize');
    if (sidebarSize) sidebarSize.textContent = company.size || '';
    var sidebarFounded = document.getElementById('cSidebarFounded');
    if (sidebarFounded) sidebarFounded.textContent = company.founded || '';
    var sidebarWebsite = document.getElementById('cSidebarWebsite');
    if (sidebarWebsite) {
      var url = (company.website || '').indexOf('http') === 0 ? company.website : 'https://' + (company.website || '');
      sidebarWebsite.innerHTML = '<a href="' + url + '" target="_blank">' + (company.website || '') + '</a>';
    }
    var sidebarEmail = document.getElementById('cSidebarEmail');
    if (sidebarEmail) sidebarEmail.innerHTML = '<a href="mailto:' + (company.email || '') + '">' + (company.email || '') + '</a>';
    var sidebarType = document.getElementById('cSidebarType');
    if (sidebarType) sidebarType.textContent = company.type || 'Private Company';

    // Stats
    var statsContainer = document.getElementById('cStats');
    if (statsContainer && company.stats) {
      statsContainer.innerHTML = '';
      company.stats.forEach(function(stat) {
        var box = document.createElement('div');
        box.className = 'company-stat-box';
        var valId = stat.label === 'Followers' ? ' id="stat-followers-val"' : (stat.label === 'Hiring Rate' ? ' id="stat-hiring-rate"' : '');
        box.innerHTML = '<span class="company-stat-num"' + valId + ' data-target="' + stat.target + '">0</span><span class="company-stat-label">' + stat.label + '</span>';
        statsContainer.appendChild(box);
      });
      animateStatsCounters();
    }

    // Ratings
    var rating = company.rating || {};
    var ratingVal = document.getElementById('cRatingVal');
    if (ratingVal) ratingVal.textContent = rating.score || '0';
    var ratingStars = document.getElementById('cRatingStars');
    if (ratingStars) {
      var starsStr = '';
      var scoreNum = Math.round(parseFloat(rating.score) || 0);
      for (var s = 0; s < 5; s++) starsStr += s < scoreNum ? '★' : '☆';
      ratingStars.textContent = starsStr;
    }
    var ratingCount = document.getElementById('cRatingCount');
    if (ratingCount) ratingCount.textContent = (rating.total || '0') + ' Reviews';

    // Rating Bars
    var ratingBars = document.getElementById('cRatingBars');
    if (ratingBars && rating.bars) {
      ratingBars.innerHTML = '';
      rating.bars.forEach(function(pct, idx) {
        var starsCount = 5 - idx;
        var barRow = document.createElement('div');
        barRow.className = 'rating-bar-row';
        barRow.innerHTML = '<span style="width:20px; text-align:right;">' + starsCount + '★</span><div class="rating-bar-track"><div class="rating-bar-fill" style="width: 0%;" data-percent="' + pct + '"></div></div><span style="width:30px; text-align:right;">' + pct + '%</span>';
        ratingBars.appendChild(barRow);
      });
      setTimeout(function() {
        var fills = ratingBars.querySelectorAll('.rating-bar-fill');
        fills.forEach(function(f) {
          f.style.transition = 'width 1s cubic-bezier(0.16, 1, 0.3, 1)';
          f.style.width = f.getAttribute('data-percent') + '%';
        });
      }, 250);
    }

    // Social Links
    var socialContainer = document.getElementById('cSocial');
    if (socialContainer && company.socials) {
      socialContainer.innerHTML = '';
      company.socials.forEach(function(soc) {
        var pill = document.createElement('a');
        pill.href = soc.url;
        pill.className = 'company-social-pill';
        pill.innerHTML = '<span>' + soc.icon + '</span> ' + soc.label;
        socialContainer.appendChild(pill);
      });
    }

    // Load reviews from API
    api.get('/reviews/' + company._id).then(function(reviews) {
      var container = document.getElementById('cReviews');
      if (!container) return;
      if (!reviews || reviews.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem; text-align:center; padding:16px 0;">No reviews yet. Be the first to share your experience!</p>';
        return;
      }
      container.innerHTML = '';
      reviews.forEach(function(rev) {
        var item = document.createElement('div');
        item.className = 'company-review-item';
        item.innerHTML =
          '<div class="company-reviewer-row">' +
            '<div>' +
              '<span class="company-reviewer-name">' + escapeHtml(rev.author) + '</span>' +
              '<span class="company-reviewer-role">' + escapeHtml(rev.role || '') + '</span>' +
            '</div>' +
            '<span class="company-review-date">' + escapeHtml(rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : '') + '</span>' +
          '</div>' +
          '<div class="company-review-stars">' + starsFromNumber(rev.stars) + '</div>' +
          '<div class="company-review-text">"' + escapeHtml(rev.text) + '"</div>';
        container.appendChild(item);
      });
      var countEl = document.getElementById('cRatingCount');
      if (countEl) countEl.textContent = reviews.length + ' Reviews';
    }).catch(function() {});

    // Render jobs from API data
    var jobsContainer = document.getElementById('companyJobsContainer');
    var openingsSection = document.getElementById('current-openings-section');
    if (jobsContainer) {
      jobsContainer.innerHTML = '';
      if (jobs && jobs.length > 0) {
        if (openingsSection) openingsSection.style.display = 'block';
        jobs.forEach(function(job) {
          var card = document.createElement('div');
          card.className = 'featured-job-card';
          card.setAttribute('data-job-id', job._id);
          card.innerHTML =
            '<button class="job-save-btn job-save-btn--icon-only" data-save-job data-job-id="' + job._id + '" data-job-title="' + escapeHtml(job.title) + '" aria-label="Save this job" aria-pressed="false">' +
              '<svg class="job-save-btn-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 3a2 2 0 0 0-2 2v16l8-5 8 5V5a2 2 0 0 0-2-2H6z" stroke-linejoin="round" stroke-linecap="round"/></svg>' +
              '<span class="job-save-btn-label">Save</span>' +
            '</button>' +
            '<div class="featured-job-top"><span class="job-type-badge">' + (job.type || 'Full-Time') + '</span>' +
              (job.fresher ? '<span class="fresher-badge" style="background:#dcfce7; color:#166534; border:1px solid #bbf7d0; padding:4px 14px; border-radius:var(--pill); font-size:0.75rem; font-weight:600;">Freshers Can Apply</span>' : '') +
            '</div>' +
            '<h3>' + escapeHtml(job.title) + '</h3>' +
            '<p class="featured-job-company"><a href="company.html?id=' + company._id + '" style="color:inherit; text-decoration:none;">' + escapeHtml(company.name) + '</a> &middot; ' + escapeHtml(job.location || company.hq || '') + '</p>' +
            '<ul class="featured-job-meta"><li>💼 ' + escapeHtml(job.exp || '') + '</li><li>💰 ' + escapeHtml(job.sal || '') + '</li></ul>' +
            '<a href="job-details.html?id=' + job._id + '" class="btn-outline featured-job-btn">View Details</a>';
          jobsContainer.appendChild(card);
        });
        var saveBtns = jobsContainer.querySelectorAll('[data-save-job]');
        saveBtns.forEach(function(btn) {
          var jId = btn.getAttribute('data-job-id');
          var jTitle = btn.getAttribute('data-job-title') || '';
          updateSaveButtonUI(btn, isJobSaved(jId));
          btn.onclick = function(e) {
            e.stopPropagation();
            toggleSaveJob(jId, jTitle, btn);
          };
        });
      } else {
        if (openingsSection) openingsSection.style.display = 'block';
        jobsContainer.innerHTML = '<div style="text-align:center; padding:24px 0; color:var(--text-muted);"><p style="font-size:0.95rem; margin-bottom:0;">There are currently no active job listings for ' + escapeHtml(company.name) + '.</p></div>';
      }
    }

    // Follow button
    var followBtn = document.getElementById('followBtn') || document.getElementById('cFollowBtn');
    if (followBtn) {
      followBtn.onclick = function() {
        if (!api.isLoggedIn()) {
          alert('Please login to follow companies.');
          return;
        }
        api.post('/companies/' + company._id + '/follow')
          .then(function(result) {
            followBtn.textContent = result.following ? 'Following' : 'Follow';
            followBtn.classList.toggle('following', result.following);
          });
      };
    }

    // Sort dropdown handler
    var sortSelect = document.getElementById('reviewSortSelect');
    if (sortSelect) {
      sortSelect.value = currentSort;
      sortSelect.addEventListener('change', function() {
        currentSort = this.value;
        // Re-fetch reviews with new sort
        api.get('/reviews/' + company._id + '?sort=' + currentSort).then(function(reviews) {
          var container = document.getElementById('cReviews');
          if (!container) return;
          if (!reviews || reviews.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem; text-align:center; padding:16px 0;">No reviews yet.</p>';
            return;
          }
          container.innerHTML = '';
          reviews.forEach(function(rev) {
            var item = document.createElement('div');
            item.className = 'company-review-item';
            item.innerHTML =
              '<div class="company-reviewer-row"><div><span class="company-reviewer-name">' + escapeHtml(rev.author) + '</span><span class="company-reviewer-role">' + escapeHtml(rev.role || '') + '</span></div><span class="company-review-date">' + escapeHtml(rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : '') + '</span></div>' +
              '<div class="company-review-stars">' + starsFromNumber(rev.stars) + '</div>' +
              '<div class="company-review-text">"' + escapeHtml(rev.text) + '"</div>';
            container.appendChild(item);
          });
        });
      });
    }
  }

  function renderCompanyFromLocal(data) {

    var breadcrumbCurrent = document.getElementById('cBreadcrumbCurrent');
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = data.name;

    // Badges in Header
    var industryEl = document.getElementById('cIndustry');
    if (industryEl) industryEl.innerHTML = `💼 ${data.industry}`;

    var locationEl = document.getElementById('cLocation');
    if (locationEl) locationEl.innerHTML = `📍 ${data.hq}`;

    // Header buttons
    var websiteBtn = document.getElementById('cWebsiteBtn');
    if (websiteBtn) {
      websiteBtn.href = data.website.indexOf('http') === 0 ? data.website : 'https://' + data.website;
    }

    // Follow Button
    var followBtn = document.getElementById('cFollowBtn');
    var isFollowed = isCompanyFollowed(data.id);
    if (followBtn) {
      followBtn.classList.toggle('following', isFollowed);
      followBtn.textContent = isFollowed ? 'Following' : 'Follow Company';

      followBtn.onclick = function() {
        var followedIds = getFollowedCompanyIds();
        var idx = followedIds.indexOf(data.id);
        var currentlyFollowing;

        if (idx === -1) {
          followedIds.push(data.id);
          currentlyFollowing = true;
        } else {
          followedIds.splice(idx, 1);
          currentlyFollowing = false;
        }

        setFollowedCompanyIds(followedIds);
        followBtn.classList.toggle('following', currentlyFollowing);
        followBtn.textContent = currentlyFollowing ? 'Following' : 'Follow Company';

        showToast(
          currentlyFollowing
            ? 'You are now following ' + data.name
            : 'You unfollowed ' + data.name
        );

        // Dynamically increment/decrement followers stat on-screen
        var followersValEl = document.getElementById('stat-followers-val');
        if (followersValEl) {
          var baseFollowers = data.stats.find(function(s) { return s.label === 'Followers'; });
          if (baseFollowers) {
            var count = baseFollowers.target;
            if (currentlyFollowing) count += 1;
            
            if (count >= 1000) {
              var kVal = count / 1000;
              // Show decimal only if meaningful (e.g. 12.5K), otherwise integer (e.g. 12K)
              followersValEl.textContent = (kVal % 1 === 0 ? kVal.toFixed(0) : kVal.toFixed(1)) + 'K+';
            } else {
              followersValEl.textContent = count + '+';
            }
          }
        }
      };
    }

    // About description
    var aboutEl = document.getElementById('cAbout');
    if (aboutEl) aboutEl.textContent = data.about;

    // Mission, Vision, Values (MVV) cards
    var mvvGrid = document.getElementById('cMVV');
    if (mvvGrid && data.mvv) {
      mvvGrid.innerHTML = '';
      data.mvv.forEach(function(item) {
        var card = document.createElement('div');
        card.className = 'company-mvv-card';
        card.innerHTML = `
          <span class="company-mvv-icon">${item.icon}</span>
          <h4>${item.label}</h4>
          <p>${item.desc}</p>
        `;
        mvvGrid.appendChild(card);
      });
    }

    // Core Values Row Items
    var valuesList = document.getElementById('cCoreValues');
    if (valuesList && data.coreValues) {
      valuesList.innerHTML = '';
      data.coreValues.forEach(function(val, idx) {
        var numStr = String(idx + 1).padStart(2, '0');
        var row = document.createElement('div');
        row.className = 'company-value-row';
        row.innerHTML = `
          <div class="company-value-num">${numStr}</div>
          <div class="company-value-text">${val}</div>
        `;
        valuesList.appendChild(row);
      });
    }

    // Office Images Gallery
    var galleryGrid = document.getElementById('cGallery');
    if (galleryGrid && data.gallery) {
      galleryGrid.innerHTML = '';
      data.gallery.forEach(function(photo) {
        var item = document.createElement('div');
        item.className = 'company-gallery-item';
        item.innerHTML = `
          <img src="${photo.url}" alt="${photo.label}" loading="lazy" />
          <div class="company-gallery-overlay">
            <span>${photo.label}</span>
          </div>
        `;
        galleryGrid.appendChild(item);
      });
    }

    // Benefits perks grid
    var benefitsGrid = document.getElementById('cBenefits');
    if (benefitsGrid && data.benefits) {
      benefitsGrid.innerHTML = '';
      data.benefits.forEach(function(b) {
        var card = document.createElement('div');
        card.className = 'company-benefit-card';
        card.innerHTML = `
          <span class="company-benefit-icon">${b.icon}</span>
          <span>${b.label}</span>
        `;
        benefitsGrid.appendChild(card);
      });
    }

    // Sidebar Info Metadata
    var sidebarIndustry = document.getElementById('cSidebarIndustry');
    if (sidebarIndustry) sidebarIndustry.textContent = data.industry;

    var sidebarHQ = document.getElementById('cSidebarHQ');
    if (sidebarHQ) sidebarHQ.textContent = data.hq;

    var sidebarSize = document.getElementById('cSidebarSize');
    if (sidebarSize) sidebarSize.textContent = data.size;

    var sidebarFounded = document.getElementById('cSidebarFounded');
    if (sidebarFounded) sidebarFounded.textContent = data.founded;

    var sidebarWebsite = document.getElementById('cSidebarWebsite');
    if (sidebarWebsite) {
      sidebarWebsite.innerHTML = `<a href="${data.website.indexOf('http') === 0 ? data.website : 'https://' + data.website}" target="_blank">${data.website}</a>`;
    }

    var sidebarEmail = document.getElementById('cSidebarEmail');
    if (sidebarEmail) {
      sidebarEmail.innerHTML = `<a href="mailto:${data.email}">${data.email}</a>`;
    }

    var sidebarType = document.getElementById('cSidebarType');
    if (sidebarType) sidebarType.textContent = data.type;

    // Statistics Counters
    var statsContainer = document.getElementById('cStats');
    if (statsContainer && data.stats) {
      statsContainer.innerHTML = '';
      data.stats.forEach(function(stat) {
        var box = document.createElement('div');
        box.className = 'company-stat-box';
        var valId = stat.label === 'Followers' ? ' id="stat-followers-val"' :
                    stat.label === 'Hiring Rate' ? ' id="stat-hiring-rate"' : '';
        box.innerHTML = `
          <span class="company-stat-num"${valId} data-target="${stat.target}">0</span>
          <span class="company-stat-label">${stat.label}</span>
        `;
        statsContainer.appendChild(box);
      });

      // Recalculate followers if they follow it right now
      if (isFollowed) {
        var followersValEl = document.getElementById('stat-followers-val');
        if (followersValEl) {
          var followersStat = data.stats.find(function(s) { return s.label === 'Followers'; });
          if (followersStat) {
            followersValEl.setAttribute('data-target', followersStat.target + 1);
          }
        }
      }

      animateStatsCounters();
    }

    // Ratings Display
    var ratingVal = document.getElementById('cRatingVal');
    if (ratingVal) ratingVal.textContent = data.rating.score;

    var ratingStars = document.getElementById('cRatingStars');
    if (ratingStars) {
      var starsStr = '';
      var scoreNum = Math.round(parseFloat(data.rating.score));
      for (var s = 0; s < 5; s++) {
        starsStr += s < scoreNum ? '★' : '☆';
      }
      ratingStars.textContent = starsStr;
    }

    var ratingCount = document.getElementById('cRatingCount');
    if (ratingCount) ratingCount.textContent = data.rating.total;

    // Rating Bars
    var ratingBars = document.getElementById('cRatingBars');
    if (ratingBars && data.rating.bars) {
      ratingBars.innerHTML = '';
      data.rating.bars.forEach(function(pct, idx) {
        var starsCount = 5 - idx;
        var barRow = document.createElement('div');
        barRow.className = 'rating-bar-row';
        barRow.innerHTML = `
          <span style="width:20px; text-align:right;">${starsCount}★</span>
          <div class="rating-bar-track">
            <div class="rating-bar-fill" style="width: 0%;" data-percent="${pct}"></div>
          </div>
          <span style="width:30px; text-align:right;">${pct}%</span>
        `;
        ratingBars.appendChild(barRow);
      });

      // Animate rating bars after render (scoped to container)
      setTimeout(function() {
        if (ratingBars) {
          var fills = ratingBars.querySelectorAll('.rating-bar-fill');
          fills.forEach(function(f) {
            f.style.transition = 'width 1s cubic-bezier(0.16, 1, 0.3, 1)';
            f.style.width = f.getAttribute('data-percent') + '%';
          });
        }
      }, 250);
    }

    // Reviews list — merge mock + user reviews, apply sort
    renderReviewsList(data.id, data.reviews);

    // Sort dropdown handler
    var sortSelect = document.getElementById('reviewSortSelect');
    if (sortSelect) {
      sortSelect.value = currentSort;
      sortSelect.addEventListener('change', function() {
        currentSort = this.value;
        renderReviewsList(data.id, data.reviews);
      });
    }

    // Star rating input
    var starBtns = document.querySelectorAll('.star-btn');
    var ratingInput = document.getElementById('reviewRating');
    var selectedRating = 0;

    starBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        selectedRating = parseInt(btn.getAttribute('data-star'), 10);
        ratingInput.value = selectedRating;
        starBtns.forEach(function(b) {
          var starVal = parseInt(b.getAttribute('data-star'), 10);
          b.textContent = starVal <= selectedRating ? '★' : '☆';
          b.classList.toggle('star-active', starVal <= selectedRating);
        });
      });

      // Hover preview
      btn.addEventListener('mouseenter', function() {
        var hoverVal = parseInt(btn.getAttribute('data-star'), 10);
        starBtns.forEach(function(b) {
          var sv = parseInt(b.getAttribute('data-star'), 10);
          b.textContent = sv <= hoverVal ? '★' : '☆';
          b.classList.toggle('star-active', sv <= hoverVal);
        });
      });

      btn.addEventListener('mouseleave', function() {
        starBtns.forEach(function(b) {
          var sv = parseInt(b.getAttribute('data-star'), 10);
          b.textContent = sv <= selectedRating ? '★' : '☆';
          b.classList.toggle('star-active', sv <= selectedRating);
        });
      });
    });

    // Review form submission
    var reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
      reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var name = document.getElementById('reviewName').value.trim();
        var role = document.getElementById('reviewRole').value.trim();
        var text = document.getElementById('reviewText').value.trim();
        var rating = parseInt(ratingInput.value, 10);

        if (!name || !role || !text) {
          showToast('Please fill in all fields');
          return;
        }

        if (rating === 0) {
          showToast('Please select a star rating');
          return;
        }

        var now = new Date();
        var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        var dateStr = months[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();

        var newReview = {
          author: name,
          role: role,
          stars: starsFromNumber(rating),
          date: dateStr,
          text: text
        };

        if (addUserReview(data.id, newReview)) {
          // Show success, hide form
          reviewForm.style.display = 'none';
          var successEl = document.getElementById('reviewSuccess');
          if (successEl) successEl.classList.add('show');

          // Re-render reviews
          renderReviewsList(data.id, data.reviews);

          showToast('Review submitted successfully!');
        } else {
          showToast('Failed to submit review. Please try again.');
        }
      });
    }

    // "Write Another Review" button handler
    var writeAnotherBtn = document.getElementById('writeAnotherReviewBtn');
    if (writeAnotherBtn) {
      writeAnotherBtn.addEventListener('click', function() {
        // Reset form
        reviewForm.reset();
        selectedRating = 0;
        ratingInput.value = 0;
        starBtns.forEach(function(b) {
          b.textContent = '☆';
          b.classList.remove('star-active');
        });

        // Hide success, show form
        var successEl = document.getElementById('reviewSuccess');
        if (successEl) successEl.classList.remove('show');
        reviewForm.style.display = '';
      });
    }

    // Social Links
    var socialContainer = document.getElementById('cSocial');
    if (socialContainer && data.socials) {
      socialContainer.innerHTML = '';
      data.socials.forEach(function(soc) {
        var pill = document.createElement('a');
        pill.href = soc.url;
        pill.className = 'company-social-pill';
        pill.innerHTML = `<span>${soc.icon}</span> ${soc.label}`;
        socialContainer.appendChild(pill);
      });
    }

    // Current Openings dynamic card generation
    var jobsContainer = document.getElementById('companyJobsContainer');
    var openingsSection = document.getElementById('current-openings-section');
    if (jobsContainer) {
      jobsContainer.innerHTML = '';
      if (data.jobs && data.jobs.length > 0) {
        if (openingsSection) openingsSection.style.display = 'block';

        data.jobs.forEach(function(job) {
          var card = document.createElement('div');
          card.className = 'featured-job-card';
          card.setAttribute('data-job-id', job.id);
          
          card.innerHTML = `
            <button class="job-save-btn job-save-btn--icon-only" data-save-job data-job-id="${job.id}" data-job-title="${job.title}" aria-label="Save this job" aria-pressed="false">
              <svg class="job-save-btn-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 3a2 2 0 0 0-2 2v16l8-5 8 5V5a2 2 0 0 0-2-2H6z" stroke-linejoin="round" stroke-linecap="round"/>
              </svg>
              <span class="job-save-btn-label">Save</span>
            </button>
            <div class="featured-job-top">
              <span class="job-type-badge">${job.type}</span>
              ${job.fresher ? '<span class="fresher-badge" style="background:#dcfce7; color:#166534; border:1px solid #bbf7d0; padding:4px 14px; border-radius:var(--pill); font-size:0.75rem; font-weight:600;">Freshers Can Apply</span>' : ''}
            </div>
            <h3>${job.title}</h3>
            <p class="featured-job-company"><a href="company.html?id=${data.id}" style="color:inherit; text-decoration:none;">${data.name}</a> &middot; ${job.location || data.hq}</p>
            <ul class="featured-job-meta">
              <li>💼 ${job.exp}</li>
              <li>💰 ${job.sal}</li>
            </ul>
            <a href="job-details.html?job=${job.id}" class="btn-outline featured-job-btn">View Details</a>
          `;
          jobsContainer.appendChild(card);
        });

        // Initialize save button triggers for newly generated cards
        var saveBtns = jobsContainer.querySelectorAll('[data-save-job]');
        saveBtns.forEach(function(btn) {
          var jId = btn.getAttribute('data-job-id');
          var jTitle = btn.getAttribute('data-job-title') || '';
          updateSaveButtonUI(btn, isJobSaved(jId));

          btn.onclick = function(e) {
            e.stopPropagation();
            toggleSaveJob(jId, jTitle, btn);
          };
        });

      } else {
        // Empty openings state
        if (openingsSection) openingsSection.style.display = 'block';
        jobsContainer.innerHTML = `
          <div style="text-align: center; padding: 24px 0; color: var(--text-muted);">
            <p style="font-size: 0.95rem; margin-bottom: 0;">There are currently no active job listings for ${data.name}.</p>
          </div>
        `;
      }
    }
  }

  // Load dynamically
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCompanyProfile);
  } else {
    renderCompanyProfile();
  }

})();
