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

//Parsing Html content to view. This custom filter will make sure that our HTML doesn’t get filtered out by AngularJS

asset.filter('unsafe', function($sce) {

    return function(val) {

        return $sce.trustAsHtml(val);

    };

});

asset.controller('MainCtrl', [
	'$scope',
	'$http',
	'dataFactory',
	'$filter',
	'$sce',
	function($scope, $http, dataFactory, $filter, $sce){
		dataFactory.list(function(list){

			$scope.questions = list; //data

			$scope.hardCoded = [];

			//PART 1

			//hardcode the HTML element which will be repalced for the key

			$scope.replacedKey = [

				['[user]','<input type="text" class="">'],

				['[none]',''],

				['[animals]','<select><option>dog</option><option>cat</option><option>panda</option><select>'],

				['[sizes]','<select><option>big</option><option>medium</option><option>small</option><select>']

			];


			//this function will run through the questions data, if it finds [key] it will replace [key] to the HTML
			function rep(question){

				var result ='';

				for (var num in $scope.replacedKey){

					if(question.indexOf($scope.replacedKey[num][0]) != -1){

						result = question.replace($scope.replacedKey[num][0],$scope.replacedKey[num][1]);

					}

				}

				return result;

			}

			$scope.trustedHTML = [];

			for(var num in $scope.questions.questions){
				//alert($scope.questions.questions[num].question);
				$scope.hardCoded.push(rep($scope.questions.questions[num].question)) //call function x to replace key to HTML. Then push the replaced HTML to the escaped HTML
			}

			//PART 2

			$scope.filtered = { pureText:[], inBrackets:[] } //separtion of pure text and key

			$scope.escapedHtml = [];

			// escaped HTML elements

			var htmlTextField = '<input type="text" class="">';

			var htmlOptionsField = '<select>Dropdown</select>';

			for (var i in $scope.questions.questions) {

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

			//PART 3			

			for (var i = 0; i < $scope.reducedOptions.length; i++ ) {
				// get data from the option sets
				$http.get($scope.reducedOptions[i]+'.json')
				.success(function(data){

					$scope.optionData = {key:'', options:[]};

					//Getting the first value in data (the option key)
					function first(obj) {

						for (var a in obj) return a;
					}

					for (var x in data){

						for (var y in data[x]){

							//Assign key
							$scope.optionData.key = first(data);
							//Concat HTML option tags to the options
							// $scope.optionData.options.push("<option>" + data[x][y].option + "</option>");
							$scope.optionData.options.push(data[x][y].option);

						}

					}

					var key, b = [];

					for (key in $scope.optionData) {
						b.push(Array.isArray($scope.optionData[key]) ? $scope.optionData[key].join('') : $scope.optionData[key]);
					}

					console.log(b);
				})
				.error(function(data, status){
					// console.log(status);
				})
			}

		})
}])