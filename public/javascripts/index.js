// $(document).ready(function(){
//   $('.single').slick({
//     slidesToShow: 3,
//     slidesToScroll: 3
//   })
//   $('.local').slick({
//     slidesToShow: 3,
//     slidesToScroll: 3
//   })
//   $('.online').slick({
//     slidesToShow: 3,
//     slidesToScroll: 3,
//     arrows: false
//   })
// });

$(document).ready(function(){
  $('.single').slick({
  })
  $('.local').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    infinite: true,
    cssEase: 'linear',
    arrows: true
  })
  $('.online').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
  })
});