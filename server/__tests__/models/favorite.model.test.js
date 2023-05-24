import mongoose from "mongoose";
import Favorite from "../../src/models/favorite.model.js";

describe("Favorite Model", () => {
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
    await Favorite.deleteMany({});
  });

  it("should create a new favorite with the given user, mediaType, mediaId, mediaTitle, mediaPoster, and mediaRate", async () => {
    const favoriteData = {
      user: mongoose.Types.ObjectId(),
      mediaType: "tv",
      mediaId: "12345",
      mediaTitle: "Test TV Show",
      mediaPoster: "tv_poster.jpg",
      mediaRate: 4.5,
    };

    const createdFavorite = await Favorite.create(favoriteData);

    expect(createdFavorite.user).toEqual(favoriteData.user);
    expect(createdFavorite.mediaType).toEqual(favoriteData.mediaType);
    expect(createdFavorite.mediaId).toEqual(favoriteData.mediaId);
    expect(createdFavorite.mediaTitle).toEqual(favoriteData.mediaTitle);
    expect(createdFavorite.mediaPoster).toEqual(favoriteData.mediaPoster);
    expect(createdFavorite.mediaRate).toEqual(favoriteData.mediaRate);
  });

  it("should throw validation error if any required field is missing", async () => {
    const favoriteData = {
      user: mongoose.Types.ObjectId(),
      mediaType: "tv",
      mediaId: "12345",
      mediaTitle: "Test TV Show",
      // Missing mediaPoster and mediaRate
    };

    await expect(Favorite.create(favoriteData)).rejects.toThrow(
      mongoose.Error.ValidationError
    );
  });
});
