using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;
using FavoriteCats.DataAccess;
using FavoriteCats.Model;

namespace FavoriteCats.ViewModel
{
    public class MainVM : INotifyPropertyChanged
    {
        private CatApi catApi;

        private bool loading;
        public bool Loading
        {
            get => loading;
            set
            {
                loading = value;
                OnPropertyChanged("Loading");
            }
        }

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

        public MainVM()
        {
            catApi = new CatApi();
            catApi.CatsFetched += OnCatsFetched;
        }

        public event PropertyChangedEventHandler PropertyChanged;

        public void FetchCats()
        {
            Loading = true;
            catApi.FetchCats();
        }

        private void OnCatsFetched(object sender, FetchCatsEventArgs args)
        {
            Cats = args.Cats;
            Loading = false;
        }

        private void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
