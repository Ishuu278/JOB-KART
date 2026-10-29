/* js/socket.js — shared Socket.io client wrapper */
(function () {
  'use strict';

  var SOCKET_URL = (window.location.protocol === 'file:') ? 'http://localhost:5000' : (window.location.origin || 'http://localhost:5000');

  var socket = null;
  var listeners = {};

  var JobKartSocket = {
    /** Connect + join personal room. Safe to call multiple times. */
    init: function (userId) {
      if (!userId) return;
      if (socket && socket.connected) return;

      if (!socket) {
        socket = io(SOCKET_URL, {
          transports: ['websocket', 'polling'],
          auth: { token: localStorage.getItem('jobkart_token') || '' }
        });

        // re-dispatch all known events to registered listeners
        ['status:updated', 'notification:new', 'message:new', 'message:read',
         'application:new', 'user:online', 'typing:start', 'typing:stop'].forEach(function (ev) {
          socket.on(ev, function (data) {
            (listeners[ev] || []).forEach(function (fn) {
              try { fn(data); } catch (e) { console.error('socket listener error', ev, e); }
            });
          });
        });

        socket.on('connect', function () {
          socket.emit('join', userId);
        });
        socket.on('disconnect', function () { /* io auto-reconnects */ });
      } else {
        if (socket.connected) socket.emit('join', userId);
      }
    },

    on: function (event, fn) {
      (listeners[event] = listeners[event] || []).push(fn);
      return function off() {
        listeners[event] = listeners[event].filter(function (f) { return f !== fn; });
      };
    },

    emit: function (event, payload) {
      if (socket) socket.emit(event, payload);
    },

    /** Fire a callback when the current user's id is known (after login/storage) */
    initFromStorage: function () {
      try {
        var raw = localStorage.getItem('jobkart_user');
        if (!raw) return;
        var user = JSON.parse(raw);
        if (user && user._id) this.init(user._id);
      } catch (e) { /* ignore */ }
    }
  };

  window.JobKartSocket = JobKartSocket;
})();
