/* js/notifications-ui.js — notification bell for both dashboards */
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function timeAgo(d) {
    var s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    return new Date(d).toLocaleDateString();
  }

  var ICONS = {
    status_update: '📌', new_message: '💬', interview_scheduled: '📅', application_received: '🎯'
  };

  function mount(containerId) {
    var host = document.getElementById(containerId);
    if (!host) return;

    var html =
      '<div class="notif-bell" id="notifBell" title="Notifications" style="position:relative; cursor:pointer; display:flex; align-items:center; justify-content:center; width:38px; height:38px; border-radius:50%; border:1px solid var(--dash-card-border,#E2E8F0); background:var(--dash-card-bg,#fff);">' +
        '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' +
        '<span id="notifBadge" style="display:none; position:absolute; top:-5px; right:-5px; min-width:17px; height:17px; padding:0 4px; border-radius:99px; background:#EF4444; color:#fff; font-size:0.62rem; font-weight:800; display:none; align-items:center; justify-content:center;">0</span>' +
      '</div>' +
      '<div id="notifPanel" style="display:none; position:absolute; top:46px; right:0; width:340px; max-height:420px; overflow-y:auto; background:var(--dash-card-bg,#fff); border:1px solid var(--dash-card-border,#E2E8F0); border-radius:14px; box-shadow:0 18px 48px rgba(10,20,40,0.18); z-index:1000; color:var(--dash-text,#0F1D33);">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border-bottom:1px solid var(--dash-card-border,#EDF2F7); position:sticky; top:0; background:inherit; border-radius:14px 14px 0 0;">' +
          '<strong style="font-size:0.9rem;">Notifications</strong>' +
          '<button id="notifReadAll" style="border:none; background:none; color:#2563EB; font-size:0.75rem; font-weight:700; cursor:pointer;">Mark all read</button>' +
        '</div>' +
        '<div id="notifList" style="padding:6px 0;"></div>' +
      '</div>';

    host.innerHTML = html;
    host.style.position = 'relative';

    var bell = document.getElementById('notifBell');
    var badge = document.getElementById('notifBadge');
    var panel = document.getElementById('notifPanel');
    var list = document.getElementById('notifList');

    function setBadge(count) {
      if (count > 0) {
        badge.style.display = 'flex';
        badge.textContent = count > 99 ? '99+' : count;
      } else {
        badge.style.display = 'none';
      }
    }

    function render(notifications) {
      if (!notifications.length) {
        list.innerHTML = '<div style="text-align:center; padding:28px 12px; color:var(--dash-text-muted,#5A6B87); font-size:0.85rem;">No notifications yet</div>';
        return;
      }
      list.innerHTML = notifications.map(function (n) {
        return '<div class="notif-item' + (n.read ? '' : ' notif-item--unread') + '" data-id="' + n._id + '" data-link="' + esc(n.link || '') + '" style="display:flex; gap:10px; padding:11px 16px; cursor:pointer; border-bottom:1px solid var(--dash-card-border,#EDF2F7);' + (n.read ? ' opacity:0.62;' : ' background:rgba(37,99,235,0.04);') + '">' +
          '<span style="font-size:1.05rem;">' + (ICONS[n.type] || '🔔') + '</span>' +
          '<div style="flex:1;">' +
            '<div style="font-size:0.82rem; font-weight:' + (n.read ? 500 : 700) + ';">' + esc(n.body || n.title) + '</div>' +
            '<div style="font-size:0.7rem; color:var(--dash-text-muted,#5A6B87); margin-top:2px;">' + timeAgo(n.createdAt) + '</div>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    async function load() {
      try {
        var d = await api.get('/notifications');
        render(d.notifications);
        setBadge(d.unread);
      } catch (e) { /* silent */ }
    }

    bell.addEventListener('click', async function (e) {
      e.stopPropagation();
      panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
      if (panel.style.display === 'block') await load();
    });

    document.addEventListener('click', function (e) {
      if (!host.contains(e.target)) panel.style.display = 'none';
    });

    document.getElementById('notifReadAll').addEventListener('click', async function () {
      await api.put('/notifications/read-all', {});
      await load();
    });

    list.addEventListener('click', async function (e) {
      var item = e.target.closest('.notif-item');
      if (!item) return;
      var id = item.getAttribute('data-id');
      var link = item.getAttribute('data-link');
      try { await api.put('/notifications/' + id + '/read', {}); } catch (err) {}
      panel.style.display = 'none';
      if (link) window.location.href = link;
      else load();
    });

    // live updates
    if (window.JobKartSocket) {
      JobKartSocket.on('notification:new', function (data) {
        load();
        if (typeof showToast === 'function' && data.notification) {
          showToast(data.notification.body || data.notification.title, 'info');
        }
      });
    }

    load();
  }

  window.JobKartNotifs = { mount: mount };
})();
