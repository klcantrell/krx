using System.Linq;
using System.Collections.Generic;
using System.ComponentModel;
using FavoriteCats.DataAccess;
using FavoriteCats.Model;
using Xamarin.Forms;
using System.Windows.Input;
using System;

namespace FavoriteCats.ViewModel
{
    public class MainVM : INotifyPropertyChanged
    {
        private CatApi catApi;
        private CatDB database;

        private List<Cat> cats;
        public List<Cat> Cats
        {
            get => cats;
            set
            {
                cats = value;
                OnPropertyChanged("Cats");
            }
        }

        private bool refreshing;
        public bool Refreshing
        {
            get => refreshing;
            set
            {
                refreshing = value;
                OnPropertyChanged("Refreshing");
            }
        }

        public ICommand FavoriteCommand { get; }

        public ICommand RefreshCommand { get; }

        public MainVM(CatDB database)
        {
            catApi = new CatApi();
            catApi.CatsFetched += OnCatsFetched;
            catApi.SingleCatFetched += OnSingleCatFetched;

            this.database = database;
            this.database.CatInserted += OnCatInserted;

            FavoriteCommand = new Command((parameter) => database.InsertFavorite(parameter as Cat));
            RefreshCommand = new Command(() =>
            {
                Refreshing = true;
                catApi.FetchCats();
                Refreshing = false;
            });
        }

        public event PropertyChangedEventHandler PropertyChanged;

        public void FetchCats()
        {
            catApi.FetchCats();
        }

        private void OnCatInserted(object sender, InsertEventArgs<Cat> args)
        {
            Cat insertedCat = args.InsertedItem;
            Cats = Cats.Where(c => c.Id != insertedCat.Id).ToList();
            catApi.FetchSingleCat();
        }

        private void OnCatsFetched(object sender, FetchCatsEventArgs args)
        {
            var favorites = database.GetFavorites().Select(c => c.Id);
            Cats = args.Cats.Where(c => !favorites.Contains(c.Id)).ToList();
            if (Cats.Count < 25)
            {
                catApi.FetchSingleCat();
            }
        }

        private void OnSingleCatFetched(object sender, FetchCatsEventArgs args)
        {
            var favorites = database.GetFavorites().Select(c => c.Id);
            var filteredCatResponse = args.Cats.Where(c => !favorites.Contains(c.Id)).ToList();
            if (filteredCatResponse.Count > 0)
            {
                Cats = Cats.Concat(filteredCatResponse).ToList();
            }
            else
            {
                catApi.FetchSingleCat();
            }
        }

        private void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
