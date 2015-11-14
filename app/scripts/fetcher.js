'use strict';

import $ from 'jquery';
import EventEmitter from './event-emitter';

export default class Fetcher extends EventEmitter {
  constructor() {
    super();
    this.isPolling = false;
    this.maxId = 0;
  }

  startPolling(interval) {
    this.isPolling = true;
    setTimeout(this.polling.bind(this, interval), 0);
  }

  stopPolling() {
    this.isPolling = false;
  }

  polling(interval) {
    if (!this.isPolling) {
      return;
    }

    this.trigger('fetch', {
      id: 1,
      url: 'http://example.com',
      text: 'hogehoge',
      image: 'http://placehold.it/60x60'
    });

    setTimeout(this.polling.bind(this, interval), interval);
  }
}
