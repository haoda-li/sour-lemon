let pageNumberOfPopularMovies = 1;
let pageNumberOfRelativeMovies = 1;
const pageSize = 20;
const loadMoviesButton = document.querySelector('#load_more_movies');
const searchResultTab = document.querySelector('#search-result');
const popularMoviesTab = document.querySelector('#now-playing');
const moviePanel = document.querySelector('#movies')
const resultPanel = document.querySelector('#result')
loadMoviesButton.addEventListener('click', refreshSearchPage);
function requestMovies(page){
    let activedPanel = moviePanel;
    const titleOrId = document.querySelector('#mid').innerText;
    let pancelChecker = 0;
    let url;
    if(page==0){
        if(titleOrId == "popular"){
            return;
        }
        url = '/api/movies/search/movies/?pageNumber='+pageNumberOfRelativeMovies+"&pageSize="+pageSize +"&titleOrId="+titleOrId;
        activedPanel = resultPanel;
        pancelChecker = 0;
        // console.log("searchResultTab is active");
    }else if(page==1){
        url = '/api/movies/popular/movies/?pageNumber='+pageNumberOfPopularMovies+"&pageSize="+pageSize;
        activedPanel = moviePanel;
        pancelChecker = 1;
        // console.log("popularMoviesTab is active");
    }
    fetch(url)
        .then((res) => { 
            if (res.status === 200) {
            return res.json() 
        } else {
            alert('Could not get search page')
        }                
        })
        .then((json) => {
            if(json.movies.length == 0){
                return;
            }
            json.movies.map((m) => {
                anchor = document.createElement('a')
                anchor.className = "movie-card"
                anchor.href="/movie/" + m.id
                let movieTitle = m.title;
                if(movieTitle.length > 30){
                    movieTitle = movieTitle.substring(0,30);
                    movieTitle += "...";
                }
                anchor.innerHTML = `<div class="movie-card-image"><svg><image xlink:href="https://image.tmdb.org/t/p/w500${m.posterPath}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"></image></svg></div><div class="movie-card-bottom"><span>${movieTitle}</span><br><span class="movie-acidity">${m.stars*20}%sour</span></div>`
                activedPanel.appendChild(anchor)
            })
            if(pancelChecker==0){
                pageNumberOfRelativeMovies ++;
            }else{
                pageNumberOfPopularMovies ++;
            }
        })
        .catch((error) => {
            console.log(error)
        })
}
function refreshSearchPage(){
    // console.log("clicked")
    if(searchResultTab.classList.contains("is-active")){
        requestMovies(0);
    }else if(popularMoviesTab.classList.contains("is-active")){
        requestMovies(1);
    }
}
requestMovies(0);
requestMovies(1);