var api = function($http){
    var getUser = function(){
        return $http.get('/api/user').then(function(res){
            return res.data;
        });
    }
    return {
        getUser
    }
}

app.factory('api', api);