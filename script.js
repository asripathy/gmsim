var gmApp = angular.module('gmsim', []);

gmApp.controller('gmCtrl', function($scope) {
    $scope.draftSlot = 3;
    $scope.options = [0, 1, 2];
    $scope.selectedIndex = -1;
    $scope.markSelected = function(number){
      if($scope.selectedIndex == -1){
        $scope.selectedIndex = number;
        console.log(number);
      }
    }

});

gmApp.directive("draftPick", function() {
    return {
        template : "<div>Possible Draft Pick</div>"

    };
});
