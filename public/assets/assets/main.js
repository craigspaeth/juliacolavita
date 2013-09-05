(function() {
  $(function() {
    var index, layoutWidth, setLayout;
    layoutWidth = 1200;
    index = 0;
    $(".portfolio_page:gt(0)").height("1px");
    $("#portfolio_nav_container nav a:gt(0)").addClass("unselected");
    $("#portfolio_nav_container nav a").click(function(event) {
      index = $(this).index();
      $(".portfolio_page:eq(" + index + ")").height("auto");
      $("#portfolio_page_container").animate({
        left: (layoutWidth + 100) * -index
      }, "slow", "easeInOutQuad", function() {
        return $(".portfolio_page").not($(".portfolio_page:eq(" + index + ")")).height("1px");
      });
      $("#portfolio_nav_container nav a").addClass("unselected");
      $(this).removeClass("unselected");
      return false;
    });
    $(".portfolio_page ul li .caption").height("13px");
    $(".portfolio_page ul li").hover((function() {
      return $(this).children(".caption").height("auto").css({
        padding: "3px"
      });
    }), function() {
      return $(this).children(".caption").height("13px");
    });
    $(".portfolio_page ul li img").click(function() {
      $("#lightbox img").attr("src", $(this).data("large_src"));
      $("#lightbox .caption").html($(this).siblings(".caption").html()).hide();
      return $("#lightbox").fadeIn(function() {
        $("#lightbox .caption").fadeIn().css({
          bottom: -$("#lightbox .caption").outerHeight()
        });
        return $("html").css({
          "overflow-y": "hidden"
        });
      });
    });
    $("#close_lightbox, #lightbox").click(function() {
      $("#lightbox").fadeOut();
      return $("html").css({
        "overflow-y": "scroll"
      });
    });
    setLayout = function() {
      if ($(window).width() >= 1200) {
        $("#container").addClass("wide").removeClass("small");
        $("#portfolio_page_container").width($(".portfolio_page").length * 1300);
        layoutWidth = 1200;
        return $("#portfolio_page_container").css({
          left: (layoutWidth + 100) * -index
        });
      } else {
        $("#container").removeClass("wide").addClass("small");
        $("#portfolio_page_container").width($(".portfolio_page").length * 900);
        layoutWidth = 800;
        return $("#portfolio_page_container").css({
          left: (layoutWidth + 100) * -index
        });
      }
    };
    setLayout();
    $(window).resize(setLayout);
    $("header").css({
      top: "-200px"
    }).delay(500).animate({
      top: 0
    }, "slow", "easeOutExpo");
    $("#container").animate({
      opacity: 1
    });
    return $("#portfolio").hide().delay(800).fadeIn(2000, "easeOutExpo");
  });

}).call(this);
