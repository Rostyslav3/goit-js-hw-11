import axios from 'axios';
const KEY = '28434812-77028be95d48f8c97f5427a9b';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export class GetPicApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchPhoto() {
    const searchParams = new URLSearchParams({
      key: KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: this.per_page,
    });

    const { data } = await axios.get(`?${searchParams}`);
    this.incrementPage();
    return data;
  }

  get currentSearchQuery() {
    return this.searchQuery;
  }

  set currentSearchQuery(newSearchQuery) {
    this.searchQuery = newSearchQuery;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
