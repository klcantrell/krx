using System;
using System.Collections.Generic;
using FavoriteCats.DataAccess;
using FavoriteCats.ViewModel;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace FavoriteCats
{
    public partial class App : Application
    {
        private CatDB database;

        private MainVM mainViewModel;

        private FavoritesVM favoritesViewModel;

        public App()
        {
            InitializeComponent();

            database = new CatDB();
            mainViewModel = new MainVM(database);
            favoritesViewModel = new FavoritesVM(database);

            MainPage = new NavigationPage(new TabsPage(mainViewModel, favoritesViewModel));
        }

        protected override void OnStart()
        {
        }

        protected override void OnSleep()
        {
        }

        protected override void OnResume()
        {
        }
    }
}
