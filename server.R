



shinyServer(function(input, output){
  
  
  val <- reactiveValues(doPlot = FALSE)
  observeEvent(input$start, {
    val$doPlot <- input$start
    output$evolu <- renderPlotly({
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
            input$wealth.reset)
          })
        orgDF <- lang.game(input$iter,
                           input$n,
                           input$repr_rate,
                           input$Beta,
                           input$memspan,
                           input$dial_change_rate,
                           input$wealth.reset)
        dialects <- seq(2,input$n, by=5)
        pos <- seq(5, input$n, by=5)
        strats <- seq(3, input$n, by=5)
        wealths <- seq(1, input$n, by=5)
        ply2 <- plot_ly(x = input$iter, y = orgDF[,pos] , text = paste("dialect: ", orgDF[,dialects]),
                mode = "markers", color = orgDF[,strats], size = orgDF[,wealths])
        })
      })
    output$encounter <- renderPlotly({
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
          input$wealth.reset
          )
      })
      OrganismID <- c(1:input$n)
      Encounters <- rowSums(encounter.mat(input$n, input$Beta))
      q <- qplot(OrganismID,
          Encounters,
          data = data.frame(encounter.mat(input$n, input$Beta)),
          main = "Encounter Probability",
          xlab = "Organisms", ylab="Number of encounters", alpha = 0)
      ply <- ggplotly(q,kwargs=list(layout=list(hovermode="closest")))
    })
  })
})
})

#session$sendCustomMessage(type="jsoinput$n",data)
