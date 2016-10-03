module.exports = function($scope) {
    $scope.todoList = [
      {text:'learn angular', done:true},
      {text:'build an angular app', done:false}];
 
    $scope.todoList.addTodo = function() {
      $scope.todoList.push({text:$scope.todoList.todoText, done:false});
      $scope.todoList.todoText = '';
      console.log($scope.todoList);
    };
 
    $scope.todoList.remaining = function() {
      var count = 0;
      angular.forEach($scope.todoList, function(todo) {
        count += todo.done ? 0 : 1;
      });
      return count;
    };
 
    $scope.todoList.archive = function() {
      var oldTodos = $scope.todoList;
      $scope.todoList = [];
      angular.forEach(oldTodos, function(todo) {
        if (!todo.done) {
          $scope.todoList.push(todo);
        }
      });
    };
}