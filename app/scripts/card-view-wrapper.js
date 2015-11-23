'use strict';

import $ from 'jquery';
import _ from 'lodash';
import CardView from './card-view';
import EventEmitter from './event-emitter';
import Native from './native';

export default class CardViewWrapper extends EventEmitter {
  constructor(el) {
    super();

    this.$el = $(el);

    this.cards = [];

    this.drag = {
      target: null,
      moved: false
    };

    this.$el
      .on('mousedown.card', '.js-card', this.dragStart.bind(this))
      .on('mousemove.card', this.dragMove.bind(this))
      .on('mouseup.card mouseleave.card', this.dragEnd.bind(this))
      .on('click.card', (event) => {
        event.preventDefault();
      });
  }

  addCards(cards) {
    let cs = _(cards)
      .map((c) => new CardView(c, this.$el))
      .forEach((c) => c.on('remove', this.removeCard.bind(this)))
      .value();
    this.cards = this.cards.concat(cs);
  }

  update(timestamp) {
    _.forEach(this.cards, (c) => c.update(timestamp));
  }

  removeCard(card) {
    card.off('remove');

    this.cards = _.without(this.cards, (c) => c.data.id === card.data.id);

    this.trigger('remove', card.data);
  }

  dragStart(event) {
    event.preventDefault();

    this.drag.target = $(event.currentTarget).data('card');
    this.drag.target.dragStart(event);
    this.drag.moved = false;
  }

  dragMove(event) {
    event.preventDefault();

    if (this.drag.target === null) {
      return;
    }

    this.drag.target.dragMove(event);
    this.drag.moved = true;
  }

  dragEnd(event) {
    event.preventDefault();

    if (this.drag.target === null) {
      return;
    }

    if (this.drag.moved) {
      this.drag.target.dragEnd(event);
    } else {
      Native.requestPreviewCard(this.drag.target.data.url);
    }

    this.drag.target = null;
    this.drag.moved = false;
  }
}
