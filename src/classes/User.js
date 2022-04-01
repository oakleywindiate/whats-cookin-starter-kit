import RecipeRepository from './RecipeRepository'

class User {
  constructor(userData) {
    this.userData = userData;
    this.favorites = [];
  };

  favoriteRecipe(id, recipeRepository) {
    this.favorites.push(recipeRepository.findRecipeById(id));
  }

  unfavoriteRecipe(id) {
    const unfavoriteIndex = this.favorites.findIndex(favoritedRecipe => {
      return favoritedRecipe.recipe.id === id
    })
    this.favorites.splice(unfavoriteIndex, 1);
  }

  filterFavoriteTags(tag) {
    const filterFavoriteByTag = this.favorites.filter(favorite =>
    favorite.recipe.tags.includes(tag))
    return filterFavoriteByTag
  };

  filterFavoriteNames(name) {
    const filterFavoriteRecipesByName = this.favorites.filter(favorite =>     favorite.recipe.name.includes(name))
    return filterFavoriteRecipesByName
  };

};

export default User;
