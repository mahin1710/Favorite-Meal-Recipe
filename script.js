const apiBaseUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const showAllButton = document.getElementById('showAllButton');

searchButton.addEventListener('click', searchMeals);
showAllButton.addEventListener('click', showAllMeals);

// Listen for Enter key press in the input field
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchMeals();
    }
});

function searchMeals() {
    const query = searchInput.value.trim();
    if (!query) return;

    fetch(apiBaseUrl + query)
        .then(response => response.json())
        .then(data => displayMeals(data.meals, true))
        .catch(error => console.error('Error fetching meals:', error));
}

function displayMeals(meals, isNewSearch = false) {
    const resultsContainer = document.getElementById('mealResults');
    const showAllContainer = document.getElementById('showAllContainer');

    if (isNewSearch) resultsContainer.innerHTML = '';

    if (!meals || meals.length === 0) {
        resultsContainer.innerHTML = '<p class="text-center text-danger">No meals found.</p>';
        showAllContainer.style.display = 'none';
        return;
    }

    const mealsToShow = isNewSearch ? meals.slice(0, 5) : meals;
    mealsToShow.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.className = 'col-12 col-md-6 col-lg-4';
        mealCard.innerHTML = `
            <div class="card h-100">
                <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                <div class="card-body">
                    <h5 class="card-title">${meal.strMeal}</h5>
                    <p class="card-text">
                        ${meal.strInstructions.slice(0, 100)}...
                        <a href="#" class="see-more" data-full-text="${meal.strInstructions}">See More</a>
                    </p>
                    <p class="text-muted">Meal ID: ${meal.idMeal}</p>
                </div>
            </div>
        `;
        resultsContainer.appendChild(mealCard);
    });

    if (isNewSearch && meals.length > 5) {
        showAllContainer.style.display = 'block';
    } else {
        showAllContainer.style.display = 'none';
    }

    addSeeMoreEventListeners();
}

function showAllMeals() {
    const query = searchInput.value.trim();
    if (!query) return;

    fetch(apiBaseUrl + query)
        .then(response => response.json())
        .then(data => displayMeals(data.meals, false))
        .catch(error => console.error('Error fetching meals:', error));
}

function addSeeMoreEventListeners() {
    document.querySelectorAll('.see-more').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const fullText = event.target.getAttribute('data-full-text');
            event.target.parentElement.innerHTML = fullText;
        });
    });
}
