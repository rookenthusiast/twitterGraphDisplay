app.directive('pieChart', [function () {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        link: function (scope, element, attrs) {
            console.log([scope.data.wordOne.length, scope.data.wordTwo.length]);
            var chart = d3.select(element[0]);
            chart.append("div").attr("class", "chart")
                .selectAll('div')
                .data([scope.data.wordOne.length, scope.data.wordTwo.length]).enter().append("div")
                .transition()
                .duration(300)
                .style("width", function (d) {
                    return d + "vw";
                })
                .text(function (d) {
                    return d + " Tweets";
                });

            function redraw(data) {
                var chart = d3.select(element[0]);
                chart.selectAll('div').remove();
                chart.append("div").attr("class", "chart")
                    .selectAll('div')
                    .data([scope.data.wordOne.length, scope.data.wordTwo.length]).enter().append("div")
                    .transition()
                    .duration(300)
                    .style("width", function (d) {
                        return d + "vw";
                    })
                    .text(function (d) {
                        return d + " Tweets";
                    });
            }
            scope.$watch('data', function (n, o) {
                console.log('data changing');
                var firstLength = n.wordOne.length;
                var secondLength = n.wordTwo.length;
                redraw([
                    [n.wordOne.length, n.wordTwo.length]
                ])
            }, true);
        }
    }
}]);