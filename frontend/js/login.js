/* js/login.js — Job-Kart Login Page Logic */

(function () {
  'use strict';

  // ===== DOM ELEMENTS =====
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const loginTabs = document.getElementById('loginTabs');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const switchToRegister = document.getElementById('switchToRegister');
  const switchToLogin = document.getElementById('switchToLogin');
  const loginMessage = document.getElementById('loginMessage');

  // Password toggles
  const loginPasswordToggle = document.getElementById('loginPasswordToggle');
  const registerPasswordToggle = document.getElementById('registerPasswordToggle');

  // Role selector
  const roleOptions = document.querySelectorAll('.role-option');

  // ===== REDIRECT IF ALREADY LOGGED IN =====
  if (typeof api !== 'undefined' && api.isLoggedIn()) {
    const user = api.getUser();
    if (user && user.role === 'recruiter') {
      window.location.href = 'recruiter-dashboard.html';
    } else {
      window.location.href = 'candidate-dashboard.html';
    }
    return;
  }

  // ===== TAB SWITCHING =====
  function switchTab(tab) {
    if (tab === 'login') {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      loginTabs.removeAttribute('data-active');
      loginForm.classList.add('active');
      registerForm.classList.remove('active');
    } else {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      loginTabs.setAttribute('data-active', 'register');
      registerForm.classList.add('active');
      loginForm.classList.remove('active');
    }
    hideMessage();
  }

  tabLogin.addEventListener('click', function () { switchTab('login'); });
  tabRegister.addEventListener('click', function () { switchTab('register'); });
  switchToRegister.addEventListener('click', function () { switchTab('register'); });
  switchToLogin.addEventListener('click', function () { switchTab('login'); });


  // ===== MESSAGE DISPLAY =====
  function showMessage(text, type) {
    loginMessage.textContent = text;
    loginMessage.className = 'login-message show ' + type;
  }

  function hideMessage() {
    loginMessage.className = 'login-message';
  }


  // ===== PASSWORD VISIBILITY TOGGLE =====
  function setupPasswordToggle(toggleBtn, inputId) {
    if (!toggleBtn) return;
    toggleBtn.addEventListener('click', function () {
      var input = document.getElementById(inputId);
      var eyeOpen = toggleBtn.querySelector('.eye-open');
      var eyeClosed = toggleBtn.querySelector('.eye-closed');

      if (input.type === 'password') {
        input.type = 'text';
        eyeOpen.style.display = 'none';
        eyeClosed.style.display = 'block';
      } else {
        input.type = 'password';
        eyeOpen.style.display = 'block';
        eyeClosed.style.display = 'none';
      }
    });
  }

  setupPasswordToggle(loginPasswordToggle, 'loginPassword');
  setupPasswordToggle(registerPasswordToggle, 'registerPassword');


  // ===== PASSWORD STRENGTH METER =====
  var registerPasswordInput = document.getElementById('registerPassword');
  var strengthMeter = document.getElementById('passwordStrength');
  var strengthLabel = document.getElementById('strengthLabel');

  if (registerPasswordInput && strengthMeter) {
    registerPasswordInput.addEventListener('input', function () {
      var val = this.value;
      var bars = strengthMeter.querySelectorAll('.strength-bar');

      if (!val.length) {
        strengthMeter.classList.remove('visible');
        bars.forEach(function (bar) { bar.className = 'strength-bar'; });
        strengthLabel.textContent = '';
        return;
      }

      strengthMeter.classList.add('visible');

      var score = 0;
      if (val.length >= 6) score++;
      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      // Normalize to 1-4
      var level = Math.min(Math.max(Math.ceil(score * 0.8), 1), 4);

      var labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
      strengthLabel.textContent = labels[level];

      bars.forEach(function (bar, i) {
        bar.className = 'strength-bar';
        if (i < level) {
          bar.classList.add('active');
          if (level >= 3) bar.classList.add(level === 4 ? 'strong' : 'medium');
        }
      });
    });
  }


  // ===== ROLE SELECTOR =====
  roleOptions.forEach(function (option) {
    option.addEventListener('click', function () {
      roleOptions.forEach(function (o) { o.classList.remove('active'); });
      this.classList.add('active');
    });
  });


  // ===== FORM SUBMISSION HELPERS =====
  function setLoading(btn, loading) {
    var text = btn.querySelector('.btn-text');
    var loader = btn.querySelector('.btn-loader');
    if (loading) {
      text.style.display = 'none';
      loader.style.display = 'flex';
      btn.disabled = true;
    } else {
      text.style.display = 'inline';
      loader.style.display = 'none';
      btn.disabled = false;
    }
  }


  // ===== LOGIN FORM =====
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    hideMessage();

    var email = document.getElementById('loginEmail').value.trim();
    var password = document.getElementById('loginPassword').value;
    var submitBtn = document.getElementById('loginSubmitBtn');

    if (!email || !password) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    setLoading(submitBtn, true);

    try {
      var data = await api.login(email, password);
      showMessage('Login successful! Redirecting...', 'success');

      setTimeout(function () {
        if (data.role === 'recruiter') {
          window.location.href = 'recruiter-dashboard.html';
        } else {
          window.location.href = 'candidate-dashboard.html';
        }
      }, 800);
    } catch (err) {
      showMessage(err.message || 'Login failed. Please check your credentials.', 'error');
      setLoading(submitBtn, false);
    }
  });


  // ===== REGISTER FORM =====
  registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    hideMessage();

    var name = document.getElementById('registerName').value.trim();
    var email = document.getElementById('registerEmail').value.trim();
    var phone = document.getElementById('registerPhone').value.trim();
    var password = document.getElementById('registerPassword').value;
    var role = document.querySelector('input[name="role"]:checked').value;
    var submitBtn = document.getElementById('registerSubmitBtn');

    if (!name || !email || !password) {
      showMessage('Please fill in all required fields', 'error');
      return;
    }

    if (password.length < 6) {
      showMessage('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(submitBtn, true);

    try {
      var data = await api.register({ name, email, password, role, phone });
      showMessage('Account created! Redirecting...', 'success');

      setTimeout(function () {
        if (data.role === 'recruiter') {
          window.location.href = 'recruiter-dashboard.html';
        } else {
          window.location.href = 'candidate-dashboard.html';
        }
      }, 800);
    } catch (err) {
      showMessage(err.message || 'Registration failed. Please try again.', 'error');
      setLoading(submitBtn, false);
    }
  });


  // ===== CHECK URL PARAMS =====
  // Allow linking to ?tab=register to show register form directly
  var params = new URLSearchParams(window.location.search);
  if (params.get('tab') === 'register') {
    switchTab('register');
  }

})();
