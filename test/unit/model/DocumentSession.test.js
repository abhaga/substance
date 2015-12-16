'use strict';

require('../qunit_extensions');
var sinon = require('sinon');
var extend = require('lodash/object/extend');
var DocumentSession = require('../../../model/DocumentSession');
var sample1 = require('../../fixtures/sample1');

QUnit.module('model/DocumentSession');

QUnit.test("Transaction: before and after state.", function(assert) {
  var doc = sample1();
  var docSession = new DocumentSession(doc);
  var change = null;
  doc.on('document:changed', function(_change) {
    change = _change;
  });
  var beforeState = { selection: 'foo', some: "other" };
  var afterState = { selection: 'bar' };
  docSession.transaction(function(tx, args) {
    extend(tx.before, beforeState);
    tx.create({ type: 'paragraph', id: 'bla', content: ""});
    args.selection = 'bar';
    return args;
  });
  assert.ok(change !== null, "Change should be applied.");
  assert.ok(change.before !== null, "Change should have before state.");
  assert.ok(change.after !== null, "Change should have after state.");
  assert.deepEqual(change.before, beforeState, "Change.before should be the same.");
  assert.equal(change.after.selection, afterState.selection, "Change.after.selection should be set correctly.");
  assert.equal(change.after.some, beforeState.some, "Not updated state variables should be forwarded.");
});

QUnit.test("Keeping TransactionDocument up-to-date.", function(assert) {
  var doc = sample1();
  var docSession = new DocumentSession(doc);
  docSession.stage.apply = sinon.spy(docSession.stage, 'apply');

  doc.create({ type: 'paragraph', id: 'foo', content: 'foo'});
  var p = docSession.stage.get('foo');
  assert.equal(docSession.stage.apply.callCount, 1, "Stage should have been updated.");
  assert.isDefinedAndNotNull(p, "Stage should contain new paragraph node.");
  assert.equal(p.content, "foo");
});
