using System;
using System.Collections.Generic;
using FavoriteCats.ViewModel;
using Xamarin.Forms;

namespace FavoriteCats
{
    public partial class TabsPage : TabbedPage
    {

        public TabsPage(MainVM mainViewModel, FavoritesVM favoritesViewModel)
        {
            InitializeComponent();

            var mainPage = new MainPage(mainViewModel)
            {
                Title = "Cats"
            };

            var favoritesPage = new FavoritesPage(favoritesViewModel)
            {
                Title = "Favorites"
            };

            Children.Add(mainPage);
            Children.Add(favoritesPage);
        }
    }
}
