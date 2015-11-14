'use strict';

import _ from 'lodash';

export default class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(name, func) {
    if (!this.listeners[name]) {
      this.listeners[name] = [];
    }
    this.listeners[name].push(func);
  }

  off(name) {
    this.listeners[name] = [];
  }

  trigger(name, data) {
    if (name in this.listeners) {
      _.forEach(this.listeners[name], (func) => {
        let f = _.curry(func);
        setTimeout(f(data), 0);
      });
    }
  }
}
