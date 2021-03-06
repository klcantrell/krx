﻿using System;
using FavoriteCats.ViewModel;
using Xamarin.Forms;

namespace FavoriteCats
{
    public partial class MainPage : ContentPage
    {
        private MainVM viewModel;

        public MainPage(MainVM viewModel)
        {
            InitializeComponent();
            this.viewModel = viewModel;

            BindingContext = this.viewModel;
            this.viewModel.FetchCats();
        }
    }
}
