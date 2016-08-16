
var app = angular.module('mrImage', []);

app.directive('mrImage', function() {
    return {
        restrict: 'A',
        scope: {
            src: '=mrSrc',
            maxWidth: '=?mrMaxWidth',
            aspectRatio: '=?mrAspectRatio',
            scale: '=?mrScale',
            drawer: '=?mrDrawer',
            selector: '=?mrSelector'
        },
        template:
            '<div mr-image-selector mr-model="selector" mr-aspect-ratio="aspectRatio" ' + 
            'ng-style="{ \'height\': scaleValuePx(height, scale), \'width\': scaleValuePx(width, scale) }"></div>' +
            '<div mr-image-drawer mr-model="drawer" ' +
            'ng-style="{ \'height\': scaleValuePx(height, scale), \'width\': scaleValuePx(width, scale) }"></div>' +
            '<img ng-src="{{src}}" width="{{scaleValue(width, scale)}}" height="{{scaleValue(height, scale)}}">',

        link: function (scope, element) {

            element.addClass('mr-image');

            var updateSize = function () {
                scope.height = scope.height || scope.image.height;
                scope.width = scope.width || scope.image.width;

                if (angular.isUndefined(scope.scale) && angular.isDefined(scope.maxWidth)) {
                    scope.scale = scope.maxWidth >= scope.width ? 1 : scope.maxWidth / scope.width;
                }
                else {
                    scope.scale = scope.scale || 1;
                }

                element.css('width', scope.scaleValuePx(scope.width, scope.scale));
                element.css('height', scope.scaleValuePx(scope.height, scope.scale));
            };

            function setImageSize(src) {
                scope.image = new Image();
                scope.image.onload = function () {
                    scope.$apply(function() {updateSize();});
                };
                scope.image.src = src;
            }

            setImageSize(scope.src);

            scope.$watch('src', function (newVal, oldVal) {
                if (newVal && newVal != oldVal)
                {
                    delete scope.height;
                    delete scope.width;
                    delete scope.scale;
                    delete scope.selector.x1;
                    delete scope.selector.y1;
                    delete scope.selector.x2;
                    delete scope.selector.y2;
                    scope.width = null;
                    scope.image.onload = function() {
                        scope.$apply(function() {updateSize();});
                    };
                    scope.image.src = newVal;
                }
            });

	    scope.scaleValuePx = function(value, scale) {
                return Math.floor(value * scale) + 'px';
            };
        }
    };
});