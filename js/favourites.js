const favResults = document.getElementById('favouriteResults');
//function to render favourites list
async function renderFavoriteMealResults(){
    favListVar = true;
    let favListArr = JSON.parse(localStorage.getItem('favouritesList'));
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    favResults.innerHTML = '';
    if(favListArr.length !== 0){
        favListArr.forEach(async (mealId)=>{
            await fetchMeals(url, mealId)
                    .then(data=>{
                        favResults.innerHTML += `
                            <div class = "card" id = "card">
                                <img src="${data[0].strMealThumb}" alt="${data[0].strMeal}" class = "card-image">
                                <div class = "card-body">
                                    <h5 class = "card-title"> ${data[0].strMeal}</h5>
                                    <div class = "d-flex justify-content-between">
                                        <a href = "/recipe-detail.html?${data[0].idMeal}">
                                            <button id = "recipe-btn" type = "button" class = "btn btn-warning" onClick = "renderMealDetails(${data[0].idMeal})">
                                                Recipe
                                            </button>
                                        </a>
                                        <button class="btn btn-outline-light" onClick = "addAndRemoveTOFavoritesList(${data[0].idMeal})" id = "meal${data[0].idMeal}">
                                            <i class="fa fa-trash" aria-hidden = "true"></i>
                                        </button>
                
                                    </div>
                                </div>
                            </div>
                        `;
                        
                    });
        })
    }
    else{
        favResults.innerHTML += `
            <div class = "container">
                <div class="mb-4 lead heading2 white text-center">
                    No meal added in your favourites list...
                </div>
            </div>
        `;
    }
}

//rendering favourites list
renderFavoriteMealResults();