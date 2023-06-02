import { expect } from 'chai';
import Favorite from '../../src/models/favorite.model.js';

describe('Favorite Model', () => {
  it('should be invalid if required fields are missing', (done) => {
    const favorite = new Favorite();

    favorite.validate((error) => {
      expect(error).to.exist; // Change this line

      expect(error.errors.user).to.exist;
      expect(error.errors.mediaType).to.exist;
      expect(error.errors.mediaId).to.exist;
      expect(error.errors.mediaTitle).to.exist;
      expect(error.errors.mediaPoster).to.exist;
      expect(error.errors.mediaRate).to.exist;

      done();
    });
  });

});
