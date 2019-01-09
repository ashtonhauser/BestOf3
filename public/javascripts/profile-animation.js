window.onload = function() {

  var expPercent;
  if (Number($('#exp').text()) <= 50) {
    expPercent = $('#exp').text() / 50 * 100
  }
  if (Number($('#exp').text()) <= 125) {
    expPercent = ($('#exp').text() - 50) / 75 * 100
  }
  if (Number($('#exp').text()) <= 310) {
    expPercent = ($('#exp').text() - 125) / 185 * 100
  }
  if (Number($('#exp').text()) <= 780) {
    expPercent = ($('#exp').text() - 310) / 470 * 100
  }
  if (Number($('#exp').text()) <= 2000) {
    expPercent = ($('#exp').text() - 780) / 1220 * 100
  }
  if (Number($('#exp').text()) <= 3500) {
    expPercent = ($('#exp').text() - 2000) / 1500 * 100
  }
  if (Number($('#exp').text()) <= 6000) {
    expPercent = ($('#exp').text() - 3500) / 2500 * 100
  }
  if (Number($('#exp').text()) <= 9500) {
    expPercent = ($('#exp').text() - 6000) / 3500 * 100
  }
  if (Number($('#exp').text()) <= 14000) {
    expPercent = ($('#exp').text() - 9500) / 4500 * 100
  }
  if (Number($('#exp').text()) <= 20000) {
    expPercent = ($('#exp').text() - 14000) / 6000 * 100
  }

  //progress bar
  anime({
    targets: '.progress',
    width: expPercent + '%',
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
