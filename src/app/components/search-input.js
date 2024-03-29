/**
 * Search Input
 */
import angular from 'angular';

export default {
  bindings: {
    'query': '=',
    'search': '&onSearch',
    'clearResults': '&onClearResults'
  },
  template: [
    '<div class="search-input" ng-keydown="searchInput.handleInput($event)">',
      '<input type="text" ng-model="searchInput.query" placeholder="Search for a movie..."></input>',
      '<a href ng-click="searchInput.resetQuery()"><i ng-show="searchInput.query.length" class="mdi-navigation-close"></i></a>',
    '</div>'
  ].join(''),
  controller: [
    function () {

      /**
       * Handle key input
       * @param  {object} e the event
       */
      this.handleInput = (e) => {
        if (e.keyCode === 13 && this.query) {
          this.search({query: this.query});
        }
      }

      /**
       * Reset the query
       */
      this.resetQuery = () => {
        this.query = '';
        this.clearResults();
      }

    }
  ]
};