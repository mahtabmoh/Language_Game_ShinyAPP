Shiny.addCustomMessageHandler("jsondata",
  function(message){
    var  JS = message;

	var m = [20, 20, 30, 20],
		w = 960 - m[1] - m[3],
		h = 500 - m[0] - m[2];

	var x,
		y,
		duration = 3000,
		delay = 800;

	var color = d3.scale.category10();

	var svg = d3.select("div_code").append("div")
		.attr("width", w + m[1] + m[3])
		.attr("height", h + m[0] + m[2])
		.append("g")
		.attr("transform", "translate(" + m[3] + "," + m[0] + ")");

	var species,
		variables;

	// A line generator, for the dark stroke.
	var line = d3.svg.line()
		.interpolate("basis")
		.x(function(d) { return x(d.Cycle); })
		.y(function(d) { return y(d.value); });

	// A line generator, for the dark stroke.
	var axis = d3.svg.line()
		.interpolate("basis")
		.x(function(d) { return x(d.Cycle); })
		.y(h);

	// A area generator, for the dark stroke.
	var area = d3.svg.area()
		.interpolate("basis")
		.x(function(d) { return x(d.Cycle); })
		.y1(function(d) { return y(d.value); });

	d3.select("div_code", function(data) {
	//var parse = d3.time.format("%b %Y").parse;

	// Nest species abundance by variable.
	variable = d3.nest()
		.key(function(d) { return d.variable; })
		.entries(species = data);

	// Parse Cycles and numbers. We assume values are sorted by Cycle.
	// Also compute the maximum value per variable, needed for the y-domain.
	variables.forEach(function(s) {
		s.values.forEach(function(d) { d.Cycle = parse(d.Cycle); d.value = +d.value; });
		s.maxvalue = d3.max(s.values, function(d) { return d.value; });
		s.sumvalue = d3.sum(s.values, function(d) { return d.value; });
	});

	// Sort by maximum value, descending.
	variables.sort(function(a, b) { return b.maxvalue - a.maxvalue; });

	var g = svg.selectAll("g")
		.data(variables)
		.enter().append("g")
		.attr("class", "variable");

	setTimeout(lines, duration);
	});

	function lines() {
		x = d3.time.scale().range([0, w - 60]);
		y = d3.scale.linear().range([h / 4 - 20, 0]);

		// Compute the minimum and maximum Cycle across variables.
		x.domain([
			d3.min(variables, function(d) { return d.values[0].Cycle; }),
			d3.max(variables, function(d) { return d.values[d.values.length - 1].Cycle; })
		]);

		var g = svg.selectAll(".variable")
			.attr("transform", function(d, i) { return "translate(0," + (i * h / 4 + 10) + ")"; });

		g.each(function(d) {
			var e = d3.select(this);

		e.append("path")
			.attr("class", "line");

		e.append("circle")
			.attr("r", 5)
			.style("fill", function(d) { return color(d.key); })
			.style("stroke", "#000")
			.style("stroke-width", "2px");

		e.append("text")
			.attr("x", 12)
			.attr("dy", ".31em")
			.text(d.key);
	});

	function draw(k) {
		g.each(function(d) {
		var e = d3.select(this);
		y.domain([0, d.maxvalue]);

		e.select("path")
			.attr("d", function(d) { return line(d.values.slice(0, k + 1)); });

		e.selectAll("circle, text")
			.data(function(d) { return [d.values[k], d.values[k]]; })
          .attr("transform", function(d) { return "translate(" + x(d.Cycle) + "," + y(d.value) + ")"; });
		});	
	};

	var k = 1, n = variables[0].values.length;
	d3.timer(function() {
		draw(k);
		if ((k += 2) >= n - 1) {
			draw(n - 1);
			setTimeout(horizons, 500);
		return true;
			}
		});
	};

	function horizons() {
		svg.insert("defs", ".variable")
		.append("clipPath")
		.attr("id", "clip")
		.append("rect")
		.attr("width", w)
		.attr("height", h / 4 - 20);

		var color = d3.scale.ordinal()
			.range(["#c6dbef", "#9ecae1", "#6baed6"]);

		var g = svg.selectAll(".variable")
			.attr("clip-path", "url(#clip)");

		area
			.y0(h / 4 - 20);

		g.select("circle").transition()
			.duration(duration)
			.attr("transform", function(d) { return "translate(" + (w - 60) + "," + (-h / 4) + ")"; })
			.remove();

		g.select("text").transition()
			.duration(duration)
			.attr("transform", function(d) { return "translate(" + (w - 60) + "," + (h / 4 - 20) + ")"; })
			.attr("dy", "0em");

		g.each(function(d) {
			y.domain([0, d.maxvalue]);

		d3.select(this).selectAll(".area")
			.data(d3.range(3))
			.enter().insert("path", ".line")
			.attr("class", "area")
			.attr("transform", function(d) { return "translate(0," + (d * (h / 4 - 20)) + ")"; })
			.attr("d", area(d.values))
			.style("fill", function(d, i) { return color(i); })
			.style("fill-opacity", 1e-6);

		y.domain([0, d.maxvalue / 3]);

		d3.select(this).selectAll(".line").transition()
			.duration(duration)
			.attr("d", line(d.values))
			.style("stroke-opacity", 1e-6);

		d3.select(this).selectAll(".area").transition()
			.duration(duration)
			.style("fill-opacity", 1)
			.attr("d", area(d.values))
			.each("end", function() { d3.select(this).style("fill-opacity", null); });
		});

		setTimeout(areas, duration + delay);
	};

	function areas() {
		var g = svg.selectAll(".variable");

		axis
			.y(h / 4 - 21);

		g.select(".line")
			.attr("d", function(d) { return axis(d.values); });

		g.each(function(d) {
			y.domain([0, d.maxvalue]);

		d3.select(this).select(".line").transition()
			.duration(duration)
			.style("stroke-opacity", 1)
			.each("end", function() { d3.select(this).style("stroke-opacity", null); });

		d3.select(this).selectAll(".area")
			.filter(function(d, i) { return i; })
			.transition()
			.duration(duration)
			.style("fill-opacity", 1e-6)
			.attr("d", area(d.values))
			.remove();

		d3.select(this).selectAll(".area")
			.filter(function(d, i) { return !i; })
			.transition()
			.duration(duration)
			.style("fill", color(d.key))
			.attr("d", area(d.values));
		});

		svg.select("defs").transition()
			.duration(duration)
			.remove();

		g.transition()
			.duration(duration)
			.each("end", function() { d3.select(this).attr("clip-path", null); });

		setTimeout(stackedArea, duration + delay);
	};

	function stackedArea() {
		var stack = d3.layout.stack()
		.values(function(d) { return d.values; })
		.x(function(d) { return d.Cycle; })
		.y(function(d) { return d.value; })
		.out(function(d, y0, y) { d.value0 = y0; })
		.order("reverse");

		stack(variables);

		y
			.domain([0, d3.max(variables[0].values.map(function(d) { return d.value + d.value0; }))])
			.range([h, 0]);

		line
			.y(function(d) { return y(d.value0); });

		area
			.y0(function(d) { return y(d.value0); })
			.y1(function(d) { return y(d.value0 + d.value); });

		var t = svg.selectAll(".variable").transition()
			.duration(duration)
			.attr("transform", "translate(0,0)")
			.each("end", function() { d3.select(this).attr("transform", null); });

		t.select("path.area")
			.attr("d", function(d) { return area(d.values); });

		t.select("path.line")
			.style("stroke-opacity", function(d, i) { return i < 3 ? 1e-6 : 1; })
			.attr("d", function(d) { return line(d.values); });

		t.select("text")
			.attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - 60) + "," + y(d.value / 2 + d.value0) + ")"; });

		setTimeout(streamgraph, duration + delay);
	};

	function streamgraph() {
		var stack = d3.layout.stack()
			.values(function(d) { return d.values; })
			.x(function(d) { return d.Cycle; })
			.y(function(d) { return d.value; })
			.out(function(d, y0, y) { d.value0 = y0; })
			.order("reverse")
			.offset("wiggle");

		stack(variables);

		line
			.y(function(d) { return y(d.value0); });

		var t = svg.selectAll(".variable").transition()
			.duration(duration);

		t.select("path.area")
			.attr("d", function(d) { return area(d.values); });

		t.select("path.line")
			.style("stroke-opacity", 1e-6)
			.attr("d", function(d) { return line(d.values); });

		t.select("text")
			.attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - 60) + "," + y(d.value / 2 + d.value0) + ")"; });

		setTimeout(overlappingArea, duration + delay);
	};

	function overlappingArea() {
		var g = svg.selectAll(".variable");

		line
			.y(function(d) { return y(d.value0 + d.value); });

		g.select(".line")
			.attr("d", function(d) { return line(d.values); });

		y
			.domain([0, d3.max(variables.map(function(d) { return d.maxvalue; }))])
			.range([h, 0]);

		area
			.y0(h)
			.y1(function(d) { return y(d.value); });

		line
			.y(function(d) { return y(d.value); });

		var t = g.transition()
			.duration(duration);

		t.select(".line")
			.style("stroke-opacity", 1)
			.attr("d", function(d) { return line(d.values); });

		t.select(".area")
			.style("fill-opacity", .5)
			.attr("d", function(d) { return area(d.values); });

		t.select("text")
			.attr("dy", ".31em")
			.attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - 60) + "," + y(d.value) + ")"; });

		svg.append("line")
			.attr("class", "line")
			.attr("x1", 0)
			.attr("x2", w - 60)
			.attr("y1", h)
			.attr("y2", h)
			.style("stroke-opacity", 1e-6)
			.transition()
			.duration(duration)
			.style("stroke-opacity", 1);

		setTimeout(groupedBar, duration + delay);
	};

	function groupedBar() {
		x = d3.scale.ordinal()
			.domain(variables[0].values.map(function(d) { return d.Cycle; }))
			.rangeBands([0, w - 60], .1);

		var x1 = d3.scale.ordinal()
			.domain(variables.map(function(d) { return d.key; }))
			.rangeBands([0, x.rangeBand()]);

		var g = svg.selectAll(".variable");

		var t = g.transition()
			.duration(duration);

		t.select(".line")
			.style("stroke-opacity", 1e-6)
			.remove();

		t.select(".area")
			.style("fill-opacity", 1e-6)
			.remove();

		g.each(function(p, j) {
			d3.select(this).selectAll("rect")
				.data(function(d) { return d.values; })
				.enter().append("rect")
				.attr("x", function(d) { return x(d.Cycle) + x1(p.key); })
				.attr("y", function(d) { return y(d.value); })
				.attr("width", x1.rangeBand())
				.attr("height", function(d) { return h - y(d.value); })
				.style("fill", color(p.key))
				.style("fill-opacity", 1e-6)
				.transition()
				.duration(duration)
				.style("fill-opacity", 1);
		});

		setTimeout(stackedBar, duration + delay);
	};

	function stackedBar() {
		x.rangeRoundBands([0, w - 60], .1);

		var stack = d3.layout.stack()
			.values(function(d) { return d.values; })
			.x(function(d) { return d.Cycle; })
			.y(function(d) { return d.value; })
			.out(function(d, y0, y) { d.value0 = y0; })
			.order("reverse");

		var g = svg.selectAll(".variable");

		stack(variables);

		y
			.domain([0, d3.max(variables[0].values.map(function(d) { return d.value + d.value0; }))])
			.range([h, 0]);

		var t = g.transition()
			.duration(duration / 2);

		t.select("text")
			.delay(variables[0].values.length * 10)
			.attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - 60) + "," + y(d.value / 2 + d.value0) + ")"; });

		t.selectAll("rect")
			.delay(function(d, i) { return i * 10; })
			.attr("y", function(d) { return y(d.value0 + d.value); })
			.attr("height", function(d) { return h - y(d.value); })
			.each("end", function() {
		d3.select(this)
            .style("stroke", "#fff")
            .style("stroke-opacity", 1e-6)
			.transition()
            .duration(duration / 2)
            .attr("x", function(d) { return x(d.Cycle); })
            .attr("width", x.rangeBand())
            .style("stroke-opacity", 1);
		});

		setTimeout(transposeBar, duration + variables[0].values.length * 10 + delay);
	};

	function transposeBar() {
		x
			.domain(variables.map(function(d) { return d.key; }))
			.rangeRoundBands([0, w], .2);

		y
			.domain([0, d3.max(variables.map(function(d) { return d3.sum(d.values.map(function(d) { return d.value; })); }))]);

		var stack = d3.layout.stack()
			.x(function(d, i) { return i; })
			.y(function(d) { return d.value; })
			.out(function(d, y0, y) { d.value0 = y0; });

		stack(d3.zip.apply(null, variables.map(function(d) { return d.values; }))); // transpose!

		var g = svg.selectAll(".variable");

		var t = g.transition()
			.duration(duration / 2);

		t.selectAll("rect")
			.delay(function(d, i) { return i * 10; })
			.attr("y", function(d) { return y(d.value0 + d.value) - 1; })
			.attr("height", function(d) { return h - y(d.value) + 1; })
			.attr("x", function(d) { return x(d.variable); })
			.attr("width", x.rangeBand())
			.style("stroke-opacity", 1e-6);

		t.select("text")
			.attr("x", 0)
			.attr("transform", function(d) { return "translate(" + (x(d.key) + x.rangeBand() / 2) + "," + h + ")"; })
			.attr("dy", "1.31em")
			.each("end", function() { d3.select(this).attr("x", null).attr("text-anchor", "middle"); });

		svg.select("line").transition()
			.duration(duration)
			.attr("x2", w);

	setTimeout(donut,  duration / 2 + variables[0].values.length * 10 + delay);
	};

	function donut() {
		var g = svg.selectAll(".variable");

		g.selectAll("rect").remove();

		var pie = d3.layout.pie()
			.value(function(d) { return d.sumvalue; });

		var arc = d3.svg.arc();

		g.append("path")
			.style("fill", function(d) { return color(d.key); })
			.data(function() { return pie(variables); })
			.transition()
			.duration(duration)
			.tween("arc", arcTween);

		g.select("text").transition()
			.duration(duration)
			.attr("dy", ".31em");

		svg.select("line").transition()
			.duration(duration)
			.attr("y1", 2 * h)
			.attr("y2", 2 * h)
			.remove();

	function arcTween(d) {
		var path = d3.select(this),
			text = d3.select(this.parentNode.appendChild(this.previousSibling)),
			x0 = x(d.data.key),
			y0 = h - y(d.data.sumvalue);

		return function(t) {
			var r = h / 2 / Math.min(1, t + 1e-3),
				a = Math.cos(t * Math.PI / 2),
				xx = (-r + (a) * (x0 + x.rangeBand()) + (1 - a) * (w + h) / 2),
				yy = ((a) * h + (1 - a) * h / 2),
				f = {
					innerRadius: r - x.rangeBand() / (2 - a),
					outerRadius: r,
					startAngle: a * (Math.PI / 2 - y0 / r) + (1 - a) * d.startAngle,
					endAngle: a * (Math.PI / 2) + (1 - a) * d.endAngle
				};

			path.attr("transform", "translate(" + xx + "," + yy + ")");
			path.attr("d", arc(f));
			text.attr("transform", "translate(" + arc.centroid(f) + ")translate(" + xx + "," + yy + ")rotate(" + ((f.startAngle + f.endAngle) / 2 + 3 * Math.PI / 2) * 180 / Math.PI + ")");
			};
		}

		setTimeout(donutExplode, duration + delay);
	};

	function donutExplode() {
		var r0a = h / 2 - x.rangeBand() / 2,
			r1a = h / 2,
			r0b = 2 * h - x.rangeBand() / 2,
			r1b = 2 * h,
			arc = d3.svg.arc();

		svg.selectAll(".variable path")
			.each(transitionExplode);
	
		function transitionExplode(d, i) {
			d.innerRadius = r0a;
			d.outerRadius = r1a;
			d3.select(this).transition()
				.duration(duration / 2)
				.tween("arc", tweenArc({
			innerRadius: r0b,
			outerRadius: r1b
			}));
		}

		function tweenArc(b) {
		return function(a) {
			var path = d3.select(this),
			text = d3.select(this.nextSibling),
			i = d3.interpolate(a, b);
			for (var key in b) a[key] = b[key]; // upCycle data
			return function(t) {
			var a = i(t);
			path.attr("d", arc(a));
			text.attr("transform", "translate(" + arc.centroid(a) + ")translate(" + w / 2 + "," + h / 2 +")rotate(" + ((a.startAngle + a.endAngle) / 2 + 3 * Math.PI / 2) * 180 / Math.PI + ")");
			};
		}
	};

	setTimeout(function() {
		svg.selectAll("*").remove();
		svg.selectAll("g").data(variables).enter().append("g").attr("class", "variable");
		lines();
		}, duration);
	}
 })
