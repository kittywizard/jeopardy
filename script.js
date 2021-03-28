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
let clueGrid = ["$200", "$400", "$600", "$800", "$1000"]; //you can do this with math, you lazy bum

const grid = document.querySelector(".grid");

async function getCategories() {
    let result = await fetch(`https://jservice.io/api/categories/?count=${count}&offset=${offset}`);
    let json = await result.json();

    console.log(json);

    json.forEach(category => {
        let div = document.createElement('div');
        div.classList.add('grid-item', 'category');
        div.textContent = category.title;
        grid.appendChild(div);
    });

    getGrid();
}

getCategories();

function getGrid() {
    const number = 5 * 6;
    
    for(let i = 0; i < number; i++) {
        let clue = document.createElement("div");
        clue.classList.add("grid-item", "clue");
        clue.textContent = clueGrid[0];
        grid.appendChild(clue);
    }
}

/* notes
    going to need event listeners on all the 'clue' divs
    i think we can add them all to an array and forEach it?
*/