'use strict';

import $ from 'jquery';
import moment from 'moment';
import EventEmitter from './event-emitter';
import * as Behavior from './card-view-behavior';

const velocitySeed = 20;

export default class CardView extends EventEmitter {
  get w() {
    this._w = this._w || this.$el.outerWidth();
    return this._w;
  }

  get h() {
    this._h = this._h || this.$el.outerHeight();
    return this._h;
  }

  constructor(cardData, $wrapper) {
    super();
    this.$wrapper = $wrapper;

    // TODO: get the user image url from the server
    this.data = cardData;
    this.data.date = moment(this.data.date);
    this.data.imageUrl = 'http://placehold.it/40x40';

    this.$el = $(this.template(this.data))
                .appendTo(this.$wrapper)
                .data('card', this);

    this.createdAt = performance.now();

    this.init();

    this.mouse = { x: 0, y: 0 };

    this.behavior = Behavior.initialBehavior;
  }

  init() {
    this.ax = this.ay = 0;

    let angle = 2 * Math.random() * Math.PI;
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);

    // calculate velocity
    // the size of velocity should always be same value
    this.vx = velocitySeed * cos;
    this.vy = velocitySeed * sin;

    // calculate position
    let xc = this.$wrapper.outerWidth() / 2;
    let yc = this.$wrapper.outerHeight() / 2;

    // scale sin(angle) and cos(angle) to put card out of wrapper
    let scale = Math.max(Math.abs(sin), Math.abs(cos));
    sin = sin / scale;
    cos = cos / scale;

    // set position against velocity direction
    let x = xc - xc * cos;
    let y = yc - yc * sin;

    this.setPos(x, y);
  }

  setPos(x, y) {
    this.x = x;
    this.y = y;
    this.$el.css('transform', `translate3d(${x}px, ${y}px, 0)`);
  }

  update(timestamp) {
    this.behavior(this, timestamp);
  }

  remove() {
    this.$el.remove();
    this.behavior = $.noop;
    this.trigger('remove', this);
  }

  dragStart(event) {
    this.behavior = Behavior.dragBehavior;

    let offset = this.$wrapper.offset();
    this.mouse.x = event.pageX - offset.left;
    this.mouse.y = event.pageY - offset.top;
  }

  dragMove(event) {
    let offset = this.$wrapper.offset();
    let x = event.pageX - offset.left;
    let y = event.pageY - offset.top;

    this.vx = x - this.mouse.x;
    this.vy = y - this.mouse.y;

    this.mouse.x = x;
    this.mouse.y = y;

    this.setPos(this.x + this.vx, this.y + this.vy);
  }

  dragEnd(event) {
    this.behavior = Behavior.thrownBehavior;
  }

  template(card) {
    return `
      <article class="card js-card">
        <a class="card-anchor js-card-anchor" href="${card.url}" target="_blank">
          <header class="card-header">
            <div class="card-icon-wrapper">
              <img src="${card.imageUrl}" alt="${card.user_name}" class="card-icon">
            </div>
            <p class="card-header-main">
              <span class="card-user">${card.user_name}</span>
              <small class="card-from">from ${card.from}</small>
            </p>
            <date class="card-date" datetime="${card.date.toISOString()}">${card.date.format('HH:mm A, Do MMMM')}</date>
          </header>
          <h1 class="card-title">${card.title}</h1>
        </a>
      </article>`;
  }
}
