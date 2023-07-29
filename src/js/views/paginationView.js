import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerPaginationView(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPrePage
    );
    console.log(numPages);
    //第一页和其他页
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupButtonUp();
    }
    //最后一页
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupButtonDown();
    }
    //其他页
    if (curPage < numPages) {
      return this._generateMarkupButtonDown() + this._generateMarkupButtonUp();
    }
    //第一页没有其他页
    return '';
  }
  _generateMarkupButtonUp() {
    return `
    <button data-goto="${
      this._data.page + 1
    }" class=" btn--inline pagination__btn--next">
    <span>Page ${this._data.page + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>`;
  }
  _generateMarkupButtonDown() {
    return `
    <button data-goto="${
      this._data.page - 1
    }" class=" btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>page ${this._data.page - 1}</span>
        </button>
       `;
  }
}

export default new PaginationView();
