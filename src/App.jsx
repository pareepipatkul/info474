import { scaleLinear, scaleBand, extent, line, csv, json } from 'd3';
import { useState } from 'react'
import logo from './logo.svg'
import census from "./census";
import './App.css'

function App() {
  const [count, setCount] = useState(0);

  const circleScale = scaleLinear().domain([0, 350]).range([0, 250]);

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


  console.log(census);
  console.log(adultPopIn2000);

  const popOver80 = [popOver80in2000, popOver80in1900];
  const adultPop = [adultPopIn2000, adultPopIn1900];

  console.log(popOver80in2000 / popOver80in1900);
  console.log(adultPopIn2000 / adultPopIn1900);

  console.log(popOver80in2000);
  console.log(popOver80in1900);

  console.log(adultPopIn2000);
  console.log(adultPopIn1900);


  const text_data = ["Population Growth for Those Over 80", "Pop. per 30k Over 80 in 1900", "Pop per 300k Between 20-40 in 2000", "Pop per 300k Between 20-40 in 1900"];

  const paragraph1 = "A question I’d like to answer is: Has the super-senior group of the US population got significantly larger over the past century? In other words, I’d like to see how many people in the year 2000 are living to ages 80 and above, in comparison to the year 1900. This will give us an indicator of healthcare improvements of the overall country and when compared to younger age groups, as well how much growth has older age groups experienced over the last century. We will need to look at growth in younger age groups to answer this question as well.";

  const paragraph2 = "From the data it is evident that the population over those over 80 has significantly increased during the past century. I chose to use circles, because I intend to convey the magnitude of increase in population size for those over 80 years old. This helps the visualization and the message of “wow, that is a big increase in comparison.” The math I did was to simply divide the population of those ages 80 and over in the year 2000 by the same population age group in the year 1900. This gives us the ratio of the super senior population group and I did the same for the young adult group as I filtered for the ages from 20 - 40. To do this, we need to filter out the data for these age groups and keep track of a variable to sum up the population.";

  const paragraph3 = "Ratio of Population Ages >= 80 in Year 2000 to Population Ages >= 80 in Year 1900: 24.4 (For every one super senior in the year 1900, there is 24.4 individuals in the year 2000).";

  const paragraph4 = "Ratio of Population Ages 20-40 in Year 2000 to Population Ages 20-40 in Year 1900: 3.6 (For every one young adult in the year 1900, there is 3.6 individuals in the year 2000)";

  const paragraph5 = "Each circle has a radius that represents the size of this ratio that I computed. The radius is then multiplied by an arbitrary number (in this case it is the value 4), so that it is scaled appropriately to fit my web page. We need to ensure not to add or subtract any numbers to this radius so that it won’t mess up the scaling and size of our circles and misrepresent our data. To paint a picture of the growth of the super-senior population, the circles are aligned next to each other. The color choice of a bright, vibrant orange was chosen for a bolder look that sticks out.";

  const paragraph6 = "The circle for the young adult population exists (which appear in a different color for clarity, we want to avoid having the same hue) because although we want to answer a question on the super-senior population, we need to consider general population growth and understand the growth rate in other age groups as well. Of course there are going to be more people in every age group in the year 2000 compared to the year 1900. But, I want my audience to observe that the old age groups have experienced massive growth over the past century. This should inform the viewer that perhaps the standard of healthcare in the US has increased to a point where it is expected for a large chunk of the population to be able to live to this age.";
  return (
    <div className="App">
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
