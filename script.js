var gmApp = angular.module('gmsim', []);

gmApp.controller('gmCtrl', function($scope) {
    $scope.draftSlot = 3;
    $scope.selections = [4, 2, 3];

});

gmApp.directive("draftPick", function() {
    return {
        template : "<div>Possible Draft Pick</div>"
    };
});
