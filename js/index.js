$('document').ready(function(){
  var jsonURL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
  
  $.getJSON(jsonURL).success(function(bigData){
    var data = bigData.data; //Strips out just the data from the json object.
    var moneyForm = d3.format('$,.2f'); //Formats a number as $XXX,XXX.XX
    var monthWords = ['January','February','March','April','May','June','July','August','September','October','November','December']; //Used for later conversion of month from number form (1-12) to string form.
    var width = 850;
    var height = 450;
    var dateFirst = new Date(data[0][0]);
    var dateLast = new Date(data[274][0]);
    
    //Set x time scale, domain is full data set chronologically, range is pixel width of chart element
    var x = d3.time.scale()
              .domain([dateFirst,dateLast])
              .range([0,width]);
    //Set y linear scale, domain is 0 to max GDP in data set, range is height to 0 (y axis increases downwards)
    var y = d3.scale.linear()
              .domain([0, d3.max(data, function(d) {
                return d[1];
              })])
              .range([height,0]);
    
    //Set x axis properties, x scale, x orientation, and how "often" ticks show up
    var xAx = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .ticks(d3.time.years,5);

    //Similar for y, y scale, orients on left side, and dictates approximate number of ticks.
    var yAx = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(20, "");
    
    //Sets up select for popup info windows on bar hover
    var div = d3.select(".container").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
    
    //Selects graph, sets h/w, and shifts it within the container. Makes room for future y axis title text.
    var graph = d3.select('.graph')
      .attr('width',1000)
      .attr('height', 500)
      .append('g')
      .attr('transform', 'translate(125,20)')
    
    //Append xAxis class and applies previously created x axis. Transforms it to bottom of graph. (y top to bottom)
    graph.append('g')
      .attr('class','xAxis')
      .attr('transform','translate(0,' + (height) +')')
      .call(xAx);
    
    //Appends yaxis group and applies y axis. No transform necessary.
    graph.append('g')
      .attr('class', 'yAxis')
      .attr('transform','translate(0,0)')
      .call(yAx);
    
    //Adding y axis title.
    graph.append('g')
      .attr('transform', 'translate(-75,225)')
      .append('text')
      .attr('class','yAxText')
      .attr('text-anchor','middle')
      .attr('transform', 'rotate(-90)')
      .text('Gross Domestic Product in Billions')
    
    
    graph.selectAll('.bar') //Creates placeholders for bars
      .data(data) //Binds data to placeholder selections
      .enter() //Selects all new incoming data (all data first time or none, as no data is ever added to this particular chart)
      .append('rect') //Appends rectangles
      .attr('class','bar') //Applies bar class to those rectangles,
      .attr('x',function(d) { 
        return x(new Date(d[0])); //Gives each bar selection one of the Dates from the data set.
    })
      .attr('y',function(d){
      return y(d[1]); //Gives each bar a GDP value from the data set that matches the Date.
    })
      .attr('height', function(d){
        return height - y(d[1]); //Sets bar height based on GDP value.
    })
      .attr('width', function(d){
        return Math.ceil(width / data.length); //Sets width of bars to fit every bar within chart. Chart width divided by length of data array.
    })
      .on('mouseover', function(d){ //Adds color change and popup window functionality to bars when hovered over.
        var rect = d3.select(this); //Selects currently hovered bar and sets it as "rect"
        var date = new Date(d[0]); //d here refers to the data set of the active bar.
        var year = date.getFullYear(); //Extracts styled date data.
        var month = date.getMonth(); //Extracts month data (in # form)
        var money = d[1]; //Extracts GDP
        rect.style('fill', '#f0f'); //Colors active bar as brighter purple.
        div.transition() //Define fade in of the popup window.
          .duration(100) //100 ms to fade in
          .style('opacity','0.85'); //Changes opacity from 0 (default set) to 85%
        div.html('<div>'+moneyForm(money)+' Billion</div><div>'+monthWords[month]+' '+year+'</div>') //Styles text form of GDP ($, two decimals), picks month from month array variable, and prints year.
        .style('left', (d3.event.pageX +10) + 'px')
        .style('top', (d3.event.pageY -40) + 'px'); //Shifts popup right and up.
    })
      .on('mouseout', function(){ //Handles cursor leaving a bar.
        var rect = d3.select(this);
        rect.style('fill', '#629'); //Returns bar to original hue.
      div.transition()
        .duration(100)
        .style('opacity','0'); //Returns opacity to 0%, the default value
    });
    
  })
  
})