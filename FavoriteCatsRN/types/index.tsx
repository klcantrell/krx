interface Breed {
  name: string;
}

interface Cat {
  url: string;
  id: string;
  breeds: Breed[];
}

export { Cat };
