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
import * as d3 from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";

function App() {
  const [chelsea, setChelsea] = useState(false);
  const [manCity, setManCity] = useState(false);
  const [liverpool, setLiverpool] = useState(false);
  const [manUtd, setManUtd] = useState(false);

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

  const pGoalsBinGenerator = d3.bin().value((d) => parseInt(d.Goals))
  const pPassesBinGenerator = d3.bin().value((d) => parseInt(d.Passes_Attempted));



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

  const paragraph2 = "From the data it is evident that the population over those over 80 has significantly increased during the past century. I chose to use circles, because I intend to convey the magnitude of increase in population size for those over 80 years old. This helps the visualization and the message of “wow, that is a big increase in comparison.” The math I did was to simply divide the population of those ages 80 and over in the year 2000 by the same population age group in the year 1900. This gives us the ratio of the super senior population group and I did the same for the young adult group as I filtered for the ages from 20 - 40. To do this, we need to filter out the data for these age groups and keep track of a variable to sum up the population.";

  const paragraph3 = "Ratio of Population Ages >= 80 in Year 2000 to Population Ages >= 80 in Year 1900: 24.4 (For every one super senior in the year 1900, there is 24.4 individuals in the year 2000).";

  const paragraph4 = "Ratio of Population Ages 20-40 in Year 2000 to Population Ages 20-40 in Year 1900: 3.6 (For every one young adult in the year 1900, there is 3.6 individuals in the year 2000)";

  const paragraph5 = "Each circle has a radius that represents the size of this ratio that I computed. The radius is then multiplied by an arbitrary number (in this case it is the value 4), so that it is scaled appropriately to fit my web page. We need to ensure not to add or subtract any numbers to this radius so that it won’t mess up the scaling and size of our circles and misrepresent our data. To paint a picture of the growth of the super-senior population, the circles are aligned next to each other. The color choice of a bright, vibrant orange was chosen for a bolder look that sticks out.";

  const paragraph6 = "The circle for the young adult population exists (which appear in a different color for clarity, we want to avoid having the same hue) because although we want to answer a question on the super-senior population, we need to consider general population growth and understand the growth rate in other age groups as well. Of course there are going to be more people in every age group in the year 2000 compared to the year 1900. But, I want my audience to observe that the old age groups have experienced massive growth over the past century. This should inform the viewer that perhaps the standard of healthcare in the US has increased to a point where it is expected for a large chunk of the population to be able to live to this age.";
  return (
    <div className="App">
      <p>
        The 2020 - 2021 Premier League season features a close battle for the top 4 positions, in which the top 4 teams is guaranteed qualification
        for the prestigious UEFA Champions League competition. Here we are analyzing the passing statistics over a full season for these top 4 teams
        in England, and comparing them to each other.
      </p>
      <p> Let's look at an interactive strip plot for total passes attempted out of the top 4 teams. </p>
      <div>
        <label>
          <input
            type="checkbox"
            checked={chelsea}
            onChange={handleChelsea}
          />
          Chelsea
        </label>
        <label>
          <input
            type="checkbox"
            checked={manCity}
            onChange={handleManCity}
          />
          Manchester City
        </label>
        <label>
          <input
            type="checkbox"
            checked={liverpool}
            onChange={handleLiverpool}
          />
          Liverpool
        </label>
        <label>
          <input
            type="checkbox"
            checked={manUtd}
            onChange={handleManUtd}
          />
          Manchester United
        </label>

      </div>
      {/*<div>
        {gk.map((name, i) => {
          return (
            <>
              <input
                key={i}
                type="checkbox"
                id={name}
                name={name}
                checked={selectedGKs.indexOf(name) > -1}
                onChange={() => {
                  if (selectedGKs.indexOf(name) === -1) {
                    setSelectedGKs(selectedGKs.slice(0).push(name));
                  } else {
                    setSelectedGKs(
                      selectedGKs.slice(0).filter((_name) => {
                        return _name !== name;
                      })
                    );
                  }
                }}
              />
              <label style={{ marginRight: 15}}>{name}</label>
            </>
          );
        })}
      </div>
*/}
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

      <p>
        Let's look at percentage passes completed to see the accuracy and how much risk each team is willing to take when they have
        possession of the ball.
      </p>

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
