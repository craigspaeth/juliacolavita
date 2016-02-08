var page = require('page');

page('/artwork/:id', function(ctx) {
  $el = $(`[data-id='${ctx.params.id}'] img`);
  console.log(`[data-id='${ctx.params.id}']`)
  $("#lightbox img").attr("src", $el.data("large_src"));
  $("#lightbox .caption").html($el.siblings(".caption").html()).hide();
  $("#lightbox").fadeIn(function() {
    $("#lightbox .caption").fadeIn().css({
      bottom: -$("#lightbox .caption").outerHeight()
    });
    $("html").css({"overflow-y": "hidden"});
  });
});

page('/', () => {
  $("#lightbox").fadeOut();
  return $("html").css({"overflow-y": "scroll"});
});

$(function() {
  var layoutWidth = 1200;
  var index = 0;

  // Start router
  page.start();

  // Setup pages and nav
  $(".portfolio_page:gt(0)").height("1px");
  $("#portfolio_nav_container nav a:gt(0)").addClass("unselected");

  // Clicking a portfoli nav item slides in a new page
  $("#portfolio_nav_container nav a").click(function(event) {
    index = $(this).index();
    $(".portfolio_page:eq(" + index + ")").height("auto");
    $("#portfolio_page_container").animate({ left: (layoutWidth + 100) * -index }, "slow", "easeInOutQuad", function() {
      return $(".portfolio_page").not($(".portfolio_page:eq(" + index + ")")).height("1px");
    }
    );
    $("#portfolio_nav_container nav a").addClass("unselected");
    $(this).removeClass("unselected");
    return false;
  });

  // Set the hovercards to be cut off
  $(".portfolio_page ul li .caption").height("13px");
  $(".portfolio_page ul li").hover( (function() {
    return $(this).children(".caption").height("auto").css({padding: "3px"});
  }
  ), function() {
    return $(this).children(".caption").height("13px");
  }
  );

  // Clicking on an artwork image opens it in the lightbox
  $(".portfolio_page ul li img").click(function() {
    page('/artwork/' + $(this).parent().attr('data-id'));
  });

  // Close lightbox
  $("#close_lightbox, #lightbox").click(function() {
    page('/');
  });

  // Set layout depending on screen size, increments of 800px to 1200px
  var setLayout = function() {
    if ($(window).width() >= 1200) {
      $("#container").addClass("wide").removeClass("small");
      $("#portfolio_page_container").width($(".portfolio_page").length * 1300);
      layoutWidth = 1200;
      return $("#portfolio_page_container").css({left: (layoutWidth + 100) * -index});
    } else {
      $("#container").removeClass("wide").addClass("small");
      $("#portfolio_page_container").width($(".portfolio_page").length * 900);
      layoutWidth = 800;
      return $("#portfolio_page_container").css({left: (layoutWidth + 100) * -index});
    }
  };
  setLayout();
  $(window).resize(setLayout);

  // Render after the initial javascript
  $("header").css({top: "-200px"}).delay(500).animate({ top: 0 }, "slow", "easeOutExpo");
  $("#container").animate({opacity: 1});
  $("#portfolio").hide().delay(800).fadeIn(2000, "easeOutExpo");

  // Hide missing images
  return $('.artworks img').error(function() { return $(this).parent().remove(); });
});
