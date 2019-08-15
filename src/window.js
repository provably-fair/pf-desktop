$(() => {

  const index = require('index.js')

  $('#number').bind('input', function() {
    const number = this.value
  })

  $("seedBTN").click(function(){
    index.generateClientSeed();
  })
})
