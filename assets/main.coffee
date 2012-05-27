$ ->
  layoutWidth = 1200
  index = 0
  
  # Setup pages and nav
  $(".portfolio_page:gt(0)").height "1px"
  $("#portfolio_nav_container nav a:gt(0)").addClass "unselected"
  
  # Clicking a portfoli nav item slides in a new page
  $("#portfolio_nav_container nav a").click (event) ->
    index = $(this).index()
    $(".portfolio_page:eq(" + index + ")").height "auto"
    $("#portfolio_page_container").animate
      left: (layoutWidth + 100) * -index
    , "slow", "easeInOutQuad", ->
      $(".portfolio_page").not($(".portfolio_page:eq(" + index + ")")).height "1px"

    $("#portfolio_nav_container nav a").addClass "unselected"
    $(this).removeClass "unselected"
    false
  
  # Set the hovercards to be cut off
  $(".portfolio_page ul li .caption").height "13px"
  $(".portfolio_page ul li").hover (->
    $(this).children(".caption").height("auto").css padding: "3px"
  ), ->
    $(this).children(".caption").height "13px"
  
  # Clicking on an artwork image opens it in the lightbox
  $(".portfolio_page ul li img").click ->
    $("#lightbox img").attr "src", $(this).data("large_src")
    $("#lightbox .caption").html($(this).siblings(".caption").html()).hide()
    $("#lightbox").fadeIn ->
      $("#lightbox .caption").fadeIn().css bottom: -$("#lightbox .caption").outerHeight()
      $("html").css "overflow-y": "hidden"
  
  # Close lightbox
  $("#close_lightbox, #lightbox").click ->
    $("#lightbox").fadeOut()
    $("html").css "overflow-y": "scroll"
  
  # Switch between portfolio and statement
  $("a.statement").click ->
    $("header nav a").removeClass "selected"
    $(this).addClass "selected"
    $("#portfolio").fadeOut ->
      $("#artist_statement").fadeIn()
  $("a.portfolio").click ->
    $("header nav a").removeClass "selected"
    $(this).addClass "selected"
    $("#artist_statement").fadeOut ->
      $("#portfolio").fadeIn()
  
  # Set layout depending on screen size, increments of 800px to 1200px
  setLayout = ->
    if $(window).width() >= 1200
      $("#container").addClass("wide").removeClass "small"
      $("#portfolio_page_container").width $(".portfolio_page").length * 1300
      layoutWidth = 1200
      $("#portfolio_page_container").css left: (layoutWidth + 100) * -index
    else
      $("#container").removeClass("wide").addClass "small"
      $("#portfolio_page_container").width $(".portfolio_page").length * 900
      layoutWidth = 800
      $("#portfolio_page_container").css left: (layoutWidth + 100) * -index
  setLayout()
  $(window).resize setLayout
  
  # Render after the initial javascript
  $("header").css(top: "-200px").delay(500).animate
    top: 0
  , "slow", "easeOutExpo"
  $("#container").animate opacity: 1
  $("#portfolio").hide().delay(800).fadeIn(2000, "easeOutExpo")
