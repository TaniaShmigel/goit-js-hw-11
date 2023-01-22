import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchApi from './fetchApi';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  button: document.querySelector('.load-more'),
};

let page = 1;
let name = '';
let response = {};

const gallery = new SimpleLightbox('.gallery a');

refs.form.addEventListener('submit', onSearch);
refs.button.addEventListener('click', onBtnLoad);

async function onSearch(e) {
  e.preventDefault();
  name = e.currentTarget.elements.searchQuery.value.trim();

  refs.gallery.innerHTML = '';
  refs.button.classList.add('hidden');
  page = 1;

  try {
    response = await fetchApi(page, name);
    if (response.data.hits.length === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (response.data.hits.length < 40) {
      createCard(response.data.hits);
      return;
    }
    refs.button.classList.remove('hidden');
    createCard(response.data.hits);
  } catch (error) {
    return Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  console.log(response);
}

function createCard(array) {
  const markupCard = array
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        views,
        likes,
        comments,
        downloads,
      }) => `<a class="gallery__item" href="${largeImageURL}"> <div class="photo-card">
    <img class="foto" src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
  </div>
  </a>`
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markupCard);

  if (page === 1) {
    Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
  }

  gallery.refresh();
}

async function onBtnLoad() {
  page += 1;

  try {
    response = await fetchApi(page, name);
    if (response.data.hits.length === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    createCard(response.data.hits);

    const { height: cardHeight } =
      gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    return Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
