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
let max = 75;
const count = 6;
let offset = Math.floor((Math.random() * (max - min + 1)) + min); //need to figure out offset, i keep getting the same categories

// let clueGrid = [];
// let values = [200, 400, 600, 800, 1000];
// let modal, clueDivs;
// let clueValues = [];

let content = [],
    clueObj = [],
    testArray = [],
    finalArr = [];

function ClueObject (question, answer, id, value, airdate) {
    this.question = question;
    this.answer = answer;
    this.id = id;
    this.value = value;
    this.airdate = airdate;
}

function findValue(obj, val) {
    return obj.value === val;
}

const grid = document.querySelector(".grid");
const container = document.querySelector(".container");

function getCategories() {
    //let result = await 
    fetch(`https://jservice.io/api/categories/?count=${count}&offset=${offset}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(data => {
                let arr = [data.id, data.title];
                content.push(arr);
                
                
                let div = document.createElement('div');
                div.classList.add('grid-item', 'category');
                div.textContent = data.title;
                grid.appendChild(div);
            });
        })
        .then(() => {
            content.forEach(category => {
                let id = category[0];
                fetch(`https://jservice.io/api/clues/?category=${category[0]}`) //i believe this is implying that its actually category[foreachposition][0]
                    .then(response => response.json())
                    .then(data => {

                        //this will gather all the clues for each category and push them into an array
                        data.forEach(clue => {                            
                            let newObj = new ClueObject(clue.question, clue.answer, clue.category_id, clue.value, clue.airdate);
                            testArray.push(newObj);
                            // {
                            //     "question": clue.question,
                            //     "answer": clue.answer,
                            //     "airDate": clue.airdate,
                            //     "value": clue.value,
                            // }

                            // let div = document.createElement('div');
                            // div.classList.add('grid-item', 'clue');
                            // div.setAttribute("id", `${id}-hi`); //need to make this unique based on the position in the grid
                            // //but need to actually set the grid up properly and WHY ARE THINGS NULL
                            // div.textContent = `$${clue.value}`;
                            // grid.appendChild(div);
                        });


                        //filters all the clues  of the current category into an array
                        let categoryArr = testArray.filter(obj => obj.id == id);

                        //check to see if the length of said array is greater than 5, in which case it needs to be checked out
                        if(categoryArr.length > 5) {

                            //for as long as the number is less than the array's length
                            for(let i = 0; i < categoryArr.length; i++) {
                                let valueCheck = 200;
                                //find the first one that match the above yes?? 
                                finalArr.push(categoryArr.find(cat => cat.value === valueCheck));
                                console.log(finalArr);
                         }

                        }

                    });

            });

        });

    // return await result.json();

}

getCategories();


// getCategories().then(json => {
//     json.forEach(category => {
//         let div = document.createElement('div');
//         div.classList.add('grid-item', 'category');
//         div.textContent = category.title;
//         grid.appendChild(div);

//         clueGrid.push(category.id);
//     });

//     getGrid();
// });

function getGrid() {

    for (let a = 0; a < 5; a++) {
        for (let i = 0; i < 6; i++) {
            let clue = document.createElement("div");
            clue.classList.add("grid-item", "clue");
            clue.textContent = `$${values[a]}`;
            grid.appendChild(clue);
        }
    }


    clueDivs = document.querySelectorAll(".clue");
    console.log(clueDivs)
    clueDivs.forEach(div => {
        div.addEventListener('click', (e) => {
            console.log(e.target.textContent)

            createModal(div)

        });

        //i don't know if this actually helps me or not.
        let valueNum = parseInt(div.outerText.slice(1, 4));
        clueValues.push(valueNum);
    });

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

    need to fix positioning on modal, so it appears on the middle of the screen
        whole lotta positioning on this stupid thing. see scrimba course about it  ^

    need to pull in the clue that matches both category AND value
    how to find value?
        use an array for the grid? can determine value by determining the position in the array?? <-have this
        could use position on grid to determine which category and it's value. MATH


*/