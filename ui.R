# SHINY USER INTERFACE FOR LGAPP


#reactiveBar <- function (outputId) 
#{
#  HTML(paste("<div id=\"", outputId, "\" class=\"shiny-lg-output\"><svg /></div>", sep=""))
#}

shinyUI(fluidPage(
  titlePanel(h1("Language Game")),
  
  # include the js code
  #includeScript("showreel_d3.js"),
  
  # a div named mydiv
  #tags$div(id="mydiv",
  #         style="width: 50px; height :50px; left: 100px; top: 100px;
   #        background-color: gray; position: absolute"),
  
  # Create the layout of the side bar,
  # Create the parameters, all of which are inputed by user
  sidebarLayout(
    sidebarPanel(
      h2("Parameters"),
      checkboxInput("wealth_reset", label = h5("Reset wealth of replicated organisms"),value = FALSE),
      actionButton("start", label = h5("Start")),
      actionButton("reset", label = h5("Reset")),
      sliderInput("n", label = h5("Number of organisms"), min = 50, max = 200, value = 50,step = 50),
      sliderInput("iter", label = h5("Number of Cycles"), min = 10, max = 500,value = 100, step = 10),
      sliderInput("memspan", label = h5("Memory Span"),min = 1,max = 50,value = 5, step = 5),
      sliderInput("dial_change_rate", label = h5("Dialect Update Probability (A percentage indicating the probability that fluctuations affect the dialects)"), min = 0, max = 100, value = 1, step= 10),
      sliderInput("repr_rate", label = h5("Replication and Death Rate"), min= 1, max= 50, value = 10, step = 5),
      sliderInput("Beta", label = h5("Decay Factor (for implementation of the encounter probability)"), min = 1, max = 1.05, value = 1.029), step = 0.005),
    
    # Create the main panel in which the plots are rendered
    # Each plot is rendered in a seperate tab
    # Define the output variable for the plots to be rendered
    mainPanel(
      position = "left",
      h3("About the Game"),
      h4("This game simulates interactions between the members of a population of organisms that are assigned some randome characteristics.
        Organims are distributed randomly in a linear space, and interact with their neighbours.
        The nature of the interactions is defined by the strategies of organisms. A group of organisms having the same strategy is referred to as Species."),
      h5("(Navigate between the tabs to view static/dynamic plots.)"),
      h5("(Due to the large size of the output dataset rendering might take several minutes.)"),
      tabsetPanel(
        tabPanel('Encounters Plot, click "Start"',
                 helpText("Hover over each point to show the ID and the position of the corresponding organism in space"),br(),
                 plotlyOutput("encounter")),
                
        tabPanel('gvis Motion Chart, click "Start"',
                 helpText("This plot animates the abundance of the species over cycles and observes the convergence
                          of the population.
                          Adjust the speed of motion next to the play button. Select x-axis, y-axis and 
                          size variable. Select log or lin for x or y-axis variable. Select unique colors from the color
                          slide bar to distinct the colors of each species.Navigate between
                          tabs at the top right side of the plot to show different plot types."),
                 br(),
                 htmlOutput("evolu")), 
                 
        tabPanel('Scatter Plot, click "Start"', 
                 helpText("This plot shows the evolution of species over time.
                          Hover the mouse over the dots to show the dialect and the species of the corresponding organism"),
                 br(),
                 plotlyOutput("scat_plotly"))
      )
      #tags$head(tags$link(rel = "stylesheet", type = "text/css", href = "style2.css")),
      #tags$script(src="http://d3js.org/d3.v3.min.js"),
      #tags$script(src="showreel_d3.js"),
      #tags$div(id="d3outputplot"),
      )
    )
  )
)

