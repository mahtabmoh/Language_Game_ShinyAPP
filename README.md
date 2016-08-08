# Language Game ShinyAPP
This repository aims to build a web application for visualizing this project: https://github.com/mahtabmoh/Language-Game.

The aforementioned project creates a population of organisms distributed in a linear space, each of which having a set of characteristics. These characteristics are 
created by fixed parameters at the beginning of the program, including:

1. Memory span, initially set to 5
2. wealth, set to 50
3. Strategy, being sampled from this list: [CHEAT, COOP, POLYGLOT, MIMIC]
4. Dialect, which is a list of 6 numbers from 1 to 6, repetition allowed
5. Position in the space
6. The beta factor which is defined to implement the number of the encounters
7. Dialect probability which is the probability that polyglots change their dialect after each encounter
8. Reproduction rate which defines the number of the updates to be done in the population after each iteration of the game, that is the number of the organisms with the lowest wealth to be eliminated and replaced by the same number of the replications from the organisms with highest wealth.


All the parameters above are entered by the user except the position, the dialect, and the strategies. All characteristics are assigned randomly to organisms. The probability that organisms meet their neighbors is higher than meeting farther organisms, thus they don't meet all the members of the population. The strategies are seen as the group of species to which an organism belongs and define the behavior against the opponent, and in general their approach during the game.

The goal here is to observe the emergence of a homogenous language, and in general the evolution of the species over time.

The number of the species as well as the iterations are parameters that user choses in the range set in the interface.

<b> Set-up </b>

As the original program was written in R, I decided to use the "shiny" library in order to illustrate the phenomenon of species evolution visually using plotly and GoogleVis plotting facilities. So there are three different charts shown in the user interface:

1. The first plot is brought to the user by {plotly} library in R which converts the ggplots (a very useful R plotting library {ggplot2}) into plotly plots, a JavaScript library for creating interactive chart. This second plot is namely referred to as the static plot, showing the number of encounters to the user. Parameters are the beta factor and the number of the organisms. As beta increases the number of encounters decreases. One can observe this by changing the beta parameter in the parameter panel.

2. The second plot, named the dynamic plot, is a motion chart rendered in shiny using {googleVis} library in R. The plot generator function is called gvisMotionChart, which provides the motion chart of Google Analytics, a JavaScript library.
The aim here is to show the convergence in the population, as well as the emergence of a homogenous behavior during the course of language evolution. Colors define the species groups and the size of the bubbles shows the abundance of the organisms.
This plot provides user with three different types of plots: 1. bubble, 2. bar, and 3. line charts. 
This plot generator function is very concrete in terms of visualization, as the parameters such as hover events and the motion speed is internally integrated into the function and shows op each time the plot is rendered.

3. The third plot is a bubble scatter plot provided by plotly, illustrating the change in the population over cycles, and summarizes whatever has happened during the iterations of the game. It is a concrete visualization of the game that provides the user with full information of the organisms, their behavior, and their dialect. It shows a homogeneous language at the end of some iterations over the whole population.


It is also useful to mention that there are numerous ways of plot generation using Shiny, and I found the two aforementioned methods suitable for visualizing my data. 
Another useful and vastly applicable method is to link the Shiny data directly to JavaScript and generate a data driven plot (D3).
I have provided two .js code files, and their corresponding cascade style sheets, and then written the corresponding commands to create the JSON file from the output of Shiny, create div and tags inside the shiny code chunk, and finally linkage between Shiny and JavaScript code. For this purpose, library{RJSONIO} is called to convert R objects to JSON files.
It is also possible to write the JavaScript codes directly within the R code body, with the call to library {shinyjs} (not provided in this repository.)


<b> User Interface </b>

The user interface is provided by shiny itself, allowing the creation of various widgets.
In this application, there are two parts into this interface, let’s call them panels. They are created in a R file called <b>ui.r</b>, which is where the inputs and input types are defined, the panels are managed and the output is defined with certain property. This file can as well contain html tags as well as div and the address towards the .js codes and libraries as well as .css files. 

The first panel belongs to different parameters and input types entered by user and is called Parameter Panel. These widgets are created having an initial value, a range, and a step. 

The second panel is called Main Panel and is where the plots are generated. It is possible to create tab panels in case of having more than on plot generated. I have put each the two aforementioned plots in separate tabs, hence the start button triggers the active tab plot rendering.

<b> Server </b>

Server is where the functions are called and the final data is generated for analysis. Here is where the input processing is managed, the inputs to be active and on call are activated, and passed through function that generate the data to be analyzed. Once data generated, the output will be passed as an argument to the function which renders the plot in the ui terminal.
This file, named as <b>serevr.r</b> is a dynamic code chunk which listens to the terminal port once the start button is clicked.

It is possible to define all functions inside the body of server.r, but it is mostly recommended to define functions and data tables in a separate file, which is normally named as helpers.r or global.r. I have republished the code in https://github.com/mahtabmoh/Language-Game, modified it entirely to have it suited for calls from server.r, named it global.r and put it in the same directory as ui.r and server.r.
As mentioned before, the plots are all illustrated by parameters entered by the user. This provides a good means for conducting empirical studies, because the source program is function-based and these parameters are passed as arguments of functions. Thus, it is possible to observe changes in the system for whoever interested in studying the language as an emergent system. The interactive plots are good means of transferring detailed information and hence one might understand the causes of the fluctuations in the system at every change in parameters and in every point of time. 

<b> Installation </b>

In order to run the application, first you need to install R and better to install RStudio afterwards. 

In the case of linkage between Shiny and .js codes, you might then need d3.js latest version or you can simply include the command below to your ui.r file:
src= tags$script(src="http://d3js.org/d3.v3.min.js") 

Then, you need to install some R packages including RJSONIO or jsonint or whatever library that has functions to convert R objects to json, shiny, ggplot2, plotly, and googleVis.

Now we are ready to build up the server, the ui, and then render the plots.

<b> Note that it is important how you locate the files of the shiny app. The directory including the app should have a structure like this: </b>

dir----|                                                                                                                                
        App---|                                                                                                                         
              global.r/                                                                                                                 
              ui.r/                                                                                                                     
              server.r/                                                                                                                 
              www---|                                                                                                                   
                    shinyd3.js/
                    style.css/

For the D3 plots (which I finally didn't rendered) was mostly inspired by these 3 repositories:

1. http://bl.ocks.org/mbostock/1256572
2. https://github.com/asifr/Research-analytics
3. https://github.com/jamesthomson/SpotifyDiscographyShinyApp

I almost copied the codes from the first two links to create my two .js files, but modified them to link them to shiny. The 3rd link taught me how to create session in server.r and pass the json to D3.


<b>Recap</b>

As mentioned before, the plots are all illustrated by parameters entered by the user. This provides a good means for conducting empirical studies, because the source program is function-based and these parameters are passed as arguments of functions. Thus, it is possible to observe changes in the system for whoever interested in studying the language as an emergent system. The interactive plots are good means of transferring detailed information and hence one might understand the causes of the fluctuations in the system at every change in parameters and in every point of time. 
Since the use of evolutionary games are gaining momentum in different research disciplines to explain various phenomena, the developed repository visually instantiates how such games explain emergent systems in its exemplary field of language emergence. As such, it can be further used for demonstrating the emergent behavior of complex systems. 

This project was done under the supervision of M. Isaac Pante for the course "Data visualization", and as a part of my masters in IMM at Lausanne University. The main R code in the "Language Game" repository is done for my masters’ project which is a replication of a simulation done in the late 90's (https://www.staff.ncl.ac.uk/daniel.nettle/ca1.pdf).




