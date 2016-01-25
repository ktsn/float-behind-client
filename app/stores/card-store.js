'use strict';

import Vue from 'vue';
import _ from 'lodash';

export default {
  _pages: null,

  get pages() {
    return this._pages || (this._pages = Vue.resource('/pages{/id}'));
  },

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

    this.pages
      .get({
        sinceId: this.maxId
      })
      .then((response) => {
        let cards = response.data.result;

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
