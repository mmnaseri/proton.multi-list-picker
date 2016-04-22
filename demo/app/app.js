/**
 * @author Milad Naseri (mmnaseri@programmer.net)
 * @since 1.0 (4/8/16)
 */
/**
 * AngularJS module for demoing the component
 * @type {angular.Module}
 */
(function () {
    var module = angular.module('protonMultiListSelector', ['proton.multi-list-picker', 'ngSanitize', 'mn']);

    module.run(function () {
    });

    module.controller("MainController", function ($scope) {
        $scope.model = {
            year: 2000,
            month: 2,
            day: 4,
            time: "01"
        };
        $scope.getYears = function () {
            var result = [];
            for (var i = 0; i < 100; i ++) {
                result.push(1950 + i);
            }
            return result;
        };
        $scope.getDays = function (year, month) {
            var result = [];
            for (var i = 1; i < 30; i ++) {
                result.push(i);
            }
            return result;
        };
        $scope.getMinutes = function () {
            var result = {};
            for (var i = 0; i < 60; i ++) {
                result[i] = i < 10 ? ("0" + i) : i;
            }
            return result;
        };
    });
})();