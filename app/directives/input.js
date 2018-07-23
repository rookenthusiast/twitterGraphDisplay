app.directive('inputComponent',function(){
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'views/input.html',
        controllerAs: 'vm',
        bindToController: true,
        controller: function($scope){
            this.words = {first:'',second:''};
            this.fired = false;
            this.action = function(action,data){
                this.fired = true;
                $scope.$emit('action',{action, data});
            }.bind(this);
        }
    }
})