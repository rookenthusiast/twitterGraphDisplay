app.controller('applicationController', ['$scope', 'api', 'liveTwitterFeed', function ($scope, api, liveTwitterFeed) {
    var vm = this;
    vm.user = {
        name: '',
        screenName: ''
    }
    vm.tweets = {
        wordOne:[1,1,1,1,1,1,1],
        wordTwo:[1,1,1,1]
    };
    api.getUser().then(function (result) {
        console.log('applicationController recieved:', result);
        vm.user.name = result.name;
        vm.user.screenName = result.screenName;
    }).catch(function (err) {
        console.error(err);
    });
    // private functions

    function set(data) {
        console.log(data);
        liveTwitterFeed.emit('set', data);
    }

    function update(data) {
        console.log(data);
        liveTwitterFeed.emit('closeStream');
        liveTwitterFeed.on('streamClosed', function (data) {
            liveTwitterFeed.emit('set', data);
            liveTwitterFeed.removeListener('streamClosed', function () {
                console.log('removed streamClosed listened');
            });
        });
    }

    // event emitter handling

    $scope.$on('action', function (event, trigger) {
        console.log('recieved action:', trigger);
        switch (trigger.action) {
            case 'set':
                set(trigger.data);
                break;
            case 'update':
                update(trigger.data);
                break;
            case 'close':
                liveTwitterFeed.emit('closeStream');
                liveTwitterFeed.on('streamClosed', function () {
                    liveTwitterFeed.removeListener('streamClosed', function () {
                        console.log('removed streamClosed listened');
                    });
                })
                break;
        }
    });

    // server feeds
    liveTwitterFeed.on('tweet', function (data) {
        if(data.tagged === 'first'){
            vm.tweets.wordOne.push(data);
        } else {
            vm.tweets.wordTwo.push(data);
        }
    });
}]);