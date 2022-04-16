// ----------------- IMPORTS ----------------- //

import './styles.css';
import apiCalls from './apiCalls';
import {getFetch, addIngredients} from './apiCalls.js'
import RecipeRepository from './classes/RecipeRepository';
import Recipe from './classes/Recipe';
import Ingredient from './classes/Ingredient';
import UserRepository from './classes/UserRepository';
import User from './classes/User';

// ----------------- QUERY SELECTORS ----------------- //

// --------HOME-PAGE-------- //
let mainPage = document.querySelector('.main-page-wrapper');
let recipeButtonList = document.querySelector('.recipe-list');
let viewRecipe = document.querySelector('.display-recipe-object');
let modal = document.querySelector('.modal');
let close = document.querySelector('.close');
let heartButton = document.querySelector('.heart-button-container');
let viewRtc = document.querySelector('.recipes-to-cook-button');
let addRecipesToCookButton = document.querySelector('.addRecipeToCook-button-container');

// --------FAVORITES-PAGE-------- //
let favoritesPage = document.querySelector('.favorites-page-wrapper');
let favoritesButtonList = document.querySelector('.favorites-list');
let viewFavorite = document.querySelector('.display-favorite-recipe-object');
let favoritesButton = document.querySelector('.favorites-button');
let favoriteModal = document.querySelector('.favorite-modal');
let favoritesClose = document.querySelector('.favorites-close');
let favoritesHeartButton = document.querySelector('.favorites-heart-button-container');
let homeButton = document.querySelector('.home-button');

// --------SEARCHED-PAGE-------- //
let searchInput = document.querySelector('.search-input');
let inputValue = document.querySelector('.search-input').value;
let searchedRecipes = document.querySelector('.display-searched-recipes');
let clearSearchButton = document.querySelector('.clear-search-button');

// --------FAVORITES SEARCHED-PAGE-------- //
let favoritesSearchInput = document.querySelector('.favorites-search-input');
let searchedFavorites = document.querySelector('.favorites-display-searched-recipes');
let searchFavoritesModal = document.querySelector('.display-search-favorite-recipe-object');
let favoritesRtcButton = document.querySelector('.favorites-rtc-button-container');

// --------RECIPES TO COOK PAGE-------- //
let rtcPage = document.querySelector('.rtc-page-wrapper');
let rtcButtonList = document.querySelector('.rtc-list');
let viewRecipesToCook = document.querySelector('.display-rtc-recipe-object');
let rtcClose = document.querySelector('.rtc-close');
let rtcHeartButton = document.querySelector('.rtc-heart-button-container');
let rtcHomeButton = document.querySelector('.rtc-home-button');
let rtcModal = document.querySelector('.rtc-modal');
let rtcRtcButton = document.querySelector('.rtc-rtc-button-container');

// --------MY PANTRY PAGE-------- //
let pantryHomeButton = document.querySelector('.pantry-home-button');
let pantryButton = document.querySelector('.my-pantry-button');
let pantryPage = document.querySelector('.my-pantry-wrapper');
let addIngredientsButton = document.querySelector('.add-pantry-ingredients-button');
let pantryModal = document.querySelector('.pantry-modal');
let pantryClose = document.querySelector('.pantry-close');
let pantryList = document.querySelector('.pantry-list');

const form = document.querySelector('#pantryForm');


// ----------------- GLOBAL VARIABLES ----------------- //

let ingredientList;
let recipeList;
let userList;
let user;

// ----------------- FUNCTIONS ----------------- //

const getRandomUser = (array) => {
  const user = array[Math.floor(Math.random() * array.length)];
  return user;
};

const getApiData = () => {
  Promise.all([
    getFetch('users'),
    getFetch('ingredients'),
    getFetch('recipes')
  ]).then(data => {
    createDataInstances(data)
    createRecipeList()
  });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const newIngredient = {
    userID: parseInt(formData.get('userId')),
    ingredientID: parseInt(formData.get('ingredientId')),
    ingredientModification: parseInt(formData.get('ingredientModification'))
  };
  console.log(newIngredient.userID)
  addIngredients(newIngredient);
  e.target.reset();
  refreshPantry(newIngredient.userID)
});

const refreshPantry = (userId) => {
  Promise.all([
    getFetch('users'),
    getFetch('ingredients'),
    getFetch('recipes')
  ]).then(data => {
    refreshDataInstances(data, userId)

  })
}

const createDataInstances = (data) => {
  ingredientList = new Ingredient(data[1]);
  recipeList = new RecipeRepository(data[2]);
  userList = new UserRepository(data[0]);
  user = getRandomUser(userList.userObjects);
  console.log(user);
};



const refreshDataInstances = (data, userId) => {
  getFetch('users')
  ingredientList = new Ingredient(data[1]);
  recipeList = new RecipeRepository(data[2]);
  userList = new UserRepository(data[0]);
  console.log("userList", userList)
  console.log("userListId", userList.userData.id)
  console.log("userListObjects", userList.userObjects)
  console.log("userId", userId)
  const findUser = () => {
    // const returnUser = userList.find(user => {
    //   userList.userData.forEach(id => console.log(id))
    // })
    // return returnUser
    userList.userObjects.forEach(user1 => {
      if (user1.userData.id === userId) {
        console.log("user1", user1)
        user.userData.pantry = user1.userData.pantry
      }
    })
    console.log("updated user", user)
  }

  // iterate over userList.userData to see where
  findUser();

  // console.log(user);
};

const displayPantryIngredients = () => {
  console.log("displaypantryuser", ingredientList)
  let pantryData = user.getPantryInfo(ingredientList)
  console.log(pantryData);
  pantryList.innerHTML = "";
    pantryData.forEach(ingredient => {
      pantryList.innerHTML += `
        <li class="pantry-ingredient-info">
          <h3 class="pantry-ingredient-title">${ingredient.name}</h3>
          <p class="pantry-ingredient-amount">Amount: ${ingredient.amount}</p>
        </li>`
    })
};

const createRecipeList = () => {
  recipeList.recipe.forEach(recipe => {
    recipeButtonList.innerHTML += `
      <button class="recipe-list-button" id="${recipe.recipe.id}">
      <h2 class="recipe-titles">${recipe.recipe.name}</h2>
      <img class="display-picture" src="${recipe.recipe.image}" alt="${recipe.recipe.name}">
      </button>`;
  });
};

const findRecipeId = (id) => {
  const filterRecipe = recipeList.recipe.find(recipe => {
    let stringifyId = recipe.recipe.id.toString();
    return stringifyId === id;
  });
  return filterRecipe;
};

const displayRecipe = (id, recipeElement, heartElement, rtcElement) => {
  const recipeInfo = findRecipeId(id);
  recipeElement.innerHTML = '';
  recipeElement.innerHTML += `
    <h2 class="display-recipe-name">${recipeInfo.recipe.name}</h2>
    <p class="instructions">Cooking Directions: ${recipeInfo.getDirections()}</p>
    <p class="ingredients">Ingredients: ${recipeInfo.getIngredient(ingredientList)}</p>
    <p class="cost">Cost: $${recipeInfo.calculateCost(ingredientList)}</p>`;
  heartElement.innerHTML = '';
  heartElement.innerHTML += `<button class="heart-button" id=${recipeInfo.recipe.id}>&hearts;</button>`;
  rtcElement.innerHTML = '';
  rtcElement.innerHTML += `<button class="addRecipeToCook-button" id=${recipeInfo.recipe.id}>+</button>`;
};


// if recipe element is RTC, then add html to RTC modal

const checkPantryInfo = (recipeId, recipeRepository, ingredientData) => {
  const ingredientsNeeded = user.determineIngredientsNeeded(recipeId, recipeRepository, ingredientData);
  // 2 scenarios
  if (ingredientsNeeded.length) {
    // inject p into modal saying you are missing x, y, ingredients
    viewRecipesToCook.innerHTML += `
    <p class="ingredients-needed">Oops! You don't have enough ingredients to cook this meal 😭 You need ${ingredientsNeeded.join(', ')}.</p>`
  } else {
    viewRecipesToCook.innerHTML += `<button class="cook-recipe-button">COOK RECIPE</button>`
  }
  console.log(ingredientsNeeded);
  console.log(findRecipeId(recipeId));
};

const searchByTagOrName = (input) => {
  const searchTag = recipeList.filterTags(input);
  const searchName = recipeList.filterName(input);
  searchedRecipes.innerHTML = '';
  const getRecipeByTag = searchTag.map(taggedRecipe => {
    recipeButtonList.innerHTML = '';
    searchedRecipes.innerHTML += `
      <button class="recipe-list-button" id="${taggedRecipe.id}">
      <h2 class="recipe-titles">${taggedRecipe.name}</h2>
      <img class="display-picture" src="${taggedRecipe.image}" alt="${taggedRecipe.name}">
      </button>`
  });
  const getRecipeByName = searchName.map(namedRecipe => {
    recipeButtonList.innerHTML = '';
    searchedRecipes.innerHTML += `
      <button class="recipe-list-button" id="${namedRecipe.id}">
      <h2 class="recipe-titles">${namedRecipe.name}</h2>
      <img class="display-picture" src="${namedRecipe.image}" alt="${namedRecipe.name}">
      </button>`;
  });
  showElement(clearSearchButton);
};

const showElement = (element) => {
  element.classList.remove('hidden');
};

const hideElement = (element) => {
  element.classList.add('hidden');
};

const createFavoritesList = () => {
  user.favorites.forEach(favorite => {
    favoritesButtonList.innerHTML += `
      <button class="favorites-list-button" id="${favorite.recipe.id}">
      <h2 class="favorite-recipe-titles">${favorite.recipe.name}</h2>
      <img class="display-picture" src="${favorite.recipe.image}" alt="${favorite.recipe.name}">
      </button>`;
  });
};

const searchFavoritesByTagOrName = (input) => {
  const searchTag = user.filterFavoriteTags(input);
  const searchName = user.filterFavoriteNames(input);
  const getRecipeByTag = searchTag.map(taggedRecipe => {
    favoritesButtonList.innerHTML = '';
    searchedFavorites.innerHTML += `
      <button class="recipe-list-button" id="${taggedRecipe.recipe.id}">
      <h2 class="favorite-recipe-titles">${taggedRecipe.recipe.name}</h2>
      <img class="display-picture" src="${taggedRecipe.recipe.image}" alt="${taggedRecipe.recipe.name}">
      </button>`;
  });
  const getRecipeByName = searchName.map(namedRecipe => {
    favoritesButtonList.innerHTML = '';
    searchedFavorites.innerHTML += `
      <button class="recipe-list-button" id="${namedRecipe.recipe.id}">
      <h2 class="favorite-recipe-titles">${namedRecipe.recipe.name}</h2>
      <img class="display-picture" src="${namedRecipe.recipe.image}" alt="${namedRecipe.recipe.name}">
      </button>`;
  });
};

const createRecipesToCookList = () => {
  user.recipesToCook.forEach(recipe => {
    rtcButtonList.innerHTML += `
      <button class="rtc-list-button" id="${recipe.recipe.id}">
      <h2 class="rtc-titles">${recipe.recipe.name}</h2>
      <img class="display-picture" src="${recipe.recipe.image}" alt="${recipe.recipe.name}">
      </button>`;
  });
};


// ----------------- EVENT LISTENERS ----------------- //

window.addEventListener('load', getApiData);

recipeButtonList.addEventListener('click', (e) => {
  let targetId = e.target.getAttribute('id');
  displayRecipe(targetId, viewRecipe, heartButton, addRecipesToCookButton);
  modal.style.display = 'block';
});

close.addEventListener('click', (e) => {
  modal.style.display = 'none';
});

heartButton.addEventListener('click', (e) => {
  let targetId = e.target.getAttribute('id');
  user.favoriteRecipe(targetId, recipeList);
  event.target.style.color = '#F95624';
});

searchedRecipes.addEventListener('click', (e) => {
  let targetId = e.target.getAttribute('id');
  displayRecipe(targetId, viewRecipe, heartButton, addRecipesToCookButton);
  modal.style.display = 'block';
});

searchInput.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    let inputValue = e.target.value.toLowerCase();
    searchByTagOrName(inputValue);
  };
});

favoritesButton.addEventListener('click', (e) => {
  hideElement(mainPage);
  showElement(favoritesPage);
  favoritesButtonList.innerHTML = '';
  createFavoritesList();
});

favoritesButtonList.addEventListener('click', (e) => {
  let targetId = e.target.getAttribute('id');
  displayRecipe(targetId, viewFavorite, favoritesHeartButton, favoritesRtcButton);
  favoriteModal.style.display = 'block';
});

favoritesClose.addEventListener('click', (e) => {
  favoriteModal.style.display = 'none';
  favoritesButtonList.innerHTML = '';
  createFavoritesList();
  searchedFavorites.innerHTML = '';
  favoritesSearchInput.value = '';
});

favoritesSearchInput.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    let inputValue = e.target.value.toLowerCase();
    searchFavoritesByTagOrName(inputValue);
  };
});

searchedFavorites.addEventListener('click', (e) => {
  let targetId = e.target.getAttribute('id');
  displayRecipe(targetId, viewFavorite, favoritesHeartButton, favoritesRtcButton);
  favoriteModal.style.display = "block";
});

homeButton.addEventListener('click', (e) => {
  hideElement(favoritesPage);
  showElement(mainPage);
  searchedFavorites.innerHTML = '';
});

clearSearchButton.addEventListener('click', (e) => {
  hideElement(clearSearchButton);
  createRecipeList();
  searchInput.value = '';
});

viewRtc.addEventListener('click', (e) => {
  hideElement(mainPage);
  showElement(rtcPage);
  rtcButtonList.innerHTML = '';
  createRecipesToCookList();
});

rtcHomeButton.addEventListener('click', (e) => {
  hideElement(rtcPage);
  showElement(mainPage);
});

addRecipesToCookButton.addEventListener('click', (e) => {
  let targetId = e.target.getAttribute('id');
  user.addRecipesToCook(targetId, recipeList);
  event.target.style.color = '#F95624';
});

rtcButtonList.addEventListener('click', (e) => {
  let targetId = e.target.getAttribute('id');
  displayRecipe(targetId, viewRecipesToCook, rtcHeartButton, rtcRtcButton);
  checkPantryInfo(targetId, recipeList, ingredientList);
  // call RTC pantry function
  rtcModal.style.display = 'block';
});

rtcClose.addEventListener('click', (e) => {
  rtcModal.style.display = 'none';
});

favoritesHeartButton.addEventListener('click', (e) => {
  let targetId = e.target.getAttribute('id');
  user.unfavoriteRecipe(targetId);
  event.target.style.color = 'black';
});

pantryHomeButton.addEventListener('click', (e) => {
  hideElement(pantryPage);
  showElement(mainPage);
});

pantryButton.addEventListener('click', (e) => {
  hideElement(mainPage);
  showElement(pantryPage);
  displayPantryIngredients(ingredientList);
});

addIngredientsButton.addEventListener('click', (e) => {
  pantryModal.style.display = 'block';
});

pantryClose.addEventListener('click', (e) => {
  pantryModal.style.display = 'none';
  displayPantryIngredients()
});


export default refreshPantry;
