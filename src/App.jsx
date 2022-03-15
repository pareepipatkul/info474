import { scaleLinear, scaleBand, extent, line, csv, json } from 'd3';
import { useState } from 'react'
import logo from './logo.svg'
import census from "./census";
import './App.css'
import premierLeague from "./epl";
import chelseaData from "./chelsea";
import manCityData from "./mancity";
import liverpoolData from "./liverpool";
import manUtdData from "./manutd";
import leicesterData from "./leicester";
import westHamData from "./westham";
import tottenhamData from "./tottenham";
import arsenalData from "./arsenal";
import leedsData from "./leeds";
import evertonData from "./everton";
import * as d3 from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";

function App() {
  const [chelsea, setChelsea] = useState(true);
  const [manCity, setManCity] = useState(true);
  const [liverpool, setLiverpool] = useState(true);
  const [manUtd, setManUtd] = useState(true);
  const [team1, setTeam1] = useState("manutd");
  const [team2, setTeam2] = useState("chelsea");
  const [highlightedPlayer, setHighlightedPlayer] = useState("");

  const handleTeam1 = (event) => {
    let teamValue = event.target.value;
    setTeam1(teamValue);
  }

  const handleTeam2 = (event) => {
    let teamValue = event.target.value;
    setTeam2(teamValue);
  }

  const handleChelsea = () => {
    setChelsea(!chelsea);
  };

  const handleManCity = () => {
    setManCity(!manCity);
  };

  const handleLiverpool = () => {
    setLiverpool(!liverpool);
  };

  const handleManUtd = () => {
    setManUtd(!manUtd);
  };

  const circleScale = scaleLinear().domain([0, 350]).range([0, 250]);

  var minGoals = d3.min(premierLeague, (player) => {
    return parseInt(player.Goals);
  });

  var maxGoals = d3.max(premierLeague, (player) => {
    return parseInt(player.Goals);
  });

  var minPassesAttempted = d3.min(premierLeague, (player) => {
    return parseInt(player.Passes_Attempted);
  });

  var maxPassesAttempted = d3.max(premierLeague, (player) => {
    return parseInt(player.Passes_Attempted);
  });

  var minPercPass = d3.min(premierLeague, (player) => {
    return 60;
  });

  var maxPercPass = d3.max(premierLeague, (player) => {
    return parseInt(player.Perc_Passes_Completed);
  });

  var minAssists = d3.min(premierLeague, (player) => {
    return parseInt(player.Assists);
  });

  var maxAssists = d3.max(premierLeague, (player) => {
    return parseInt(player.Assists);
  });

  var minXA = d3.min(premierLeague, (player) => {
    return parseInt(player.xA);
  });

  var maxXA = d3.max(premierLeague, (player) => {
    return 0.6;
  });

  var minXG = d3.min(premierLeague, (player) => {
    return parseInt(player.xG);
  });

  var maxXG = d3.max(premierLeague, (player) => {
    return 0.7;
  });



  const premierLeagueChartHeight = 100;
  const premierLeagueChartWidth = 800;
  const premierLeagueMargin = 20;
  const premierLeagueAxisTextPadding = 5;

  const premierLeagueGoalsScale = scaleLinear()
    .domain([minGoals, maxGoals])
    .range([premierLeagueMargin, premierLeagueChartWidth - premierLeagueMargin - premierLeagueMargin]);


  const premierLeaguePassesAttemptedScale = scaleLinear()
    .domain([minPassesAttempted, maxPassesAttempted])
    .range([premierLeagueMargin, premierLeagueChartWidth - premierLeagueMargin - premierLeagueMargin])

  const premierLeaguePercPassScale = scaleLinear()
    .domain([minPercPass, maxPercPass])
    .range([premierLeagueMargin, premierLeagueChartWidth - premierLeagueMargin - premierLeagueMargin])

  const premierLeagueAssistsScale = scaleLinear()
    .domain([minAssists, maxAssists])
    .range([premierLeagueMargin, premierLeagueChartWidth - premierLeagueMargin - premierLeagueMargin])

  const premierLeagueXAScale = scaleLinear()
    .domain([minXA, maxXA])
    .range([premierLeagueMargin, premierLeagueChartWidth - premierLeagueMargin - premierLeagueMargin])

  const premierLeagueXGScale = scaleLinear()
    .domain([minXG, maxXG])
    .range([premierLeagueMargin, premierLeagueChartWidth - premierLeagueMargin - premierLeagueMargin])

  const pGoalsBinGenerator = d3.bin().value((d) => parseInt(d.Goals))
  const pPassesBinGenerator = d3.bin().value((d) => parseInt(d.Passes_Attempted));

  const doD3Stuff = (element) => {
    // 2D Scatter
    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select(element)
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    const svg2 = d3.select(element)
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    const x = d3.scaleLinear()
      .domain([0, maxAssists])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, maxXA])
      .range([ height, 0]);

    // text label for the x axis
    svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Assists");

    // text label for the y axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Expected Assists per Game");

    // Add X axis
    const x2 = d3.scaleLinear()
      .domain([0, maxGoals])
      .range([ 0, width ]);
    svg2.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x2));

    // Add Y axis
    const y2 = d3.scaleLinear()
      .domain([0, maxXG])
      .range([ height, 0]);

    // text label for the x axis
    svg2.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Goals");

    // text label for the y axis
    svg2.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Expected Goals per Game");

    const tip = d3.select(element)
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")

    const getPlayer = function(d) {
      console.log(d.target.__data__.Name);
      setHighlightedPlayer(d.target.__data__.Name);
      return d.target.__data__.Name;
    }

    const mouseover = function(d) {
      // if (d.target.__data__.Name === "Bruno Fernandes") {

      // }
      // svg.selectAll("dot").filter(function(d_other) {
      //   console.log('hi');
      //   console.log(d_other);
      // })
      // console.log(d);
      d3.select(this).style("fill", "red");
      tip.style("opacity", 1);
      setHighlightedPlayer(d.target.__data__.Name);
      return d.target.__data__.Name;
    }



    const mousemove = function(d) {
      tip
        .html("Player: " + d.target.__data__.Name + ";  Goals: " + d.target.__data__.Goals + ";  xG: " + d.target.__data__.xG + ";  Assists: " + d.target.__data__.Assists + ";  xA: " + d.target.__data__.xA)
        // .style("left", (d3.mouse(this)[0]+90) + "px")
        // .style("top", (d3.mouse(this)[1]) + "px")
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    const mouseleave = function(d) {
      d3.select(this).style("fill", "black");
      tip
        .transition()
        .duration(200)
        .style("opacity", 0)
  }


  svg2.append("g")
    .call(d3.axisLeft(y2));

  let team1Data = manUtdData;
  let team2Data = chelseaData;

  if (team1 === "mancity") {
    team1Data = manCityData;
  } else if (team1 === "manutd") {
    team1Data = manUtdData;
  } else if (team1 === "liverpool") {
    team1Data = liverpoolData;
  } else if (team1 === "chelsea") {
    team1Data = chelseaData;
  } else if (team1 === "leicester") {
    team1Data = leicesterData;
  } else if (team1 === "westham") {
    team1Data = westHamData;
  } else if (team1 === "tottenham") {
    team1Data = tottenhamData;
  } else if (team1 === "arsenal") {
    team1Data = arsenalData;
  } else if (team1 === "leeds") {
    team1Data = leedsData;
  } else if (team1 === "everton") {
    team1Data = evertonData;
  }

  if (team2 === "mancity") {
    team2Data = manCityData;
  } else if (team2 === "manutd") {
    team2Data = manUtdData;
  } else if (team2 === "liverpool") {
    team2Data = liverpoolData;
  } else if (team2 === "chelsea") {
    team2Data = chelseaData;
  } else if (team2 === "leicester") {
    team2Data = leicesterData;
  } else if (team2 === "westham") {
    team2Data = westHamData;
  } else if (team2 === "tottenham") {
    team2Data = tottenhamData;
  } else if (team2 === "arsenal") {
    team2Data = arsenalData;
  } else if (team2 === "leeds") {
    team2Data = leedsData;
  } else if (team2 === "everton") {
    team2Data = evertonData;
  }

  const dotsRight1 = svg2.append('g')
    .selectAll("dot")
    .data(team1Data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x2(d.Goals); } )
      .attr("cy", function (d) { return y2(d.xG); } )
      .attr("r", 4)
      .style("fill", function(d) {
        if (d.Name === highlightedPlayer) {
          return "red";
        } else {
          return "black";
        }
      })
    .on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave )


  const dotsRight2 = svg2.append('g')
    .selectAll("dot")
    .data(team2Data)
    .enter()
    .append("path")
      .attr("d", d3.symbol().type(d3.symbolCross))
      .attr("transform", function(d) { return "translate(" + x2(d.Goals) + "," + y2(d.xG) + ")"; })
      .style("fill", function(d) {
        if (d.Name === highlightedPlayer) {
          return "red";
        } else {
          return "black";
        }
      })
    .on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave )


  svg.append("g")
    .call(d3.axisLeft(y));

  const dotsLeft1 = svg.append('g')
    .selectAll("dot")
    .data(team1Data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.Assists); } )
      .attr("cy", function (d) { return y(d.xA); } )
      .attr("r", 3)
      .style("fill", function(d) {
        if (d.Name === highlightedPlayer) {
          return "red";
        } else {
          return "black";
        }
      })
    .on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave );

  const dotsLeft2 = svg.append('g')
    .selectAll("dot")
    .data(team2Data)
    .enter()
    .append("path")
      .attr("d", d3.symbol().type(d3.symbolCross))
      .attr("transform", function(d) { return "translate(" + x(d.Assists) + "," + y(d.xA) + ")"; })
      .style("fill", function(d) {
        if (d.Name === highlightedPlayer) {
          return "red";
        } else {
          return "black";
        }
      })
    .on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave )
  };



  const goalsBins = pGoalsBinGenerator(premierLeague);
  const passesAttemptedBins = pPassesBinGenerator(premierLeague);

  const goalsBarHeightScale = scaleLinear()
    .domain([0, d3.max(goalsBins, (d) => d.length)])
    .range([premierLeagueChartHeight - premierLeagueMargin - premierLeagueAxisTextPadding, premierLeagueMargin,]);

  const passesAttemptedBarHeightScale = scaleLinear()
    .domain([0, d3.max(passesAttemptedBins, (d) => d.length)])
    .range([premierLeagueChartHeight - premierLeagueMargin - premierLeagueAxisTextPadding, premierLeagueMargin,]);

  let popOver80in1900 = 0;

  let popOver80in2000 = 0;

  let adultPopIn1900 = 0;

  let adultPopIn2000 = 0;

  census.forEach((data) => {
    if (data.Age >= 80 && data.Year == 1900) {
      popOver80in1900 += parseInt(data.People);
    }
    if (data.Age >= 80 && data.Year == 2000) {
      popOver80in2000 += parseInt(data.People);
    }
    if (data.Age >= 20 && data.Age <= 40 && data.Year == 1900) {
      adultPopIn1900 += parseInt(data.People);
    }
    if (data.Age >= 20 && data.Age <= 40 && data.Year == 2000) {
      adultPopIn2000 += parseInt(data.People);
    }
  });

  const popOver80 = [popOver80in2000, popOver80in1900];
  const adultPop = [adultPopIn2000, adultPopIn1900];

  const text_data = ["Population Growth for Those Over 80", "Pop. per 30k Over 80 in 1900", "Pop per 300k Between 20-40 in 2000", "Pop per 300k Between 20-40 in 1900"];

  const paragraph1 = "A question I’d like to answer is: Has the super-senior group of the US population got significantly larger over the past century? In other words, I’d like to see how many people in the year 2000 are living to ages 80 and above, in comparison to the year 1900. This will give us an indicator of healthcare improvements of the overall country and when compared to younger age groups, as well how much growth has older age groups experienced over the last century. We will need to look at growth in younger age groups to answer this question as well.";

  const paragraph2 = "From the data it is evident that the population over those over 80 has significantly increased during the past century. I chose to use circles, because I intend to convey the magnitude of increase in population size for those over 80 years old. This helps the visualization and the message of “wow, that is a big increase in comparison.” The math I did was to simply divide the population of those ages 80 and over in the year 2000 by the same population age group in the year 1900. This gives us the ratio of the super senior population group and I did the same for the young adult group as I filtered for the ages from 20 - 40. To do this, we need to filter out the data for these age groups and keep track of a constiable to sum up the population.";

  const paragraph3 = "Ratio of Population Ages >= 80 in Year 2000 to Population Ages >= 80 in Year 1900: 24.4 (For every one super senior in the year 1900, there is 24.4 individuals in the year 2000).";

  const paragraph4 = "Ratio of Population Ages 20-40 in Year 2000 to Population Ages 20-40 in Year 1900: 3.6 (For every one young adult in the year 1900, there is 3.6 individuals in the year 2000)";

  const paragraph5 = "Each circle has a radius that represents the size of this ratio that I computed. The radius is then multiplied by an arbitrary number (in this case it is the value 4), so that it is scaled appropriately to fit my web page. We need to ensure not to add or subtract any numbers to this radius so that it won’t mess up the scaling and size of our circles and misrepresent our data. To paint a picture of the growth of the super-senior population, the circles are aligned next to each other. The color choice of a bright, vibrant orange was chosen for a bolder look that sticks out.";

  const paragraph6 = "The circle for the young adult population exists (which appear in a different color for clarity, we want to avoid having the same hue) because although we want to answer a question on the super-senior population, we need to consider general population growth and understand the growth rate in other age groups as well. Of course there are going to be more people in every age group in the year 2000 compared to the year 1900. But, I want my audience to observe that the old age groups have experienced massive growth over the past century. This should inform the viewer that perhaps the standard of healthcare in the US has increased to a point where it is expected for a large chunk of the population to be able to live to this age.";
  return (
    <div className="App">
      <h1> 2020 - 2021 English Premier League Interactive xAssists/Assists & xGoals/Goals Comparison Plots </h1>

      <p> The 2020 - 2021 Premier League (European football) season features some of the world's most technically gifted football players. Since scoring goals are the most
      exciting and important aspects of the game, we will look at attacking statistics and comparing their assists and goalscoring threat.
      </p>
      <p>
      In our plots, we will be exploring all players of the two selected teams to see how they stack up in assists, expected assists per game, goals, and expected goals per game to see
      the distribution of a team's attacking statistics (in the form of assists and goals contribution) and to also look for positive outliers. (Below the plots is the explanation about how the xA/xG per game statistic is calculated)
      </p>

      <h3> Pick two teams and hover over each of their player's data points in the plot to highlight how
      the player performs in either plot! A tooltip of the player will be displayed upon mouseover.
      </h3>



      <div style={{"margin": 15}}>
        <text style={{"margin": 10}}>Select Team 1:</text>
        <select id="select1" onChange={handleTeam1} value={team1}>
          <option value="mancity">Manchester City</option>
          <option value="manutd">Manchester United</option>
          <option value="liverpool">Liverpool</option>
          <option value="chelsea">Chelsea</option>
          <option value="leicester">Leicester City</option>
          <option value="westham">West Ham</option>
          <option value="tottenham">Tottenham</option>
          <option value="arsenal">Arsenal</option>
          <option value="leeds">Leeds United</option>
          <option value="everton">Everton</option>
        </select>
        <text style={{"margin": 5}}>labeled by: •</text>
      </div>

      <div style={{"margin": 15}}>
        <text style={{"margin": 10}}>Select Team 2:</text>
        <select id="select2" onChange={handleTeam2} value={team2}>
          <option value="mancity">Manchester City</option>
          <option value="manutd">Manchester United</option>
          <option value="liverpool">Liverpool</option>
          <option value="chelsea">Chelsea</option>
          <option value="leicester">Leicester City</option>
          <option value="westham">West Ham</option>
          <option value="tottenham">Tottenham</option>
          <option value="arsenal">Arsenal</option>
          <option value="leeds">Leeds United</option>
          <option value="everton">Everton</option>
        </select>
        <text style={{"margin": 5}}>labeled by: +</text>
      </div>

      <div>
        <div id="container" ref={doD3Stuff} />
      </div>



      <h1> What is xA/xG (Expected Assists/Goals)? </h1>

      <p>
        TLDR version:
      </p>

      <p>
        xA = Expected number of assists from the player in a match.
      </p>
      <p>
        xG = Expected number of goals from the player in a match.
      </p>

      <h2> ---- </h2>
      <p>
        Expected assists (xA) measures the likelihood that a given pass will become an assist. It considers several factors including the type of pass, pass end-point and length of pass. (via statsperform.com)
      </p>

      <p>
        Expected goals (or xG) measures the quality of a chance by calculating the likelihood that it will be scored from a particular position on the pitch during a particular phase of play.
        This value is based on several factors from before the shot was taken.
        xG is measured on a scale between zero and one, where zero represents a chance that is impossible to score and one represents a chance that a player would be expected to score every single time. (via theanalyst.com)
      </p>

      <p>
        Important: In our data, we sum a player's xA and xG values up for each game they play and take the average over the course of their season, indicating how many assists and goals they should have had based on the quality of their attacking play on average in a single game.
      </p>

      <h1> ------------ </h1>


      <h2> 2020 - 2021 English Premier League Interactive Total Passes Attempted Plot (Top 4 Teams) </h2>
      <div>
        <label style={{"margin-right": 15}}>
          <input
            type="checkbox"
            checked={chelsea}
            onChange={handleChelsea}
          />
          Chelsea
        </label>
        <label style={{"margin-right": 15}}>
          <input
            type="checkbox"
            checked={manCity}
            onChange={handleManCity}
          />
          Manchester City
        </label>
        <label style={{"margin-right": 15}}>
          <input
            type="checkbox"
            checked={liverpool}
            onChange={handleLiverpool}
          />
          Liverpool
        </label>
        <label style={{"margin-right": 15}}>
          <input
            type="checkbox"
            checked={manUtd}
            onChange={handleManUtd}
          />
          Manchester United
        </label>
      </div>

      <svg width={premierLeagueChartWidth} height={premierLeagueChartHeight} style={{border: "none"}}>
        {chelseaData.map((player, i) => {
          return (
            <circle
              key={i}
              cx={premierLeaguePassesAttemptedScale(parseInt(player.Passes_Attempted))}
              cy={premierLeagueChartHeight / 2}
              r={9}
              style={
                chelsea === true
                  ? { fill: "none", stroke: "rgba(0,255,255,.4)" }
                  : { fill: "none", stroke: "rgba(0,0,0,.0)" }
              }
            ></circle>
          );
        }
        )}
        {manCityData.map((player, i) => {
          return (
            <circle
              key={i}
              cx={premierLeaguePassesAttemptedScale(parseInt(player.Passes_Attempted))}
              cy={premierLeagueChartHeight / 2}
              r={9}
              style={
                manCity === true
                  ? { fill: "none", stroke: "rgba(0,0,0,.4)" }
                  : { fill: "none", stroke: "rgba(0,0,0,.0)" }
              }
            ></circle>
          );
        }
        )}
        {liverpoolData.map((player, i) => {
          return (
            <circle
              key={i}
              cx={premierLeaguePassesAttemptedScale(parseInt(player.Passes_Attempted))}
              cy={premierLeagueChartHeight / 2}
              r={9}
              style={
                liverpool === true
                  ? { fill: "none", stroke: "rgba(0,128,0,.4)" }
                  : { fill: "none", stroke: "rgba(0,0,0,.0)" }
              }
            ></circle>
          );
        }
        )}
        {manUtdData.map((player, i) => {
          return (
            <circle
              key={i}
              cx={premierLeaguePassesAttemptedScale(parseInt(player.Passes_Attempted))}
              cy={premierLeagueChartHeight / 2}
              r={9}
              style={
                manUtd === true
                  ? { fill: "none", stroke: "rgba(255,0,0,.4)" }
                  : { fill: "none", stroke: "rgba(0,0,0,.0)" }
              }
            ></circle>
          );
        }
        )}

        <AxisBottom
          strokeWidth={1}
          top={premierLeagueChartHeight - premierLeagueMargin - premierLeagueAxisTextPadding}
          scale={premierLeaguePassesAttemptedScale}
          numTicks={10}
        />
      </svg>

      <p> Let's look at an interactive strip plot for total passes attempted out of the top 4 teams. We can see Liverpool is the team with the most positive outliers in passes attempted, but they also have the highest variability in this statistic.
      Chelsea on the other hand, use a team system that is much more reliant on the creative capabilities of the entire team, and we can see that it is represented well in the data as each of their players' data is more clumped together.
      We can also notice that Manchester City and Liverpool have the most creative players in the league as they both have two positive outliers in this statistic. When we dive into the data, both of Liverpool's outliers are wide attacking full backs while
      Manchester City's outliers are central players playing close to the holding midfield area. This indicates that Liverpool are more likely to build up and create chances coming in from the wide areas of the pitch, while Manchester City are more focused on
      buildup play from the middle of the pitch.
      </p>

      <h2> 2020 - 2021 English Premier League Interactive Percentage of Passes Completed Plot (Top 4 Teams) </h2>



      <svg width={premierLeagueChartWidth} height={premierLeagueChartHeight} style={{border: "none"}}>
        {chelseaData.map((player, i) => {
          return (
            <circle
              key={i}
              cx={premierLeaguePercPassScale(parseFloat(player.Perc_Passes_Completed))}
              cy={premierLeagueChartHeight / 2}
              r={9}
              style={
                chelsea === true
                  ? { fill: "none", stroke: "rgba(0,255,255,.4)" }
                  : { fill: "none", stroke: "rgba(0,0,0,.0)" }
              }
            ></circle>
          );
        }
        )}
        {manCityData.map((player, i) => {
          return (
            <circle
              key={i}
              cx={premierLeaguePercPassScale(parseFloat(player.Perc_Passes_Completed))}
              cy={premierLeagueChartHeight / 2}
              r={9}
              style={
                manCity === true
                  ? { fill: "none", stroke: "rgba(0,0,0,.4)" }
                  : { fill: "none", stroke: "rgba(0,0,0,.0)" }
              }
            ></circle>
          );
        }
        )}
        {liverpoolData.map((player, i) => {
          return (
            <circle
              key={i}
              cx={premierLeaguePercPassScale(parseFloat(player.Perc_Passes_Completed))}
              cy={premierLeagueChartHeight / 2}
              r={9}
              style={
                liverpool === true
                  ? { fill: "none", stroke: "rgba(0,128,0,.4)" }
                  : { fill: "none", stroke: "rgba(0,0,0,.0)" }
              }
            ></circle>
          );
        }
        )}
        {manUtdData.map((player, i) => {
          return (
            <circle
              key={i}
              cx={premierLeaguePercPassScale(parseFloat(player.Perc_Passes_Completed))}
              cy={premierLeagueChartHeight / 2}
              r={9}
              style={
                manUtd === true
                  ? { fill: "none", stroke: "rgba(255,0,0,.4)" }
                  : { fill: "none", stroke: "rgba(0,0,0,.0)" }
              }
            ></circle>
          );
        }
        )}

        <AxisBottom
          strokeWidth={1}
          top={premierLeagueChartHeight - premierLeagueMargin - premierLeagueAxisTextPadding}
          scale={premierLeaguePercPassScale}
          numTicks={10}
          tickFormat={function tickFormat(v){
            return v + "%";
          }}
        />
      </svg>
      <p>
        Let's look at percentage of passes completed to see the accuracy and how much risk each team is willing to take when they have
        possession of the ball. We can see why Manchester City are the champions of the league. The way they use the ball is extremely prominent to see in our
        percentage of passes completed, with many data points clumped together around the 90-95% mark. The data matches my eye test, as they are a extremely possession
        oriented team. In comparison, Liverpool and Chelsea have similarly looking distributions but slightly worse (as they did finish underneath Manchester City), but Manchester United certainly play a different way and it seems they aren't
        as focused on ball possession. This is accurate as they are known to be a counter-attacking team who look to hit teams on turnovers of the ball, so it makes sense that their
        percentage of passes completion numbers are lower.
      </p>

      <h2> 2020 - 2021 English Premier League Assists Plot (Top 4 Teams) </h2>



      <svg width={premierLeagueChartWidth} height={premierLeagueChartHeight} style={{border: "none"}}>
        {chelseaData.map((player, i) => {
          return (
            <circle
              key={i}
              cx={premierLeagueAssistsScale(parseInt(player.Assists))}
              cy={premierLeagueChartHeight / 6}
              r={7}
              style={
                chelsea === true
                  ? { fill: "rgba(0,255,255)", stroke: "rgba(0,255,255)" }
                  : { fill: "none", stroke: "rgba(0,0,0,.0)" }
              }
            ></circle>
          );
        }
        )}
        {manCityData.map((player, i) => {
          return (
            <circle
              key={i}
              cx={premierLeagueAssistsScale(parseInt(player.Assists))}
              cy={premierLeagueChartHeight / 3}
              r={7}
              style={
                manCity === true
                  ? { fill: "rgba(0,0,0)", stroke: "rgba(0,0,0)" }
                  : { fill: "none", stroke: "rgba(0,0,0)" }
              }
            ></circle>
          );
        }
        )}
        {liverpoolData.map((player, i) => {
          return (
            <circle
              key={i}
              cx={premierLeagueAssistsScale(parseInt(player.Assists))}
              cy={premierLeagueChartHeight / 2}
              r={7}
              style={
                liverpool === true
                  ? { fill: "rgba(0,128,0)", stroke: "rgba(0,128,0)" }
                  : { fill: "none", stroke: "rgba(0,0,0)" }
              }
            ></circle>
          );
        }
        )}
        {manUtdData.map((player, i) => {
          return (
            <circle
              key={i}
              cx={premierLeagueAssistsScale(parseInt(player.Assists))}
              cy={premierLeagueChartHeight / 1.5}
              r={7}
              style={
                manUtd === true
                  ? { fill: "rgba(255,0,0)", stroke: "rgba(255,0,0)" }
                  : { fill: "none", stroke: "rgba(0,0,0,.0)" }
              }
            ></circle>
          );
        }
        )}

        <AxisBottom
          strokeWidth={1}
          top={premierLeagueChartHeight - premierLeagueMargin - premierLeagueAxisTextPadding}
          scale={premierLeagueAssistsScale}
          numTicks={10}
        />
      </svg>






      <h1> Assignment 3 Write-Up </h1>
      <p>
        The 2020 - 2021 Premier League (European football) season features a close battle for the top 4 positions, in which the top 4 teams is guaranteed qualification
        for the prestigious UEFA Champions League competition. To analyze a team's play, it is especially important to understand how dominant teams use possession of the ball, as they
        are expected to have more of the ball compared to teams lower than them in the standings. When we look at passing numbers, we can attempt to understand their game plan and even compare
        these data points to the other "Big 4" teams. Here we are analyzing the total passes attempted statistic and the percentage of passes completed statistic for each of these team's players over a
        full season for these top 4 teams in England, and comparing these distributions to each other.
      </p>
      <p>
        By using a strip plot, in which we determined was the most suitable plot type to plot these statistics, allows us to show all the players' data on a one-dimensional axis. When we compare each teams'
        players, we also want to be able to distinguish each team from another and also see if there are any outliers (extraordinary players). Since each team represents a variable that is categorical in nature (and we are comparing each team to another), I chose distinct
        colors for each of the teams so that it is easy for the audience to compare their passing statistics. I also had to choose colors carefully, ensuring they are distinct enough from each other if they happen
        to overlap on the plot while picking colors that are easily visible on a white background. Also, since the plots might be cluttered with all these data points of each player, it makes the interactive feature of using a
        checkbox extremely helpful. We can look at all the 4 teams' data at once, or have the option to display or undisplay any team at your choosing. This allows the audience to understand how the data is distributed for each team
        at their own choosing.
      </p>
      <p>
        As the only member working on this assignment, the development process was started as soon as the last assignment was submitted. I came to the conclusion that the choice of a strip plot was most effective in answering questions with this dataset.
        I wanted to look at passing statistics for each team, so it was necessary to split up the players' data filtered by team. This process alongside brainstorming how I wanted to answer the questions was part of the data wrangling process which took about
        2 hours. Then, I spent another two hours figuring out the React hooks and how to use checkboxes to display and undisplay each of these data points on my plots, a necessary component to help with the interactive comparison feature. Setting up the scale and
        coding each of the teams' data points also took several hours, ensuring the circles representing each data point are displayed appropriately and matching with the distinct colors. I thought that setting up the React hooks to work with the checkboxes took the
        most time as I needed several tries to make it work the way I wanted.
      </p>

      <h1> --------------- </h1>

      <p>
        The English Premier League players dataset contains {premierLeague.length} professional soccer players.
        Each player has statistics that have been accumulated over the course of the full 2020 - 2021 season.
        We will analyze their goals output and passes completed statistics, two metrics that are key to team contribution.
      </p>

      <p>
        Let's take a look at a barcode plot of the goals scored by each player and how they are distributed.
      </p>

      <svg width={premierLeagueChartWidth} height={premierLeagueChartHeight} style={{border: "none"}}>
        {premierLeague.map((player, i) => {
          return (
            <line
              key={i}
              x1={premierLeagueGoalsScale(parseInt(player.Goals))}
              y1={20}
              x2={premierLeagueGoalsScale(parseInt(player.Goals))}
              y2={60}
              strokeWidth={0.3}
              style={{ fill: "none", stroke: "rgba(70,130,180,0.9)" }}
            ></line>
          );
        }

        )}
        <AxisBottom
          strokeWidth={1}
          top={premierLeagueChartHeight - premierLeagueMargin - premierLeagueAxisTextPadding}
          scale={premierLeagueGoalsScale}
          numTicks={4}
        />

      </svg>

      <p>
        We now have a good idea of how the goals scored are distributed across the league. Let's take a look at a strip plot to understand the visualization behind
        how the goals scored are distributed. As we can see by the opacity, we have significantly big portion of players who are towards the lower quadrant.
      </p>

      <svg width={premierLeagueChartWidth} height={premierLeagueChartHeight} style={{border: "none"}}>
        {premierLeague.map((player, i) => {
          return (
            <circle
              key={i}
              cx={premierLeagueGoalsScale(parseInt(player.Goals))}
              cy={premierLeagueChartHeight / 2}
              r={10}
              style={{ fill: "none", stroke: "rgba(50,50,50,.1)" }}
            ></circle>
          );
        }

        )}
        <AxisBottom
          strokeWidth={1}
          top={premierLeagueChartHeight - premierLeagueMargin - premierLeagueAxisTextPadding}
          scale={premierLeagueGoalsScale}
          numTicks={10}
        />
      </svg>

      <p>
        Here we have a jittered strip plot of the goals scored, giving us a better understanding of where most players stand in the league.
      </p>

      <svg width={premierLeagueChartWidth} height={premierLeagueChartHeight * 2} style={{border: "none"}}>
        {premierLeague.map((player, i) => {
          return (
            <circle
              key={i}
              cx={premierLeagueGoalsScale(parseInt(player.Goals))}
              cy={(Math.random() * premierLeagueChartHeight)}
              r={3}
              style={{ fill: "none", stroke: "rgba(70,150,90,.5)" }}
            ></circle>
          );
        }

        )}
        <AxisBottom
          strokeWidth={1}
          top={130}
          scale={premierLeagueGoalsScale}
          numTicks={10}
        />
      </svg>

      <p> Now we have a histogram with labels of the goals scored. </p>

      <svg width={premierLeagueChartWidth} height={premierLeagueChartHeight}>
        {goalsBins.map((bin, i) => {
          return (
            <rect
              key={i}
              fill="#e69138"
              x={premierLeagueGoalsScale(bin.x0) + 1}
              y={goalsBarHeightScale(bin.length)}
              width={Math.max(0, premierLeagueGoalsScale(bin.x1) - premierLeagueGoalsScale(bin.x0) - 1)}
              height={goalsBarHeightScale(0) - goalsBarHeightScale(bin.length)}
            />
          );
        })}
        {goalsBins.map((bin, i) => {
          return (
            <text
              key={i}
              fill="black"
              fontsize="10"
              textAnchor="middle"
              x={((premierLeagueGoalsScale(bin.x0) + premierLeagueGoalsScale(bin.x1)) / 2) | 0}
              y={goalsBarHeightScale(bin.length) - 2}
            >
              {bin.length}
            </text>
          );
        })}
        <AxisBottom
          strokeWidth={1}
          top={premierLeagueChartHeight - premierLeagueMargin - premierLeagueAxisTextPadding}
          scale={premierLeagueGoalsScale}
          numTicks={10}
        />
      </svg>

      <p> Now let's look at a barcode plot of total passes attempted by each player in the league over the full season.
      </p>

      <svg width={premierLeagueChartWidth} height={premierLeagueChartHeight} style={{border: "none"}}>
        {premierLeague.map((player, i) => {
          return (
            <line
              key={i}
              x1={premierLeaguePassesAttemptedScale(parseInt(player.Passes_Attempted))}
              y1={20}
              x2={premierLeaguePassesAttemptedScale(parseInt(player.Passes_Attempted))}
              y2={60}
              strokeWidth={0.3}
              style={{ fill: "none", stroke: "rgba(70,130,180,0.9)" }}
            ></line>
          );
        }

        )}
        <AxisBottom
          strokeWidth={1}
          top={premierLeagueChartHeight - premierLeagueMargin - premierLeagueAxisTextPadding}
          scale={premierLeaguePassesAttemptedScale}
          numTicks={10}
        />

      </svg>

      <p> Now we show a strip plot of total passes attempted. </p>

      <svg width={premierLeagueChartWidth} height={premierLeagueChartHeight} style={{border: "none"}}>
        {premierLeague.map((player, i) => {
          return (
            <circle
              key={i}
              cx={premierLeaguePassesAttemptedScale(parseInt(player.Passes_Attempted))}
              cy={premierLeagueChartHeight / 2}
              r={5}
              style={{ fill: "none", stroke: "rgba(50,50,50,.1)" }}
            ></circle>
          );
        }

        )}
        <AxisBottom
          strokeWidth={1}
          top={premierLeagueChartHeight - premierLeagueMargin - premierLeagueAxisTextPadding}
          scale={premierLeaguePassesAttemptedScale}
          numTicks={10}
        />
      </svg>

      <p> Let's look at the jittered strip plot of passes attempted. </p>

      <svg width={premierLeagueChartWidth} height={premierLeagueChartHeight * 2} style={{border: "none"}}>
        {premierLeague.map((player, i) => {
          return (
            <circle
              key={i}
              cx={premierLeaguePassesAttemptedScale(parseInt(player.Passes_Attempted))}
              cy={(Math.random() * premierLeagueChartHeight)}
              r={3}
              style={{ fill: "none", stroke: "rgba(70,150,90,.5)" }}
            ></circle>
          );
        }

        )}

        <AxisBottom
          strokeWidth={1}
          top={130}
          scale={premierLeaguePassesAttemptedScale}
          numTicks={10}
        />
      </svg>


      <p>Finally, let's look at the histogram and distribution of total passes attempted.</p>

      <svg width={premierLeagueChartWidth} height={premierLeagueChartHeight}>
        {passesAttemptedBins.map((bin, i) => {
          return (
            <rect
              key={i}
              fill="#e69138"
              x={premierLeaguePassesAttemptedScale(bin.x0) + 1}
              y={passesAttemptedBarHeightScale(bin.length)}
              width={Math.max(0, premierLeaguePassesAttemptedScale(bin.x1) - premierLeaguePassesAttemptedScale(bin.x0) - 1)}
              height={passesAttemptedBarHeightScale(0) - passesAttemptedBarHeightScale(bin.length)}
            />
          );
        })}
        {passesAttemptedBins.map((bin, i) => {
          return (
            <text
              key={i}
              fill="black"
              fontsize="10"
              textAnchor="middle"
              x={((premierLeaguePassesAttemptedScale(bin.x0) + premierLeaguePassesAttemptedScale(bin.x1)) / 2) | 0}
              y={passesAttemptedBarHeightScale(bin.length) - 2}
            >
              {bin.length}
            </text>
          );
        })}
        <AxisBottom
          strokeWidth={1}
          top={premierLeagueChartHeight - premierLeagueMargin - premierLeagueAxisTextPadding}
          scale={premierLeaguePassesAttemptedScale}
          numTicks={10}
        />
      </svg>

      <p>
        To conclude, the Premier League is known at the pinnacle of soccer, with teams that are incredibly organized and players with the highest abilities in the world.
        The dataset describes statistics over the course of a full soccer season, and I've decided to look more into goals and passes attempted to analyze their attacking
        contribution as ultimately the aim of soccer is to score goals. These players that are the outliers are regularly scouted by top professionals who are paid to watch
        them in person, but a data analysis and visualization should tell part of the story as teams look to find value or sign superstar players.
      </p>

      <p>
        With these four types of plots, we are able to see that with the goals scored over the season, most players do not contribute in this regard with a significant
        portion of the players contributing zero goals or one goal per season. This is of course expected as defenders make up more than half of a team, especially for lower
        league sides are aim to sit deep and hit on the counter-attack, creating a game that lacks goals and are defensively set up very tight at the back. However, we can see
        that there are 2 players that stand out and broke the 22+ goals barrier: Harry Kane (who plays for Tottenham Hotspur on 23 goals) and Mohammed Salah (plays for Liverpool, 22 goals).

      </p>
      <p>
        These top goalscorers are followed by Bruno Fernandes of Manchester United on 18 goals, and Son Heung Min and Patrick Bamford on 17 goals each. Noticably, only one player
        out of the top 5 goalscorers do not play for a traditional top team, that is Patrick Bamford. This makes him a standout player for the role
        he plays with respect to the quality of his teammates. To add, if you factor in the fact that there are 20 teams in the league, it seems as if only one or two players
        per team are consistently geting past the 10 goal barrier. This speaks to the style of the game, where goalscorers take on a very defined role while others are primarily contributing
        to the team in other areas.
      </p>

      <p>
        When we look at passes completed, we also see a right tailed distribution (data screwed to the right). The standout player in this category is Andrew Robertson of Liverpool with 3214
        attempted passes. We can try to understand that this player has consistently been in positions to contribute regularly in terms of attempting passes, in which a player with more attempted
        passes would naturally create more goalscoring opportunities. He is followed by Trent Alexander Arnold of Liverpool, another fullback who likes to overlap regularly into the attack. This speaks
        volumes about how Liverpool are set up and how they rely on their defenders to overlap the flanks to create goalscoring opportunities as a main part of their ball progression. As far as the distribution goes,
        we can notice that a huge majority of players struggle to break past the 1500 passes attempted mark, and even if you factor in players who don't start many games, it seems that most players will be able to contribute
        with passes more so than goals as the data and plots are less skewed (these plots have data that are more evenly distributed in comparison).
      </p>

      <svg width="500" height="500" style={{border: "1px solid blue"}}>
      <text x="10" y="40" fontSize={15}>
        Population Growth from 1900-2000 for S-Senior Group vs Young Adults
      </text>

      <text x="50" y="140" fontSize={14}>
        Pop. Growth for Ages 80 and above
      </text>

      <text x="310" y="220" fontSize={14}>
        Pop. Growth for Ages 20-40
      </text>
      <circle
        fill={"#FF5733"}
        cx={170}
        cy={250}
        r={(popOver80in2000 / popOver80in1900) * 4}
      />

      <circle
        fill={"#69b3a2"}
        cx={400}
        cy={250}
        r={(adultPopIn2000 / adultPopIn1900) * 4}
      />

      <text x="50" y="380" fontSize={12}>
        Population grew 24.4 times in size
      </text>

      <text x="300" y="300" fontSize={12}>
        Population grew 3.61 times in size
      </text>


      </svg>

      <p>
        {paragraph1}
      </p>

      <p>
        {paragraph2}
      </p>

      <p>
        {paragraph3}
      </p>

      <p>
        {paragraph4}
      </p>

      <p>
        {paragraph5}
      </p>

      <p>
        {paragraph6}
      </p>

    </div>
  )
}

export default App
