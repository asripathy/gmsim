var gmApp = angular.module('gmsim', []);

gmApp.controller('gmCtrl', function($scope) {
    $scope.draftSlot = 3;
    $scope.options = [0, 1, 2];
    $scope.draftStarted = false;
    $scope.selectedIndex = -1;
    $scope.validSlot = true;
    $scope.markSelected = function(number){
      if($scope.selectedIndex == -1){
        $scope.selectedIndex = number;
      }
    }
    $scope.generatePicks = function(){
      $scope.draftStarted = true;
      console.log("Draft Started!");
    }
    $scope.validateSlot = function(){
      if($scope.slotSelect.slotChoice.$valid){
        $scope.validSlot = true;
      }
      else{
        $scope.validSlot = false;
      }
    }

});
