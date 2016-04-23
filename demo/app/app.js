/**
 * @author Milad Naseri (mmnaseri@programmer.net)
 * @since 1.0 (4/8/16)
 */
/**
 * AngularJS module for demoing the component
 * @type {angular.Module}
 */
(function () {
    var module = angular.module('protonMultiListSelector', ['proton.multi-list-picker', 'ngSanitize']);

    module.run(function () {
        self && self.webView && self.webView.scrollView && (self.webView.scrollView.bounces = NO);
        angular.element(document.body).on("touchmove", function (event) {
            event.preventDefault();
        })
    });

    module.controller("MainController", function ($scope) {
        $scope.pivotYear = 2000;
        $scope.model = {
            hour: 11,
            minute: 59
        };
        $scope.attachment = "inline";
        $scope.bindHtml = "true";
        var years = [];
        $scope.getYears = function () {
            return years;
        };
        $scope.$watch('pivotYear', function (year) {
            year -= 50;
            years = [];
            for (var i = 0; i < 100; i ++) {
                years.push(year + i);
            }
        });
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
        $scope.$watch('model.hour', function (newValue, oldValue) {
            var now = parseInt(newValue);
            var then = parseInt(oldValue);
            if (now > 9 && then < 9 || now < 3 && then > 9) {
                $scope.model.time = $scope.model.time == "AM" ? "PM" : "AM";
            }
        });
    });
})();
