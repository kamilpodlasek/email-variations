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
  })
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get({ email: 'CHANGE_ME@email.com' }, data => {
    getEmailInput().value = data.email
  })

  getUpdateButton().addEventListener('click', handleSubmit)
})
