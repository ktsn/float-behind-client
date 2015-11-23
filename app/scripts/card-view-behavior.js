'use strict';

const weight = 0.0002;
const friction = 0.95;
const bounce = -0.6;
const threshold = 20;
const opacityDuration = 400;

function delta() {
  return Math.random() * 2 * weight - weight;
}

export function initialBehavior(card, timestamp) {
  let opacity = Math.min((timestamp - card.createdAt) / opacityDuration, 1);
  card.$el.css('opacity', opacity);

  floatBehavior(card);

  if (opacity === 1) {
    card.behavior = floatBehavior;
  }
}

export function floatBehavior(card) {
  let [ax, ay] = [card.ax + delta(), card.ay + delta()];
  let [vx, vy] = [(card.vx + ax) * friction, (card.vy + ay) * friction];
  let [x, y] = [card.x + vx, card.y + vy];

  let right = card.$wrapper.outerWidth();
  if (x < 0) {
    x = 0;
    vx *= bounce;
    ax *= bounce;
  } else if (x + card.w > right) {
    x = right - card.w;
    vx *= bounce;
    ax *= bounce;
  }

  let bottom = card.$wrapper.outerHeight();
  if (y < 0) {
    y = 0;
    vy *= bounce;
    ay *= bounce;
  } else if (y + card.h > bottom) {
    y = bottom - card.h;
    vy *= bounce;
    ay *= bounce;
  }

  card.setPos(x, y);

  card.ax = ax;
  card.ay = ay;
  card.vx = vx;
  card.vy = vy;
}

export function dragBehavior(card) {
}

export function thrownBehavior(card) {
  let [vx, vy] = [card.vx * friction, card.vy * friction];
  let [x, y] = [card.x + vx, card.y + vy];

  card.setPos(x, y);

  card.vx = vx;
  card.vy = vy;

  // change the behavior to floatBehavior if the velocity will be less than the threshold
  if (Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2)) < threshold) {
    card.behavior = floatBehavior;
    return;
  }

  // the card will be removed if it goes over the wrapper border
  let right = card.$wrapper.outerWidth();
  let bottom = card.$wrapper.outerHeight();
  if (x < 0 || x + card.w > right || y < 0 || y + card.h > bottom) {
    card.behavior = leaveBehavior;
  }
}

export function leaveBehavior(card) {
  let [x, y] = [card.x + card.vx, card.y + card.vy];

  card.setPos(x, y);

  // remove the card after it completely leave the viewport
  let right = card.$wrapper.outerWidth();
  let bottom = card.$wrapper.outerHeight();
  if (x + card.w < 0 || x > right || y + card.h < 0 || y > bottom) {
    card.remove();
  }
}
