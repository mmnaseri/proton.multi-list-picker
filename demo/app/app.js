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
        self && self.webView && self.webView.scrollView && (self.webView.scrollView.bounces = NO);
        angular.element(document.body).on("touchmove", function (event) {
            event.preventDefault();
        })
    });

    module.controller("MainController", function ($scope) {
        $scope.pivotYear = 2000;
        $scope.model = {
            year: $scope.pivotYear,
            month: 2,
            day: 4,
            time: "01"
        };
        $scope.getYears = function () {
            var result = [];
            for (var i = $scope.pivotYear - 50; i < $scope.pivotYear + 50; i ++) {
                result.push(i);
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