let activeSheetColor = "#ced6e0";
let sheetFolderContainer = document.querySelector(".sheet-folder-container");
let addSheetBtn = document.querySelector(".sheet-add-icon");

addSheetBtn.addEventListener("click", (e) => {
    // Get all sheets
    let allSheets = document.querySelectorAll(".sheet-folder");
    let sheet = document.createElement("div");
    sheet.setAttribute("class", "sheet-folder");
    sheet.setAttribute("id", allSheets.length);

    sheet.innerHTML = `<div class="sheet-content">Sheet ${allSheets.length + 1}</div>`;

    sheetFolderContainer.appendChild(sheet);

    createSheetDB();
    createGraphComponentMatrix();
    handleSheetActiveness(sheet);
    handleSheetRemoval(sheet);
    sheet.click(); // 1st sheet should be by default selected
})

function createSheetDB(){
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

    collectedSheetDB.push(sheetDB);
}

function createGraphComponentMatrix() {
    let graphComponentMatrix = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            // Why array -> More than 1 child relation(dependency)
            row.push([]);
        }
        graphComponentMatrix.push(row);
    }
    collectedGraphComponent.push(graphComponentMatrix);
}

function handleSheetProperties(){
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            // 1st cell should be click by default
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }

    // By default click on first cell via DOM
    let firstCell = document.querySelector(".cell");
    firstCell.click();
}

function handleSheetActiveness(sheet) {
    sheet.addEventListener("click", (e) => {
        let sheetIdx = Number(sheet.getAttribute("id"));
        handleSheetDB(sheetIdx);
        handleSheetProperties();
        handleSheetUI(sheet);
    })
}

function handleSheetDB(sheetIdx) {
    sheetDB = collectedSheetDB[sheetIdx];
    graphComponentMatrix = collectedGraphComponent[sheetIdx];
}

function handleSheetUI(sheet) {
    let allSheets = document.querySelectorAll(".sheet-folder");
    for (let i = 0; i < allSheets.length; i++) {
        allSheets[i].style.backgroundColor = "transparent";
    }
    sheet.style.backgroundColor = activeSheetColor;
}

function handleSheetRemoval(sheet) {
    sheet.addEventListener("mousedown", (e) => {
        // Right click
        if (e.button !== 2) return;

        let allSheets = document.querySelectorAll(".sheet-folder");
        if (allSheets.length === 1) {
            alert("You need to have atleast one sheet!!");
            return;
        }

        let response = confirm("Your sheet will be removed permanently, Are you sure?");
        if (response === false) return;

        let sheetIdx = Number(sheet.getAttribute("id"));
        // DB
        collectedSheetDB.splice(sheetIdx, 1);
        collectedGraphComponent.splice(sheetIdx, 1);
        // UI
        handleSheetUIRemoval(sheet)

        // By default DB to sheet 1 (active)
        sheetDB = collectedSheetDB[0];
        graphComponentMatrix = collectedGraphComponent[0];
        handleSheetProperties();
    })
}

function handleSheetUIRemoval(sheet) {
    sheet.remove();
    let allSheets = document.querySelectorAll(".sheet-folder");
    for (let i = 0; i < allSheets.length; i++) {
        allSheets[i].setAttribute("id", i);
        let sheetContent = allSheets[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet ${i+1}`;
        allSheets[i].style.backgroundColor = "transparent";
    }

    allSheets[0].style.backgroundColor = activeSheetColor;
}