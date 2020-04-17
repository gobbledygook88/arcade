(function() {

  let userId

  const makeid = (length) => {
    let result = ""
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const charactersLength = characters.length
    for(let i = 0; i < length; ++i) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result;
  }

  userId = window.localStorage.getItem("userId") || makeid(5)
  window.localStorage.setItem("userId", userId)

  async function postData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    })
    return response.json()
  }

  const checkAllChecked = (els) => {
    let allChecked = true;
    for(let i = 0; i < els.length; i++) {
      allChecked = allChecked && els[i].checked
    }
    return allChecked
  }

  const createCheckbox = () => {
    const input = document.createElement("input")
    input.type = "checkbox"
    input.checked = false

    return input
  }

  const setupGame = (selector, numCheckboxes, numToAdd, round = 1) => {
    const container = document.querySelector(`.${selector} .boxes`)
    const checkboxes = document.querySelectorAll(`.${selector} input`)
    let startTime

    checkboxes.forEach((el) => container.removeChild(el))

    const listener = () => {
      if(!startTime) {
        startTime = Date.now()
      }

      const checkboxes = document.querySelectorAll(`.${selector} input`) 
      const allChecked = checkAllChecked(checkboxes)

      if(allChecked) {
        const statistics = {
          userId,
          game: selector,
          round,
          n: checkboxes.length,
          duration: Date.now() - startTime,
        }
        console.log(statistics)
        postData('/statistics', statistics)
        
        setupGame(selector, numToAdd(numCheckboxes, round), numToAdd, ++round)
      }
    }

    for(let i = 0; i < numCheckboxes; ++i) {
      const checkbox = createCheckbox()
      checkbox.addEventListener("click", listener)
      container.appendChild(checkbox)
    }
  }

  // Game 1
  document.querySelector(".game_1 input").addEventListener("click", (e) => {
    const startTime = Date.now()
    if(e.target.checked) {
      const statistics = {
        userId,
        game: "game_1",
        round: 1,
        n: 1,
        duration: Date.now() - startTime,
      }
      console.log(statistics)
      postData('/statistics', statistics)
    }
  })

  // Game 2
  setupGame("game_2", 1, (k) => k + 1)

  // Game 3
  setupGame("game_3", 1, (k) => k + 3)

  // Game 4
  setupGame("game_4", 1, (_, r) => (r + 1) ** 2)

  // Game 5
  setupGame("game_5", 1, (k) => k + k)
})();
