define( [
    'knockout',
    'text!components/widgets/big-english/big-english.html',
    'chartjs',
    'numeraljs',
    'd3',
    'c3',
    'momentjs'
], function( ko, template, chartjs, numeraljs, d3, c3, moment ){


    function BigEnglishViewModel( params ){
        var self = this;

        // Get Data
        ///////////

        //for public uploading, this has been made private
        self.decemberData = {
		    "donations":0,
		    "usd_total":0,
		    "minutes":0,
		    "usd_per_second":0,
		    "day":0,
		    "hour":0
		},

		self.dailyDonationLabels = [];
		self.hourlyDonationLabels = [];
		self.secondsByHourDonationData = ['Donations Per Second'];
		self.dailyDonationData = {};
		self.updateData = {
			goal: 20000000,
			raised: 145678
		};

		self.getTodaysDate = ko.computed( function(){
			return moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
		});

		self.hourlyDonationData = [];

		//initialize day/hour data
		self.dayObj = {};
		$.each(self.decemberData, function(el, i){
			if(!self.dayObj[self.decemberData[el].day]){
				self.dayObj[self.decemberData[el].day] = [ 'Hourly Totals', self.decemberData[el].usd_total ];
			} else {
				self.dayObj[self.decemberData[el].day].push(self.decemberData[el].usd_total);
			}
		});

		self.bigEnglishGoal = ko.computed( function(){
			return numeral(self.updateData.goal).format('($0 a)');
		});

		//made up number for now:
		self.totalRaisedToDate = ko.computed( function(){
			return numeral(self.updateData.raised).format('$0,0');
		});

		self.totalRemainingToDate = ko.computed( function(){
			var trtd = self.updateData.goal - self.updateData.raised;
			return numeral(trtd).format('$0,0');
		});

		$.each(self.decemberData, function(i, el){

			//get labels from chart based on where we are in December.
			if (self.dailyDonationLabels.indexOf(el.day) < 0){
				self.dailyDonationLabels.push(el.day);
			}

			//get data slice for days: donation amt
			if(self.dailyDonationData[el.day]){
				self.dailyDonationData[el.day] += el.usd_total;
			} else {
				self.dailyDonationData[el.day] = el.usd_total;
			}

			//get all seconds into seconds array
			self.secondsByHourDonationData.push(el.usd_per_second);

		});

		self.dailyDonations = $.map(self.dailyDonationData, function(p, k){
			return p;
		});

		self.dailyDataArray = ['Daily Total'];
		$.each( self.dailyDonationData, function(el, i){
			self.dailyDataArray.push(self.dailyDonationData[el]);
		});

		// Totals Earned Chart
		//////////////////////
		self.hourlyChart = function(d,i){
			return {
				bindto: '#totalsEarnedChart',
				size: {
		            height: 450,
		            width: window.width
		        },
		        zoom: { enabled: true },
				data: {
					columns: [ self.dayObj[d['x']]],
					type: 'bar',
					colors: { 'Hourly Totals': 'rgb(92,184,92)'},
					onclick: function (d, i) { c3.generate(self.dailyChart()) },
				},
				axis: {
					x: {
						label: {
							text: 'December ' + d['x'],
							position: 'outer-left'
						},
						tick: {
							format: function(x){ return x + ':00'; }
						}
					},
					y: {
						label: {
							text: 'Dollars'
						}
					}
				},
				bar: {
					width: {
						ratio: 0.5
					}
				}
			};
		};
		self.dailyChart = function(d,i){
			return {
			bindto: '#totalsEarnedChart',
			size: {
                height: 450,
                width: window.width
            },
            zoom: { enabled: true },
			data: {
				columns: [ self.dailyDataArray ],
				type: 'bar',
				colors: { 'Daily Total': 'rgb(49,176,213)'},
				onclick: function (d, i) {
					self.totalsEarnedChart = c3.generate(self.hourlyChart(d,i));
				},
			},
			grid: {
		        x: {
		            show: true
		        },
		        y: {
		            show: true
		        }
		    },
			axis: {
				x: {
					tick: {
						format: function(x){ return "Dec " + (x+1) }
					}
				},
				y: {
					label: {
						text: 'Dollars'
					},
					tick: {
						format: function(x){ return numeral(x).format('$0,0') }
					}
				}
			},
			bar: {
				width: {
					ratio: 0.5
				}
			}
		};
		};
		self.totalsEarnedChart = c3.generate(self.dailyChart());



		// Distance To Goal Chart
		/////////////////////////
		self.updatedGoal = self.updateData.goal;
		self.neededArray = $.map( self.dailyDonations, function( val, i ){
			self.updatedGoal = self.updatedGoal - val;
			return self.updatedGoal;
		});

		self.neededArray.unshift('Needed');
		self.distanceToGoalChart = c3.generate({
			bindto: '#distanceToGoalChart',
			size: {
                height: 250,
                width: window.width/2
            },
			data: {
				columns: [ self.neededArray ],
				type: 'area-spline',
				colors: { Needed: 'rgb(217,83,79)'}
			},
			grid: {
		        x: {
		            show: true
		        },
		        y: {
		            show: true
		        }
		    },
			axis: {
				x: {
					tick: {
						format: function(x){ return "Dec " + (x+1) }
					}
				},
				y: {
					label: {
						text: 'Dollars',
						position: 'outer-middle'
					},
					tick: {
						format: function(x){ return '$' + x/1000000 + "m" }
					}
				}
			},
		});


		// Avg USD per second
		/////////////////////
		console.log('needed array: ', self.neededArray);
		self.perSecondArray = $.map(self.neededArray, function(val, i){
			return (((((val/31)/24)/60)/60));
		});
		self.secondsByDayArray = ['Needed Per Second'];
		$.each(self.perSecondArray, function(val, i){
			for(var i=0; i<25; i++){
				self.secondsByDayArray.push(self.perSecondArray[val]);
			}
		})
		console.log('per second day array: ', self.secondsByDayArray);

		self.perSecondArray.unshift('Per Second');
		self.avgUSDComboChart = c3.generate({
			bindto: '#avgUSDperSecond',
			size: {
                height: 250,
                width: window.width/2
            },
            zoom: { enabled: true },
			data: {
				columns: [
					self.secondsByHourDonationData,
					self.secondsByDayArray
				],
				type: 'area',
				types: {
					'USD per second': 'line'
				}
			}
		});

		// Reload
		// TODO: make this real
		self.reloadBigEnglish = function(){
			location.reload();
		};


    }

    return { viewModel: BigEnglishViewModel, template: template };

});