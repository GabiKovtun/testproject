import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const inputEl = document.querySelector('input');
const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadBtnEl = document.querySelector('.load-more');

const KEY = '34432303-1108ccb7cbd790ba6a27ea587';
const instance = axios.create({
  baseURL: 'https://pixabay.com/api',
});
let name;
let page = 1;
let pages; 

loadBtnEl.style.display = 'none';

async function getPicture() {
  try {
      const {data} = await instance.get(
      `/?key=${KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );
    pages = data.totalHits / 40;
    return data;
      
  } catch (error) {
    console.log(error);
  }
}

searchFormEl.addEventListener('submit', onSearch);

function onSearch(event) {
  event.preventDefault();
  galleryEl.innerHTML = '';
  name = inputEl.value.trim();
  page = 1;

  if (name !== ''){
    page = 1;
    addPictures();
      } else {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function renderPicture(array) {
      const markup = array
    .map(item => {
      return `
    <a class = "gallery__item" href="${item.largeImageURL}" target="_blank"  rel="noopener">
      <div class="photo-card">
        <div class="image-box">
          <img  class="gallery__image" src="${item.webformatURL}" alt="${item.tags}"  loading="lazy"  />
        </div>
        <div class="info">
          <p class="info-item">
            <b>Likes:</b> ${item.likes}
          </p>
          <p class="info-item">
            <b>Views:</b>  ${item.views}
          </p>
          <p class="info-item">
            <b>Comments: </b> ${item.comments}
          </p>
          <p class="info-item">
            <b>Downloads:</b> ${item.downloads}
          </p>
        </div>
      </div>
    </a>`;
    })
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
  download: false,
});

async function addPictures() {
   const pictureInfo = await getPicture();
   if (pictureInfo.hits.length !== 0) {
    renderPicture(pictureInfo.hits);
  console.log(pictureInfo.hits);
  loadBtnEl.style.display = 'block';
   } else {
    return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
   }
  
} 

loadBtnEl.addEventListener('click', onLoad)

function onLoad() {
  
  if (page < pages){
    page ++;
    addPictures()}
    else{
      loadBtnEl.style.display = 'none';
      return Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
          }
  }
  