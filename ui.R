
shinyUI(fluidPage(
  titlePanel(h1("Language Game")),
  
  # include the js code
  #includeScript("showreel_d3.js"),
  
  # a div named mydiv
  #tags$div(id="mydiv",
  #         style="width: 50px; height :50px; left: 100px; top: 100px;
   #        background-color: gray; position: absolute"),
  
  sidebarLayout(
    sidebarPanel(
      h2("Parameters"),
      checkboxInput("wealth.reset", label = h5("Reset wealth of replicated organisms"),value = FALSE),
      actionButton("start", label = h5("Start")),
      actionButton("reset", label = h5("Reset")),
      sliderInput("n", label = h5("Number of organisms"), min = 50, max = 200, value = 100,step = 50),
      sliderInput("iter", label = h5("Number of Iterations"), min = 10, max = 500,value = 200, step = 10),
      sliderInput("memspan", label = h5("Memory Span"),min = 1,max = 50,value = 5, step = 5),
      sliderInput("dial_change_rate", label = h5("Dialect Update Probability (percentage)"), min = 0, max = 100, value = 1, step= 10),
      sliderInput("repr_rate", label = h5("Reproduction Rate"), min= 1, max= 50, value = 20, step = 1),
      sliderInput("Beta", label = h5("Decay Factor"), min = 1, max = 1.05, value = 1.029), step = 0.005),
      
    mainPanel(
      position = "left",
      h3("About the Game"),
      h4("This game simulates interactions between the members of a population of organisms that are assigned some randome characteristics.
        Organims are distributed randomly on a linear space, and interact with their neighbours.
        The nature of the interactions is defined by the strategies of organisms."),
      p("Click on the start button: The plot below shows the evolution of the species over iterations, and thus the dialect that evolves during the course of time."),
      plotlyOutput("evolu"),
      
      # Creating tags to pass to .js
      #tags$head(tags$link(rel = "stylesheet", type = "text/css", href = "style2.css")),
      #tags$script(src="http://d3js.org/d3.v3.min.js"),
      #tags$script(src="showreel_d3.js"),
      #tags$div(id="d3outputplot"),
      
      p("Click on Start button: The plot below illustrates the number of encounters for each organism. By hoovering on the points you can see the identity (assign by position in linear space), and the number of encounters"),
      plotlyOutput("encounter")
      )
    )
  )
)

