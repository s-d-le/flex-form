// Must have! To connect the HTML with the js controller
var myAppModule = angular.module('myApp', []);

var shoppingModule = angular.module('ShoppingModule', []);

// TextController can receive multiple objects
myAppModule.controller('TextController', 
	function($scope, $location){
	$scope.greeting = {text : 'Hello'};
	//$location can be doing something else here.
});


// Always pass controller's function into a module.
// Stay out of the global namespace
myAppModule.controller('CartController', 
	function CartController($scope)
	{
		$scope.bill = {};

		$scope.items = [
		{title: 'Paint pots', quantity: 8, price: 3.95},
		{title: 'Polka dots', quantity: 17, price: 12.95},
		{title: 'Pebbles', quantity: 5, price: 6.95}
		];

		$scope.remove = function(index)
		{
			$scope.items.splice(index, 1);
		};

		var calculateTotals = function (){
			var total = 0;
			for (var i = 0, len = $scope.items.length; i < len; i++){
				total = total + $scope.items[i].price * $scope.items[i].quantity;
			}

			$scope.bill.totalcart = total;
			$scope.bill.discount = total > 100 ? 10 : 0;
			$scope.bill.subtotal = total - $scope.bill.discount;
			
		};

		$scope.$watch('items', calculateTotals, true);
	});

myAppModule.controller('StartUpController', 
	function StartUpController($scope) {
		$scope.computeNeeded = function() {
			$scope.needed = $scope.startingEstimate * 10;
		};

		$scope.requestFunding = function() {
			window.alert("Sorry, please get more customers first.");
		};

		$scope.reset = function() {
			$scope.startingEstimate = 0;
		};
	});


myAppModule.controller('StudentListController',
	function StudentListController($scope){

		var students = [

		{name:'Son Le', id:'1'},
		{name:'Claire B', id:'2'},
		{name:'Lynda C', id:'3'}

		];

		$scope.students = students;

		$scope.insertStudent = function() {
			$scope.students.splice(1, 0, {
				name: $scope.newStudent});

			$scope.newStudent = '';
		};

	});

// myAppModule.controller('MenuController',
// 	function MenuController($scope){

// 		$scope.menuState.show = false;

// 		$scope.toggleMenu = function(){
// 			$scope.menuState.show =! $scope.menuState.show;
// 		};

// 	});


myAppModule.controller('HeaderController',
	function HeaderController($scope){

		$scope.isError = false;
		$scope.isWarning = false;

		$scope.showError = function () {
			$scope.textMessage = 'Error Text!!!!';
			$scope.isError = true;
			$scope.isWarning = false;
		};

		$scope.showWarning = function () {
			$scope.textMessage = 'Warning Text!!!!';
			$scope.isError = false;
			$scope.isWarning = true;
		};

	});

// Module! No more cramping ctrl into the myAppModule anymore.
var homeModule = angular.module('HomeModule', []);

homeModule.filter('titleFilter', function() {
	var titleFilterF = function(input) {

		var words = input.split(' ');

		for (var i = 0; i < words.length; i++){
			words[i] = words[i].charAt(0).toUpperCase + words[i].slice(1);
		}

		return words.join(' ');
	};

	return titleFilterF;
});

myAppModule.controller('HomeController',
	function HomeController($scope){
		$scope.pageTitle = 'big old title goes here';
	});