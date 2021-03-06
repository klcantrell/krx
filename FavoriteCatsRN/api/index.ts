import { CAT_API_KEY } from '../env.json';

import { CatEntity, FavoriteCatEntity } from '../types';

interface FavoriteResponse {
  message: string;
}

interface AddFavoriteResponse extends FavoriteResponse {
  id: string;
}

const CAT_API_BASE_URL = 'https://api.thecatapi.com/v1';
const CAT_API_SUB_ID = 'favoriteCatsRN';
const CAT_API_BASE_HEADERS = {
  Accept: 'application/json',
  'x-api-key': CAT_API_KEY,
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache',
};

const fetchCats = async () => {
  const response = await fetch(
    CAT_API_BASE_URL +
      '/images/search?' +
      new URLSearchParams({ limit: '25', page: '0' }).toString(),
    {
      method: 'GET',
      headers: CAT_API_BASE_HEADERS,
    }
  );
  return (await response.json()) as CatEntity[];
};
const fetchFavorites = async () => {
  const response = await fetch(
    CAT_API_BASE_URL +
      '/favourites?' +
      new URLSearchParams({
        sub_id: CAT_API_SUB_ID,
        limit: '25',
        page: '0',
      }).toString(),
    {
      method: 'GET',
      headers: CAT_API_BASE_HEADERS,
    }
  );
  return (await response.json()) as FavoriteCatEntity[];
};
const addFavorite = async (id: string) => {
  const response = await fetch(CAT_API_BASE_URL + '/favourites', {
    method: 'POST',
    headers: CAT_API_BASE_HEADERS,
    body: JSON.stringify({
      image_id: id,
      sub_id: CAT_API_SUB_ID,
    }),
  });
  return (await response.json()) as AddFavoriteResponse;
};
const deleteFavorite = async (id: string) => {
  const response = await fetch(`${CAT_API_BASE_URL}/favourites/${id}`, {
    method: 'DELETE',
    headers: CAT_API_BASE_HEADERS,
  });
  return (await response.json()) as FavoriteResponse;
};

export { fetchCats, fetchFavorites, addFavorite, deleteFavorite };
