import axios from 'axios';

// console.log(axios)

export default async function fetchApi(page, name) {
  const URL = `https://pixabay.com/api/`;
  const API_KEY = `32995657-5d5fba1f78fb808676eb60a6f`;
  const options = `&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`;

  try {
    const response = await axios.get(
      `${URL}?key=${API_KEY}&${options}&page=${page}`
    );
    return response;
  } catch (error) {
    return error;
  }
}
