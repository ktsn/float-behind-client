'use strict';

import $ from 'jquery';
import _ from 'lodash';

const fetchURL = '/sampleData';

export default {
  isPolling: false,
  maxId: 0,

  state: {
    cards: []
  },

  startPolling(interval) {
    this.isPolling = true;
    this.polling(interval);
  },

  stopPolling() {
    this.isPolling = false;
  },

  polling(interval) {
    if (!this.isPolling) {
      return;
    }

    $.ajax({
      url: fetchURL,
      type: 'get',
      data: {
        id: this.maxId
      }
    }).done((data) => {
      let cards = data.result;

      if (cards.length > 0) {
        this.maxId = _.last(cards).id + 1;
        this.state.cards = this.state.cards.concat(cards);
      }

      setTimeout(this.polling.bind(this, interval), interval);
    });
  },

  remove(card) {
    // TODO: send remove request
    console.log(`removed: ${card.id}`);
  }
};
