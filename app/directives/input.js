app.directive('inputComponent',function(){
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'views/input.html',
        controllerAs: 'vm',
        bindToController: true,
        controller: function($scope){
            this.first = 'word1';
        }
    }
})