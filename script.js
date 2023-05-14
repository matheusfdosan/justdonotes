let data = []

function showNotes() {
  data.forEach((element) => {
    const card = `
    <div class="card" data-title="${element.title}" title="${element.title}">
      <div class="content">
        <h1>${element.title}</h1>
        <textarea disable>${element.note}</textarea>
      </div>
      <div class="options">
        <img src="assets/trash.svg" alt="delete" class="delete-note" title="Delete note" />
      </div>
    </div>
    `

    document
      .querySelector(".main-container .container")
      .insertAdjacentHTML("afterbegin", card)
  })
}

if (JSON.parse(localStorage.getItem("data"))) {
  data = JSON.parse(localStorage.getItem("data"))
  showNotes()
}

document
  .querySelector(".create-note-button")
  .addEventListener("click", createNote)

const modal = document.querySelector(".modal")

function createNote() {
  modal.classList.add("active")
  document.body.style.overflow = "hidden"
}

const title = document.querySelector(".title")
const note = document.querySelector(".notes")

document.querySelector(".add-note").addEventListener("click", () => {
  if (title.value.length === 0 && note.value.length === 0) {
    modal.classList.remove("active")
    document.body.style.overflow = "initial"
    return
  }

  modal.classList.remove("active")
  document.body.style.overflow = "initial"

  function Note(title, note) {
    this.title = title
    this.note = note
  }

  data.push(new Note(title.value, note.value))

  localStorage.setItem("data", JSON.stringify(data))

  document.querySelector(".main-container .container").innerHTML = ""

  showNotes()

  title.value = ""
  note.value = ""

  window.location.reload()
})

document.querySelector(".delete").addEventListener("click", deleteInfo)
function deleteInfo() {
  modal.classList.remove("active")
  document.body.style.overflow = "initial"
  title.value = ""
  note.value = ""
}

const allCards = document.querySelectorAll(".card")
allCards.forEach((card) => {
  card.addEventListener("click", optionCard)
})

function optionCard(event) {
  if (event.target.classList.contains("delete-note")) {
    const card = event.target.parentElement.parentElement
    const noteIndex = data.findIndex((note) => note.title === card.title)

    if (noteIndex !== -1) {
      data.splice(noteIndex, 1)
      localStorage.setItem("data", JSON.stringify(data))
    }

    card.remove()
    return
  }

  if (event.target.parentElement.className == "content") {
    path = event.target.parentElement.parentElement
    editAndClose(path)
  } else if (event.target.className == "content") {
    path = event.target.parentElement
    editAndClose(path)
  } else if (event.target.className == "card") {
    path = event.target
    editAndClose(path)
  }

  function editAndClose(path) {
    modal.classList.add("active")
    document.body.style.overflow = "hidden"
    const card = path

    const noteIndex = data.findIndex((note) => note.title === card.title)

    document.querySelector(".title").value = data[noteIndex].title
    document.querySelector(".notes").value = data[noteIndex].note

    const addNote = document.querySelector(".add-note")
    addNote.remove()

    const closeButton = document.querySelector(".delete")
    closeButton.textContent = "Close"

    const saveButton = document.createElement("button")
    saveButton.textContent = "Save"
    saveButton.className = "save"

    const options = document.querySelector(".modal-overlay .options")
    options.insertAdjacentElement("afterbegin", saveButton)

    const addNoteButton = document.createElement("button")
    addNoteButton.textContent = "Add note"
    addNoteButton.className = "add-note"

    closeButton.addEventListener("click", () => {
      closeButton.textContent = "Delete"
      saveButton.remove()

      options.insertAdjacentElement("afterbegin", saveButton)
      window.location.reload()
    })

    saveButton.addEventListener("click", () => {
      const title = document.querySelector(".title").value
      const note = document.querySelector(".notes").value

      modal.classList.remove("active")
      document.body.style.overflow = "initial"

      if (title === data[noteIndex].title && note === data[noteIndex].note) {
        return
      }

      data[noteIndex].title = title
      data[noteIndex].note = note

      closeButton.textContent = "Delete"
      saveButton.remove()

      options.insertAdjacentElement("afterbegin", saveButton)

      localStorage.setItem("data", JSON.stringify(data))
      window.location.reload()
    })
  }
}
