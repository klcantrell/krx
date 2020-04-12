interface Breed {
  name: string;
}

interface Cat {
  url: string;
  id: string;
  breeds: Breed[];
}

interface FavoriteCat {
  image: {
    url: string;
  };
  id: string;
}

export { Cat, FavoriteCat };
