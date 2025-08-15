function popup() {
    const popup = document.getElementById("popupContainer");
    popup.style.display = "block";
    document.body.appendChild(popup);
}

function closePopup() {
    const popup = document.getElementById("popupContainer");
    if(popup) {
         popup.style.display = "none";;
    }
}
function createNote() {
    const noteTitle = document.getElementById("note-title").value.trim();
    const noteContent = document.getElementById("note-text").value.trim();
    const noteCategory = document.getElementById("note-category").value;

    if (!noteTitle || !noteContent || !noteCategory) {
        alert("Please fill in all fields: title, category, and content.");
        return;
    }

    const note = {
        id: new Date().getTime(),
        title: noteTitle,
        category: noteCategory,
        text: noteContent
    };

   
    const template = document.getElementById("note-template");
    const clone = template.content.cloneNode(true);

    clone.querySelector(".note-title").textContent = note.title || "Untitled";
    clone.querySelector(".note-category span").textContent = note.category;
    clone.querySelector(".note-text").textContent = note.text;

    // Append to notes list
    document.getElementById("notes-list").appendChild(clone);

    // Save to localStorage
    saveData(note);

    // Reset fields
    document.getElementById("note-title").value = "";
    document.getElementById("note-text").value = "";
    document.getElementById("note-category").selectedIndex = 0;

    closePopup();
    displayNotes(); 
}
function saveData(note) {
    const existingNotes = JSON.parse(localStorage.getItem("notes")) || [];
    existingNotes.push(note);
    localStorage.setItem("notes", JSON.stringify(existingNotes));
}

function displayNotes() {
    const notesList = document.getElementById("notes-list");
    notesList.innerHTML = '';  

    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const template = document.getElementById("note-template");

    notes.forEach(note => {
        const clone = template.content.cloneNode(true);

        clone.querySelector(".note-title").textContent = note.title || "Untitled";
        clone.querySelector(".note-category span").textContent = note.category;
        clone.querySelector(".note-text").textContent = note.text;

       clone.querySelector(".editBtn").addEventListener("click", () => editNote(note.id));
       clone.querySelector(".deleteBtn").addEventListener("click", () => deleteNote(note.id));


        notesList.appendChild(clone);
    });
}
function editNote(noteId) {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  const noteToEdit = notes.find(note => note.id == noteId);
  if (!noteToEdit) return;

  // Set values in the edit popup
  document.getElementById('edit-note-title').value = noteToEdit.title || '';
  document.getElementById('edit-note-category').value = noteToEdit.category || '';
  document.getElementById('edit-note-text').value = noteToEdit.text || '';
  document.getElementById('editPopupContainer').style.display = 'block';

  // Set note ID
  document.getElementById('edit-submit-btn').setAttribute('data-note-id', noteId);
}

document.getElementById('edit-submit-btn').addEventListener('click', function () {
  const noteId = this.getAttribute('data-note-id');
  const updatedTitle = document.getElementById('edit-note-title').value;
  const updatedCategory = document.getElementById('edit-note-category').value;
  const updatedText = document.getElementById('edit-note-text').value;

  const notes = JSON.parse(localStorage.getItem('notes')) || [];

  const updatedNotes = notes.map(note => {
    if (note.id == noteId) {
      return {
        ...note,
        title: updatedTitle,
        category: updatedCategory,
        text: updatedText
      };
    }
    return note;
  });

  localStorage.setItem('notes', JSON.stringify(updatedNotes));
  closeEditPopup();
  displayNotes();
});


function closeEditPopup() {
  document.getElementById('editPopupContainer').style.display = 'none';
  document.getElementById('edit-note-text').value = '';
}


window.onload = function () {
  displayNotes();
};
function deleteNote(noteId) {
  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes = notes.filter(note => note.id !== noteId);
  localStorage.setItem('notes', JSON.stringify(notes));
  displayNotes();
}


function displayNotesByCategory(category) {
    const notesList = document.getElementById("notes-list");
    notesList.innerHTML = '';  // Clear current notes

    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const template = document.getElementById("note-template");

    // Filter notes by category
    const filteredNotes = notes.filter(note => note.category === category);

    filteredNotes.forEach(note => {
        const clone = template.content.cloneNode(true);

        clone.querySelector(".note-title").textContent = note.title || "Untitled";
        clone.querySelector(".note-category span").textContent = note.category;
        clone.querySelector(".note-text").textContent = note.text;

        clone.querySelector(".editBtn").addEventListener("click", () => editNote(note.id));
        clone.querySelector(".deleteBtn").addEventListener("click", () => deleteNote(note.id));

        notesList.appendChild(clone);
    });
}
document.querySelectorAll('.slider-img').forEach(slider => {
    slider.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        displayNotesByCategory(category);
    });
});
document.getElementById("searchInput").addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();

    const notesList = document.getElementById("notes-list");
    notesList.innerHTML = '';  // Clear old list

    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const template = document.getElementById("note-template");

    const filteredNotes = notes.filter(note => 
        note.title && note.title.toLowerCase().includes(searchTerm)
    );

    filteredNotes.forEach(note => {
        const clone = template.content.cloneNode(true);
        clone.querySelector(".note-title").textContent = note.title || "Untitled";
        clone.querySelector(".note-category span").textContent = note.category;
        clone.querySelector(".note-text").textContent = note.text;

        clone.querySelector(".editBtn").addEventListener("click", () => editNote(note.id));
        clone.querySelector(".deleteBtn").addEventListener("click", () => deleteNote(note.id));

        notesList.appendChild(clone);
    });
});
const darkModeToggle = document.getElementById('darkModeToggle');

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  //  Change button text/icon
  if (document.body.classList.contains('dark-mode')) {
    darkModeToggle.textContent = ' Light Mode';
  } else {
    darkModeToggle.textContent = ' Dark Mode';
  }

  // Save preference in localStorage
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Applying dark mode if previously enabled
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeToggle.textContent = ' Light Mode';
  }
});
