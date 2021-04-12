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
//do i still use the count / clueCount one?
function ClueObject(question, answer, id, value, airdate, count, isNull) {
    this.question = question;
    this.answer = answer;
    this.id = id;
    this.value = value;
    this.airdate = airdate;
    this.clueCount = count;
    this.isNull = isNull;
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
                            clueArray.sort((a, b) => a.value - b.value);
                        });
                }
            });
        })
}

//3. runs after getCategories()
//4. goes back to getCategories after finished running, returning its result
function getClues(clue) {
    let newObj = new ClueObject(clue.question, clue.answer, clue.category_id, clue.value, clue.airdate, false)
    if (clue.value == null) newObj.isNull = true;
    clueArray.push(newObj);

    let div = document.createElement('div');
    div.classList.add('grid-item', 'clue', `v${newObj.value}`);
    div.setAttribute("id", `${newObj.id}-${newObj.value}`); //need to fix this to have a unique number -- might already be unique, i'm just dumb

    div.textContent = `$${newObj.value}`;
    grid.appendChild(div);
}

//3. get called around the same time as getClues, depending on parameters
function fetch5(categoryid, value) {
    value.forEach(val => {
        fetch(`https://jservice.io/api/clues/?category=${categoryid}&value=${val}`)
            .then(response => response.json())
            .then(data => {
                if (data[0].value != null) getClues(data[0])
                else {
                    console.log(data[Math.floor((Math.random() * (data.length - 1)) + 1)])
                    getClues(data[Math.floor((Math.random() * (data.length - 1)) + 1)])
                }
            })
    });
}

getCategories(count);
getEvent();

function getEvent() {
    const htmlObj = document.getElementsByClassName('clue');
    //const divs = Array.from(htmlObj, obj => obj.id)
    
    console.log(htmlObj[1]);
   
    // divs.forEach(div => {
    //     div.addEventListener('click', () => createModal(div))
    // })
}

function createModal(div) {

    console.log(div)
    modal = document.createElement("div");
    modal.classList.add("modal");
    grid.classList.add("dim"); // temp solution

    /*
    need to rework this whole function to pull in the clue div information depending on which one was clicked!
    use unique id for this??

    */

    // modal.textContent = `Question:  `;

    // let answerBtn = document.createElement("button");
    // answerBtn.textContent = "Answer?";
    // modal.appendChild(answerBtn);

    // container.appendChild(modal);

    // answerBtn.addEventListener('click', () => {
    //     answerBtn.style.display = 'none';
    //     let answerDiv = document.createElement("div");
    //     answerDiv.classList.add("answer");
    //     answerDiv.textContent = `The Answer is: `;
    //     modal.appendChild(answerDiv);
    // });

}