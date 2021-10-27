for(let i = 0; i < rows; i++){
    for(let j = 0; j < cols; j++){
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        // blur occurs even before click event
        cell.addEventListener("blur", (e) => {
            let address = addressBar.value;
            let [cell, cellProp] = getCellAndCellProp(address);
            let enteredData = cell.innerText;

            if(enteredData == cellProp.value) return;

            cellProp.value = enteredData;
            // If data modifies remove P-C(parent-child) relation, formula empty, update children with new hardcoded (modified) value 
            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCells(address);
        })
    }
}

let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", (e) => {
    let inputFormula = formulaBar.value;
    let address = addressBar.value;
    if(e.key === "Enter" && inputFormula){
        let evaluatedValue = evaluateFormula(inputFormula);
        setCellAndCellProp(evaluatedValue, inputFormula, address);
        addChildToParent(inputFormula);
        updateChildrenCells(address);
    }
})

// In formula if it has dependency to somone (b1 has dependency on a1) then add to its parent(a1)
function addChildToParent(formula){
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for(let i = 0; i < encodedFormula.length; i++){
        let asciiValue = encodedFormula[i].charCodeAt(0); // eg: 'A' + something then only add children
        if(asciiValue >= 65 && asciiValue <= 90){
            let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }
    }
}

// If parent formula updates after some time, then child value also should update
function updateChildrenCells(parentAddress) {
    let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
    let children = parentCellProp.children;

    for (let i = 0; i < children.length; i++) {
        let childAddress = children[i];
        let [childCell, childCellProp] = getCellAndCellProp(childAddress);
        let childFormula = childCellProp.formula;

        let evaluatedValue = evaluateFormula(childFormula);
        setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
        updateChildrenCells(childAddress); // recursive call (children -> children)
    }
}

// Formula can be edited so dependency remove then pop its child from parent array
function removeChildFromParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            let idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx, 1);
        }
    }
}

// If it is encoded formula (A1 + something) or normal (10 + 10)
function evaluateFormula(formula){
    let encodedFormula = formula.split(" ");
    for(let i = 0; i < encodedFormula.length; i++){
        let asciiValue = encodedFormula[i].charCodeAt(0); // A1 => A
        if(asciiValue >= 65 && asciiValue <= 90){
            let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;   
        }
    }

    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}

// update UI and DB
function setCellAndCellProp(evaluatedValue, formula, address){
    let [cell, cellProp] = getCellAndCellProp(address);
    cell.innerText = evaluatedValue;
    cellProp.value = evaluatedValue;
    cellProp.formula = formula;
}