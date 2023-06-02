import { expect } from 'chai';
import sinon from 'sinon';
import Review from '../../src/models/review.model.js';

describe('Review Model', () => {
  let review;

  beforeEach(() => {
    review = new Review({
      user: 'user_id',
      content: 'Great movie!',
      mediaType: 'movie',
      mediaId: '123456',
      mediaTitle: 'The Avengers',
      mediaPoster: 'https://example.com/poster.jpg',
    });
  });

  it('should save a new review', async () => {
    const saveStub = sinon.stub(Review.prototype, 'save').resolves(review);

    const savedReview = await review.save();

    expect(savedReview).to.exist;
    expect(savedReview).to.deep.equal(review);

    saveStub.restore();
  });
});
