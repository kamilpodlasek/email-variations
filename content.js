const buttonClassName = 'email-variations_fill-button'
const buttonWidth = 20
const buttonPadding = 5

// match inputs with type email and inputs with name containing the word "email" (case insensitive)
const isNodeEmailField = node =>
  node.tagName === 'INPUT' && (node.type === 'email' || (node.name && /email/i.test(node.name)))
const emailFieldQuerySelector = 'input[type="email"], input[name*="email" i]'

function generateButton(emailInput) {
  const inputRect = emailInput.getBoundingClientRect()

  const inputIsHidden = !inputRect.width && !inputRect.height
  if (inputIsHidden) return

  const button = document.createElement('div')
  button.className = buttonClassName
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
  button.style.top = emailInput.offsetTop + buttonPadding + 'px'
  button.style.left = emailInput.offsetLeft + inputRect.width - buttonWidth - buttonPadding + 'px'

  return button
}

function handleEmailInputs(emailInputs, options = { forceRerender: false }) {
  chrome.storage.sync.get({ email: 'CHANGE_ME@email.com' }, ({ email }) => {
    const currentDomain = window.location.hostname.replace(/^www\./i, '')

    if (options.forceRerender) {
      const buttons = document.getElementsByClassName(buttonClassName)

      Array.from(buttons).forEach(button => button.remove())
    }

    for (const emailInput of emailInputs) {
      const buttonAlreadyAdded = emailInput.nextSibling?.className === buttonClassName
      if (buttonAlreadyAdded) continue

      const button = generateButton(emailInput)
      if (!button) continue

      button.addEventListener('click', () => {
        // simulate user input by dispatching events, to make it work with contolled inputs
        const inputEvent = new Event('input', { bubbles: true })
        emailInput.value = email.replace('@', `+${currentDomain}@`)
        emailInput.dispatchEvent(inputEvent)
      })

      emailInput.insertAdjacentElement('afterend', button)
    }
  })
}

function traverseNodes(nodeList) {
  for (const node of nodeList) {
    if (isNodeEmailField(node)) {
      handleEmailInputs([node])
    } else if (node.children?.length) {
      traverseNodes(node.children)
    }
  }
}

function observeNewInputs() {
  const observer = new MutationObserver(mutationsList => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const addedNodes = Array.from(mutation.addedNodes)
        traverseNodes(addedNodes)
      }
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
}

const emailInputs = document.querySelectorAll(emailFieldQuerySelector)

// handle existing inputs
handleEmailInputs(emailInputs)

// handle new inputs added to DOM
observeNewInputs()

// handle inputs update when user email is changed in popup.js
chrome.runtime.onMessage.addListener(message => {
  if (message.action === 'handleEmailInputs') {
    handleEmailInputs(emailInputs, { forceRerender: true })
  }
})
