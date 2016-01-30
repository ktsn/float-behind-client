'use strict';

export function getAbsolutePosition(el) {
  const bounds = el.getBoundingClientRect();

  return {
    x: bounds.left + window.pageXOffset,
    y: bounds.top + window.pageYOffset
  };
}
