/**
 * AttrEactive Router
 */

var events = require("events");
var cls = require("cls");
var $ = require("jquery");

var Router = cls.extend({
  init: function() {
    this._eventEmitter = new events.EventEmitter();
    this._routes = [];

    $(window).on('hashchange', this._handleHashChange.bind(this));
  },

  add: function(pattern, handler) {
    pattern = pattern.replace(/:\?/g, '([^\\/]+)');
    pattern = '^' + pattern + '$';
    pattern = new RegExp(pattern);

    this._routes.push({pattern: pattern, handler: handler});
  },

  addChangeListener: function(callback) {
    this._eventEmitter.on('change', callback);
  },

  removeChangeListener: function(callback) {
    this._eventEmitter.removeListener('change', callback);
  },

  getCurrentLocation: function() {
    var hash = window.location.hash;
    var prefix = /^#!\//;

    if (!prefix.test(hash)) {
      return '/';
    }

    return hash.replace(prefix, '\/') || '/';
  },

  getCurrentRouteHandler: function() {
    return this._match(this.getCurrentLocation());
  },

  _match: function(location) {
    for (var i = 0; i < this._routes.length; i++) {
      var route = this._routes[i];

      var matches = route.pattern.exec(location);

      if (matches) {
        return function() {
          return route.handler.apply(null, matches.slice(1));
        };
      }
    }

    return null;
  },

  _handleHashChange: function() {
    this._eventEmitter.emit('change', this.getCurrentRouteHandler());
  }
});

module.exports = Router;
