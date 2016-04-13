import cast from "../src";

import KefirBus from "kefir-bus";
import Rx from "rx";
import Bacon from "baconjs";
import { subject as MostSubject } from "most-subject";

it("kefir", () => {
  const observer = sinon.spy();
  const stream = new KefirBus;

  const subscribe = cast(stream);
  assert.isFunction(subscribe, "subscribe is not a function");

  const unsubscribe = subscribe(observer);
  assert.isFunction(unsubscribe, "unsubscribe is not a function");

  stream.emit();
  unsubscribe();
  stream.emit();

  assert.equal(observer.callCount, 1, "subscription is not cleared");
});

it("rx", () => {
  const observer = sinon.spy();
  const stream = new Rx.Subject;

  const subscribe = cast(stream);
  assert.isFunction(subscribe, "subscribe is not a function");

  const unsubscribe = subscribe(observer);
  assert.isFunction(unsubscribe, "unsubscribe is not a function");

  stream.onNext();
  unsubscribe();
  stream.onNext();

  assert.equal(observer.callCount, 1, "subscription is not cleared");
});

it("bacon", () => {
  const observer = sinon.spy();

  const stream = new Bacon.Bus;

  const subscribe = cast(stream);
  assert.isFunction(subscribe, "subscribe is not a function");

  const unsubscribe = subscribe(observer);
  assert.isFunction(unsubscribe, "unsubscribe is not a function");

  stream.push();
  unsubscribe();
  stream.push();

  assert.equal(observer.callCount, 1, "subscription is not cleared");
});

it("most", () => {
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

it("unknown", () => {
  const stream = {};

  assert.throws(
    () => cast(stream),
    /Unknown stream type/
  );
});