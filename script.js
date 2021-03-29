/* 
    Jeopardy
    
    Write an async function 
        that uses fetch() to fetch 4 categories 
        from https://jservice.io/api/categories
        parameters: count, offset
        
    Display the categories
        in a simplified 4x5 Jeopardy Board 
        using CSS Grid
*/
let min = 1;
let max = 50;
const count = 6;
let offset = Math.floor((Math.random() * (max - min + 1)) + min);

let clueGrid = [];
let values = [200, 400, 600, 800, 1000];
let modal, clueDivs;
let clueValues = [];

const grid = document.querySelector(".grid");
const container = document.querySelector(".container");

async function getCategories() {
    let result = await fetch(`https://jservice.io/api/categories/?count=${count}&offset=${offset}`);
    let json = await result.json();
    console.log(json)
    return json;
}

getCategories().then(json => {

    json.forEach(category => {
        let div = document.createElement('div');
        div.classList.add('grid-item', 'category');
        div.textContent = category.title;
        grid.appendChild(div);

        clueGrid.push(category.id);
    });

    getGrid();
});

function getGrid() {

    for(let a = 0; a < 5; a++) {
        for (let i = 0; i < 6; i++) {
            let clue = document.createElement("div");
            clue.classList.add("grid-item", "clue");
            clue.textContent = `$${values[a]}`;
            grid.appendChild(clue);
        }
    }


    clueDivs = document.querySelectorAll(".clue"); 
    clueDivs.forEach(div => {
        div.addEventListener('click', () => createModal(div));

        //i don't know if this actually helps me or not.
        let valueNum = parseInt(div.outerText.slice(1,4));
        clueValues.push(valueNum);
    });

}


function createModal(div) {
    modal = document.createElement("div");
    grid.classList.add("dim"); // temp solution
    //console.log(clueDivs[0].outerText); //this returns the content! then i can strip out the $ and use it as value variable.
    //parseInt(clueDivs[var].outerText.slice(1,4)) will == the above ^^

        fetch(`https://jservice.io/api/clues/?category=${clueGrid[0]}`)
            .then(response => response.json())
            .then(data => {
                let question = data[0].question;
                let answer = data[0].answer;
                modal.textContent = `Question: ${question}`;

                let answerBtn = document.createElement("button");
                answerBtn.textContent = "Answer?";
                modal.appendChild(answerBtn);

                container.appendChild(modal);

                answerBtn.addEventListener('click', () => {
                    answerBtn.style.display = 'none';
                    let answerDiv = document.createElement("div");
                    answerDiv.textContent = `The Answer is: ${answer}`;
                    modal.appendChild(answerDiv);
                });
            });
}

/* notes

    next up: 

    need to fix positioning on modal, so it appears on the middle of the screen
        whole lotta positioning on this stupid thing. see scrimba course about it  ^

    need to pull in the clue that matches both category AND value
    how to find value?
        use an array for the grid? can determine value by determining the position in the array?? <-have this
        could use position on grid to determine which category and it's value. MATH


*/