// @flow

import * as Api from 'index'

describe('Api', function() {
  it('returns not null', function(done) {
    Api.getAllLinks('')
      .then(list => {
        expect(list).not.toBeNull()
      })
      .then(done)
  })
})
