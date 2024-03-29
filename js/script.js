// API endpoint for meal search

let inputEle = document.getElementById('searchInput');
let searchBtn  = document.querySelector('.search_button');
let resultHeading = document.getElementById('results-heading');
let resultContainer = document.getElementById('results-container');
let favListVar = false;
//initializing favouritesList key in local storage with empty array
if(localStorage.getItem("favouritesList") === null){
    localStorage.setItem("favouritesList", JSON.stringify([])); 
}

// Function to fetch meals from API based on search query
async function fetchMeals(url, query) {
    try {
        const response = await fetch(`${url}${query}`);
        const data = await response.json();
        return data.meals || [];
    } catch (error) {
        console.error('Error fetching meals:', error);
        return [];
    }
}

//it  shows full meal details in main
async function renderMealDetails(id) {
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    await fetchMeals(url, id).then(data => {
        console.log(data);
        html += ` 
                <div class="container py-3">
                <div class="card p-lg-5 p-md-2">
                    <div class="row ">
                        <div class="col-md-4  align-self-center">
                            <img src="${data[0].strMealThumb}" class="w-100">
                        </div>
                        <div class="col-md-8 px-3 align-self-center">
                            <div class="card-block px-3">
                                <div id="heading" class="text-center">

                                </div>
                                <h2 class="card-title" id="results-heading">${data[0].strMeal}</h2>
                                <p id="category">Category : ${data[0].strCategory}</p>
                                <p d="area">Area : ${data[0].strArea}</p>


                                <h5>Instruction :</h5>
                                <p class="card-text" id="recipe-intro">
                                    ${data[0].strInstructions}</p>
                                <a href="${data[0].strYoutube}"  target="_blank" class="btn btn-warning">Video</a>

                                
                            </div>
                        </div>

                    </div>
                </div>
            </div>`;
    });
    document.getElementById("searchResults").innerHTML = html;
}

// Function to render search results
function renderSearchResults(meals) {
    favListVar = false;
    const searchResults = document.getElementById('searchResults');
    let favListArr = localStorage.getItem("favouritesList");
    searchResults.innerHTML = '';
    console.log(meals);
    if(meals.length !== 0){
        meals.forEach(meal => {   
            let isFavourite = false;
            if(favListArr.includes(meal.idMeal)){
                isFavourite = true;
            }   
                 
            const mealItem = `
                <div class = "card" id = "card">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class = "card-image">
                    <div class = "card-body">
                        <h5 class = "card-title"> ${meal.strMeal}</h5>
                        <div class = "d-flex justify-content-between">
                            <a href = "/recipe-detail.html?${meal.idMeal}">
                                <button id = "recipe-btn" type = "button" class = "btn btn-warning">
                                    Recipe
                                </button>
                            </a>
                            <button class="btn btn-outline-light ${isFavourite ? 'active' : ''}" onClick = "addAndRemoveTOFavoritesList(${meal.idMeal})" id = "meal${meal.idMeal}">
                                <i class="fa-solid fa-heart"></i>
                            </button>
    
                        </div>
                    </div>
                </div>
            `;
            searchResults.innerHTML += mealItem;            
            
        });
    }
    else{
        searchResults.innerHTML += `
                    <div class = "container">
                        <div class="mb-4 lead heading2 white text-center">
                        The meal you are looking for was not found...
                        </div>
                    </div>`;
    }    
}



//function to add or delete from the favourites list
function addAndRemoveTOFavoritesList(mealId){
    console.log("entered");

    let favListArr = JSON.parse(localStorage.getItem('favouritesList'));
    let isExists = false;

    for(let ind = 0; ind < favListArr.length; ind++){
        if(mealId == favListArr[ind]){
            isExists = true;
            break;
        }
    }
    if(isExists){
        let itemIndex = favListArr.indexOf(mealId);
        const confirmed = window.confirm('Are you sure you want to delete this item?');
        if(confirmed){
            favListArr.splice(itemIndex, 1);
        }
    }
    else{
        favListArr.push(mealId);
        window.alert("your meal is added to your favourites list");
    }
    localStorage.setItem('favouritesList', JSON.stringify(favListArr));
    console.log(`favListVar: ${favListVar}`);
    if(favListVar){
        renderFavoriteMealResults();
    }
    else{
        inputSearchResults();
    }
}

const searchInput = document.getElementById('searchInput');

//function to fetch results based on search input
async function inputSearchResults(){
    const query = searchInput.value.trim();
    
    const meals = await fetchMeals('https://www.themealdb.com/api/json/v1/1/search.php?s=', query);
    renderSearchResults(meals);
}

// Event listeners for search input
searchInput.addEventListener('input', inputSearchResults);

searchInput.addEventListener("keydown", (event)=>{
    if(event.key === "Enter" && searchInput.value.trim() !== ""){
        inputSearchResults();
    }
})

//event listener for search icon
searchBtn.addEventListener('click', inputSearchResults);