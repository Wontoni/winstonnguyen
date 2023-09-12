// Note Object
class Note {
    constructor(noteText, dateTime) {
        this.noteText = noteText;
        this.dateTime = dateTime;
    }
}

let notesArr = [];

document.addEventListener('DOMContentLoaded', function() {
    if(typeof(Storage) !== "undefined") {
        let noteForm = document.getElementById("noteForm");

        noteForm.addEventListener("submit", (e) => {
            e.preventDefault();
            createNote();
        });
    
        notesArr = JSON.parse(localStorage.getItem("notes") || "[]");
    
        populateNotes();
    
        // Add note object to local storage -> Text + DateTime
        saveNotes(); // Call once at page load and then every 2 seconds after.
        const interval = setInterval(function() {
            saveNotes();
        }, 2000);
    } else {
        alert("Local Storage is not supported on this browser.");
    }
    
}, false);


// Uses form to create a note object for local storage
function createNote() {
    let note = document.getElementById("formText");

    if (note.value != "") {
        // Create note object
        let newNote = new Note(note.value, Date.now());
        notesArr.push(newNote);

        // DOM new note card here
        let notesDiv = document.getElementById("notes");
        let noteCard = createNoteCard(note.value, notesArr.length - 1);

        notesDiv.appendChild(noteCard);

        // Remove text
        note.value = "";

    }
}

// Called every 2 seconds
function saveNotes() {
    // Save notes to local storage
    localStorage.setItem("notes", JSON.stringify(notesArr));

    // Update last updated text
    const currentDate = new Date().toLocaleTimeString();
    let dateSpan = document.getElementById("updated");
    dateSpan.innerHTML = currentDate;
}

function createNoteCard(noteText, cardNumber) {
    let noteCard = document.createElement("div");
    noteCard.className = "noteCard";

    // Note Text
    let noteTextSpan = document.createElement("span");
    noteTextSpan.className = "noteText";
    let textNode = document.createTextNode(noteText);

    noteTextSpan.appendChild(textNode);
    noteCard.appendChild(noteTextSpan);

    // Remove Button
    let removeButton = document.createElement("button");
    let buttonTextNode = document.createTextNode("Remove");
    removeButton.appendChild(buttonTextNode);

    // Remove note when clicked
    removeButton.addEventListener("click", function() {
        if (notesArr.length === 1) {
            notesArr = [];
        } else {
            notesArr.splice(cardNumber, 1); //  Remove from array
            noteCard.remove();
        }
    })

    noteCard.appendChild(removeButton);

    return noteCard;
}

// Called at page load and every time new note is added.
function populateNotes() {
    // Populates notes onto the page

    let notesDiv = document.getElementById("notes");

    // Create a card for each item in the array
    for (let i = 0; i < notesArr.length; i++) {
        // Create noteCard div
        let noteCard = createNoteCard(notesArr[i].noteText, i);

        notesDiv.appendChild(noteCard);
    }
}