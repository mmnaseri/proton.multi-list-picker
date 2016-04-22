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
        $templateCache.put(templates.picker, "<div class=\'proton-multi-list-picker {{attachment}}\'>\n    <span ng-transclude class=\'proton-multi-list-picker-contents\'></span>\n    <div class=\'first\'></div>\n    <div class=\'before\'></div>\n    <ul class=\'lists\'>\n        <li ng-repeat=\'list in items track by $index\' class=\'list-container\' data-index=\'{{$index}}\'>\n            <span class=\'divider\' ng-if=\'list.$divider\'>\n                <span ng-if=\'!bindHtml\' ng-bind=\'list.$divider\'></span>\n                <span ng-if=\'bindHtml\' ng-bind-html=\'list.$divider\'></span>\n            </span>\n            <ul class=\'list\' ng-if=\'!list.$divider\' proton-multi-list-motion data-start=\'testStart($event)\' data-move=\'testStart($event)\' data-end=\'testStart($event)\'>\n                <li class=\'item {{$index == 3 ? \"selected\" : \"offset-\" + ($index &gt; 3 ? $index - 3 : 3 - $index)}}\' ng-repeat=\'item in list.array track by $index\'>\n                    <span ng-if=\'!bindHtml\' ng-bind=\'item.label\'></span>\n                    <span ng-if=\'bindHtml\' ng-bind-html=\'item.label\'></span>\n                </li>\n            </ul>\n        </li>\n    </ul>\n    <div class=\'after\'></div>\n    <div class=\'last\'></div>\n</div>");
    }]);
    module.directive('protonMultiListPicker', ["$parse", "$filter", "$timeout", function ($parse, $filter, $timeout) {
        var controller = function ProtonMultiListPickerController($scope) {
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
                item.index = $scope.items.length;
                $scope.items.push(item);
                $scope.$watch(function () {
                    return item.source();
                }, function () {
                    $scope.$broadcast('protonMultiListPicker:changed', item);
                }, true);
            };
        };
        return {
            restrict: "E",
            replace: true,
            templateUrl: templates.picker,
            require: "?ngModel",
            scope: {},
            transclude: true,
            controller: ["$scope", controller],
            link: function ($scope, $element, $attrs) {
                var parentScope = $element.parent().scope();
                $scope.$watch(function () {
                    return $parse($attrs.ngModel)(parentScope);
                }, function (model) {
                    $scope.model = model;
                    $scope.$broadcast('protonMultiListPicker:changed', model);
                });
                $attrs.$observe("bindHtml", function (value) {
                    $scope.bindHtml = value == "true";
                });
                $scope.$on('protonMultiListPicker:changed', function () {
                    //we need to convert the values, so that the given items are all lists of {label,value}s.
                    angular.forEach($scope.items, function (list) {
                        if (angular.isDefined(list.$divider)) {
                            return;
                        }
                        var source = angular.copy(list.source());
                        var result;
                        if (!angular.isArray(source)) {
                            result = [];
                            if (angular.isObject(source)) {
                                angular.forEach(source, function (value, property) {
                                    result.push({
                                        label: value,
                                        value: property
                                    });
                                });
                            } else {
                                result.push({
                                    label: source,
                                    value: source
                                });
                            }
                        } else {
                            result = source;
                        }
                        source = result;
                        result = [];
                        angular.forEach(source, function (item, index) {
                            item.index = index;
                            if (angular.isObject(item) && angular.isDefined(item.label) && angular.isDefined(item.value)) {
                                result.push(item);
                            } else {
                                result.push({
                                    label: item,
                                    value: item
                                });
                            }
                        });
                        list.array = result;
                        list.selected = 0;
                    });
                    if (angular.isObject($scope.model)) {
                        //first, let's see if the model has all the required properties
                        angular.forEach($scope.items, function (list) {
                            if (list.$divider) {
                                return;
                            }
                            if (angular.isUndefined($scope.model[list.alias])) {
                                $scope.model[list.alias] = list.array[0].value;
                            }
                        });
                        //now, let's figure out which one is selected
                        angular.forEach($scope.items, function (list) {
                            if (list.$divider) {
                                return;
                            }
                            list.selected = -1;
                            angular.forEach(list.array, function (item, index) {
                                if (list.selected > -1) {
                                    return;
                                }
                                if (item.value == $scope.model[list.alias]) {
                                    list.selected = index;
                                }
                            });
                        });
                    }
                });
                $scope.select = function (list, index) {
                    if (angular.isObject($scope.model)) {
                        $scope.model[list.alias] = list.array[index].value;
                    }
                };
            }
        };
    }]);
    module.directive('protonMultiListPickerList', [function () {
        var controller = function ProtonMultiListPickerListController($scope) {
            $scope.items = [];
            this.add = function (item) {
                $scope.items.push(item);
            };
        };
        return {
            scope: {
                source: "&?",
                alias: "@?",
                cycle: "@?"
            },
            restrict: "E",
            require: "^protonMultiListPicker",
            controller: ["$scope", controller],
            link: function ($scope, $element, $attrs, parent) {
                parent.add({
                    source: function () {
                        return $scope.source && $scope.source() || $scope.items;
                    },
                    alias: $scope.alias,
                    cycle: $scope.cycle == "true"
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
            if (items.length >= 7 && view.length < 7) {
                var loop = 7 - view.length;
                if (from == 0) {
                    loop = loop * -1;
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
            } else if (view.length < 7) {
                var cursor = items.length - 1;
                while (pivot < 3) {
                    view.splice(0, 0, items[cursor]);
                    items[cursor].index = cursor;
                    cursor--;
                    if (cursor < 0) {
                        cursor = items.length - 1;
                    }
                    pivot++;
                }
                cursor = 0;
                while (view.length < 7) {
                    view.push(items[cursor]);
                    items[cursor].index = cursor;
                    cursor++;
                    if (cursor == items.length) {
                        cursor = 0;
                    }
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
    module.service('protonMultiListMomentum', [function () {
        var details = function (event) {
            return {
                event: event,
                type: event.touches ? "Touch" : "Mouse",
                x: event.touches ? event.touches[0].screenX : event.screenX,
                y: event.touches ? event.touches[0].screenY : event.screenY,
                target: event.touches ? event.touches[0].target : event.target,
                timestamp: Date.now(),
                xDisplacement: 0,
                yDisplacement: 0,
                speedX: 0,
                speedY: 0,
                speedXState: 'stopped',
                speedYState: 'stopped',
                accelerationX: 0,
                accelerationY: 0,
                speed: 0,
                acceleration: 0,
                angle: NaN,
                origin: coordinates ? (coordinates.origin ? coordinates.origin : coordinates) : null
            };
        };
        var coordinates = null;
        this.start = function (event, callback) {
            if (event.touches && event.touches.length > 1) {
                return;
            }
            coordinates = details(event);
            if (angular.isFunction(callback)) {
                callback(coordinates);
            }
        };
        this.move = function (event, callback) {
            if (coordinates === null) {
                return;
            }
            var newCoordinates = details(event);
            var timeDifference = newCoordinates.timestamp - coordinates.timestamp;
            var xDifference = newCoordinates.x - coordinates.x;
            var yDifference = newCoordinates.y - coordinates.y;
            newCoordinates.xDisplacement = xDifference;
            newCoordinates.yDisplacement = yDifference;
            newCoordinates.angle = Math.atan2(newCoordinates.x, newCoordinates.y);
            if (timeDifference == 0) {
                if (xDifference == 0) {
                    newCoordinates.speedX = 0;
                    newCoordinates.speedXState = 'stopped';
                } else {
                    newCoordinates.speedX = Math.sign(xDifference) * Infinity;
                    newCoordinates.speedXState = 'fast';
                }
                if (yDifference == 0) {
                    newCoordinates.speedY = 0;
                    newCoordinates.speedYState = 'stopped';
                } else {
                    newCoordinates.speedY = Math.sign(yDifference) * Infinity;
                    newCoordinates.speedYState = 'fast';
                }
            } else {
                newCoordinates.speedX = xDifference / timeDifference;
                newCoordinates.speedY = yDifference / timeDifference;
                if (Math.abs(newCoordinates.speedX) < 0.2) {
                    newCoordinates.speedXState = 'slow';
                } else if (Math.abs(newCoordinates.speedX) < 0.6) {
                    newCoordinates.speedXState = 'moderate';
                } else {
                    newCoordinates.speedXState = 'fast';
                }
                if (Math.abs(newCoordinates.speedY) < 0.2) {
                    newCoordinates.speedYState = 'slow';
                } else if (Math.abs(newCoordinates.speedY) < 0.6) {
                    newCoordinates.speedYState = 'moderate';
                } else {
                    newCoordinates.speedYState = 'fast';
                }
            }
            var speedXDifference = newCoordinates.speedX - coordinates.speedX;
            var speedYDifference = newCoordinates.speedY - coordinates.speedY;
            if (timeDifference == 0) {
                if (speedXDifference == 0) {
                    newCoordinates.accelerationX = 0;
                } else {
                    newCoordinates.accelerationX = Math.sign(speedXDifference) * Infinity;
                }
                if (speedYDifference == 0) {
                    newCoordinates.accelerationY = 0;
                } else {
                    newCoordinates.accelerationY = Math.sign(speedYDifference) * Infinity;
                }
            } else {
                newCoordinates.accelerationX = speedXDifference / timeDifference;
                newCoordinates.accelerationY = speedYDifference / timeDifference;
            }
            newCoordinates.speed = Math.sqrt(Math.pow(newCoordinates.speedX, 2) + Math.pow(newCoordinates.speedY, 2));
            newCoordinates.acceleration = Math.sqrt(Math.pow(newCoordinates.accelerationX, 2) + Math.pow(newCoordinates.accelerationY, 2));
            coordinates = newCoordinates;
            if (angular.isFunction(callback)) {
                callback(coordinates);
            }
        };
        this.end = function (event, callback) {
            if (coordinates === null) {
                return;
            }
            if (angular.isFunction(callback)) {
                callback(coordinates);
            }
            coordinates = null;
        };
    }]);
    module.directive('protonMultiListMotion', ["protonMultiListMomentum", function (protonMultiListMomentum) {
        return {
            restrict: "A",
            scope: {
                move: "&?move",
                end: "&?end",
                start: "&?start"
            },
            link: function ($scope, $element) {
                $element.on("mousedown touchstart", function (event) {
                    protonMultiListMomentum.start(event, function (event) {
                        $scope.start && $scope.start({
                            $event: event
                        });
                    });
                });
                $element.on("mousemove touchmove", function (event) {
                    protonMultiListMomentum.move(event, function (event) {
                        $scope.move && $scope.move({
                            $event: event
                        });
                    });
                });
                $element.on("mouseup touchend touchcancel", function (event) {
                    protonMultiListMomentum.end(event, function (event) {
                        $scope.end && $scope.end({
                            $event: event
                        });
                    });
                });
            }
        };
    }]);
})();