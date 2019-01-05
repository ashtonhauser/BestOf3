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
});