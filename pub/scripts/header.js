const mdlLayoutHeader = document.querySelector('.mdl-layout__header');
mdlLayoutHeader.innerHTML= ` <div class="mdl-layout__header-row black_back">
<!-- Add spacer, to align navigation to the right -->
<a href="/index">
    <img src="/pub/assets/logo.png" class="header-logo">
    <img src="/pub/assets/logo_text_line.png" class="header-logo">
</a>
<div class="mdl-layout-spacer"></div>
<!-- Navigation -->
<nav class="mdl-navigation">
    <div class="mdl-textfield mdl-js-textfield">
        <input class="mdl-textfield__input white white" type="text" id="search_input" placeholder="Search Movie title or ID">
        <label class="mdl-textfield__label" for="search_input"></label>
    </div>
    <button class="mdl-navigation__link yellow_icon" id="nav_search_button">
        <i class="material-icons yellow">search</i>
    </button>
    <a class="mdl-navigation__link yellow_icon" href="/popular">
        <i class="material-icons yellow">whatshot</i>
    </a>
    <a class="mdl-navigation__link yellow_icon" href="/signin">
        <i class="material-icons yellow">person_outline</i>
    </a>
    <div id="demo-toast-example" class="mdl-js-snackbar mdl-snackbar">
        <div class="mdl-snackbar__text"></div>
        <button class="mdl-snackbar__action" type="button"></button>
    </div>
</nav>
</div>`
const mdlLayoutDrawer = document.querySelector('.mdl-layout__drawer');
mdlLayoutDrawer.innerHTML = `<span class="mdl-layout__title">
<img src="/pub/assets/logo_text_line.png" class="header-logo"></span>
<nav class="mdl-navigation">
    <div class="mdl-textfield mdl-js-textfield">
        <input class="mdl-textfield__input white white" type="text" id="search_input2" placeholder="Search Movie title or ID">
        <label class="mdl-textfield__label" for="search_input"></label>
    </div>
    <a class="mdl-navigation__link" id="drawer_search_button">
        <i class="material-icons yellow">search</i>
        <span class="general_text yellow">Search</span>
    </a>
    <a class="mdl-navigation__link" href="/popular">
        <i class="material-icons yellow">whatshot</i>
        <span class="general_text yellow">Now playing...</span>
    </a>
    <a class="mdl-navigation__link" href="/signin">
        <i class="material-icons yellow">person_outline</i>
        <span class="general_text yellow">User Profile</span>
    </a>
</nav>`;


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