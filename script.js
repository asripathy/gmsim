var gmApp = angular.module('gmsim', []);

gmApp.controller('gmCtrl', function($scope) {

    $scope.year = 2017;
    /*---------------------------TEAM CODE-------------------------------*/
    $scope.startingGuard;
    $scope.startingWing;
    $scope.startingFlex;
    $scope.startingForward;
    $scope.startingBig;
    $scope.sixthMan;

    var playerTypes = ["Stud", "Role-player", "Role-player", "Role-player", "Role-player"];
    $scope.initializeTeam = function() {
        $scope.startingGuard = getDefaultPlayer("Guard", playerTypes.splice(Math.floor(Math.random()*playerTypes.length), 1)[0]);
        $scope.startingWing = getDefaultPlayer("Wing", playerTypes.splice(Math.floor(Math.random()*playerTypes.length), 1)[0]);
        $scope.startingForward = getDefaultPlayer("Forward", playerTypes.splice(Math.floor(Math.random()*playerTypes.length), 1)[0]);
        $scope.startingBig = getDefaultPlayer("Big", playerTypes.splice(Math.floor(Math.random()*playerTypes.length), 1)[0]);
        $scope.startingFlex = getDefaultPlayer(positions[Math.floor(Math.random()*4)], playerTypes.splice(Math.floor(Math.random()*playerTypes.length), 1)[0]);
        $scope.sixthMan = getDefaultPlayer(positions[Math.floor(Math.random()*4)], "Specialist");
    }
    $scope.initializeTeam();

    /*---------------------------DRAFT CODE-------------------------------*/
    //Draft Slot information
    $scope.draftSlot = 8;
    $scope.validSlot = true;

    //Information on players available and selected
    $scope.options = [0, 1, 2];
    $scope.playerOptions;
    $scope.selectedPlayer;

    //Information on state of draft
    $scope.draftComplete = false;
    $scope.draftActive = false;
    $scope.roundActive = false;

    $scope.team = [];

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
        $scope.team.push(pick);
        $scope.roundActive = false;
        if($scope.draftSlot > 30){
          $scope.draftComplete = true;
        }
      }
    }
    /*---------------------------END DRAFT CODE-------------------------------*/
});

/*---------------------------PLAYER ATTRIBUTES CODE-------------------------------*/
// TODO refactor player object names
var positions = ["Guard", "Wing", "Forward", "Big"];

function getPlayersAttributes(index) {
    arr = [];
    for (var i = 1 ; i <= 3; i++) {
        playerAttributes = {
            risk : Math.round(Math.random() * 50),
            upside : Math.round((90 / Math.pow(index, 0.15)) + (Math.random() * 10) - 1),
            position : positions[Math.floor(Math.random()*4)]
        };
        playerAttributes.val = playerAttributes.upside - (0.25 * playerAttributes.risk);
        playerAttributes.type = getPlayerType(playerAttributes.val);
        arr.push(playerAttributes);
        console.log(playerAttributes);
    }
    return arr;
}

function getPlayerType(val) {
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

function getDefaultPlayer(playerPosition, playerType) {
    var value = 0;
    if (playerType == "Stud")
        value = 70;
    else if (playerType == "Role-player")
        value = 58;
    else if (playerType == "Specialist")
        value = 48;
    
    return {
        risk: 0,
        upside: value,
        val: value,
        type: playerType,
        position: playerPosition
    }
}