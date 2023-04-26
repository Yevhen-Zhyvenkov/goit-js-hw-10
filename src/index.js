import './css/styles.css';
import debounce from 'lodash.debounce';
import notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const createCountryListMarkup = (countries) => {
  return countries
    .map((country) => {
      const flagUrl = country.flags.svg;
      const name = country.name;
      return `
        <li class ="country-item">
          <img src="${flagUrl}" alt="${name} flag" width="50" height="50">
          <h2>${name}<h2>
        </li>
      `;
    })
    .join('');
};

const createCountryInfoMarkup = (country) => {
  const flagUrl = country.flags.svg;
  return `
    <div>
      <img src="${flagUrl}" alt="${country.name}  width="50" height="50" flag">
      <h2>${country.name}</h2>
      <p><strong>Capital:</strong> ${country.capital}</p>
      <p><strong>Population:</strong> ${country.population}</p>
      <p><strong>Languages:</strong> ${country.languages.map((language) => language.name).join(', ')}</p>
    </div>
  `;
};

const clearMarkup = (element) => {
  element.innerHTML = '';
};
const handleSearch = debounce((event) => {
  const searchQuery = event.target.value.trim();
  if (searchQuery) {
    fetchCountries(searchQuery)
      .then((countries) => {
        clearMarkup(countryList);
        clearMarkup(countryInfo);
        if (countries.length > 10) {
          notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        } else if (countries.length >= 2 && countries.length <= 10) {
          countryList.innerHTML = createCountryListMarkup(countries);
        } else if (countries.length === 1) {
          countryInfo.innerHTML = createCountryInfoMarkup(countries[0]);
        } else {
          notiflix.Notify.failure('No matches found.');
        }
      })
      .catch((error) => {
        error = 'Oops, there is no country with that name';
        notiflix.Notify.failure(error);
      });
  } else {
    clearMarkup(countryList);
    clearMarkup(countryInfo);
  }
}, DEBOUNCE_DELAY);
searchBox.addEventListener('input', handleSearch);

