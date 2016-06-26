

Shiny.addCustomMessageHandler("jsondata",
  function(message){
    var  JS = message;
	
	function truncate(str, maxLength, suffix) {		if(str.length > maxLength) {
			str = str.substring(0, maxLength + 1); 
			str = str.substring(0, Math.min(str.length, str.lastIndexOf(" ")));
			str = str + suffix;
		}
		return str;
	};
	
	var margin = {top: 20, right: 20, bottom: 20, left: 20},
		width = 300,
		height = 650;

	var c = d3.scale.category20c();

	var x = d3.scale.linear()
		.range([0, width]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("top");

	var formatCy = d3.format("0");
		xAxis.tickFormat(formatCy);
	
	var svg = d3.select("div_tree").append("div")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.style("margin-right", margin.left + "px")
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.select("div_code", function(data) {
		x.domain(data['Cycle'])
		var xScale = d3.scale.linear()
			.domain(data['Cycle'])
			.range([0, width]);

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + 0 + ")")
			.call(xAxis);

		for (var j = 0; j < data.length; j++) {
			var g = svg.append("g").attr("class","variable");

			var circles = g.selectAll("circle")
				.data(data[j]['variable'])
				.enter()
				.append("circle");

			var text = g.selectAll("text")
				.data(data[j]['variable'])
				.enter()
				.append("text");

			var rScale = d3.scale.linear()
				.domain([0, d3.max(data[j]['variable'], function(d) { return d.variable; })])
				.range([0, 100]);

			circles
				.attr("cx", function(d, i) { return xScale(d.Cycle); })
				.attr("cy", j*20+20)
				.attr("r", function(d) { return rScale(d.variable); })
				.style("fill", function(d) { return c(j); });

			text
				.attr("y", j*20+25)
				.attr("x",function(d, i) { return xScale(d.Cycle)-5; })
				.attr("class","value")
				.text(function(d){ return d.variable; })
				.style("fill", function(d) { return c(j); })
				.style("display","none");

			g.append("text")
				.attr("y", j*20+25)
				.attr("x",width+20)
				.attr("class","label")
				.text(truncate(jsondata[j]['variable'],30,"..."))
				.style("fill", function(d) { return c(j); })
				.on("mouseover", mouseover)
				.on("mouseout", mouseout);
		};

		function mouseover(p) {
			var g = d3.select(this).node().parentNode;
			d3.select(g).selectAll("circle").style("display","none");
			d3.select(g).selectAll("text.value").style("display","block");
		}
	

	function mouseout(p) {
		var g = d3.select(this).node().parentNode;
		d3.select(g).selectAll("circle").style("display","block");
		d3.select(g).selectAll("text.value").style("display","none");
		}
	});
  })	

