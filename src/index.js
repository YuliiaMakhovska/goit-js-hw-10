import './css/styles.css';
import { fetchCountries } from '../src/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import markup from '../src/templates/markup.hbs';

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

inputEl.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(e) {
  e.preventDefault();
  const inputValue = e.target.value.trim();
  if (!inputValue) {
    listEl.innerHTML = '';
    infoEl.innerHTML = '';
    return;
  }

  fetchCountries(inputValue)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      renderMarkup(data);
    })
    .catch(err => {
      listEl.innerHTML = '';
      infoEl.innerHTML = '';
      Notify.failure('Oops, there is no country with that name');
    });
}

const renderMarkup = data => {
  if (data.length === 1) {
    listEl.innerHTML = '';
    const markupInfo = markup(data);
    infoEl.innerHTML = markupInfo;
  } else {
    infoEl.innerHTML = '';
    const markupList = renderListMarkup(data);
    listEl.innerHTML = markupList;
  }
};

const renderListMarkup = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.svg}" alt="${name.official}" width="100" height="60">${name.official}</li>`
    )
    .join('');
};
// function renderCountries(arr) {
//   return arr.map(
//     ({ name, capital, population, flags, languages }) => `
//     <h1><img src = "${flags.svg}" alt="flag" width="60" heigth ="32"/></h1>
//   <h2>Country name:${name.common}</h2>
//   <h3>Capital: ${capital}</h3>
//   <p>Population: ${population}</p>
//   <p>Languages: ${Object.values(languages)}</p>`
//   );
// }
