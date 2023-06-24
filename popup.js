function getEmailInput() {
  return document.getElementById('emailInput')
}

function getUpdateButton() {
  return document.getElementById('updateButton')
}

function handleSubmit(e) {
  e.preventDefault()

  const emailInput = getEmailInput()
  const updateButton = getUpdateButton()
  const updatedEmail = emailInput.value

  updateButton.innerText = 'Update 💤'

  chrome.storage.sync.set({ email: updatedEmail }, () => {
    emailInput.value = updatedEmail

    updateButton.innerText = 'Update ✅'

    // trigger a rerender of the input buttons - they need a new onclick now that the email has changed
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'handleEmailInputs' })
    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get({ email: 'CHANGE_ME@email.com' }, data => {
    getEmailInput().value = data.email
  })

  getUpdateButton().addEventListener('click', handleSubmit)
})
