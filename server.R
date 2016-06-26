


shinyServer(function(input, output, session){
  
  
  val <- reactiveValues(doPlot = FALSE)
  observeEvent(input$start, {
    val$doPlot <- input$start
    output$d3outplot <- renderPlot({
      data <- reactive({
        if (val$doPlot == FALSE) return()
        isolate({
          lang.game(
            input$iter,
            input$n,
            input$repr_rate,
            input$Beta)
        })
        data
        session$sendCustomMessage(type="jsondata",data)
      })
    })
  })
  
  
  observeEvent(input$reset, {
    val$doPlot <- FALSE
  })
  
  output$encounter <- renderPlotly({
    
    p("The plot below illustrates the number of encounters for each organism. By hoovering on the points you can see the identity (assign by position in linear space), and the number of encounters")
    if (val$doPlot == FALSE) return()
    isolate({
      data <- reactive({
        lang.game(
          input$iter,
          input$n,
          input$repr_rate,
          input$Beta
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
