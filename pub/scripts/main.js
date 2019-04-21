"use restrict"

// global counts
let numberOfMovies = 0; // total number of Movies
let numnerOfPages = 0;
let curPageId = 0; // Index of page which user is now browsing

// global arrays
/** Here movies should be read from database**/
let movies = []
let pages = []

// Page "class"
class Page {
  constructor(position, title, color) {
    this.position = position;
    this.title = title;
    this.pageId = numnerOfPages;
    this.color = color;
    //initialize movieArray
    this.movieArray = [];
    numnerOfPages++;
  }

  addMovie(newMovie) {
    this.movieArray.push(newMovie);
  }

}


// Setting up the Page array
pages.push(new Page('null', 'Starting page', 'null'));

function randomColorGenerator() {
  return "hsl(" + 360 * Math.random() + ',' +
    (25 + 20 * Math.random()) + '%,' +
    (25 + 50 * Math.random()) + '%, 0.6)';
}

function randomPositionGenerator(num) {
  const positionArray = ['left', 'right']
  return positionArray[Math.floor(Math.random() * (positionArray.length))]
}


async function loadMovie(pageNum) {
  if ((pageNum == 0) || (pages.length > pageNum)) {
    addPage(pageNum);
  } else {
    try {
      pages.push(new Page(randomPositionGenerator(pageNum), `BEST OF ${2020-pageNum}: TOP TEN LISTS`, randomColorGenerator()));
      const moviesResponse = await fetch('/api/movies/load_movies/' + pageNum);
      const moviesArray = await moviesResponse.json();
      const tempFunc = async () => {
        for (let i = 0; i < 10; i++) {
          const commentsResponse = await fetch('/api/comments/top/' + moviesArray[i].id);
          const comments = await commentsResponse.json();
          if (comments.comment[0]) {
            moviesArray[i].topComment = comments.comment[0].text
          } else {
            moviesArray[i].topComment = "Waiting for you to comment on this movie! Join sour lemon!"
          }
          pages[pageNum].addMovie(moviesArray[i])
        }
        addPage(pageNum);
      }
      tempFunc();
    } catch (error) {
      console.log(error)
    }
  }
}

function redirectToSearchPage() {
  const title = document.querySelector('#search_input').value;
  window.location.href = "/search/" + title;
}

/* Select all DOM form elements*/
// addPage(1);
const ratingPagesContainer = document.querySelector(".pages-container")
const audio = document.querySelector("#audio")
const anchorAudio = document.querySelector("#anchorAudio")
const anchorAudio2 = document.querySelector("#anchorAudio2")

/*-----------------------------------------------------------*/
/*** Functions that don't edit DOM themselves, but can call DOM functions ***/
window.addEventListener('wheel', scrollUpDown);
anchorAudio.addEventListener('click', playerControl);
anchorAudio2.addEventListener('click', playerControl);
/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/
loadMovie(1);
loadMovie(2);
// Control the music
function playerControl(e) {
  e.preventDefault();
  if (anchorAudio.firstElementChild.innerText == "equalizer") {
    audio.src = '';
    anchorAudio.firstElementChild.innerText = "play_arrow";
    anchorAudio2.firstElementChild.innerText = "play_arrow";
  } else {
    audio.src = './pub/assets/audio.mp4';
    anchorAudio.firstElementChild.innerText = "equalizer";
    anchorAudio2.firstElementChild.innerText = "equalizer";
  }
}

// Detect whether user is scrolling up or down. And let the main page always hold at most 4 sub-pages(div), by remove and add subpages properly
function scrollUpDown(e) {
  //Going Up
  if ((e.deltaY < 0) && (curPageId != 0)) {
    window.removeEventListener('wheel', scrollUpDown)
    if ((curPageId > 0) && (curPageId < 15 - 2)) {
      removePage(curPageId + 2);
    }
    if (curPageId >= 2) {
      loadMovie(curPageId - 2);
    }
    ratingPagesContainer.style = " transition: 0.8s;transition-timing-function: ease-out;transform:translate3d(0px, -" + (curPageId - 1) + "00% , 0px);"
    setTimeout(function() {
      window.addEventListener('wheel', scrollUpDown);
    }, 1200);
    curPageId = curPageId - 1;
  }
  //Going Down
  if ((e.deltaY > 0) && (curPageId != 15 - 1)) {
    window.removeEventListener('wheel', scrollUpDown)
    if (curPageId < 15 - 3) {
      loadMovie(curPageId + 3);
    }
    if ((curPageId > 0) && (curPageId < 15 - 2)) {
      removePage(curPageId - 1);
    }
    ratingPagesContainer.style = " transition: 0.8s;transition-timing-function: ease-out;transform:translate3d(0px, -" + (curPageId + 1) + "00%  , 0px);"
    setTimeout(function() {
      window.addEventListener('wheel', scrollUpDown);
    }, 1200);
    curPageId = curPageId + 1;
  }
}

// This function will remove sub-page from main at certain index
function removePage(index) {
  if(ratingPagesContainer.children[index].children[0]==undefined){
    return;
  }
  ratingPagesContainer.children[index].removeChild(ratingPagesContainer.children[index].children[0])
}


// This function will add a new sub-page at the certain index of main page
function addPage(index) {
  const ratingPageContainer = document.querySelector(".pages-container").children[index];
  const ratingPageWrap = document.createElement('div');
  ratingPageWrap.className = 'rating-page-wrap';
  const pageContentWrap = document.createElement('div');
  pageContentWrap.className = 'page-content-wrap';
  const pageContent = document.createElement('div');
  pageContent.className = 'page-content';
  // Starting page
  if (index == 0) {
    const backgroundImage = document.createElement('div');
    backgroundImage.className = 'background-image';
    backgroundImage.style = "background-image: url('./pub/assets/highlight2.jpg'); opacity: 0.4";

    // Add video
    const fullScreenVideoWrap = document.createElement('div');
    fullScreenVideoWrap.className = 'full-screen-video-wrap';
    const fullScreenVideo = document.createElement('video');
    fullScreenVideo.autoplay = "true";
    fullScreenVideo.loop = "true";
    fullScreenVideo.muted = "true";
    fullScreenVideo.src = "./pub/assets/mp4ieannual2018.mp4";
    fullScreenVideoWrap.appendChild(fullScreenVideo);

    // Add logo
    const logoContainer = document.createElement('div');
    logoContainer.className = 'logo-container';
    logoContainer.classList.add("yellow");
    const lemonLogo = document.createElement('img');
    lemonLogo.className = 'lemon-logo';
    lemonLogo.src = "./pub/assets/logo.png";
    const nameLogo = document.createElement('img');
    nameLogo.className = 'name-logo';
    nameLogo.src = "./pub/assets/logo_text_line.png";
    logoContainer.appendChild(lemonLogo);
    logoContainer.appendChild(nameLogo);

    pageContent.appendChild(backgroundImage);
    pageContent.appendChild(fullScreenVideoWrap);
    pageContent.appendChild(logoContainer);
    pageContentWrap.appendChild(pageContent);
    ratingPageWrap.appendChild(pageContentWrap);
    ratingPageContainer.appendChild(ratingPageWrap);
  } else {
    // Set background Image coresspoding to movie's poster
    const backgroundImage  = document.createElement('div');
    let randomPoster = Math.floor(Math.random() * pages[index].movieArray.length+1);
    backgroundImage.className = 'background-image';
    while(pages[index].movieArray[randomPoster] == undefined){
      randomPoster = Math.floor(Math.random() * pages[index].movieArray.length+1);
    }
    backgroundImage.style = `background-image :url(https://image.tmdb.org/t/p/original${pages[index].movieArray[randomPoster].backdropPath});`;
    pageContent.appendChild(backgroundImage);

    const contentField = document.createElement('div');
    contentField.className = 'content_field';

    const midField = document.createElement('div');
    midField.className = 'mdl-grid mid-field';
    const mdlCellLeft = document.createElement('div');
    mdlCellLeft.className = 'mdl-cell mdl-cell--2-col mdl-cell--hide-tablet mdl-cell--hide-phone';
    midField.appendChild(mdlCellLeft);
    const mdlCellMiddle = document.createElement('div');
    mdlCellMiddle.className = 'mdl-cell mdl-cell--8-col mdl-cell--8-col-phone';

    // Create Card with review and rating
    const mdlCard = document.createElement('div');
    mdlCard.className = 'demo-card-wide mdl-card mdl-shadow--2dp';
    mdlCard.style.backgroundColor = 'rgb(0,0,0,0.5)';
    mdlCard.style.float = pages[index].position;
    const mdlCardTitle = document.createElement('div');
    mdlCardTitle.className = 'mdl-card__title mdl-card--border';
    mdlCardTitle.style.backgroundColor = pages[index].color;
    const mdlCardTitleHeader = document.createElement('h2');
    mdlCardTitleHeader.className = 'mdl-card__title-text';
    mdlCardTitleHeader.innerText = pages[index].title;
    mdlCardTitle.appendChild(mdlCardTitleHeader);
    const mdlCardText = document.createElement('div');
    mdlCardText.className = 'mdl-card__supporting-text';
    const text_map = ["No comment yet", "Not Sour ", "A bit Sour ",
      "Kinda Sour ", "Very Sour ", "Rua, super SOUR "
    ];
    mdlCardText.innerHTML = "<a class='movie-card-image-container' href='/movie/" + pages[index].movieArray[randomPoster].id + "'><svg><image xlink:href=" +
      "https://image.tmdb.org/t/p/w300" + pages[index].movieArray[randomPoster].posterPath + " width='100%' height='100%' preserveAspectRatio='xMidYMid slice'></image>" +
      "</svg></a><h4 id='title' class='index_text'>" + "<span class='bli1r'>Top " + `${randomPoster+1}` + "</span>" + pages[index].movieArray[randomPoster].title + "</h4><p class='index_text yellow'>Release Date" +
      "<span id='release_date' class='index_text white'>" + pages[index].movieArray[randomPoster].releaseDate + "</span></p><div id='sour_rate'>" +
      "<span class='yellow index_text'>" + text_map[pages[index].movieArray[randomPoster].stars] + "</span></div>"
    for (let i = 1; i <= pages[index].movieArray[randomPoster].stars; i++) {
      mdlCardText.innerHTML += "<img src='./pub/assets/lemon.png' class='lemon_icon'>";
    }
    mdlCardText.innerHTML += "</div>"

    const mdlCardactions = document.createElement('div');
    mdlCardactions.className = 'mdl-card__actions mdl-card--border';
    mdlCardactions.innerHTML = '<span class="review">' + pages[index].movieArray[randomPoster].topComment + '</span><br>'
    mdlCard.appendChild(mdlCardTitle);
    mdlCard.appendChild(mdlCardText);
    mdlCard.appendChild(mdlCardactions);
    mdlCellMiddle.appendChild(mdlCard);
    midField.appendChild(mdlCellMiddle);
    const mdlCellRight = document.createElement('div');
    mdlCellRight.className = 'mdl-cell mdl-cell--2-col mdl-cell--hide-tablet mdl-cell--hide-phone';
    midField.appendChild(mdlCellRight);

    // Create Movie list
    const bottomField = document.createElement('div');
    bottomField.className = 'mdl-grid bottom-field';
    const bottomCellLeft = document.createElement('div');
    bottomCellLeft.className = 'mdl-cell mdl-cell--1-col mdl-cell--hide-tablet mdl-cell--hide-phone';
    const bottomCellLeft2 = document.createElement('div');
    bottomCellLeft2.className = 'mdl-cell mdl-cell--1-col mdl-cell--1-col-phone';
    const bottomCellMiddle = document.createElement('div');
    bottomCellMiddle.className = 'mdl-cell mdl-cell--8-col mdl-cell--8-col-phone image-cards';

    pages[index].movieArray.forEach((element, index) => {
      if (index != randomPoster) {
        const movieCard = document.createElement('a');
        let movieTitle = element.title;
        if(movieTitle.length>20){
          movieTitle = movieTitle.substring(0,20);
          movieTitle += "...";
        }
        movieCard.href = "/movie/" + element.id;
        movieCard.className = "movie-card";
        movieCard.innerHTML = '<div class="rating"><span>'+ (index+1) +'</span></div>'
                              +'<div class="movie-card-image"><svg><image xlink:href='
                              +"https://image.tmdb.org/t/p/w300"+ element.posterPath +' width="100%" height="100%" preserveAspectRatio="xMidYMid slice"></image></svg></div>'
                              +'<div class="movie-card-bottom"><span>'+ movieTitle + '</span><span class="movie-acidity">'+(element.stars*20)+'%sour</span></div>';
        bottomCellMiddle.appendChild(movieCard);
      }
    });
    // for (i = 1; i < pages[index].movieArray.length; i++) {
    //     const movieCard = document.createElement('a');
    //     movieCard.href = "/movie/"+pages[index].movieArray[i].id;
    //     movieCard.className = "movie-card";
    //     movieCard.innerHTML = '<div class="rating"><span>'+ (i+1) +'</span></div>'
    //                           +'<div class="movie-card-image"><svg><image xlink:href='
    //                           +"https://image.tmdb.org/t/p/w300"+ pages[index].movieArray[i].posterPath +' width="100%" height="100%" preserveAspectRatio="xMidYMid slice"></image></svg></div>'
    //                           +'<div class="movie-card-bottom"><span>'+ pages[index].movieArray[i].title + '</span><span class="movie-acidity">'+pages[index].movieArray[i].stars+'%sour</span></div>';
    //     bottomCellMiddle.appendChild(movieCard);
    // }
    const bottomCellRight = document.createElement('div');
    bottomCellRight.className = 'mdl-cell mdl-cell--1-col mdl-cell--1-col-phone';
    const bottomCellRight2 = document.createElement('div');
    bottomCellRight2.className = 'mdl-cell mdl-cell--1-col mdl-cell--hide-tablet mdl-cell--hide-phone';
    bottomField.appendChild(bottomCellLeft);
    bottomField.appendChild(bottomCellLeft2);
    bottomField.appendChild(bottomCellMiddle);
    bottomField.appendChild(bottomCellRight);
    bottomField.appendChild(bottomCellRight2);
    contentField.appendChild(midField);
    contentField.appendChild(bottomField);
    pageContentWrap.appendChild(pageContent);
    pageContentWrap.appendChild(contentField);
    ratingPageWrap.appendChild(pageContentWrap);
    ratingPageContainer.appendChild(ratingPageWrap);
  }
}

(function() {
  'use strict';
  var snackbarContainer = document.querySelector('#demo-toast-example');
  var navSearchButton = document.querySelector('#nav_search_button');
  var drawerSearchButton = document.querySelector('#drawer_search_button');
  navSearchButton.addEventListener('click', function() {
    'use strict';
    const title = document.querySelector('#search_input').value;
    if (title.includes('/') || title ==""){
      var data = {message: 'Invalid input. Please tap in movie ID or title.'};
      snackbarContainer.MaterialSnackbar.showSnackbar(data);
    }else{
      window.location.href = "/search/"+title;
    }
  });
  drawerSearchButton.addEventListener('click', function() {
      'use strict';
      const title = document.querySelector('#search_input2').value;
      if (title.includes('/') || title ==""){
        var data = {message: 'Invalid input. Please tap in movie ID or title.'};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
      }else{
        window.location.href = "/search/"+title;
      }
    });
}());