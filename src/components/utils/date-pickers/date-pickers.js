define( [
    'knockout',
    'text!components/utils/date-pickers/date-pickers.html',
    'bootstrap-timepicker'
], function( ko, template ){


    function DatePickerViewModel( params ){
        var self = this;

        self.setupTimepicker = function(event){
            $('#' + event.target.id).timepicker({
                template: false,
                showMeridian: false
            });
        };

        //initialize inputs
        self.dateBeginRange = ko.observable('');
        self.dateEndRange = ko.observable('');
        self.chosenTimePeriodPresetDate = ko.observable('');
        self.chosenTimePeriodDate = ko.observable('');
        self.chosenTimePeriodFromTime = ko.observable('');
        self.chosenTimePeriodToTime = ko.observable('');
<<<<<<< HEAD
=======
        self.selectedTimePeriod = params.selectedTimePeriod;
>>>>>>> release-2

        //TODO: handle resetting fields
        self.chosenTimePeriod = ko.pureComputed( function (){
            var timePeriod;

            if (self.dateBeginRange() && self.dateEndRange()){
<<<<<<< HEAD
                timePeriod = "from " + self.dateBeginRange() + " to " + self.dateEndRange();
            } else if(self.chosenTimePeriodPresetDate()){
                timePeriod = self.chosenTimePeriodPresetDate();
            } else if(self.chosenTimePeriodDate() && self.chosenTimePeriodFromTime() && self.chosenTimePeriodToTime()) {
                timePeriod = self.chosenTimePeriodDate() + " from " + self.chosenTimePeriodFromTime() + " to " + self.chosenTimePeriodToTime();
=======
                timePeriod = 'from ' + self.dateBeginRange() + ' to ' + self.dateEndRange();
            } else if(self.chosenTimePeriodPresetDate()){
                timePeriod = self.chosenTimePeriodPresetDate();
            } else if(self.chosenTimePeriodDate() && self.chosenTimePeriodFromTime() && self.chosenTimePeriodToTime()) {
                timePeriod = self.chosenTimePeriodDate() + ' from ' + self.chosenTimePeriodFromTime() + ' to ' + self.chosenTimePeriodToTime();
>>>>>>> release-2
            }

            return timePeriod;

        });

<<<<<<< HEAD
        self.chosenTimePeriod.subscribe( function(newVal){
            params.selectedTimePeriod(newVal);
        });

=======
>>>>>>> release-2
        self.submitTimePeriod = function(){
            console.log('the time period was submitted');
        };

        self.shouldShowIncrements = ko.computed( function(){
            return true;
        });

        self.shouldShowCustom = ko.computed( function(){
            return true;
        });

        self.availableTimePresets = ko.observableArray([
<<<<<<< HEAD
                    'Select:',
=======
>>>>>>> release-2
                    'Last 15 Minutes',
                    'Last Hour',
                    'Last 24 Hours',
                    'Last 5 Minutes'
        ]);

        self.availableIncrementTypes = ko.observableArray([
<<<<<<< HEAD
                    'Select:',
=======
>>>>>>> release-2
                    'Hour...',
                    'Day...',
                    'Week...',
                    'Month...',
                    'Year...'
        ]);

        self.selectedIncrement = ko.observable();

        self.getIncrementSubmenu = ko.computed( function(){

        });


    }

    return { viewModel: DatePickerViewModel, template: template };

});