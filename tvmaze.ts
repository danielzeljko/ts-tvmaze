import axios from "axios";
import * as $ from 'jquery';
import { ShowInterface, EpisodesInterface } from "./interfaces";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const MISSING_IMG_URL = "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300"
const BASE_URL = "http://api.tvmaze.com"

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */
// return the resp.data.shows -> {id, img...}
async function getShowsByTerm(term: string): Promise<ShowInterface[]> {
  const response = await axios.get(`${BASE_URL}/search/shows?q=${term}`);
  const shows = response.data.map((show:{show:object}) => show.show)
  return shows;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows: ShowInterface[]): void {
  $showsList.empty();

  for (const show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image?.medium || MISSING_IMG_URL}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button data-show-id=${show.id} class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay(): Promise<void> {
  const term = $("#searchForm-term").val() as string;
  const shows = await getShowsByTerm(term);
  $episodesArea.hide();
  populateShows(shows);
}

/** Handle fetching episodes: get episodes from API and display */
$searchForm.on("submit", async function (evt): Promise<void> {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

$showsList.on("click", "button", async function (evt): Promise<void> {
  const episodes = await getEpisodesOfShow(evt.target.dataset.showId)
  $episodesArea.show();
  populateEpisodes(episodes);
})

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id: number): Promise<EpisodesInterface[]>  {
  const response = await axios.get(`${BASE_URL}/shows/${id}/episodes`);
  return response.data;
}

/** Given an array of objects representing episode data, creates list elements for
 * each episode and appends to episodesArea
 */

function populateEpisodes(episodes: EpisodesInterface[]): void {
  $episodesArea.empty();

  for (const episode of episodes) {
    const $show = $(
      `<li>${episode.name} (Season ${episode.season}, Episode ${episode.number})</li>`);

    $episodesArea.append($show);
  }
}
