using System;
using System.Linq;
using System.Collections.Generic;
using FavoriteCats.Model;

namespace FavoriteCats.DataAccess
{
    public class CatDB
    {
        public event EventHandler<InsertEventArgs<Cat>> CatInserted;
        public event EventHandler<DeleteEventArgs<Cat>> CatDeleted;

        private List<Cat> favorites = new List<Cat>();

        public void InsertFavorite(Cat cat)
        {
            if (favorites.Count(f => f.Id == cat.Id) == 0)
            {
                favorites.Add(cat);
                CatInserted?.Invoke(this, new InsertEventArgs<Cat>(cat));
            }
        }

        public void DeleteFavorite(Cat cat)
        {
            favorites = favorites.Where(f => f.Id != cat.Id).ToList();
            CatDeleted?.Invoke(this, new DeleteEventArgs<Cat>(cat));
        }

        public List<Cat> GetFavorites() => favorites;
    }

    public class InsertEventArgs<T>
    {
        public T InsertedItem { get; }

        public InsertEventArgs(T insertedItem)
        {
            InsertedItem = insertedItem;
        }
    }

    public class DeleteEventArgs<T>
    {
        public T DeletedItem { get; }

        public DeleteEventArgs(T deletedItem)
        {
            DeletedItem = deletedItem;
        }
    }
}
