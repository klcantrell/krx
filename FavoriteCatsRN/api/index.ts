import { CAT_API_KEY } from '../env.json';

import { Cat } from '../types';

const CAT_API_BASE_URL = 'https://api.thecatapi.com/v1/';
const CAT_API_SUB_ID = 'favoriteCatsRN';
const CAT_API_BASE_HEADERS = {
  Accept: 'application/json',
  'x-api-key': CAT_API_KEY,
  'Cache-Control': 'no-cache',
};

const fetchCats = async () => {
  const response = await fetch(
    CAT_API_BASE_URL +
      'images/search?' +
      new URLSearchParams({ limit: '25', page: '0' }).toString(),
    {
      method: 'GET',
      headers: CAT_API_BASE_HEADERS,
    }
  );
  const cats = (await response.json()) as Cat[];
  return cats;
};
const fetchFavorites = async () => {
  const response = await fetch(
    CAT_API_BASE_URL +
      'favourites?' +
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
  return (await response.json()) as Cat[];
};

export { fetchCats, fetchFavorites };
