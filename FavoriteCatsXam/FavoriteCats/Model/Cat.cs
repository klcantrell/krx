using System.Collections.Generic;

namespace FavoriteCats.Model
{
    public class Cat
    {
        public string Url { get; set; }
        public string Id { get; set; }
        public List<BreedName> Breeds { get; set; }
    }

    public class BreedName
    {
        public string Breed { get; set; }
    }
}
