$(document).ready(function() {
    // Code for the hero images slider on homepage
    $(".slide-container").unslider({
        arrows: {
            prev: "<a class='prev'>&#10094;</a>",
            next: "<a class='next'>&#10095;</a>"
        },
        autoplay: true,
        speed: 1200,
        delay: 8000
    });

    // Don't show mobile menu on page load
    if($(window).width() < 769) {
        $("#nav-bar .right-menu .menu-items").hide();
    }

    // Make navbar sticky when its top of screen
    $(window).bind("scroll", function() {
        var aboveNav = $("#hero-slider").height();
        var contentHeight = $("#nav-bar").height() + 96;
        if($(window).scrollTop() > aboveNav) {
            $("#nav-bar").addClass("sticky");
            $("#reasons").css("margin-top", contentHeight + "px");
        } else {
            $("#nav-bar").removeClass("sticky");
            $("#reasons").css("margin-top", "96px");
        }
    });

    if( $("#nav-bar").hasClass("sticky") ) {
        var contentHeight = $("#nav-bar").height() + 96;
        $("#reasons").css("margin-top", contentHeight + "px");
    }

    // Set height for different elements
    heightElements();
    $(window).resize(function() {
        heightElements();
    });

    // Set reason to first one
    selectReason(undefined, 1);

    // Hide all text from solution banners
    $("#solutions .solution-banner .solution-text").hide();

    // Check URL for /send. Contact was sent succesfully so show the message
    if(window.location.href.indexOf("form=send") > -1) {
        $("#success-modal").fadeIn();
    }
});

// Flip a solution to see front/back
function flip($event) {
    $("." + $event).toggleClass("flipped");
    if($(window).width() < 769) {
        if ($("." + $event + " .back").css("display") === "none") {
            $("." + $event + " .back").slideDown();
        } else {
            $("." + $event + " .back").slideUp();
        }
    }
}

// Scroll to menu item
function menuClick(name) {
    $("html, body").animate({
        scrollTop: $(name).offset().top - 120
    }, 1000);
    if($(window).width() < 769) {
        toggleMobileMenu();
    }
}

// Scroll to right reason
function scrollToReason($event) {
    $("html, body").animate({
        scrollTop: $("#reasons").offset().top - 120
    }, 1000);
    selectReason($event);
}

// Scroll to right solution
function scrollToSolution($event) {
    var ua = window.navigator.userAgent;
    var idx = ua.indexOf("MSIE");
    var isIE;
    if(idx > 0 || !!navigator.userAgent.match(/Trident\/7\./)) {
        isIE = true;
    } else {
        isIE = false;
    }

    $("html, body").animate({
        scrollTop: $("#solutions ." + $event).offset().top - 120
    }, 1000);
    if (isIE == false) {
        showSolution($event);
    }
}

// When page is loaded set interval to change the reasons
var reasonIndex = 2;
var reasonInterval = setInterval(function() {
    if (reasonIndex < 4) {
        selectReason(undefined, reasonIndex);
        reasonIndex += 1;
    } else {
        selectReason(undefined, 1);
        reasonIndex = 1;
    }
}, 5000);

// Set height of different elements
function heightElements() {
    // Set height circles in #reasons
    var circle = $("#reasons .circle");
    var circleWidth = circle.width();
    circle.css("height", circleWidth + "px");

    // Set height circles in .icon-block
    var circleBlock = $("#reasons .icon-block");
    var circleBlockWidth = circleBlock.width();
    circleBlock.css("height", circleBlockWidth + "px");

    // Set all reasons same height
    var peopleHeight = $("#reasons .block-reasons .people").height();
    $("#reasons .block-reasons .profit").css("height", peopleHeight + "px");
    $("#reasons .block-reasons .planet").css("height", peopleHeight + "px");

    // Set height of map so its the same as the text
    var heightText = $("#footer .footer-text").height();
    $("#map").css("height", heightText + "px");
}

// Select the right reason. When a reason is clicked, stop the interval
function selectReason($event, reason) {
    $("#reasons .block-reasons .block-reason").hide();
    $("#reasons .all-reasons .column .circle").removeClass("active");
    $("#reasons .all-reasons .column .block-title").removeClass("active");
    if($event !== undefined) {
        clearInterval(reasonInterval);
        $("#reasons .block-reasons ." + $event).show();
        $("#reasons .all-reasons ." + $event + " .circle").addClass("active");
        $("#reasons .all-reasons ." + $event + " .block-title").addClass("active");
    } else if (reason !== undefined) {
        if (reason === 1) {
            $("#reasons .block-reasons .profit").show();
            $("#reasons .all-reasons .profit .circle").addClass("active");
            $("#reasons .all-reasons .profit .block-title").addClass("active");
        } else if (reason === 2) {
            $("#reasons .block-reasons .planet").show();
            $("#reasons .all-reasons .planet .circle").addClass("active");
            $("#reasons .all-reasons .planet .block-title").addClass("active");
        } else if (reason === 3) {
            $("#reasons .block-reasons .people").show();
            $("#reasons .all-reasons .people .circle").addClass("active");
            $("#reasons .all-reasons .people .block-title").addClass("active");
        }
    } else {
        $("#reasons .block-reasons .profit").show();
        $("#reasons .all-reasons .profit .circle").addClass("active");
        $("#reasons .all-reasons .profit .block-title").addClass("active");
    }
}

// Toggle text from solution banner
function showSolution($event) {
    $("." + $event).addClass("flipped");
    if($(window).width() < 769) {
        if ($("." + $event + " .back").css("display") === "none") {
            $("." + $event + " .back").slideDown();
        } else {
            $("." + $event + " .back").slideUp();
        }
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    var menu = $("#nav-bar .right-menu .menu-items");
    var icon = $("#nav-bar .right-menu .mobile-toggle .nav-icon");
    if( menu.css("display") === "none" ) {
        // open menu and change icon to cross
        menu.slideDown();
        icon.addClass("open");
    } else {
        // close menu and change icon to bars
        menu.slideUp();
        icon.removeClass("open");
    }
}

// Check if recaptcha is checked to remove disabled state of submit button
function recaptchaCallback() {
    $("#contact-submit").removeAttr("disabled");
}

// Opens a modal
function showModal(modalName) {
    $("#" + modalName + "-modal").fadeIn();
}

// Close a modal
function closeModal(modalName) {
    $("#" + modalName + "-modal").fadeOut();
}

// Close modal with successmessage
function closeSuccessModal() {
    $("#success-modal").fadeOut();
    setTimeout(function() {
        window.location.replace("/");
    }, 400);
}

// Sent contactform
function sendForm(event) {
    event.preventDefault();
    var data = {};
    data.name = $("#contact-form #name").val();
    data.email = $("#contact-form #email").val();
    data.subject = $("#contact-form #subject").val();
    data.msg = $("#contact-form #msg").val();

    if (grecaptcha.getResponse() != "") {
        $.ajax({
            type: "POST",
            url: "/send",
            data: data,
            dataType: "application/json"
        });
    }
}

// Set disabled with jQuery
jQuery.fn.extend({
    disable: function(state) {
        return this.each(function() {
            this.disabled = state;
        });
    }
});

// Check if class changes
(function() {
    var originalAddClassMethod = jQuery.fn.addClass;

    jQuery.fn.addClass = function() {
        var result = originalAddClassMethod.apply( this, arguments );
        jQuery(this).trigger('cssClassChanged');
        return result;
    }
})();