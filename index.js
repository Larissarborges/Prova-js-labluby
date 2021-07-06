(function (document) {
  'use strict';

  // State
  var url = 'games.json';
  var selectedNumbers = {
    "Lotofácil": [],
    "Mega-Sena": [],
    "Quina": []
  }
  var colors = {
    "Lotofácil": '',
    "Mega-Sena": '',
    "Quina": ''
  }
  var cart = {
    items: [],
    total: 0
  };
  var currentGame = '';
  var total = [];

  // DOM References
  var $divWithBetTypesButtons = document.querySelectorAll('[data-js="betTypesButtons"]');
  var $betTypesButtons = $divWithBetTypesButtons[0].children;
  var $arrayBetTypesButtons = [...$betTypesButtons];
  var $gameName = document.querySelector('[data-js="game-title"]');
  var $gameDescription = document.querySelector('[data-js="game-description"]');
  var $gameArea = document.querySelector('[data-js="game-area"]');
  var $buttonCart = document.querySelector('[data-js="button-cart"]');
  var $gameTotal = document.querySelector('[data-js="game-total"]');
  var $alertMsg = document.querySelector('[data-js="alert-message"]');
  var $clearButton = document.querySelector('[data-js="clear-button"]');
  var $completeButton = document.querySelector('[data-js="complete-button"]');

  // Functions
  const updateTotal = () => {
    var finalPrice = cart.items.reduce((acc, item) => {
      return acc + item.price
    }, 0)
    $gameTotal.innerHTML = `R$ ${finalPrice}`;
  }

  const onAddItemCart = ({ range, gameColor, gamePrice, gameType, maxNumber }, buttonValue) => {
    var $cartGame = document.createElement('div');
    var $cartButtonWrapper = document.createElement('div');
    var $cartButton = document.createElement('button');
    var $cartIcon = document.createElement('img');
    var $cartContent = document.createElement('div');
    var $cartNumbers = document.createElement('small');
    var $cartWrapper = document.createElement('div');
    var $cartGameName = document.createElement('p');
    var $cartPrice = document.createElement('p');
    var $gameMessage = document.querySelector('[data-js="game-message"]');
    var $cartGrid = document.querySelector('[data-js="cart-grid"]');

    $cartIcon.setAttribute('src', 'assets/trash.svg');
    $cartIcon.setAttribute('alt', 'Imagem de lixeira');
    $cartButton.appendChild($cartIcon);
    $cartButtonWrapper.classList.add('BetCard__cart-buttonWrapper');
    $cartButtonWrapper.appendChild($cartButton);
    $cartButtonWrapper.style.borderRight = `4px solid ${gameColor}`
    $cartGame.appendChild($cartButtonWrapper);
    $cartGame.classList.add('BetCard__cart-game');

    $cartWrapper.classList.add('BetCard__cart-info');
    $cartNumbers.classList.add('BetCard__cart-numbers');
    $cartGameName.style.color = gameColor;
    $cartNumbers.innerHTML = selectedNumbers[buttonValue];
    $cartGameName.innerHTML = gameType;
    $cartPrice.innerHTML = `R$ ${gamePrice}`;
    $cartWrapper.appendChild($cartGameName);
    $cartWrapper.appendChild($cartPrice);
    $cartContent.appendChild($cartNumbers);
    $cartContent.appendChild($cartWrapper);
    $cartContent.classList.add('BetCard__cart-content');
    $cartGame.appendChild($cartContent);
    if ($gameMessage) {
      $cartGrid.removeChild($gameMessage);
    }
    $cartGrid.appendChild($cartGame);

    var itemId = Date.now();
    cart.items.push({
      id: itemId,
      price: gamePrice,
      numbers: selectedNumbers[buttonValue]
    })

    $cartButton.onclick = function (e) {
      cart.items = cart.items.filter(item => item.id != itemId);
      $cartGrid.removeChild($cartGame);
      if (cart.items.length === 0) {
        $cartGrid.appendChild($gameMessage);
      }
      updateTotal();
    }
    updateTotal();
  }

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
      currentGame = button.value;
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
          colors[button.name] = gameColor;
          var gamePrice = result[0].price;
          var gameType = result[0].type;
          var maxNumber = result[0].maxNumber;

          $arrayBetTypesButtons.forEach((btn) => {
            btn.classList.remove('active')
          })

          button.classList.toggle('active')
          $gameArea.insertAdjacentHTML('afterbegin', `<div data-js="game-card">${generateCard(range)}</div>`);

          var $gameButtons = document.querySelectorAll('[data-js="game-buttons"]');

          $gameButtons.forEach((gameButton) => {
            gameButton.onclick = function (e) {
              if (selectedNumbers[button.value].includes(gameButton.value)) {
                selectedNumbers[button.value] = selectedNumbers[button.value].filter(function (item) {
                  return item !== gameButton.value
                })
              } else {
                selectedNumbers[button.value].push(gameButton.value);
              }
              gameButton.classList.toggle('selected')
              gameButton.classList.contains('selected')
                ? gameButton.style.background = gameColor
                : gameButton.style.background = '#ADC0C4';
            }

            if (selectedNumbers[button.value].includes(gameButton.value)) {
              gameButton.classList.toggle('selected')
              gameButton.classList.contains('selected')
                ? gameButton.style.background = gameColor
                : gameButton.style.background = '#ADC0C4';
            }
          })

          $buttonCart.onclick = function (e) {
            const item = {
              range, gameColor, gamePrice, gameType, maxNumber
            };
            if (selectedNumbers[button.value].length === maxNumber) {
              $alertMsg.innerHTML = '';
              onAddItemCart(item, button.value);
            } else {
              $alertMsg.innerHTML = `Selecione ${maxNumber} números`
            }
          }

          $clearButton.onclick = function (e) {
            selectedNumbers[button.value] = [];
            $gameButtons.forEach((gameButton) => {
              gameButton.classList.remove('selected')
              gameButton.classList.contains('selected')
                ? gameButton.style.background = gameColor
                : gameButton.style.background = '#ADC0C4';
            })

          }

          $completeButton.onclick = function (e) {
            var randomArray = [];
            while (randomArray.length < maxNumber) {
              var random = (Math.floor(Math.random() * range) + 1).toString();
              if (randomArray.indexOf(random) === -1) randomArray.push(random);
            }
            selectedNumbers[button.value] = randomArray;
            $gameButtons.forEach((gameButton) => {
              if (selectedNumbers[button.value].includes(gameButton.value)) {
                gameButton.classList.add('selected')
              } else {
                gameButton.classList.remove('selected')
              }
              gameButton.classList.contains('selected')
                ? gameButton.style.background = gameColor
                : gameButton.style.background = '#ADC0C4';
            })
          }
        })
    }
  })

})(document);