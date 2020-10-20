using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using FavoriteCats.Model;
using Newtonsoft.Json;
using Xamarin.Forms;
using static FavoriteCats.Constants.Constants;

namespace FavoriteCats.DataAccess
{
    public class CatApi
    {
        public event EventHandler<FetchCatsEventArgs> CatsFetched;
        public event EventHandler<FetchCatsEventArgs> SingleCatFetched;

        public void FetchCats()
        {
            BaseFetch("images/search?limit=25&page=0", CatsFetched);
        }

        public void FetchSingleCat()
        {
            BaseFetch("images/search?limit=1&page=0", SingleCatFetched);
        }

        private async void BaseFetch(String pathSegment, EventHandler<FetchCatsEventArgs> fetchedEvent)
        {
            Uri uri = new Uri($"{CAT_API_BASE_URL}/{pathSegment}");
            HttpRequestMessage httpRequest = new HttpRequestMessage()
            {
                Method = HttpMethod.Get,
                RequestUri = uri,
            };
            httpRequest.Headers.Add("Accept", "application/json");
            httpRequest.Headers.Add("Cache-Control", "no-cache");
            httpRequest.Headers.Add("x-api-key", CAT_API_KEY);

            using (HttpClient httpClient = new HttpClient())
            {
                var response = await httpClient.SendAsync(httpRequest);
                var json = await response.Content.ReadAsStringAsync();
                var cats = JsonConvert.DeserializeObject<List<Cat>>(json);
                fetchedEvent?.Invoke(this, new FetchCatsEventArgs(cats));
            }
        }
    }

    public class FetchCatsEventArgs
    {
        public List<Cat> Cats { get; }

        public FetchCatsEventArgs(List<Cat> cats)
        {
            Cats = cats;
        }
    }
}
