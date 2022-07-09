export default function makeGalleryPic(searchImages) {
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