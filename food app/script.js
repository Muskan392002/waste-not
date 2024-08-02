document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('food-form');
    const foodList = document.getElementById('food-list');
    const recipeList = document.getElementById('recipe-list');
    const favoriteList = document.getElementById('favorite-list');

    let storedFood = JSON.parse(localStorage.getItem('storedFood')) || [];
    let favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('food-name').value;
        const quantity = document.getElementById('quantity').value;
        const expirationDate = document.getElementById('expiration-date').value;

        const foodItem = { name, quantity, expirationDate };
        storedFood.push(foodItem);
        localStorage.setItem('storedFood', JSON.stringify(storedFood));

        form.reset();
        displayFood();
        suggestRecipes(storedFood);
    });

    function displayFood() {
        const now = new Date().getTime();
        foodList.innerHTML = '';
        storedFood.forEach((food, index) => {
            const expirationTime = new Date(food.expirationDate).getTime();
            const isNearExpiration = expirationTime - now < 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

            const li = document.createElement('li');
            li.className = 'food-item';
            li.innerHTML = `
                ${food.name} - ${food.quantity} - ${food.expirationDate}
                <div>
                    <button onclick="editFood(${index})">Edit</button>
                    <button onclick="removeFood(${index})">Remove</button>
                </div>
            `;

            if (isNearExpiration) {
                li.style.color = 'red';
            }

            foodList.appendChild(li);
        });
    }

    window.editFood = function(index) {
        const food = storedFood[index];
        document.getElementById('food-name').value = food.name;
        document.getElementById('quantity').value = food.quantity;
        document.getElementById('expiration-date').value = food.expirationDate;
        storedFood.splice(index, 1);
        localStorage.setItem('storedFood', JSON.stringify(storedFood));
        displayFood();
    }

    window.removeFood = function(index) {
        storedFood.splice(index, 1);
        localStorage.setItem('storedFood', JSON.stringify(storedFood));
        displayFood();
        suggestRecipes(storedFood);
    }

    function suggestRecipes(foodItems) {
        const recipes = [
            { name: 'Fruit Salad', ingredients: ['Apple', 'Banana', 'Orange'] },
            { name: 'Vegetable Stir Fry', ingredients: ['Carrot', 'Broccoli', 'Bell Pepper'] },
            { name: 'Omelette', ingredients: ['Egg', 'Cheese', 'Tomato'] }
        ];

        recipeList.innerHTML = '';

        recipes.forEach(recipe => {
            const matchedIngredients = recipe.ingredients.filter(ingredient => 
                foodItems.some(foodItem => foodItem.name.toLowerCase() === ingredient.toLowerCase())
            );

            const matchPercentage = (matchedIngredients.length / recipe.ingredients.length) * 100;
            
            if (matchPercentage > 0) {
                const li = document.createElement('li');
                li.className = 'recipe-item';
                li.innerHTML = `
                    ${recipe.name} (${matchPercentage.toFixed(0)}% match)
                    <button onclick="addFavorite('${recipe.name}')">Add to Favorites</button>
                `;
                recipeList.appendChild(li);
            }
        });
    }

    window.addFavorite = function(recipeName) {
        if (!favoriteRecipes.includes(recipeName)) {
            favoriteRecipes.push(recipeName);
            localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
            displayFavorites();
        }
    }

    function displayFavorites() {
        favoriteList.innerHTML = '';
        favoriteRecipes.forEach(recipe => {
            const li = document.createElement('li');
            li.textContent = recipe;
            favoriteList.appendChild(li);
        });
    }

    displayFood();
    suggestRecipes(storedFood);
    displayFavorites();
});