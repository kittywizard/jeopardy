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

const grid = document.querySelector(".grid");

/* notes: 
    guessing offset will have to be random - to get different categories each time
    count should be standard since its jeopardy, but could still be a variable

*/

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
        grid.appendChild(clue);
    }
}