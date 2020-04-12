interface Breed {
  name: string;
}

interface CatEntity {
  url: string;
  id: string;
  breeds: Breed[];
}

interface Cat {
  url: string;
  imageId: string;
  favoritedId: string | null;
  breeds: Breed[];
}

interface FavoriteCatEntity {
  image: {
    id: string;
    url: string;
  };
  id: string;
}

export { CatEntity, FavoriteCatEntity, Cat };
