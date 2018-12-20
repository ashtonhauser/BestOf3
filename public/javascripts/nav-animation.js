function openSlideMenu(){
  document.getElementById('side-menu').style.width = '250px';
  document.getElementById('nav').style.marginLeft = '190px';
  document.getElementById('hamburger').style.visibility = 'hidden';
}

function closeSlideMenu(){
  document.getElementById('side-menu').style.width = '0';
  document.getElementById('nav').style.marginLeft = '0';
  document.getElementById('hamburger').style.visibility = 'visible';
}
