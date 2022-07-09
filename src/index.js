import { GetPicApi } from './js/getPicApi';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import makeGalleryPic from './js/makeGallery';

Notify.init({
  width: '300px',
  position: 'rigth-top',
  timeout: 1500,
});

let lightBox = new simpleLightbox('.gallery a', {
  captions: true,
  captionsselector: 'self',
  captionsType: 'attr',
  captionsAttribute: 'title',
  captionPosition: 'bottom',
  captionDelay: 250,
  showCounter: false,
});

const searchForm = document.querySelector('#search-form');
const galleryForm = document.querySelector('.gallery');

searchForm.addEventListener('submit', onSearch);

const getPicApi = new GetPicApi();

function renderGallery(searchImages) {
  galleryForm.insertAdjacentHTML('beforeend', makeGalleryPic(searchImages));
}

async function getData() {
  try {
    const { hits, totalHits } = await getPicApi.fetchPhoto();
    const lastPage = totalHits / 40;
    if (getPicApi.page > lastPage) {
      return Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
    } else {
      Notify.success(`New images loaded`);
      renderGallery(hits);
      lightBox.refresh();
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function onSearch(e) {
  e.preventDefault();
  clearSearchForm();
  getPicApi.resetPage();

  const request = e.target.searchQuery.value.trim().toLowerCase();
  getPicApi.currentSearchQuery = request;

  try {
    const { hits, totalHits } = await getPicApi.fetchPhoto();
    if (!request) {
      return Notify.info('Еnter a search query');
    }

    if (totalHits > 0) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
      renderGallery(hits);
      lightBox.refresh();
    }

    if (totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.log(error.message);
  }
  e.target.reset();
}

function clearSearchForm() {
  galleryForm.innerHTML = '';
}

// function scrollSmoothly() {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();
// console.log(cardHeight)
//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }

const scrollOptions = {
  rootMargin: '200px',
  threshold: 1.0,
};
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (
      entry.isIntersecting &&
      getPicApi.fetchPhoto.searchQuery !== '' &&
      document.documentElement.getBoundingClientRect().top !== 0
    ) {
      getPicApi.fetchPhoto.page += 1;
      getData();
      // scrollSmoothly();
    }
  });
}, scrollOptions);

observer.observe(document.querySelector('.scroll'));
