var gmApp = angular.module('gmsim', []);

gmApp.controller('gmCtrl', function($scope) {
    //Draft Slot information
    $scope.draftSlot = 3;
    $scope.validSlot = true;

    //Information on players available and selected
    $scope.options = [0, 1, 2];
    $scope.playerOptions;
    $scope.selectedPlayer;

    //Information on state of draft
    $scope.draftComplete = false;
    $scope.draftActive = false;
    $scope.roundActive = false;

    //Ensures valid slot offered
    $scope.validateSlot = function(){
      if($scope.slotSelect.slotChoice.$valid)
        $scope.validSlot = true;
      else
        $scope.validSlot = false;
    }

    //Generates the available picks
    $scope.generatePicks = function(draftSlot){
      $scope.draftActive = true;
      $scope.roundActive = true;
      $scope.draftSlot = draftSlot;
      $scope.playerOptions = getPlayersAttributes($scope.draftSlot);
    }

    //Performs the actual selection
    $scope.markSelected = function(pick){
      if($scope.roundActive == true){
        $scope.selectedPlayer = pick;
        $scope.roundActive = false;
        if($scope.draftSlot > 30)
          $scope.draftComplete = true;
      }
    }
});

/*---------------------------PLAYER ATTRIBUTES CODE-------------------------------*/
var positions = ["Guard", "Wing", "Forward", "Big"];

function getPlayersAttributes(index) {
    arr = [];
    for (var i = 1 ; i <= 3; i++) {
        playerAttributes = {
            risk : Math.round(Math.random() * 50),
            upside : Math.round((90 / Math.pow(index, 0.15)) + (Math.random() * 10) - 1),
            position : positions[Math.floor(Math.random()*4)]
        };
        playerAttributes.type = getPlayerType(playerAttributes.upside, playerAttributes.risk);
        arr.push(playerAttributes);
        console.log(playerAttributes);
    }
    return arr;
}

function getPlayerType(upside, risk) {
    val = upside - (0.25 * risk);
    if (val >= 87)
        return "Superstar";
    else if (val >= 77)
        return "Star";
    else if (val >= 64)
        return "Stud";
    else if (val >= 52)
        return "Role-player";
    else if (val >= 45)
        return "Specialist";
    else
        return "Bust";
}
