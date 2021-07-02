(function (document) {
  'use strict';

  var $divWithBetTypesButtons = document.querySelectorAll('[data-js="betTypesButtons"]');
  var $betTypesButtons = $divWithBetTypesButtons[0].children;
  var $arrayBetTypesButtons = [...$betTypesButtons];

  var $gameName = document.querySelector('[data-js="game-title"]');
  var $gameDescription = document.querySelector('[data-js="game-description"]');
  var $gameArea = document.querySelector('[data-js="game-area"]');

  var url = 'games.json';

  function generateCard(range) {
    var numbersAmount = [];
    for (var i = 1; i <= range; i++) {
      numbersAmount.push(i);
    }
    var card = numbersAmount.reduce((acc, act) => {
      return acc + `<button value=${act} class="game-button" data-js="game-buttons">${act}</button>`
    }, '')
    return card;
  }

  $arrayBetTypesButtons.forEach((button) => {
    button.onclick = function (e) {
      var $gameCard = document.querySelector('[data-js="game-card"]');
      if ($gameCard) {
        $gameArea.removeChild($gameCard);
      }
      fetch(url)
        .then(resp => resp.json())
        .then(data => {
          var betTypes = data.types;
          var result = betTypes.filter((bet) => {
            return bet.type === button.value;
          })
          $gameName.innerHTML = result[0].type;
          $gameDescription.innerHTML = result[0].description;
          var range = result[0].range;
          var gameColor = result[0].color;
          $gameArea.insertAdjacentHTML('afterbegin', `<div data-js="game-card">${generateCard(range)}</div>`);

          var $gameButtons = document.querySelectorAll('[data-js="game-buttons"]')
          var buttonsArray = [];
          $gameButtons.forEach((button) => {
            button.onclick = function (e) {
              if (buttonsArray.some(button.value)) {
                return
              }
              buttonsArray.push(button.value);
              console.log(buttonsArray);

              button.classList.toggle('selected')
              button.classList.contains('selected')
                ? button.style.background = gameColor
                : button.style.background = '#ADC0C4';
            }
          })
        })
    }
  })

})(document);

// if (button.classList.contains('lotofacil')) {
//   button.classList.toggle('lotofacil-active')
// }
// if (button.classList.contains('megasena')) {
//   button.classList.toggle('megasena-active')
// }
// if (button.classList.contains('lotomania')) {
//   button.classList.toggle('lotomania-active')
// }