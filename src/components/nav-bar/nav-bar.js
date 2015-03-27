define( [
    'knockout',
    'text!components/nav-bar/nav-bar.html'
], function( ko, template ){


    function NavBarViewModel( params ){
    	var self = this;
<<<<<<< HEAD

        self.route = params.route;
=======
        self.loggedIn = params.loggedIn;
        self.welcome = params.welcome;
        self.userBoards = params.userBoards;
        self.displayPage = ko.observable('filler');
>>>>>>> release-2

        self.hideNav = function(){
        	//make the nav menu fold out of view.
            $('#navContainer .navWrapper').toggleClass('hide');
            $('#showNavMenu').css('display', 'inline');
<<<<<<< HEAD
            $('#dashApp').css('padding', '0 0 0 55px');
=======
            $('#dashApp').css('padding', '0 0 0 10px');
>>>>>>> release-2
        };

        self.showNav = function(){
        	window.setTimeout(function(){
                $('#navContainer .navWrapper').toggleClass('hide');
                $('#dashApp').css('padding-left', '175px');
            }, 200);
        };

<<<<<<< HEAD
        self.showLogIn = ko.observable(false);
        self.welcome = ko.observable('');
        $.get('/user/info', function(userInfo) {
            if (userInfo) {
                self.welcome('Welcome, ' + userInfo.name);
            } else {
                self.showLogIn(true);
            }
        });
=======
        $('.mainNavButton').click(function(e){
            $('.mainNavButton').removeClass('selectedSubNav');
            if($(e.target).hasClass('mainNavButton')){
                $(e.target).addClass('selectedSubNav');
            } else {
                $(e.target.parentElement).addClass('selectedSubNav');
            }
        });

        self.toggleBoardList = function(e, data){
            $('#boards.subNavBoardOpts').slideDown(200, 'swing', function(){
                $('#boards.subNavBoardOpts').toggleClass('hide');
            });
        };

        self.toggleProfileList = function(){
            $('#profileLinks.subNavBoardOpts').slideDown(200, 'swing', function(){
                $('#profileLinks.subNavBoardOpts').toggleClass('hide');
            });
        };

>>>>>>> release-2
    }

    return { viewModel: NavBarViewModel, template: template };

});