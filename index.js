(function (document) {
  'use strict';

  var $divWithBetTypesButtons = document.querySelectorAll('[data-js="betTypesButtons"]');
  var $betTypesButtons = $divWithBetTypesButtons[0].children;
  var arrayBetTypesButtons = [...$betTypesButtons];

  arrayBetTypesButtons.forEach((button, index) => {
    button.onclick = function (e) {
      if (button.classList.contains('lotofacil')) {
        button.classList.toggle('lotofacil-active')
      }
      if (button.classList.contains('megasena')) {
        button.classList.toggle('megasena-active')
      }
      if (button.classList.contains('lotomania')) {
        button.classList.toggle('lotomania-active')
      }
    }
  })

})(document);


