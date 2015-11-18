'use strict';

import $ from 'jquery';
import moment from 'moment';

const weight = 0.0002;
const velocitySeed = 20;
const friction = 0.95;
const bounce = -0.6;
const threshold = 20;
const opacityDuration = 400;

export default class CardView {
  get w() {
    this._w = this._w || this.$el.outerWidth();
    return this._w;
  }

  get h() {
    this._h = this._h || this.$el.outerHeight();
    return this._h;
  }

  constructor(cardData, $wrapper) {
    this.$wrapper = $wrapper;

    this.data = cardData;
    this.data.date = moment(this.data.date);
    this.data.imageUrl = 'http://placehold.it/40x40';
    this.$el = $(this.template(this.data))
                .appendTo(this.$wrapper)
                .data('obj', this);

    this.createdAt = performance.now();

    this.init();

    this.mouse = { x: 0, y: 0 };

    this.isBounce = true;
    this.isHover = false;
    this.isDrag = false;

    // Hover event
    this.$el.on({
      mouseenter: () => {
        if (this.isDrag || !this.isBounce) {
          return;
        }

        this.isHover = true;
        this.stop();
      },
      mouseleave: () => this.isHover = false,
    });
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

  stop() {
    this.ax = this.ay = this.vx = this.vy = 0;
  }

  update(timestamp) {
    if (this.isDrag) {
      return;
    }

    this.updateOpacity(timestamp);

    let [ax, ay] = [this.ax + this.delta(), this.ay + this.delta()];
    let [vx, vy] = [(this.vx + ax) * friction, (this.vy + ay) * friction];
    let [x, y] = [this.x + vx, this.y + vy];

    if (this.isBounce) {
      let right = this.$wrapper.outerWidth();
      if (x < 0) {
        x = 0;
        vx *= bounce;
        ax *= bounce;
      } else if (x + this.w > right) {
        x = right - this.w;
        vx *= bounce;
        ax *= bounce;
      }

      // bounce is not occured if the card is already out of wrapper
      let bottom = this.$wrapper.outerHeight();
      if (y < 0) {
        y = 0;
        vy *= bounce;
        ay *= bounce;
      } else if (y + this.h > bottom) {
        y = bottom - this.h;
        vy *= bounce;
        ay *= bounce;
      }
    }

    this.setPos(x, y);

    this.ax = ax;
    this.ay = ay;
    this.vx = vx;
    this.vy = vy;
  }

  updateOpacity(timestamp) {
    let opacity = Math.min((timestamp - this.createdAt) / opacityDuration, 1);
    this.$el.css('opacity', opacity);
  }

  dragStart(event) {
    event.preventDefault();

    this.isDrag = true;

    let offset = this.$wrapper.offset();
    this.mouse.x = event.pageX - offset.left;
    this.mouse.y = event.pageY - offset.top;
  }

  dragMove(event) {
    if (!this.isDrag) {
      return;
    }

    event.preventDefault();

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
    if (!this.isDrag) {
      return;
    }

    event.preventDefault();
    this.isDrag = false;

    if (Math.sqrt(Math.pow(this.vx, 2) + Math.pow(this.vy, 2)) > threshold) {
      this.isBounce = false;
    }
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

  delta() {
    return Math.random() * 2 * weight - weight;
  }
}
