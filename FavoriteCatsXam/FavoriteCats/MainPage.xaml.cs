using FavoriteCats.ViewModel;
using Xamarin.Forms;

namespace FavoriteCats
{
    public partial class MainPage : ContentPage
    {
        MainVM viewModel;

        public MainPage()
        {
            InitializeComponent();

            viewModel = new MainVM();
            BindingContext = viewModel;
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();
            viewModel.FetchCats();
        }
    }
}
