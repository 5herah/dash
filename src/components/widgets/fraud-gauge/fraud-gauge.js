define([
<<<<<<< HEAD
    'knockout',
    'text!components/widgets/fraud-gauge/fraud-gauge.html',
    'gauge',
    'noUISlider',
    'selectize',
    'bootstrap-datepicker'
    ],
function( ko, template, datePickersTemplate, noUISlider ){

  function FraudGaugeViewModel( params ){

    var self = this;

    $.ajaxSetup({async:false});

    var widgetData = $.get( 'metadata/fraud', function(reqData){
      self.data = reqData;
    });

    self.title = 'Fraud Rejections';
    self.selectedTimePeriod = ko.observable();
    self.selectedFilters = ko.observableArray([]);
    self.selectedSubFilters = ko.observableArray([]);
    self.queryRequest = [];
    self.gaugeValue = ko.observable(3);
    self.filtersSelected = ko.observable(false);
    self.gaugeIsSetUp = ko.observable(false);
    self.queryString = ko.observable('This widget hasn\'t been set up yet!');

    //broken down data from above
    self.filters = ko.observableArray($.map(self.data.filters, function(val, i){return[val]}));
    self.filterNames = ko.computed( function(){
      var names = [];
      $.each(self.filters(), function(el, i){
        names.push(i.display);
      });
      return names;
    });

    //default range slider settings
    self.lowRange = ko.observable(33);
    self.highRange = ko.observable(66);
    $('#fraudPercentSlider').noUiSlider({
      start: [ self.lowRange(), self.highRange() ],
      range: {
        'min': [0],
        'max': [100]
      },
      step: 1,
      connect: true
    });
    $('#fraudPercentSlider').on({
      slide: function(){
        var sliderValArray = $('#fraudPercentSlider').val();
        self.lowRange(parseInt(sliderValArray[0]));
        self.highRange(parseInt(sliderValArray[1]));
      },
    });

    //Gauge options
    self.opts = {
      lines: 12,
      angle: 0,
      lineWidth: 0.44,
      pointer: {
        strokeWidth: 0
      },
      limitMax: 'true',
      colorStop: '#c12e2a',
      strokeColor: '#E0E0E0',
      generateGradient: true
    };

    self.getFraudFailurePercent = function(lowHi, midHi){
      //get color thresholds
      //TODO: these vals to come from user's choices via slider.
      if(self.gaugeValue() < lowHi){
        self.opts.colorStop = '#89CC23';
      } else if(self.gaugeValue() >= lowHi && self.gaugeValue() < midHi){
        self.opts.colorStop = '#FFA722';
      } else {
        self.opts.colorStop = '#c12e2a';
      }

      self.gauge.setOptions(self.opts);

      return self.gaugeValue();
    };

    //#FraudRiskScoreGauge
    self.context = document.getElementById('FraudRiskScoreGauge');
    self.gauge = new Gauge(self.context).setOptions(self.opts);
    self.gauge.maxValue = 100;
    self.gauge.animationSpeed = 32;
    self.gauge.set(self.getFraudFailurePercent());
    ///////////////////

    self.validateSubmission = function( times, filters ){

      var validation = {
         validated: '',
         errors: []
       };

      //there must be a chosen timeframe
       if(!times){
         validation.errors.push('You must submit a valid time.')
        validation.validated = false;
       } else {
         validation.validated = true;
      }

      return validation;
    };

    self.convertToQuery = function( userChoices ){

      var qs            = '',
          ds            = '',
          timePresets   = [ "Last 15 Minutes",
                            "Last Hour",
                            "Last 24 Hours",
                            "Last 5 Minutes"];

      $.each( self.selectedSubFilters(), function(i, el){
        //add the filters' parent filter
        if(i===0){
          qs += el;
        } else {
          qs += ' and ' + el;
        }
      });

      //convert time constraints
      var currentDate = new Date();
      switch( userChoices.timespan[0] ){
        case timePresets[0]:
          var lfm = new Date(currentDate.getTime() - (15 * 60 * 1000));
          ds += 'DT gt \'' + lfm.toISOString() + '\'';
          break;
        case timePresets[1]:
          var lh = new Date(currentDate.getTime() - (60 * 60 * 1000));
          ds += 'DT gt \'' + lh.toISOString() + '\'';
          break;
        case timePresets[2]:
          var ltfh = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000));
          ds += 'DT gt \'' + ltfh.toISOString() + '\'';
          break;
        case timePresets[3]:
          var lfvm = new Date(currentDate.getTime() - (5 * 60 * 1000));
          ds += 'DT gt \'' + lfvm.toISOString() + '\'';
          break;
        default:
          var lfm = new Date(currentDate.getTime() - (15 * 60 * 1000));
          ds += 'DT gt \'' + lfm.toISOString() + '\'';
          break;

      }

      //if there's already something in the qs, precede new string with 'and'
      var postQS = '';
      if(qs.length > 0){
        postQS = qs + ' and ' + ds;
      } else {
        postQS = ds;
      }

      self.queryString(postQS);
      console.log('query string: ', self.queryString());

      return postQS;
    };

    self.showSubfilters = function(stuff){
      $('#'+stuff).toggleClass('hide');
    };

    self.submitGaugeModifications = function(){

      //validate values first.
      var validation = self.validateSubmission( self.selectedTimePeriod(), self.selectedFilters() );
      if( !validation.validated ){
        console.log(validation);

        $('#fraudSubmissionErrors').html('<p class="text-danger">you have errors in your submission:</p><ul></ul>' ).addClass('show');
        $.each( validation.errors, function(el, i){
          $('#fraudSubmissionErrors ul').append('<li>' + i + '</li>');
        });

      } else{

        //gauge time period
        self.queryRequest['timespan'] = self.selectedTimePeriod();

        //gauge filters
        self.queryRequest['selectedFilters'] = self.selectedFilters();
        self.filtersSelected(true);

        //gauge subfilters
        self.selectedSubFilters();

        //put it all into a real query
        //this will be a function call - TODO: make parsing function
        self.queryString( self.convertToQuery(self.queryRequest));

        $.get( '/data/fraud?' + $.param({ '$filter': self.queryString() }).replace(
          /\+/g, '%20' ), function ( dataget ) {
          self.gaugeIsSetUp(true);
          self.gaugeValue( parseFloat(dataget[0].fraud_percent).toFixed(2) );
          self.gauge.set(self.getFraudFailurePercent(parseInt($('#fraudPercentSlider').val()[0]), parseInt($('#fraudPercentSlider').val()[1])));
        } );
      };


    };


  }

  return { viewModel: FraudGaugeViewModel, template: template };

});
=======
	'knockout',
	'text!components/widgets/fraud-gauge/fraud-gauge.html',
	'c3',
	'chartjs',
	'WidgetBase'
	],
function( ko, template, c3, Chart, WidgetBase ){

	//extend the chart so we can flip the circle
	Chart.types.Doughnut.extend({
		addData: function(segment, atIndex, silent){
			var index = atIndex || this.segments.length;
			this.segments.splice(index, 0, new this.SegmentArc({
				value : segment.value,
				outerRadius : (this.options.animateScale) ? 0 : this.outerRadius,
				innerRadius : (this.options.animateScale) ? 0 : (this.outerRadius/100) * this.options.percentageInnerCutout,
				fillColor : segment.color,
				highlightColor : segment.highlight || segment.color,
				showStroke : this.options.segmentShowStroke,
				strokeWidth : this.options.segmentStrokeWidth,
				strokeColor : this.options.segmentStrokeColor,
				startAngle : Math.PI * 2.5,
				circumference : (this.options.animateRotate) ? 0 : this.calculateCircumference(segment.value),
				label : segment.label
			}));

			if (!silent){
				this.reflow();
				this.update();
			}
		}
	});

	function FraudGaugeViewModel( params ){

		WidgetBase.call( this, params );

		var self 		= this,
			wasSaved  	= self.chartSaved();

		self.filters 				= ko.observableArray();
		self.title 					= ko.observable(params.title);
		self.queryString			= '';
		self.columnSize 			= ko.observable('col-lg-' + ( self.config.width || 6 ) + ' fraudGauge');
		self.selectedTimePeriod 	= ko.observable( self.config.timeBreakout || 'Last 15 Minutes');
		self.selectedFilters 		= ko.observableArray([]);
		self.selectedSubFilters 	= ko.observableArray([]);
		self.queryRequest 			= [];
		self.gaugeValue 			= ko.observable(0);
		self.filtersSelected 		= ko.observable(false);
		self.queryStringSQL 		= ko.observable('This widget hasn\'t been set up yet!');
		self.greenHighRange 		= ko.observable( self.config.greenHighRange || 17 );
		self.redLowRange 			= ko.observable( self.config.redLowRange || 68 );
		self.configSet				= ko.observable(Object.keys(self.config).length > 0);
		self.gauge					= ko.observable(false);

		self.populateChoices = function(){
			return $.get( 'metadata/fraud-gauge', function(reqData){
				self.data = reqData;

				self.filters($.map(self.data.filters, function(val, i){return [val];}));
				self.filterNames = ko.computed( function(){
					var names = [];

					$.each(self.filters(), function(el, i){
					  names.push(i.display);
					});

					return names;
				});
			});
		};

		self.renderPercentRangeChart = function(){

			var canvas 		= $('#fraudPercentRanges')[0],
				ctx 		= canvas.getContext('2d');

			var placeholder 		= document.createElement('canvas');
			placeholder.width	 	= 200;
			placeholder.height 		= placeholder.width;
			var placeholderctx 		= placeholder.getContext('2d');

			var ddata = [{
				value: 90,
				color: '#000000'
			},{
				value: 1.8 * (self.greenHighRange()),
				color: '#4cae4c'
			},{
				value: 1.8 * (self.redLowRange() - self.greenHighRange()),
				color: '#eea236'
			}, {
				value: 1.8 * (100 - self.redLowRange()),
				color: '#c9302c'
			},{
				value: 90,
				color: '#000000'
			}];

			self.gaugeChart = new Chart( placeholderctx ).Doughnut( ddata, {
				animation: false,
				segmentShowStroke: false,
				onAnimationComplete: function() {
					var cropHeight = Math.round(placeholder.height/2);
					ctx.clearRect(0,0,canvas.width,canvas.height);
					ctx.drawImage(
						placeholder,
						0,
						0,
						placeholder.width,
						cropHeight,
						0,
						0,
						placeholder.width,
						cropHeight
					);
				}
			});
		};

		self.makeChart = function(){
			self.gauge({
				size: {
					height: 300,
					width: 390
				},
				data: {
					columns: [
						['failure', self.gaugeValue()]
					],
					type: 'gauge'
				},
				gauge: {
					min: 0,
					max: 100,
					units: 'failure rate'
				},
				color: {
					pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
					threshold: {
						values: [ 0, self.greenHighRange(), self.redLowRange(), 100]
					}
				}
			});
		};

		self.validateSubmission = function( times, filters ){
			var validation = {
				validated: '',
				errors: []
			};

			if( !times ){
				validation.errors.push('You must submit a valid time.');
				validation.validated = false;
			} else {
				validation.validated = true;
			}

			return validation;
		};

		self.convertToQueryString = function( userChoices ){
			var qs            	= '',
				ds            	= '',
				timePresets		= [ 'Last 15 Minutes',
									'Last Hour',
									'Last 24 Hours',
									'Last 5 Minutes'];

			var filterObj = {};
			var haveMultipleSubfilters = [];
			$.each( userChoices.selectedSubFilters, function(el, subfilter){
				var filter = subfilter.substr(0, subfilter.indexOf(' '));

				if(!filterObj[filter]){
					filterObj[filter] = subfilter;
				} else {
					filterObj[filter] += ' or ' + subfilter;
					haveMultipleSubfilters.push(filter);
				}
			});

			$.each( filterObj, function(el, s){
				if( haveMultipleSubfilters.indexOf(el) > -1){
					qs += '(' + filterObj[el] + ')';
				} else {
					qs += filterObj[el];
				}
				qs += ' and ';
			});

			var currentDate = new Date();
			switch( userChoices.timespan ){
				case timePresets[0]:
					var lfm = new Date(currentDate.getTime() - (15 * 60 * 1000));
					ds += 'DT gt \'' + lfm.toISOString() + '\'';
					break;
				case timePresets[1]:
					var lh = new Date(currentDate.getTime() - (60 * 60 * 1000));
					ds += 'DT gt \'' + lh.toISOString() + '\'';
					break;
				case timePresets[2]:
					var ltfh = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000));
					ds += 'DT gt \'' + ltfh.toISOString() + '\'';
					break;
				case timePresets[3]:
					var lfvm = new Date(currentDate.getTime() - (5 * 60 * 1000));
					ds += 'DT gt \'' + lfvm.toISOString() + '\'';
					break;
				default:
					var lfm2 = new Date(currentDate.getTime() - (15 * 60 * 1000));
					ds += 'DT gt \'' + lfm2.toISOString() + '\'';
					break;

			}

			var postQS = '';
			if(qs.length > 0){
				postQS = qs + ds;
			} else {
				postQS = ds;
			}

			return '$filter=' + postQS;
		};

		self.showSubfilters = function( stuff ){
			$('#'+stuff).toggleClass('hide');
		};

		self.resetGaugeSettings = function(){
			self.greenHighRange(33);
			self.redLowRange(66);
			self.renderPercentRangeChart();

			$('#timePeriodDropdown option:eq(0)').prop('selected', true);
			$('.subfilterSubnav').addClass('hide');
			$('input:checkbox').removeAttr('checked');
		};

		self.submitGaugeModifications = function(btn){

			if(btn){self.logStateChange(true);}

			var validation = self.validateSubmission( self.selectedTimePeriod(), self.selectedFilters() );
			if( !validation.validated ){

				$('#fraudSubmissionErrors').html('<p class="text-danger">you have errors in your submission:</p><ul></ul>' ).addClass('show');
				$.each( validation.errors, function(el, i){
					$('#fraudSubmissionErrors ul').append('<li>' + i + '</li>');
				});

			} else{
				self.configSet( true );
				//gauge time period
				self.queryRequest.timespan = self.selectedTimePeriod();

				//gauge filters
				self.queryRequest.selectedFilters = self.selectedFilters();
				if(self.selectedFilters().length > 0){
				  self.filtersSelected(true);
				}

				//gauge subfilters
				self.queryRequest.selectedSubFilters = self.selectedSubFilters() ? self.selectedSubFilters().sort() : '';
				self.queryString = self.convertToQueryString(self.queryRequest);

				//put gauge mods into temp config to be pushed if/when saved
				//width, queryString, timeBreakout, showSlice
				self.config = {
					width: self.config.width,
					queryString: self.queryString,
					timeBreakout: self.selectedTimePeriod().toString(),
					selectedFilters: self.queryRequest.selectedFilters,
					selectedSubFilters: self.queryRequest.selectedSubFilters,
					greenHighRange: self.greenHighRange(),
					redLowRange: self.redLowRange()
				};

				var chartDataCall = self.getChartData( self.queryString );
				$.when( chartDataCall ).then( function( dataget ){
					self.gaugeValue(parseFloat(dataget.results[0].fraud_percent).toFixed(2) );
					self.queryStringSQL(dataget.sqlQuery);
					self.makeChart();
				});
			}
		};

		self.populateChoices().then(function() {
			self.preDataLoading(false);

			if ( wasSaved ) {
				// restore choices and show the chart
				if(self.config !== 'NULL') {
					self.selectedTimePeriod(self.config.timeBreakout);
					self.selectedFilters(self.config.selectedFilters ? self.config.selectedFilters : '');
					self.selectedSubFilters(self.config.selectedSubFilters ? self.config.selectedSubFilters : '');
				}
				self.chartSaved( true );
				self.submitGaugeModifications();
			}
		});

		return this;
	}

	return { viewModel: FraudGaugeViewModel, template: template };
});
>>>>>>> release-2
