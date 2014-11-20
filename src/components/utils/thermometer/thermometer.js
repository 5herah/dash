define( [
    'knockout',
    'text!components/utils/thermometer/thermometer.html'
], function( ko, template ){


    function ThermometerViewModel( params ){
        var self = this;

        self.currentAmountRaised = params.raised;
        self.goal = params.goal;

		self.goalProgress = function(options) {
			var defaults = {
				goalAmount: self.goal,
				currentAmount: self.currentAmountRaised,
				speed: 1000,
				textBefore: '',
				textAfter: '',
				milestoneNumber: 70,
				milestoneClass: 'almost-full',
				callback: function() {}
			}

			var options = $.extend(defaults, options);
			return this.each(function(){
				var obj = $(this);

				// Collect and sanitize user input
				var goalAmountParsed = parseInt(defaults.goalAmount);
				var currentAmountParsed = parseInt(defaults.currentAmount);

				// Calculate size of the progress bar
				var percentage = (currentAmountParsed / goalAmountParsed) * 100;

				var milestoneNumberClass = (percentage > defaults.milestoneNumber) ? ' ' + defaults.milestoneClass : ''

				// Generate the HTML
 				var progressBar = '<div class="progressBar">' + defaults.textBefore + currentAmountParsed + defaults.textAfter + '</div>';

 				var progressBarWrapped = '<div class="goalProgress' + milestoneNumberClass + '">' + progressBar + '</div>';

				// Append to the target
				obj.append(progressBarWrapped);

				// Ready
				var rendered = obj.find('div.progressBar');

				// Remove Spaces
				rendered.each(function() {
					$(this).html($(this).text().replace(/\s/g, '&nbsp;'));
				});

				// Animate!
				rendered.animate({width: percentage +'%'}, defaults.speed, defaults.callback);

				if(typeof callback == 'function') {
					callback.call(this)
				}
			});
		}();
	}

    return { viewModel: ThermometerViewModel, template: template };

});