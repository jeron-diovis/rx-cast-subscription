const map = {
  rx: {
    is: $ => $.subscribe && $.subscribeOnNext,
    cast: $ => fn => {
      const subscription = $.subscribe(fn);
      return () => subscription.dispose();
    }
  },

  bacon: {
    is: $ => $.subscribe && $.onValue,
    cast: $ => fn => $.onValue(fn)
  },

  kefir: {
    is: $ => $.onAny && $.offAny,
    cast: $ => fn => {
      $.onValue(fn);
      return () => $.offValue(fn);
    }
  },

  most: {
    is: $ => $.observe && $.drain,
    cast: $ => fn => {
      $.observe(fn);

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
