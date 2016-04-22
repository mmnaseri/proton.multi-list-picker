/**
 * @author Milad Naseri (mmnaseri@programmer.net)
 * @since 1.0 (4/21/16)
 */
(function () {
    var templates = {
        picker: "$/proton/multi-list-picker/picker.html"
    };
    var module = angular.module('proton.multi-list-picker', []);
    module.run(['$templateCache', function ($templateCache) {
        $templateCache.put(templates.picker, "<div><span ng-transclude class='proton-multi-list-picker'></span></div>");
    }]);
    module.directive('protonMultiListPicker', ["$parse", function ($parse) {
        return {
            restrict: "E",
            templateUrl: templates.picker,
            require: "?ngModel",
            controllerAs: "controller",
            scope: {},
            transclude: true,
            controller: function ProtonMultiListPickerController($scope, $element, $attrs) {
                this.name = "picker";
            },
            link: function ($scope, $element, $attrs, ngModel) {
                var controller = $scope.controller;
                var parentScope = $element.parent().scope();
                $scope.attachment = "bottom";
                $attrs.$observe("attachment", function (attachment) {
                    $scope.attachment = attachment || "bottom";
                });
                $scope.model = null;
                $scope.$watch(function () {
                    return $parse($attrs.ngModel)(parentScope);
                }, function (model) {
                    $scope.model = model;
                    console.log(model);
                }, true);
            }
        };
    }]);
    module.directive('protonMultiListPickerList', [function () {
        return {
            scope: {
                source: "=?"
            },
            restrict: "E",
            require: "^protonMultiListPicker",
            controller: function ProtonMultiListPickerListController() {
                this.name = "list";
            },
            link: function ($scope, $element, $attrs, parent) {
                console.log($scope.source);
            }
        };
    }]);
    module.directive('protonMultiListPickerDivider', [function () {
        return {
            restrict: "E",
            link: function ($scope, $element) {
                var parent = $element.parent();
                var parentName = parent[0].nodeName.toLowerCase();
                if (/^proton[:-]?multi-?list-?picker$/.test(parentName) || parent.hasClass('proton-multi-list-picker')) {
                    parentName = "protonMultiListPicker";
                } else if (/^proton[:-]?multi-?list-?picker-?list$/.test(parentName) || parent.hasClass('proton-multi-list-picker-list')) {
                    parentName = "protonMultiListPickerList";
                } else {
                    console.log($element, parent);
                    throw new Error("Divider cannot be used inside " + parentName);
                }
                console.log(parent.controller(parentName));
            }
        };
    }]);
})();