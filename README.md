# Language_Game_ShinyAPP
This repository aims to build a web application for visualizing this project: https://github.com/mahtabmoh/Language-Game.

The aforementioned project creates a population of organisms distributed in a linear space, each of which having a set of characteristics. These characteristics are 
created by fixed parameters at the begining of the program, including:

1. Memory span, initially set to 5
2. wealth, set to 50
3. Strategy, being sampled from this list: [CHEAT, COOP, POLYGLOT,MIMIC]
4. Dialect, which is a list of 6 numbers from 1 to 6, repetition allowed
5. Position in the space
6. The beta factor which is defined to implement the number of the encounters
7. Dialect probability which is the probability that polyglots change their dialect after each encounter
8. Reproduction rate which defines the number of the updates to be done in the population after each iteration of the game, that is the number of the organisms whith lowest wealth to be eliminated and replaced by the same number of the replications from the organisms with highest wealth.


All the parameters above are entered by the user except the position, the dialect, and the strategies. All characteristics are assigned randomly to  organisms. The probability that organisms meet their neighbours is higher than meeting farther organisms, thus they don't meet all the members of the population. The strategies are seen as the species to which an organism belongs and define the behaviour against the opponent.

The goal here is to observe the emergence of a homogenous language, and in general the evolution of the species over time.

The number of the species as well as th iterations are parameters that user choses in the range set in the interface.

<b> Set-up </b>

As the original program was written in R, I decided to use the "shiny" library in order to illustrate the phenomenon of species evolution visually using plotly and D3 plotting facilities.

1.
The first plot is brought to the user by plotly, showing the number of encounters to the user. Parameters are the beta factor and the number of the organisms. As beta increases the number of encounters decreases. One can observe this by changing the beta parameter in the parameter panel. 

2.
For the second plot, I have written two .js files with their stylesheets seperatly, both showing the growth of the species over cycles. 
So the server.r takes the json object returned from the global.r code and sends it to the .js files, that is, the r session in the server is called from the .js sources and the elements of the json is grabbed there, using shiny message handlers.

Therefore, the plots are all illustrated by parameters entered by the user. This provides a good means for conducting empirical studies, beacuse the source program is function-based and these parameters are passed as arguments of functions. Thus, it is possible to observe changes in the system for whoever interested in studying the language as an emergent system. The interactive plots are good means of transferring detailed information and hence one might understand the causes of the fluctuations in the system at evry change in parameters and in every point of time. 

<b> Installation </b>

In order to run the application, You might need d3.js latest version or you can simply include the command below to your ui.r file:

src= tags$script(src="http://d3js.org/d3.v3.min.js") 

Then, you need to install some R packages including RJSONIO or jsonint or whatever library that has functions to convert R objects to json, shiny, ggplot2, plotly, and reshape.

Now we are ready to build up the server, the ui, and then develop d3 codes and stylesheets.

<b> Not that it is important how you locate the files of the shiny app. The directory including the app should have a structure like this:

dir----|
        App---|
              global.r/
              ui.r/
              server.r/
              www---|
                    shinyd3.js/
                    style.css/

I was mostly inspired by these 3 repositories:

1. http://bl.ocks.org/mbostock/1256572
2. https://github.com/asifr/Research-analytics
3. https://github.com/jamesthomson/SpotifyDiscographyShinyApp

I almost copied the codes from the first two links to create my two .js files, but modified them to link them to shiny. The 3rd link taught me how to creat session in server.r and pass the json to D3.

As for the encounter plot, the plotly library offers easy to use functions in order to transform the ggplot2 plots to an interactive plot. Therefore, no D3 code needed.

Since the use of evolutionary games are gaining momentum in different research desciplines to explain variuos phenomena, the doveloped repository visually instantiates how such games explain emergent systems in its examplary field of language emergence. As such, it can be further used for demonestrating the emergent behaviuor of complex systems. 







