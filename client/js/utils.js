export function collisionPointRect(point, rect) {
  return (
    point.x >= rect.left &&
    point.x <= rect.right &&
    point.y >= rect.top &&
    point.y <= rect.bot
  )
}

export function createObjectForEach() {
  Object.defineProperty(Object.prototype, 'forEach', {
    value: function(callback, thisArg) {
      if (this == null) {
        throw new TypeError('Not an object');
      }
      thisArg = thisArg || window;
      for (var key in this) {
        if (this.hasOwnProperty(key)) {
          callback.call(thisArg, this[key], key, this);
        }
      }
    }
  });
}
