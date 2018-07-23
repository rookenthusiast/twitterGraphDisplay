app.directive('pieChart', [function () {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        link: function (scope, element, attrs) {
            element[0].append(document.createElement('svg'));
            var svg = d3.select('svg'),
                width = svg.attr("width"),
                height = svg.attr("height"),
                radius = Math.min(width, height) / 2,
                g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
            var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

            // Generate the pie
            var pie = d3.pie();

            // Generate the arcs
            var arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);

            //Generate groups
            var arcs = g.selectAll("arc")
                .data(pie([scope.data.wordOne.length, scope.data.wordTwo.length]))
                .enter()
                .append("g")
                .attr("class", "arc")

            //Draw arc paths
            arcs.append("path")
                .attr("fill", function (d, i) {
                    return color(i);
                })
                .attr("d", arc);


            scope.$watch('data', function (n, o) {
                console.log('data changing');
                var firstLength = n.wordOne.length;
                var secondLength = n.wordTwo.length;
                console.log(pie([firstLength, secondLength]))
                var path = svg.selectAll('path');
                path.data(pie([firstLength, secondLength]));
                path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
            }, true)

            function arcTween(a) {
                var i = d3.interpolate(this._current, a);
                this._current = i(0);
                return function (t) {
                    return arc(i(t));
                };
            }
        }
    }
}]);