function openSlideMenu(){
  document.getElementById('side-menu').style.width = '250px';
  document.getElementById('actual-body').style.marginLeft = '250px';
  document.getElementById('hamburger').style.visibility = 'hidden';
}

function closeSlideMenu(){
  document.getElementById('side-menu').style.width = '0';
  document.getElementById('actual-body').style.marginLeft = '0';
  document.getElementById('hamburger').style.visibility = 'visible';
}


