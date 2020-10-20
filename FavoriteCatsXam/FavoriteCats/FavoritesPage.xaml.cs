using System;
using System.Collections.Generic;
using FavoriteCats.ViewModel;
using Xamarin.Forms;

namespace FavoriteCats
{
    public partial class FavoritesPage : ContentPage
    {
        private FavoritesVM viewModel;

        public FavoritesPage(FavoritesVM viewModel)
        {
            InitializeComponent();

            this.viewModel = viewModel;

            BindingContext = this.viewModel;
        }
    }
}
