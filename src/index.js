import { GetPicApi } from './js/getPicApi';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

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

function makeGalleryPic(searchImages) {
  return searchImages
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => ` 
      <a href="${largeImageURL}">
  <div class="photo-card">
    <img
      src="${webformatURL}"
      alt="${tags}"
      loading="lazy"
      width="280px"
      height="200px"
    />
    <div class="info">
      <p class="info-item">
        <b>Likes:</b>
        <b>${likes}</b>
      </p>
      <p class="info-item">
        <b>Views: </b>
        <b>${views}</b>
      </p>
      <p class="info-item">
        <b>Comments: </b>
        <b>${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads: </b>
        <b>${downloads}</b>
      </p>
    </div>
  </div>
  </a>

`
    )
    .join('');
}

function renderGallery(searchImages) {
  galleryForm.insertAdjacentHTML('beforeend', makeGalleryPic(searchImages));
}

async function getData() {
  try {
    const { hits, totalHits } = await getPicApi.fetchPhoto();
    if (totalHits > 0) {
      Notify.success(`New images loaded`);
      renderGallery(hits);
      lightBox.refresh();
    }
  } catch (error) {
    console.log(error);
    if (error.response.status === 400) {
      Notify.failure(`We're sorry, but you've reached the end of search results.`);
    }
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
      Notify.success(`Founded ${totalHits} images.`);
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
