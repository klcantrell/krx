type Breed = {
  name: string;
};

type Cat = {
  url: string;
  id: string;
  breeds: Breed[];
};

export { Cat };
