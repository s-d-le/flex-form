var asset = angular.module('assets', ['ngRoute','ngResource']);

asset.config(function ($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: "index.html",
		controller: 'MainCtrl'
	});
});

asset.factory('dataFactory', [
	'$http', 
	function($http){

	function getData(callback){
		$http.get('questions.json', {cache : true}).success(callback);
	}

	return {
		list : getData,

		listLength : function() { //need more work to get list length
			getData(function(data){
				var len = data.questions.length;
			})
		}
	}
}]);

asset.controller('MainCtrl', [
	'$scope',
	'$http',
	'dataFactory',
	'$filter',
	'$sce',
	function($scope, $http, dataFactory, $filter, $sce){
		dataFactory.list(function(list){
			$scope.questions = list;

			var len = list.questions.length;

			$scope.filtered = {}

			$scope.filtered.pureText = [];

			$scope.filtered.inBrackets =[];

			$scope.escapedHtml = [];

			// escaped HTML elements

			var htmlTextField = '<input type="text" class="">';

			var htmlOptionsField = '<select>Dropdown</select>';

			for (var i = 0; i < len; i++) {

				// delete anything with and in between the [ ] then push to the selectedText
				$scope.filtered.pureText.push($scope.questions.questions[i].question.replace(/\[(.*?)\]/g, ""));
				$scope.filtered.inBrackets.push($scope.questions.questions[i].question.match(/[^[\]]+(?=])/g));				

				//Assign html type to the question and push everything back into escapedHtml array
				if ($scope.questions.questions[i].inputType === "text") {
					$scope.escapedHtml.push($scope.filtered.pureText[i] + htmlTextField);
				}
				else if ($scope.questions.questions[i].inputType === "option") {
					$scope.escapedHtml.push($scope.filtered.pureText[i] + htmlOptionsField);
				}
				else if ($scope.questions.questions[i].inputType === "none") {
					$scope.escapedHtml.push($scope.filtered.pureText[i]);
				}
			};

			console.log($scope.escapedHtml);

			$scope.reducedOptions = [];

			var singleArray = [];

			//Reduce inBrackets into a single dimensional array and eliminiate duplicates
			for (var x = 0; x < $scope.filtered.inBrackets.length; x++) {
				for (var y = 0; y < $scope.filtered.inBrackets[x].length; y++) {
					singleArray.push($scope.filtered.inBrackets[x][y]);
				}
			};

			$scope.reducedOptions = singleArray.filter(function(elem, index, self) {
				return index == self.indexOf(elem);
			});

			$scope.optionData = [];

			for (var i = 0; i < $scope.reducedOptions.length; i++ ) {
				// get data from the option sets
				$http.get($scope.reducedOptions[i]+'.json')
				.success(function(data){
					for (var key in data) {
						if (data.hasOwnProperty(key)) {
							console.log(key);
						}
					}
					console.log(data.animals);
				})
				.error(function(data, status){
					console.log();
				})
			}
		})
}])