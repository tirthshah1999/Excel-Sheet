let rows = 100, cols = 26;

let columnContainer = document.querySelector(".column-container");
let rowContainer = document.querySelector(".row-container");
let cellContainer = document.querySelector(".cell-container");
let addressBar = document.querySelector(".address-bar");

for(let i = 0; i < rows; i++){
    let col = document.createElement("div");
    col.setAttribute("class", "col");
    col.innerText = i + 1;
    columnContainer.appendChild(col);
}

for(let i = 0; i < cols; i++){
    let row = document.createElement("div");
    row.setAttribute("class", "row");
    row.innerText = String.fromCharCode(65 + i);
    rowContainer.appendChild(row);
}

for(let i = 0; i < rows; i++){
    let row = document.createElement("div");
    row.setAttribute("class", "row-item");
    for(let j = 0; j < cols; j++){
        let cell = document.createElement("div");
        cell.setAttribute("class", "cell");
        cell.setAttribute("contenteditable", "true");
        cell.setAttribute("spellcheck", "false");

        // Attribute to identify cell and storage
        cell.setAttribute("rid", i);
        cell.setAttribute("cid", j);

        row.appendChild(cell);
        listenerForAddressBar(cell, i, j);
    }
    cellContainer.appendChild(row);
}

function listenerForAddressBar(cell, i, j){
    cell.addEventListener("click", (e) => {
        let rowNo = i + 1;
        let colNo = String.fromCharCode(65 + j);
        addressBar.value = `${colNo}${rowNo}`;
    })
}