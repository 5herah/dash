define( [
    'knockout',
    'text!components/utils/login/login-page.html',
    'bootstrap-timepicker'
], function( ko, template ){


    function LoginPageViewModel( params ){
        var self = this;

        self.userIsLoggedIn = ko.observable(false);


    }

    return { viewModel: LoginPageViewModel, template: template };

});