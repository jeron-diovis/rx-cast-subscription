# rx-cast-subscription
Creates unified subscription interface for various types of observables.
 
---

### Installation
```
npm install --save rx-cast-subscription
```

---

### API
#### `cast : Observable -> Subscribe`
#### `Observable : RxObservable | BaconObservable | KefirObservable | MostObservable`
#### `Subscribe : (?onNext, ?onError, ?onEnd) -> dispose`

`cast(observable)` creates a `subscribe` function, which accepts `onNext`, `onError` and `onEnd` listeners (as in RxJS), and returns a `dispose` function which removes all listeners.

Just like [bacon-cast](https://github.com/StreakYC/bacon-cast) or [kefir-cast](https://github.com/StreakYC/kefir-cast), this is intended for use by libraries which want to be able to accept streams from different sources, without diving into differences between them.

---

#### Something about `most.js`

Support of `most.js` is not full. Because most itself is... strange.

First, you *can't clear your subscription*. Just because [unobserving is not supported](https://github.com/cujojs/most/issues/142#issuecomment-110554081). 
`subscribe` will still return `dispose` function for `most`'s streams, but it will do nothing. As it's stated by link above, it's up to you to ensure you listener won't get new events when it shouldn't. Heh.

Second, there is no `end` or `error` events. You can [handle errors](https://github.com/cujojs/most/blob/master/docs%2Fapi.md#recoverwith), but can't subscribe on them. And I didn't found how to deal with stream ending at all.
So `subscribe` will just throw when you trying to add `onError` or `onEnd` listeners.
Please let me know if I'm wrong and missed something in `most`'s docs.
