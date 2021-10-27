// We had written this script after grid, so we can access variables that we have declared in grid.js
let sheetDB = [];

for(let i = 0; i < rows; i++){
    let sheetRow = [];
    for(let j = 0; j < cols; j++){
        // Initial Default structure
        let cellProp = {
            bold: false,
            italic: false,
            underline: false,
            alignment: "left",
            fontFamily: "monospace",
            fontSize: "14",
            fontColor: "#000000",
            bgColor: "#000000",
            value: "",
            formula: "",
            children: []
        }

        sheetRow.push(cellProp);
    }
    sheetDB.push(sheetRow);
}

// Selectors for cell properties
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let bgColor = document.querySelector(".bg-color-prop");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

let activeColor = "#d1d8e0";
let inActiveColor = "#ecf0f1";

bold.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    // Change data
    cellProp.bold = !cellProp.bold;
    // Change UI
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
    bold.style.backgroundColor = cellProp.bold ? activeColor : inActiveColor;  
})

italic.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    // Change data
    cellProp.italic = !cellProp.italic;
    // Change UI
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
    italic.style.backgroundColor = cellProp.italic ? activeColor : inActiveColor;  
})

underline.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    // Change data
    cellProp.underline = !cellProp.underline;
    // Change UI
    cell.style.textDecoration = cellProp.underline ? "underline" : "normal";
    underline.style.backgroundColor = cellProp.underline ? activeColor : inActiveColor;  
})

fontSize.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    // Data Change -> 16
    cellProp.fontSize = fontSize.value;
    // UI Change -> 16px
    cell.style.fontSize = cellProp.fontSize + "px";
    // Set Box value to 16
    fontSize.value = cellProp.fontSize;
})

fontFamily.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.fontFamily = fontFamily.value; 
    cell.style.fontFamily = cellProp.fontFamily;
    fontFamily.value = cellProp.fontFamily;
})

fontColor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.fontColor = fontColor.value; // Data change
    cell.style.color = cellProp.fontColor;
    fontColor.value = cellProp.fontColor;
})

bgColor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.bgColor = bgColor.value;
    cell.style.backgroundColor = cellProp.bgColor;
    bgColor.value = cellProp.bgColor;
})

alignment.forEach((alignElem) => {
    alignElem.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);

        let alignValue = e.target.classList[0];
        cellProp.alignment = alignValue;
        cell.style.textAlign = cellProp.alignment;

        switch(alignValue){
            case "left":
                leftAlign.style.backgroundColor = activeColor;
                centerAlign.style.backgroundColor = inActiveColor;
                rightAlign.style.backgroundColor = inActiveColor;
                break;
            case "center":
                leftAlign.style.backgroundColor = inActiveColor;
                centerAlign.style.backgroundColor = activeColor;
                rightAlign.style.backgroundColor = inActiveColor;
                break;
            case "right":
                leftAlign.style.backgroundColor = inActiveColor;
                centerAlign.style.backgroundColor = inActiveColor;
                rightAlign.style.backgroundColor = activeColor;
                break;
        }
    })
})

// The selected items should display for that cell only, not on other cell
let allCells = document.querySelectorAll(".cell");
for(let i = 0; i < allCells.length; i++){
    addListenerToAttachCellProperties(allCells[i]);
}

function addListenerToAttachCellProperties(cell){
    cell.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [rid, cid] = decodeIDFromAddress(address);
        let cellProp = sheetDB[rid][cid];

        // Apply cell Properties
        cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
        cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
        cell.style.textDecoration = cellProp.underline ? "underline" : "none";
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.color = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.bgColor === "#000000" ? "transparent" : cellProp.bgColor;
        cell.style.textAlign = cellProp.alignment;

        // Apply properties UI Props container
        bold.style.backgroundColor = cellProp.bold ? activeColor : inActiveColor;
        italic.style.backgroundColor = cellProp.italic ? activeColor : inActiveColor;
        underline.style.backgroundColor = cellProp.underline ? activeColor : inActiveColor;
        fontColor.value = cellProp.fontColor;
        bgColor.value = cellProp.bgColor;
        fontSize.value = cellProp.fontSize;
        fontFamily.value = cellProp.fontFamily;
        switch(cellProp.alignment) { 
            case "left":
                leftAlign.style.backgroundColor = activeColor;
                centerAlign.style.backgroundColor = inActiveColor;
                rightAlign.style.backgroundColor = inActiveColor;
                break;
            case "center":
                leftAlign.style.backgroundColor = inActiveColor;
                centerAlign.style.backgroundColor = activeColor;
                rightAlign.style.backgroundColor = inActiveColor;
                break;
            case "right":
                leftAlign.style.backgroundColor = inActiveColor;
                centerAlign.style.backgroundColor = inActiveColor;
                rightAlign.style.backgroundColor = activeColor;
                break;
        }

        // Formula should only display for cell which we applied (not on other cell)
        let formulaBar = document.querySelector(".formula-bar");
        formulaBar.value = cellProp.formula;
        cell.innerText = cellProp.value;
    })
}

// Get cell and cellprop
function getCellAndCellProp(address){
    let [rid, cid] = decodeIDFromAddress(address);
    // Access cell and storage object
    let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    
    let cellProp = sheetDB[rid][cid];
    return [cell, cellProp];
}

// Decode rid, cid from address
function decodeIDFromAddress(address){
    // address -> "A1"
    // -1 bcoz of row is starting at 1, but in cell is 0
    let rid = Number(address.slice(1) - 1);
    let cid = Number(address.charCodeAt(0)) - 65; // A->65
    return [rid, cid];
}

