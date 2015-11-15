'use strict';

import $ from 'jquery';
import _ from 'lodash';
import EventEmitter from './event-emitter';

const fetchUrl = 'http://floatbehind.mybluemix.net/sampleData';

export default class Cards extends EventEmitter {
  constructor() {
    super();
    this.isPolling = false;
    this.maxId = 0;
    this.cards = [];
  }

  startPolling(interval) {
    this.isPolling = true;
    this.polling(interval);
  }

  stopPolling() {
    this.isPolling = false;
  }

  polling(interval) {
    if (!this.isPolling) {
      return;
    }

    $.ajax({
      url: fetchUrl,
      type: 'get',
      data: {
        minId: this.maxId
      }
    }).done((data) => {
      let cards = data.result;

      this.maxId = _.last(cards).id;
      this.cards = this.cards.concat(cards);

      this.trigger('fetch', cards);

      setTimeout(this.polling.bind(this, interval), interval);
    });
  }
}
