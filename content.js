const buttonWidth = 20
const buttonPadding = 5

chrome.storage.sync.get({ email: 'CHANGE_ME@gmail.com' }, ({ email }) => {
  const currentDomain = window.location.hostname.replace(/^www\./i, '')

  const emailInputs = document.querySelectorAll('input[type="email"]')

  for (const emailInput of emailInputs) {
    const inputRect = emailInput.getBoundingClientRect()
    if (!inputRect.width && !inputRect.height) return

    const top = emailInput.offsetTop + buttonPadding
    const left = emailInput.offsetLeft + inputRect.width - buttonWidth - buttonPadding

    const button = document.createElement('div')
    button.style.position = 'absolute'
    button.style.width = `${buttonWidth}px`
    button.style.height = '12px'
    button.style.borderRadius = '12px'
    button.style.backgroundColor = '#F81894'
    button.style.lineHeight = '10px'
    button.style.cursor = 'pointer'
    button.style.color = '#FFFFFF'
    button.style.fontSize = '10px'
    button.style.fontWeight = 'bold'
    button.style.textAlign = 'center'
    button.style.lineHeight = '10px'
    button.textContent = '+@'
    button.style.top = `${top}px`
    button.style.left = `${left}px`

    button.addEventListener('click', () => {
      emailInput.value = email.replace('@', `+${currentDomain}@`)
    })

    emailInput.insertAdjacentElement('afterend', button)
  }
})
