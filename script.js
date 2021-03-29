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

const grid = document.querySelector(".grid");

async function getCategories() {
    let result = await fetch(`https://jservice.io/api/categories/?count=${count}&offset=${offset}`);
    let json = await result.json();
    return json;
}

getCategories().then(json => {

    json.forEach(category => {
        let div = document.createElement('div');
        div.classList.add('grid-item', 'category');
        div.textContent = category.title;
        grid.appendChild(div);

        let categoryId = category.id;
        clueGrid.push(categoryId);
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
    //getClues();
}

function getClues() {
    clueGrid.forEach(clue => {
        fetch(`https://jservice.io/api/clues/?category=${clue}`)
            .then(response => response.json())
            .then(data => {
                console.log(data[0].value)
            });
    });

}

/* notes
    going to need event listeners on all the 'clue' divs
    i think we can add them all to an array and forEach it?

    next up: 
    gather all the clue divs querySelectorAll 
    add event listener
    console log
    need to create modal w/ question
    
*/