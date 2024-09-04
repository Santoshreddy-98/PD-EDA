import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const Histogram1 = ({ data }) => {
  const [popup, setPopup] = useState(false)
  const [range, setRange] = useState(d3.extent(data))
  const [from, setFrom] = useState(range[0]);
  const [to, setTo] = useState(range[1]);


  var bins;
  

  var margin = { top: 130, right: 130, bottom: 130, left: 150 };
  var width = 860 - margin.left - margin.right;
  var height = 800 - margin.top - margin.bottom;
  const svgRef = useRef();
  const tooltipRef = useRef(null);

  useEffect(() => {
    // Add the svg element to the body and set the dimensions and margins of the graph
    var Nbin = 10;
    var svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    setRange([from, to]);

    var x = d3.scaleLinear().domain(range).nice().range([0, width]);

    var histogram = d3
      .bin()
      .domain(x.domain()) // then the domain of the graphic
      .thresholds(x.ticks(Nbin)); // then the numbers of bins

    // And apply this function to data to get the bins
    bins = histogram(data);
    console.log(bins);
    var svg = d3
      .select(svgRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    var y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([
        0,
        d3.max(bins, function (d) {
          return d.length;
        }),
      ]);


    /////****x axis label start here 10-02-23****/////
    svg
      .append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .style("fill", "black") // svg
      .attr("x", width / 2)
      .attr("y", height + 40)
      .attr("font-family", "sans-serif")
      .style("font-size", "1.0em")
      .text("slack values");
    /////****x axis label end here 10-02-23****/////

    /////****y axis label start here 10-02-23****/////
    svg
      .append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", -80)
      .style("fill", "black")
      .style("font-size", "1.0em")
      .attr("x", -height / 2)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("count of path");
    /////****y axis label end here 10-02-23****/////

    svg.append("g").call(d3.axisLeft(y));
   

    svg
      .selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .filter((d)=> d.length >0)
      .attr("x", 1)
      .attr("transform", function (d) {
        return "translate(" + x(d.x0) + "," + y(d.length) + ")";
      })
      .attr("width", function (d) {
        return x(d.x1) - x(d.x0) - 1;
      })
      .attr("height", function (d) {
        return height - y(d.length);
      })

      .style("fill", (d) => (d.x0 >= 0 ? "green" : "red"));
    console.log(bins)

    svg
      .selectAll(".bin-value")
      .data(bins)
      .enter()
      .append("text")
      .attr("class", "bin-value")
      .attr("x", function (d,i) {
        if (i=== bins.length -1){
          return -1000;
        }else{

          return x(d.x0) + (x(d.x1) - x(d.x0)) / 2;

        }
        
      })
      .attr("y", function (d) {
        return y(d.length) - 5;
      })
      .text(function (d) {
        if(d.length > 0 && d.x0 >= x.domain()[0]&& d.x1 <= x.domain()[1]){
          return d.length;
        }else{

          return "";

        }
        

      });

  }, [data,range, from, to]);




  return (
    <div style={{display: "flex"}}>
    {
      popup ? <span style={{border: "1px solid grey", color: "red", fontSize: "20px"}}>Error</span> : ""
    }
      <div style={{fontWeight: "900"}} ref={svgRef}></div>

      <div>
        <label style={{fontWeight: "900"}}>From:</label>
        <input
          type="number"
          value={from}
          onChange={(event) => setFrom(event.target.value)}
        />
      </div>
      <div>
        <label style={{fontWeight: "900"}} >To:</label>
        <input
          type="number"
          value={to}
          onChange={(event) => setTo(event.target.value)}
        />
      </div>
    </div>
  );
};

export default Histogram1;
