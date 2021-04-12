const grid = document.querySelector(".grid");
const container = document.querySelector(".container");

const count = 1; //determines the number of categories

//these three are for determining the offset, which needs some work
//TODO need to figure out offset, i keep getting the same categories
let min = 1;
let max = 100;
let offset = Math.floor((Math.random() * (max - min + 1)) + min);


//all the various arrays i've needed
let content = [],
    clueArray = [],
    finalArr = [],
    newArr = [];

const valArray = [200, 400, 600, 800, 1000];

//objects to store clue/category data
function ClueObject(question, answer, id, value, airdate, isNull) {
    this.question = question;
    this.answer = answer;
    this.id = id;
    this.value = value;
    this.airdate = airdate;
    this.isNull = isNull;
}

function CategoryObject(id, title, clueCount) {
    this.id = id;
    this.title = title;
    this.clueCount = clueCount;
}

function getCategories(count) {
    fetch(`https://jservice.io/api/category?id=306`)
        .then(response => response.json())
        .then(data => {
            content.push(new CategoryObject(data.id, data.title, data.clues_count));
            let div = document.createElement('div');
            div.textContent = data.title;
            grid.appendChild(div);
        })
        .then(() => {
            fetch(`https://jservice.io/api/clues/?category=${content[0].id}`)
                .then(response => response.json())
                .then(data => {
                    //so we've got data - all the clues with their values
                    data.forEach(clue => {
                        let newObj = new ClueObject(clue.question, clue.answer, clue.category_id, clue.value, clue.airdate, false);
                        if(clue.value == null) newObj.isNull = true;
                        clueArray.push(newObj);
                    });
                    clueArray.sort((a, b) => a.value - b.value);

                    //need to check for the true/false and uhhhh somehow fix the null values
                    
                    //in theory >> there should only be one missing value in the group
                    

                    //then need to display the grid like before

                    // let div = document.createElement('div');
                    // div.classList.add('grid-item', 'clue', `v${newObj.value}`);
                    // div.setAttribute("id", `${newObj.id}-${newObj.value}`); //need to fix this to have a unique number
                    // div.textContent = `$${newObj.value}`;
                    // grid.appendChild(div);
                    console.log(clueArray);
                })
        })
}

//3. runs after getCategories()
//4. goes back to getCategories after finished running, returning its result
function getClues(clue) {
    let newObj = new ClueObject(clue.question, clue.answer, clue.category_id, clue.value, clue.airdate);
    clueArray.push(newObj);

    let div = document.createElement('div');
    div.classList.add('grid-item', 'clue', `v${newObj.value}`);
    div.setAttribute("id", `${newObj.id}-${newObj.value}`); //need to fix this to have a unique number
    //but need to actually set the grid up properly and WHY ARE THINGS NULL
    div.textContent = `$${newObj.value}`;
    grid.appendChild(div);
}

//5. a work in progress function 
function checkNulls(arr, clue, id) {
    //so i've got the entire array, the specific clue that triggered the call (which i honestly might not need?) 
    //and the category id so i can just pull the others in the category?

    console.log(clue)
    //this is going off too many times?
    //getting a bunch of repeat clues

}

getCategories(count);