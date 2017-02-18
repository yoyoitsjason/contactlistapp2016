var myApp = angular.module("myApp",[]);
	myApp.controller("AppCtrl", ["$scope", "$http",
		function($scope,$http){
			console.log("AppCtrl controller in myApp angular module has started up");

		var refresh = function () {
			$http.get("/contactlist").success(function(response) {
				console.log("I got the data I requested; response: " + JSON.stringify(response)); /*response is the whole JSON object */
				$scope.contactlist = response; /* Obtain the JSON object from /contactlist (where it is stored) and give it to contactlist object*/
				$scope.contact = ""; /* fill contact object with empty string to clear all input boxes */
			});
		};
		
		refresh(); /*cleans up input boxes and re-inputs latest JSON object from /cotnactlist */
		console.log("refresh() one occurred for the first time");

		$scope.addContact = function () {
			if ($scope.contact !== "") {
			console.log("$scope.contact: " + $scope.contact);
			$http.post("/contactlist", $scope.contact).success(function(response) {
				console.log("response in post : " + JSON.stringify(response)); /* response should old be the new contact object being added to JSON obj */
				refresh(); /* This will refresh the data and populate data on page without actually reloading the page and clearing the input boxes */
				console.log("refresh occurred after addContact function executed");
			});
			}
		};

		$scope.remove = function(id) {
			console.log("id : " + id);
			$http.delete("/contactlist/" + id).success(function(response) {
				refresh();
			});
		};

		$scope.edit = function(id) {
			console.log("id : " + id);
			$http.get("/contactlist/" + id).success(function(response) {
				$scope.contact = response;
			});
		};

		$scope.update = function(id) {
			console.log("id : " + $scope.contact._id);
			$http.put("/contactlist/" + $scope.contact._id, $scope.contact).success(function(response) {
				refresh();
			});
		};

		$scope.deselect = function() {
			$scope.contact = "";
		};

		}]);