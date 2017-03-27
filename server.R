# SHINY SERVER FOR LGAPP

# Define a function for returning multiple outputs with an introduces operator as ":="
# (http://stackoverflow.com/a/1829651/5539205)
':=' <- function(lhs, rhs) {
  frame <- parent.frame()
  lhs <- as.list(substitute(lhs))
  if (length(lhs) > 1)
    lhs <- lhs[-1]
  if (length(lhs) == 1) {
    do.call(`=`, list(lhs[[1]], rhs), envir=frame)
    return(invisible(NULL)) 
  }
  if (is.function(rhs) || is(rhs, 'formula'))
    rhs <- list(rhs)
  if (length(lhs) > length(rhs))
    rhs <- c(rhs, rep(list(NULL), length(lhs) - length(rhs)))
  for (i in 1:length(lhs))
    do.call(`=`, list(lhs[[i]], rhs[[i]]), envir=frame)
  return(invisible(NULL)) 
}

shinyServer(function(input, output, session){
  
  
  val <- reactiveValues(doPlot = FALSE)
  observeEvent(input$start, {
    val$doPlot <- input$start
    
    # Motion chart tab
    output$evolu <- renderGvis({
      if (val$doPlot == FALSE) return()
      isolate({
        data <- reactive({
          lang.game(
            input$iter,
            input$n,
            input$repr_rate,
            input$Beta,
            input$memspan,
            input$dial_change_rate,
            input$wealth_reset)
          })
        c(odf,abund_melted) := lang.game(input$iter,
                                  input$n,
                                  input$repr_rate,
                                  input$Beta,
                                  input$memspan,
                                  input$dial_change_rate,
                                  input$wealth_reset)
        
        gvisMotionChart(data=abund_melted, 
                        idvar="variable", 
                        timevar="Cycle",
                        xvar = "Cycle",
                        yvar = "value",
                        colorvar = "variable")
        })
      })
  })
    # Encounter plot tab
  observeEvent(input$start, {
    # Observe the event of start button click
    val$doPlot <- input$start
  
    output$encounter <- renderPlotly({
    if (val$doPlot == FALSE) return()
    isolate({
      data <- reactive({
        # Reactive the inputs needed for rendering the plot
        # So that the server will read them from ui and call the corresponding functions of the source code.
        encounter.mat(
          input$n,
          input$Beta
          )
      })
      OrganismID <- c(1:input$n)
      Encounters <- rowSums(encounter.mat(input$n, input$Beta))
      # Render the qplot with plotly
      q <- qplot(OrganismID,
          Encounters,
          data = data.frame(encounter.mat(input$n, input$Beta)),
          main = "Encounter Probability",
          xlab = "Organisms", ylab="Number of encounters", alpha = 0)
      ply <- ggplotly(q,kwargs=list(layout=list(hovermode="closest")))
    })
  })
  })
  
  # Plotly scatter plot
  observeEvent(input$start, {
    val$doPlot <- input$start
    output$scat_plotly <- renderPlotly({
      if (val$doPlot == FALSE) return()
      isolate({
        data <- reactive({
          lang.game(
            input$iter,
            input$n,
            input$repr_rate,
            input$Beta,
            input$memspan,
            input$dial_change_rate,
            input$wealth_reset)
        })
        # Assign the output of the function to a data frame
        c(odf,abund) := lang.game(input$iter,
                         input$n,
                         input$repr_rate,
                         input$Beta,
                         input$memspan,
                         input$dial_change_rate,
                         input$wealth_reset)
        
        # Convert integer columns to numeric 
        odf <- as.data.frame(odf)
        cycle <- as.numeric(odf$cycle)
        wealth <- as.numeric(odf$wealth)
        pos <- as.numeric(odf$pos)
        dial <- odf$dial
        strat <- odf$strat
        # Scatter plot rendering with the data frame variables as the parameters to the plot
        ply2 <- plot_ly(data=odf,
                        type = "scatter",
                        x = cycle ,
                        y = pos,
                        text = paste("dialect: ", dial),
                        mode = "markers",
                        # Define the size of the bubbles according to the wealth of organisms
                        marker= list(
                          size = wealth,
                          sizemode='diameter',
                          sizeref= 6),
                        # Define color of bubbles according to the strategies
                        color = strat,
                        # Choose palette (from https://cran.r-project.org/web/packages/RColorBrewer/RColorBrewer.pdf)
                        colors="PuOr" ) %>%
                        layout(height = 1000)
      })
    })
  })
})

#session$sendCustomMessage(type="jsoinput$n",data)
