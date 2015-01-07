define( [
    'knockout',
    'text!components/nav-bar/nav-bar.html'
], function( ko, template ){


    function NavBarViewModel( params ){
    	var self = this;
        self.loggedIn = params.loggedIn;
        self.welcome = params.welcome;

        //for now make this dummy - it should come from params/global user settings
        self.userBoards = ko.observableArray([
            { name: "Big English" },
            { name: "A/B Testing" },
            { name: "Fraud Monitoring" },
            { name: "Times Honey is Cute" },
        ]);

        self.hideNav = function(){
        	//make the nav menu fold out of view.
            $('#navContainer .navWrapper').toggleClass('hide');
            $('#showNavMenu').css('display', 'inline');
            $('#dashApp').css('padding', '0 0 0 80px');
        };

        self.showNav = function(){
        	window.setTimeout(function(){
                $('#navContainer .navWrapper').toggleClass('hide');
                $('#dashApp').css('padding-left', '175px');
            }, 200);
        };

        self.selectNav = function(d, e){
            $('.mainNavButton').removeClass('selectedSubNav');
            $(e.target).addClass('selectedSubNav');
        };

        self.toggleBoardList = function(){
            $('.subNavBoardOpts').toggleClass('hide');
        };

    }

    return { viewModel: NavBarViewModel, template: template };

});