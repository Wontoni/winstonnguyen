let notesArr = [];

document.addEventListener('DOMContentLoaded', function() {
    // populateNotes();

    if(typeof(Storage) !== "undefined") {
        notesArr = JSON.parse(localStorage.getItem("notes") || "[]");


        // Get note objects from local storage
        retrieveNotes();
        const interval = setInterval(function() {
            retrieveNotes();
        }, 2000);
    } else {
        alert("Local Storage is not supported on this browser.");
    }
    
}, false);

function retrieveNotes() {
    // Save notes to local storage
    notesArr = JSON.parse(localStorage.getItem("notes") || "[]");

    // Update last updated text
    const currentDate = new Date().toLocaleTimeString();
    let dateSpan = document.getElementById("updated");
    dateSpan.innerHTML = currentDate;

    populateNotes();
}


function createNoteCard(noteText,) {
    let noteCard = document.createElement("div");
    noteCard.className = "noteCard";

    // Note Text
    let noteTextSpan = document.createElement("span");
    noteTextSpan.className = "noteText";
    let textNode = document.createTextNode(noteText);

    noteTextSpan.appendChild(textNode);
    noteCard.appendChild(noteTextSpan);

    return noteCard;
}

// Called at page load and every 2 seconds
function populateNotes() {
    let notesDiv = document.getElementById("notes");

    // Remove all child elements to repopulate notes
    notesDiv.innerHTML = ""; 

    // Create a card for each item in the array
    for (let i = 0; i < notesArr.length; i++) {
        // Create noteCard div
        let noteCard = createNoteCard(notesArr[i].noteText);

        notesDiv.appendChild(noteCard);
    }
}