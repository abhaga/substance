'use strict';

require('../qunit_extensions');

var changeStoreSeed = require('../../fixtures/collab/changeStoreSeed');
var ChangeStore = require('../../../collab/ChangeStore');
var testChangeStore = require('../../collab/testChangeStore');
var changeStore = new ChangeStore();

QUnit.module('collab/ChangeStore', {
  beforeEach: function(assert) {
    var done = assert.async();

    // Make sure we create a new seed instance, as data ops
    // are performed directly on the seed object
    var newChangeStoreSeed = JSON.parse(JSON.stringify(changeStoreSeed));
    changeStore.seed(newChangeStoreSeed, function(err) {
      if (err) {
        return console.error(err);
      } else {
        done();
      }
    });
  }
});

// Runs the offical backend test suite
testChangeStore(changeStore, QUnit);