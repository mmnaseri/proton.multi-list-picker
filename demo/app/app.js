/**
 * @author Milad Naseri (mmnaseri@programmer.net)
 * @since 1.0 (4/8/16)
 */
/**
 * AngularJS module for demoing the component
 * @type {angular.Module}
 */
var module = angular.module('protonMultiListSelector', ['proton.multi-list-picker']);

module.run(function () {
});

module.controller("MainController", function ($scope) {
    $scope.model = {
        year: 2000,
        month: 2,
        day: 13
    };
    var result = [];
    $scope.getYears = function () {
        result.length = 0;
        for (var i = 0; i < 1; i ++) {
            result.push(1950 + i);
        }
        return result;
    };
});