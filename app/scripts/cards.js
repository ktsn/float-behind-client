'use strict';

import $ from 'jquery';
import _ from 'lodash';
import EventEmitter from './event-emitter';

const fetchUrl = 'http://floatbehind.mybluemix.net/getListById';

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
        id: this.maxId
      }
    }).done((data) => {
      let cards = data.result;

      if (cards.length > 0) {
        this.maxId = _.last(cards).id + 1;
        this.cards = this.cards.concat(cards);
      }

      this.trigger('fetch', cards);

      setTimeout(this.polling.bind(this, interval), interval);
    });
  }
}
