/**
 * jt_AJS.js - JavaScript Toolkit for AngularJS
 *
 * by Joseph Oster, wingo.com - http://www.wingo.com/jt_/
 */

angular.module('jt_AJS', [])

	.directive('jtRepeatDone', function() {
		return function(scope, element, attrs) {
			if (scope.$last) { // all are rendered
				scope.$eval(attrs.jtRepeatDone);
			}
		}
	})

	.directive('jtOnEnter', function() {
		return function(scope, element, attrs) {
			element.on('keydown', function(event) {
				if (event.which === 13) {
					scope.$eval(attrs.jtOnEnter);
				}
			})
		}
	})

	.directive('jtFullScreen', function() {
		return function(scope, element, attrs) {
			element.on('click', function(event) {
				var docElm = document.documentElement;
				if (docElm.requestFullscreen) {
					docElm.requestFullscreen();
				}
				else if (docElm.mozRequestFullScreen) {
					docElm.mozRequestFullScreen();
				}
				else if (docElm.webkitRequestFullScreen) {
					docElm.webkitRequestFullScreen();
				}
			})
		}
	})

	.directive('jtViewScroll', function($timeout, $location) {
		return {
			link:function(scope, element, attrs, ctrl) {
				scope.jt_AJS = scope.jt_AJS || {};
				scope.jt_AJS.scrollPos = {}; // scroll position of each view

				$(window).on('scroll', function() {
					if (scope.jt_AJS.okSaveScroll) { // false between $routeChangeStart and $routeChangeSuccess
						scope.jt_AJS.scrollPos[$location.path()] = $(window).scrollTop();
						//console.log(scope.jt_AJS.scrollPos);
					}
				});

				scope.jt_AJS.scrollClear = function(path) {
					scope.jt_AJS.scrollPos[path] = 0;
				}

				scope.$on('$routeChangeStart', function() {
					scope.jt_AJS.okSaveScroll = false;
				});

				scope.$on('$routeChangeSuccess', function() {
					$timeout(function() { // wait for DOM, then restore scroll position
						$(window).scrollTop(scope.jt_AJS.scrollPos[$location.path()] ? scope.jt_AJS.scrollPos[$location.path()] : 0);
						scope.jt_AJS.okSaveScroll = true;
					}, 0);
				});

			}
		}
	})

	.service('jt_AJS_LocalStorage', function($q) {

		this.get = function(key) {
			var d = $q.defer();
			if (localStorage) {
				var json = localStorage[key];
				if (json) {
					d.resolve(angular.fromJson(json));
				}
				else d.reject();
			}
			else d.reject();
			return d.promise;
		}

		this.set = function(key, obj) {
			var d = $q.defer();
			if (localStorage) {
				localStorage[key] = angular.toJson(obj);
				d.resolve();
			}
			else d.reject();
			return d.promise;
		}

	})

	.filter('jt_strip_http', function() {
		return function(url) {
			var urlParser = document.createElement('a');
			urlParser.href = url;
			var http = urlParser.protocol + '//';
			return (url.indexOf(http) == 0) ? url.substr(http.length) : url;
		}
	})
