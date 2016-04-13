import cast from "../src";

import KefirBus from "kefir-bus";
import Rx from "rx";
import Bacon from "baconjs";
import { subject as MostSubject } from "most-subject";


function doTest(stream, emitValue, emitError, emitEnd) {
  const onValue = sinon.spy();
  const onError = sinon.spy();
  const onEnd = sinon.spy();

  const subscribe = cast(stream);
  assert.isFunction(subscribe, "subscribe is not a function");

  const unsubscribe = subscribe(onValue, onError, onEnd);
  assert.isFunction(unsubscribe, "unsubscribe is not a function");

  emitValue();
  emitError && emitError();
  emitEnd && emitEnd();

  //unsubscribe();

  emitValue();
  emitError && emitError();
  emitEnd && emitEnd();

  assert.equal(onValue.callCount, 1, "value subscription is not cleared");
  assert.equal(onError.callCount, 1, "error subscription is not cleared");
  assert.equal(onEnd.callCount, 1, "end subscription is not cleared");
}


describe("rx", () => {

  let stream, subscribe;

  beforeEach(() => {
    stream = new Rx.Subject;
    subscribe = cast(stream);
  });

  afterEach(() => {
    stream = null;
    subscribe = null;
  });

  it("values and errors", () => {
    const onValue = sinon.spy();
    const onError = sinon.spy();

    assert.isFunction(subscribe, "subscribe is not a function");

    const unsubscribe = subscribe(onValue, onError);
    assert.isFunction(unsubscribe, "unsubscribe is not a function");

    stream.onNext();
    stream.onError();

    assert.equal(onValue.callCount, 1, "value subscription does not work");
    assert.equal(onError.callCount, 1, "error subscription does not work");

    unsubscribe();

    stream.onNext();
    stream.onError();

    assert.equal(onValue.callCount, 1, "value subscription is not cleared");
    assert.equal(onError.callCount, 1, "error subscription is not cleared");
  });

  it("end", () => {
    const onEnd = sinon.spy();
    subscribe(undefined, undefined, onEnd);
    stream.onCompleted();
    stream.onCompleted();
    assert.equal(onEnd.callCount, 1, "end subscription does not work");
  });
});



describe("kefir", () => {

  let stream, subscribe;

  beforeEach(() => {
    stream = new KefirBus;
    subscribe = cast(stream);
  });

  afterEach(() => {
    stream = null;
    subscribe = null;
  });

  it("values and errors", () => {
    const onValue = sinon.spy();
    const onError = sinon.spy();

    assert.isFunction(subscribe, "subscribe is not a function");

    const unsubscribe = subscribe(onValue, onError);
    assert.isFunction(unsubscribe, "unsubscribe is not a function");

    stream.emit();
    stream.error();

    assert.equal(onValue.callCount, 1, "value subscription does not work");
    assert.equal(onError.callCount, 1, "error subscription does not work");

    unsubscribe();

    stream.emit();
    stream.error();

    assert.equal(onValue.callCount, 1, "value subscription is not cleared");
    assert.equal(onError.callCount, 1, "error subscription is not cleared");
  });

  it("end", () => {
    const onEnd = sinon.spy();
    subscribe(undefined, undefined, onEnd);
    stream.end();
    stream.end();
    assert.equal(onEnd.callCount, 1, "end subscription does not work");
  });
});



describe("bacon", () => {

  let stream, subscribe;

  beforeEach(() => {
    stream = new Bacon.Bus;
    subscribe = cast(stream);
  });

  afterEach(() => {
    stream = null;
    subscribe = null;
  });

  it("values and errors", () => {
    const onValue = sinon.spy();
    const onError = sinon.spy();

    assert.isFunction(subscribe, "subscribe is not a function");

    const unsubscribe = subscribe(onValue, onError);
    assert.isFunction(unsubscribe, "unsubscribe is not a function");

    stream.push();
    stream.error();

    assert.equal(onValue.callCount, 1, "value subscription does not work");
    assert.equal(onError.callCount, 1, "error subscription does not work");

    unsubscribe();

    stream.push();
    stream.error();

    assert.equal(onValue.callCount, 1, "value subscription is not cleared");
    assert.equal(onError.callCount, 1, "error subscription is not cleared");
  });

  it("end", () => {
    const onEnd = sinon.spy();
    subscribe(undefined, undefined, onEnd);
    stream.end();
    stream.end();
    assert.equal(onEnd.callCount, 1, "end subscription does not work");
  });
});


// ---


describe("most", () => {
  it("values", () => {
    const observer = sinon.spy();

    const { stream, observer: subject } = MostSubject();

    const subscribe = cast(stream);
    assert.isFunction(subscribe, "subscribe is not a function");

    const unsubscribe = subscribe(observer);
    assert.isFunction(unsubscribe, "unsubscribe is not a function");

    subject.next();
    unsubscribe();
    subject.next();

    // because can't unsubscribe
    // @link https://github.com/cujojs/most/issues/142
    assert.equal(observer.callCount, 2, "subscription cleared? how?");
  });

  it("errors", () => {
    const observer = sinon.spy();
    const { stream } = MostSubject();
    const subscribe = cast(stream);
    assert.throws(
      () => subscribe(undefined, observer),
      /'onError' listener is not supported/
    );
  });

  it("end", () => {
    const observer = sinon.spy();
    const { stream } = MostSubject();
    const subscribe = cast(stream);
    assert.throws(
      () => subscribe(undefined, undefined, observer),
      /'onEnd' listener is not supported/
    );
  });
});


// ---


it("unknown", () => {
  const stream = {};

  assert.throws(
    () => cast(stream),
    /Unknown stream type/
  );
});