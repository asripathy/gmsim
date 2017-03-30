var gmApp = angular.module('gmsim', []);

gmApp.controller('gmCtrl', function($scope) {
    $scope.draftSlot = 3;
    $scope.validSlot = true;
    $scope.draftStarted = false;
    $scope.options = [0, 1, 2];
    $scope.playerOptions;
    $scope.drafted = false;
    $scope.selectedPlayer;
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
      $scope.playerOptions = getPlayersAttributes($scope.draftSlot);
    }
    $scope.markSelected = function(pick){
      if($scope.drafted == false){
        $scope.drafted = true;
        $scope.selectedPlayer = pick;
      }
    }
});

function getPlayersAttributes(index) {
    arr = [];
    for (var i = 1 ; i <= 3; i++) {
        playerAttributes = {
            risk : Math.round(Math.random() * 50),
            upside : Math.round((80 / Math.pow(index, 0.25)) + (Math.random() * 25) - 5)
        };
        playerAttributes.type = getPlayerType(playerAttributes.upside, playerAttributes.risk);
        arr.push(playerAttributes);
        console.log(playerAttributes);
    }
    return arr;
}

function getPlayerType(upside, risk) {
    val = upside - (0.7 * risk);
    if (val > 75)
        return "Superstar";
    else if (val > 65)
        return "Star";
    else if (val > 55)
        return "Stud";
    else if (val > 45)
        return "Role-player";
    else if (val > 25)
        return "Specialist";
    else
        return "Bust";
}
