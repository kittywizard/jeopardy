
const grid = document.querySelector(".grid");
const container = document.querySelector(".container");

const count = 6; //determines the number of categories

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

//objects to store clue/category data
function ClueObject(question, answer, id, value, airdate, count) {
    this.question = question;
    this.answer = answer;
    this.id = id;
    this.value = value;
    this.airdate = airdate;
    this.clueCount = count;
}

function CategoryObject(id, title, clueCount) {
    this.id = id;
    this.title = title;
    this.clueCount = clueCount;
}

//1. first function to run. sets up categories
//2. then, calls getClues
function getCategories(count) {
    fetch(`https://jservice.io/api/categories/?count=${count}&offset=${offset}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(data => {
                content.push(new CategoryObject(data.id, data.title, data.clues_count));

                let div = document.createElement('div');
                div.classList.add('grid-item', 'category');
                div.textContent = data.title;
                grid.appendChild(div);
            });
        })
        //fetching the clues for each category
        .then(() => {
            content.forEach(category => {
                if (category.clueCount > 5) fetch5(category.id, [200, 400, 600, 800, 1000]);
                else {
                    fetch(`https://jservice.io/api/clues/?category=${category.id}`)
                        .then(response => response.json())
                        .then(data => data.forEach(clue => getClues(clue)))
                        //after clues are fetched, either by fetch5 or the normal way, i need to sort the array
                        .then(() => {
                            //this is where i need to check for the null values
                            //TODO - the null checker doesn't seem to be working properly
                            clueArray.sort((a, b) => a.value - b.value);
                            //clueArray.forEach(clue => {if(clue.value == null) checkNulls(clueArray, clue, clue.id)})
                        });
                }
            });
            getEvent();
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

//3. get called around the same time as getClues, depending on parameters
function fetch5(categoryid, value) {
    value.forEach(val => {
        fetch(`https://jservice.io/api/clues/?category=${categoryid}&value=${val}`)
            .then(response => response.json())
            .then(data => {
                if(data[0].value != null) getClues(data[0])
                else {
                    console.log(data[Math.floor((Math.random() * (data.length - 1)) + 1)])
                    getClues(data[Math.floor((Math.random() * (data.length - 1)) + 1)])
                }
            })
    });
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

function getEvent() {
    let divs = document.querySelectorAll('.clue');
    console.log(divs);
}

function createModal(div) {

    modal = document.createElement("div");
    modal.classList.add("modal");
    grid.classList.add("dim"); // temp solution
    //console.log(clueDivs[0].outerText); //this returns the content! then i can strip out the $ and use it as value variable.
    //parseInt(clueDivs[var].outerText.slice(1,4)) will == the above ^^

    fetch(`https://jservice.io/api/clues/?category=${clueGrid[0]}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            let question = data[0].question;
            let answer = data[0].answer;
            modal.textContent = `Question: ${question} `;
            //modal.textContent += `This question originally aired ${data[0].airdate}`;

            let answerBtn = document.createElement("button");
            answerBtn.textContent = "Answer?";
            modal.appendChild(answerBtn);

            container.appendChild(modal);

            answerBtn.addEventListener('click', () => {
                answerBtn.style.display = 'none';
                let answerDiv = document.createElement("div");
                answerDiv.classList.add("answer");
                answerDiv.textContent = `The Answer is: ${answer}`;
                modal.appendChild(answerDiv);
            });
        });
}

/* notes

    next up: 
        - figure out where the null values are coming from
        - potentially because they are daily doubles. need to either note that somewhere for later
        - or, need to assign it whichever value is missing
*/