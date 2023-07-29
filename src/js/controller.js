import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookMarkView from './views/bookMarkView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    //图片加载转动
    recipeView.renderSpinner();

    //更新结果视图以标记选定的搜索结果
    resultsView.update(model.getSearchPage());
    //更新收藏视图
    bookMarkView.update(model.state.bookmarks);

    //加载食谱
    await model.loadRecipe(id);

    //渲染食谱
    recipeView.render(model.state.recipe);
    console.log(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    //提供搜索内容
    const query = searchView.getQuery();
    if (!query) return;

    //图片加载转动
    resultsView.renderSpinner();

    //加载搜索结果
    await model.loadSearchResults(query);

    //渲染结果
    //resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchPage());

    //渲染分页
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  //渲染新页的结果
  resultsView.render(model.getSearchPage(goToPage));

  //渲染新分页
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //更新菜单服务
  model.updateServings(newServings);

  //更新食谱
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookMark = function () {
  //添加和删除收藏
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookMark(model.state.recipe.id);
  console.log(model.state.recipe);
  //更新收藏视图
  recipeView.update(model.state.recipe);

  //渲染收藏栏
  bookMarkView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookMarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    //更新新菜单数据
    await model.uploadRecipe(newRecipe);
    //console.log(model.state.recipe);

    //渲染新添菜单
    recipeView.render(model.state.recipe);
    //发送创建成功信息
    addRecipeView.renderMessage();
    //更新收藏
    bookMarkView.render(model.state.bookmarks);
    //更换url的id
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //关闭添加菜单表格
    setTimeout(
      function () {
        // addRecipeView.toggleWindow();
      }.MODAL_CLOSE_SEC * 1000
    );
  } catch (err) {
    console.error('😄', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookMarkView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServing(controlServings);
  recipeView.addHandlerAddBookMark(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPaginationView(controlPagination);
  addRecipeView.addHandlerFrom(controlAddRecipe);
};
init();
