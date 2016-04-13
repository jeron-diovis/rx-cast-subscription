# rx-cast-subscription
Creates unified subscription interface for various types of observables.
 
### API
#### `cast : Observable -> Subscribe`
#### `Observable : RxObservable | BaconObservable | KefirObservable | MostObservable`
#### `Subscribe : (?onNext, ?onError, ?onEnd) -> dispose`

`cast(observable)` creates a `subscribe` function, which accepts `onNext`, `onError` and `onEnd` listeners (as in RxJS), and returns a `dispose` function which removes all listeners.

Just like [bacon-cast](https://github.com/StreakYC/bacon-cast) or [kefir-cast](https://github.com/StreakYC/kefir-cast), this is intended for use by libraries which want to be able to accept streams from different sources, without diving into differences between them.
