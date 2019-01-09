if ($('div.form').is(':visible')) {
  document.getElementById("signup").onclick = function () {
    location.href = "http://localhost:3000/user/register";
  };

  var current = null;
  document.querySelector('#email').addEventListener('focus', function(e) {
    if (current) current.pause();
    current = anime({
      targets: 'path',
      strokeDashoffset: {
        value: 0,
        duration: 700,
        easing: 'easeOutQuart'
      },
      strokeDasharray: {
        value: '240 1386',
        duration: 700,
        easing: 'easeOutQuart'
      }
    });
  });
  document.querySelector('#password').addEventListener('focus', function(e) {
    if (current) current.pause();
    current = anime({
      targets: 'path',
      strokeDashoffset: {
        value: -336,
        duration: 700,
        easing: 'easeOutQuart'
      },
      strokeDasharray: {
        value: '240 1386',
        duration: 700,
        easing: 'easeOutQuart'
      }
    });
  });
  document.querySelector('#submit').addEventListener('focus', function(e) {
    if (current) current.pause();
    current = anime({
      targets: 'path',
      strokeDashoffset: {
        value: -730,
        duration: 700,
        easing: 'easeOutQuart'
      },
      strokeDasharray: {
        value: '530 1386',
        duration: 700,
        easing: 'easeOutQuart'
      }
    });
  });
}

$(document).ready(function(){
  $('.single').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    infinite: true,
    arrows: true,
    nextArrow: '<i class="next fas fa-arrow-alt-circle-right"></i>',
    prevArrow: '<i class="prev fas fa-arrow-alt-circle-left"></i>',
  })
  $('.local').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    infinite: true,
    arrows: true,
    nextArrow: '<i class="next fas fa-arrow-alt-circle-right"></i>',
    prevArrow: '<i class="prev fas fa-arrow-alt-circle-left"></i>',
  })
  $('.online').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    infinite: true,
    arrows: true,
    nextArrow: '<i class="next fas fa-arrow-alt-circle-right"></i>',
    prevArrow: '<i class="prev fas fa-arrow-alt-circle-left"></i>',
  })
  var expPercent;
  if (Number($('#exp').text()) <= 50) {
    expPercent = Number($('#exp').text()) / 50 * 100;
  } else if (Number($('#exp').text()) <= 125) {
    expPercent = (Number($('#exp').text()) - 50) / 75 * 100;
  } else if (Number($('#exp').text()) <= 310) {
    expPercent = (Number($('#exp').text()) - 125) / 185 * 100;
  } else if (Number($('#exp').text()) <= 780) {
    expPercent = (Number($('#exp').text()) - 310) / 470 * 100;
  } else if (Number($('#exp').text()) <= 2000) {
    expPercent = (Number($('#exp').text()) - 780) / 1220 * 100;
  } else if (Number($('#exp').text()) <= 3500) {
    expPercent = (Number($('#exp').text()) - 2000) / 1500 * 100;
  } else if (Number($('#exp').text()) <= 6000) {
    expPercent = (Number($('#exp').text()) - 3500) / 2500 * 100;
  } else if (Number($('#exp').text()) <= 9500) {
    expPercent = (Number($('#exp').text()) - 6000) / 3500 * 100;
  } else if (Number($('#exp').text()) <= 14000) {
    expPercent = (Number($('#exp').text()) - 9500) / 4500 * 100;
  } else if (Number($('#exp').text()) <= 20000) {
    expPercent = (Number($('#exp').text()) - 14000) / 6000 * 100;
  }

  //progress bar
  anime({
    targets: '.progress',
    width: expPercent.toString() + '%',
    duration: 1500,
    easing: 'easeInOutQuart'
  })
});
