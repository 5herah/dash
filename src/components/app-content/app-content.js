define(
    [   'jquery',
        'knockout',
        'text!./app-content.html'
    ], function( $, ko, templateMarkup) {

    function AppContent(params) {
        var self = this;

        self.url = params.url || 'hi';
        self.name = ko.observable();
        self.content = ko.observable('this is the content');
        self.description = ko.observable();
        self.graphs = ko.observableArray([]);

        //set up the app assuming that the user is not logged in yet.
        self.userIsLoggedIn = ko.observable(false);

        var find = function(value){
            return function(e, i){
                return value === e;
            };
        };
    }

    return { viewModel: AppContent, template: templateMarkup };
});
