const map = {
  rx: {
    is: $ => $.subscribe && $.subscribeOnNext,
    cast: $ => (...args) => {
      const subscription = $.subscribe(...args);
      return () => subscription.dispose();
    }
  },

  bacon: {
    is: $ => $.subscribe && $.onValue,
    cast: $ => (onNext, onError, onEnd) => {
      const disposables = [];
      if (onNext) {
        disposables.push($.onValue(onNext));
      }
      if (onError) {
        disposables.push($.onError(onError));
      }
      if (onEnd) {
        disposables.push($.onEnd(onEnd));
      }
      return () => disposables.forEach(fn => fn());
    }
  },

  kefir: {
    is: $ => $.onAny && $.offAny,
    cast: $ => (onNext, onError, onEnd) => {
      const disposables = [];
      if (onNext) {
        $.onValue(onNext);
        disposables.push(() => $.offValue(onNext));
      }
      if (onError) {
        $.onError(onError);
        disposables.push(() => $.offError(onError));
      }
      if (onEnd) {
        $.onEnd(onEnd);
        disposables.push(() => $.offEnd(onEnd));
      }
      return () => disposables.forEach(fn => fn());
    }
  },

  most: {
    is: $ => $.observe && $.drain,
    cast: $ => (onNext, onError, onEnd) => {
      if (onNext) {
        $.observe(onNext);
      }

      // am I wrong about this features support in most?
      if (onError) {
        throw new Error("[rx-cast-subscription] (most) 'onError' listener is not supported by most");
      }

      if (onEnd) {
        throw new Error("[rx-cast-subscription] (most) 'onEnd' listener is not supported by most");
      }

      // ???
      // No way to unsubscribe in most
      // @link https://github.com/cujojs/most/issues/142
      // Use most at your own risk
      return () => {};
    }
  }
};

export default function cast(stream) {
  for (const key in map) {
    const lib = map[key];
    if (lib.is(stream)) {
      return lib.cast(stream);
    }
  }

  throw new Error("[rx-cast-subscription] Unknown stream type");
}
