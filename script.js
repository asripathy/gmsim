var gmApp = angular.module('gmsim', []);

gmApp.controller('gmCtrl', function($scope) {
    $scope.draftSlot = 3;
    $scope.validSlot = true;
    $scope.draftStarted = false;
    $scope.options;
    $scope.selectedIndex = -1;
    $scope.validateSlot = function(){
      if($scope.slotSelect.slotChoice.$valid){
        $scope.validSlot = true;
      }
      else{
        $scope.validSlot = false;
      }
    }
    $scope.generatePicks = function(){
      $scope.draftStarted = true;
      $scope.options = getPlayersAttributes($scope.draftSlot);
    }
    $scope.markSelected = function(number){
      if($scope.selectedIndex == -1){
        $scope.selectedIndex = number;
      }
    }
});

getPlayersAttributes(1);

function getPlayersAttributes(index) {
    arr = [];
    for (var i = 1 ; i <= 3; i++) {
        playerAttributes = {
            risk : Math.random() * 50,
            upside : (80 / Math.pow(index, 0.25)) + (Math.random() * 25) - 5
        };
        playerAttributes.type = getPlayerType(playerAttributes['upside']);
        arr.push(playerAttributes);
        console.log(playerAttributes);
    }
    return arr;
}

function getPlayerType(upside) {
    if (upside > 90)
        return "superstar";
    else if (upside > 80)
        return "star";
    else if (upside > 70)
        return "stud";
    else if (upside > 60)
        return "role-player";
    else if (upside > 50)
        return "specialist";
    else
        return "bust";
}
