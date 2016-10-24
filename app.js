var app = angular.module('app', ['ui.grid', 'ui.grid.grouping', 'nvd3']);

var gridApi1;

app.controller('MainCtrl', ['$scope', '$http','uiGridGroupingConstants', function($scope, $http,uiGridGroupingConstants) {
  $scope.gridOptions = {
    enableFiltering: true,
    enableGroupHeaderSelection: true,
    treeRowHeaderAlwaysVisible: false,
    onRegisterApi: function( gridApi ) {
      $scope.gridApi = gridApi;
      gridApi1 = gridApi;
     
    }
  };

  $scope.$on('$routeChangeSuccess', function() {
    $scope.gridApi.treeBase.expandAllRows();
});
 $scope.$watch('$viewContentLoaded', function(){
    $scope.gridApi.treeBase.expandAllRows();
 });


  $scope.gridOptions.columnDefs = [
    {
    field: 'company' , grouping: { groupPriority: 0 }
  },
    {
    field: 'name'
  }, {
    field: 'gender'
  }, {
    field: 'spark',
    cellTemplate: 'sparkline-cell.html',
    width: 100
  },{ name: 'balance', treeAggregationType: uiGridGroupingConstants.aggregation.AVG }

  ];

  $http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/500_complex.json')
    .success(function(data) {
      data.forEach(function(d) {
        d.spark = {
          options: {
            chart: {
              type: 'sparklinePlus',
              height: 20,
              width: 100,
              x: function(xd, i) {
                return i;
              }
            }
          },
          data: []
        };

    d.balance =  Number(d.balance.replace(/[^0-9\.]+/g,""));
   
    
        // Generate random X values
        for (i = 0; i < 10; i++) {
          d.spark.data.push({
            x: i,
            y: Math.floor(Math.random() * (100 - 1 + 1) + 1)
          });
        }
      });

      $scope.gridOptions.data = data;
    });
}]);


angular.element(document).ready(function () {

      $scope.gridApi.treeBase.expandAllRows();

});
    