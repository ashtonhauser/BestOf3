window.onload = function() {

  //progress bar
  anime({
    targets: '.progress',
    width: '75%',
    duration: 1500,
    easing: 'easeInOutQuart'
  })

  anime({
    targets: '.importantStats',
    translateX: '25%'
  })

  anime({
    targets: '.wlcont',
    translateX: '25%'
  })
}
