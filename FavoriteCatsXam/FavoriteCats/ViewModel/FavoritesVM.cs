using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Windows.Input;
using FavoriteCats.DataAccess;
using FavoriteCats.Model;
using Xamarin.Forms;

namespace FavoriteCats.ViewModel
{
    public class FavoritesVM : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;

        private CatDB database;

        private List<Cat> favorites = new List<Cat>();
        public List<Cat> Favorites
        {
            get => favorites;
            set
            {
                favorites = value;
                OnPropertyChanged("Favorites");
            }
        }

        public ICommand DeleteCommand { get; }

        public FavoritesVM(CatDB database)
        {
            this.database = database;

            Favorites = database.GetFavorites();

            this.database.CatInserted += OnCatInserted;
            this.database.CatDeleted += OnCatDeleted;

            DeleteCommand = new Command((parameter) => database.DeleteFavorite(parameter as Cat));
        }

        public void OnCatInserted(object sender, InsertEventArgs<Cat> args)
        {
            var favoritedCat = args.InsertedItem;

            var newFavorites = new List<Cat>(Favorites)
            {
                favoritedCat
            };

            Favorites = newFavorites;
        }

        public void OnCatDeleted(object sender, DeleteEventArgs<Cat> args)
        {
            var deletedCat = args.DeletedItem;

            var newFavorites = Favorites.Where(c => c.Id != deletedCat.Id).ToList();

            Favorites = newFavorites;
        }

        private void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
