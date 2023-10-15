// const endPointRoot = "https://www.winstonnguyen.ca/COMP4537/labs/5/API/v1/sql/";
const endPointRoot = "http://localhost:8080/COMP4537/labs/5/API/v1/sql/";

function addRows() {
    const endPointAdd = endPointRoot + "addRows/";
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", endPointAdd, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            document.getElementById("addResult").innerHTML = this.responseText;
        }
    }
}

function sendQuery() {
    let word = document.getElementById("word").value;
    let definition = document.getElementById("definition").value;
    let params = "?word=" + word + "&definition=" + definition;
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", endPointRoot, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(params);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            document.getElementById("addResult").innerHTML = this.responseText;
            document.getElementById("word").value = "";
            document.getElementById("definition").value = "";
        }
    }
}