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
        $templateCache.put(templates.picker, "<div class=\'proton-multi-list-picker\'>\n    <span ng-transclude class=\'proton-multi-list-picker-contents\'></span>\n    <div class=\'before\'></div>\n    <ul class=\'lists\'>\n        <li ng-repeat=\'list in items track by $index\'>\n            <span class=\'divider\' ng-if=\'list.$divider\' ng-bind=\'list.$divider\'></span>\n            <ul class=\'list\' ng-if=\'!list.$divider\' ng-init=\'cached = (list.source() | protonMultiListArrayOf); view = (cached | protonMultiListView:selected(list.alias, cached));\'>\n                <li ng-repeat=\'item in view\'><span ng-bind=\'item.label\'></span></li>\n            </ul>\n        </li>\n    </ul>\n</div>");
    }]);
    module.directive('protonMultiListPicker', ["$parse", "$filter", function ($parse, $filter) {
        return {
            restrict: "E",
            templateUrl: templates.picker,
            require: "?ngModel",
            controllerAs: "controller",
            scope: {},
            transclude: true,
            controller: function ProtonMultiListPickerController($scope) {
                $scope.items = [];
                this.addDivider = function (divider) {
                    $scope.items.push({
                        $divider: divider
                    });
                };
                this.add = function (item) {
                    if (!item.alias) {
                        item.alias = $scope.items.length;
                    }
                    $scope.items.push(item);
                };
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
                    angular.forEach($scope.items, function (list) {
                        if (!list.alias) {
                            return;
                        }
                        if (angular.isUndefined(model[list.alias])) {
                            $scope.select(list.alias, $filter("protonMultiListArrayOf")(list.source()), 0);
                        }
                    });
                }, true);
                $scope.label = function (list, index) {
                    if (list.index <= index || index < 0) {
                        return null;
                    }
                    if (angular.isObject(list[index]) && angular.isDefined(list[index].label)) {
                        return list[index].label;
                    }
                    return list[index];
                };
                $scope.value = function (list, index) {
                    if (list.index <= index || index < 0) {
                        return null;
                    }
                    if (angular.isObject(list[index]) && angular.isDefined(list[index].value)) {
                        return list[index].value;
                    }
                    return list[index];
                };
                $scope.select = function (property, list, index) {
                    $scope.model[property] = $scope.value(list, index);
                };
                $scope.selected = function (property, list) {
                    var selection = $scope.model[property];
                    var index = -1;
                    angular.forEach(list, function (item, cursor) {
                        if (index > -1) {
                            return;
                        }
                        if (angular.isObject(item) && angular.isDefined(item.value) && selection == item.value) {
                            index = cursor;
                        }
                        if ((!angular.isObject(item) || !angular.isDefined(item.value)) && selection == item) {
                            index = cursor;
                        }
                    });
                    return index > -1 ? index : 0;
                };
            }
        };
    }]);
    module.directive('protonMultiListPickerList', [function () {
        return {
            scope: {
                source: "&?",
                alias: "@?"
            },
            restrict: "E",
            require: "^protonMultiListPicker",
            controller: function ProtonMultiListPickerListController($scope) {
                $scope.items = [];
                this.add = function (item) {
                    $scope.items.push(item);
                };
            },
            link: function ($scope, $element, $attrs, parent) {
                parent.add({
                    source: function () {
                        return $scope.source && $scope.source() || $scope.items;
                    },
                    alias: $scope.alias
                });
            }
        };
    }]);
    module.directive('protonMultiListPickerDivider', [function () {
        return {
            restrict: "E",
            require: "^protonMultiListPicker",
            link: function ($scope, $element, $attrs, parentController) {
                parentController.addDivider($element.html());
            }
        };
    }]);
    module.directive('protonMultiListPickerListItem', [function () {
        return {
            restrict: "E",
            require: "^protonMultiListPickerList",
            link: function ($scope, $element, $attrs, parent) {
                parent.add({
                    value: $attrs.value || $element.html(),
                    label: $element.html()
                });
            }
        };
    }]);
    module.filter('protonMultiListView', [function () {
        return function (items, index) {
            var pivot = index;
            var from = Math.max(pivot - 3, 0);
            var to = Math.min(pivot + 3, items.length - 1);
            var view = [];
            var i;
            for (i = from; i <= to; i++) {
                view.push({
                    label: items[i].label,
                    value: items[i].value,
                    index: i
                });
            }
            var loop = 0;
            if (items.length >= 7 && view.length < 7) {
                loop = 7 - view.length;
                if (from == 0) {
                    loop = loop * -1;
                }
            }
            if (loop < 0) {
                for (i = items.length + loop; i < items.length; i++) {
                    view.splice(i - items.length - loop, 0, {
                        label: items[i].label,
                        value: items[i].value,
                        index: i
                    });
                }
            } else if (loop > 0) {
                for (i = 0; i < loop; i++) {
                    view.push({
                        label: items[i].label,
                        value: items[i].value,
                        index: i
                    });
                }
            }
            return view;
        }
    }]);
    module.filter('protonMultiListArrayOf', [function () {
        return function (items) {
            var result;
            if (angular.isArray(items)) {
                result = [];
                angular.forEach(items, function (item) {
                    if (angular.isObject(item) && angular.isDefined(item.label) && angular.isDefined(item.value)) {
                        result.push(item);
                    } else {
                        result.push({
                            label: item,
                            value: item
                        });
                    }
                });
                return result;
            } else if (angular.isObject(items)) {
                result = [];
                angular.forEach(items, function (value, property) {
                    result.push({
                        value: property,
                        label: value
                    });
                });
                result.sort(function (first, second) {
                    return first.label < second.label ? -1 : 1;
                });
                return result;
            } else {
                return [items];
            }
        }
    }]);
})();