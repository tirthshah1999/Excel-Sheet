async function isGraphCyclicTracePath(graphComponentMatrix, cycleResponse){
    let [sr, sc] = cycleResponse;  // (i, j) 
    let visited = []; 
    let dfsVisited = []; 

    for(let i = 0; i < rows; i++){
        let visitedRow = [];
        let dfsVisitedRow = [];
        for(let j = 0; j < cols; j++){
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }

        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

    // For path trace, no need to go and check for all cells
    let response = await dfsCycleDetectionTracePath(graphComponentMatrix, sr, sc, visited, dfsVisited);

    if(response === true) return Promise.resolve(true);

    return Promise.resolve(false);
}

async function dfsCycleDetectionTracePath(graphComponentMatrix, sr, sc, visited, dfsVisited) {
    visited[sr][sc] = true;
    dfsVisited[sr][sc] = true;

    let cell = document.querySelector(`.cell[rid="${sr}"][cid="${sc}"]`);
    cell.style.backgroundColor = "lightblue";
    await colorPromise();

    for (let children = 0; children < graphComponentMatrix[sr][sc].length; children++) {
        let [nbrr, nbrc] = graphComponentMatrix[sr][sc][children];
        if (visited[nbrr][nbrc] === false) {
            let response = await dfsCycleDetectionTracePath(graphComponentMatrix, nbrr, nbrc, visited, dfsVisited);

            if (response === true){
                await colorPromise();
                cell.style.backgroundColor = "transparent";
                return Promise.resolve(true);
            }
        }
        else if (visited[nbrr][nbrc] === true && dfsVisited[nbrr][nbrc] === true) {
            // Found cycle so apply salmon color
            let cyclicCell = document.querySelector(`.cell[rid="${nbrr}"][cid="${nbrc}"]`);

            cyclicCell.style.backgroundColor = "lightsalmon";
            await colorPromise();
            cyclicCell.style.backgroundColor = "transparent";

            // Bcoz node -> nextnode (salmon) so after that node has to be transparent
            await colorPromise();
            cell.style.backgroundColor = "transparent";

            return Promise.resolve(true);
        }
    }

    dfsVisited[sr][sc] = false;
    return Promise.resolve(false);
}

// For delay and wait
function colorPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    })
}