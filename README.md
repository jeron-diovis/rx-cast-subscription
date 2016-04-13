# rx-cast-subscription
Creates unified subscription interface for various types of observables.
 
### API
#### `cast : Observable -> Subscribe`
#### `Observable : RxObservable | BaconObservable | KefirObservable | MostObservable`
#### `Subscribe : Function -> Dispose`
#### `Dispose : Function`

`cast(observable)` creates `subscribe` function, which will subscribe given observer to stream and return `dispose` function to cancel subscription.

Just like [bacon-cast](https://github.com/StreakYC/bacon-cast) or [kefir-cast](https://github.com/StreakYC/kefir-cast), this is intended for use by libraries which want to be able to accept streams from different sources, without diving into differences between them.