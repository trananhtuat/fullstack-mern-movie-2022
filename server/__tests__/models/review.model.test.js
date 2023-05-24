import mongoose from "mongoose";
import Review from "../../src/models/review.model.js";
import User from "../../src/models/user.model.js";

describe("Review Model", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/es", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Review.deleteMany({});
  });

  it("should set the user property", () => {
    const review = new Review();
    const userId = new mongoose.Types.ObjectId();
    review.user = userId;
    expect(review.user).toEqual(userId);
  });

  it("should set the content property", () => {
    const review = new Review();
    const content = "This is a review.";
    review.content = content;
    expect(review.content).toEqual(content);
  });

  it("should set the mediaType property", () => {
    const review = new Review();
    const mediaType = "movie";
    review.mediaType = mediaType;
    expect(review.mediaType).toEqual(mediaType);
  });

  it("should set the mediaId property", () => {
    const review = new Review();
    const mediaId = "123456";
    review.mediaId = mediaId;
    expect(review.mediaId).toEqual(mediaId);
  });

  it("should set the mediaTitle property", () => {
    const review = new Review();
    const mediaTitle = "Movie Title";
    review.mediaTitle = mediaTitle;
    expect(review.mediaTitle).toEqual(mediaTitle);
  });

  it("should set the mediaPoster property", () => {
    const review = new Review();
    const mediaPoster = "poster.jpg";
    review.mediaPoster = mediaPoster;
    expect(review.mediaPoster).toEqual(mediaPoster);
  });
});
