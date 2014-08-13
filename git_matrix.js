;(function (exports) {
	var GitMatrix = exports.GitMatrix = function (container, options) {
		this.container = container;

		var defaults = {};
		defaults.gridSize = options.gridSize || 20;
		defaults.textList = options.textList || ["0", "1", "2", "3"];
		defaults.startDate = options.startDate || new Date("2014-08-01");
		defaults.endDate = options.endDate || new Date();
		this.defaults = defaults;

		Date.prototype.getWeek = function() {
      return Math.ceil((((this - startDate) / 86400000) + startDate.getDay() + 1) / 7);
    };
	};

	GitMatrix.prototype.loadData = function (data) {
		if (!data || data.length === 0) {
			return false;
		}

		var container = this.container;
		var conf = this.defaults;
		var startDate = conf.startDate;
		var endDate = conf.endDate;
		var gridSize = conf.gridSize;

		var dDays = parseInt((endDate - startDate) / 1000 / 60 / 60 /24) + 1;
		var source = [];
		var startWeek = startDate.getWeek();
		var date = new Date(startDate.valueOf());
		for (var i = 0; i < dDays; i++) {
			var day = date.getDay() + 1;
			var week = date.getWeek() - startWeek + 1;
			source.push({"week": week, "day": day, "value": 0, "id": i});
			date.setDate(date.getDate() + 1);
		}

		function setData (item) {
			var date = new Date(item[0].toString());
			var dDay = parseInt((date - startDate) / 1000 / 60 / 60 /24);
			if (dDay < source.length) {
				source[dDay].value = item[1];
			}
		}

		for (var i = 0; i < data.length; i++) {
			setData(data[i]);
		}

		var width = (endDate.getWeek() - startDate.getWeek() + 1) * gridSize;
    var height = 7 * gridSize;
    var areaColors = ['#eee', '#d6e685', '#8cc665', '#44a340', '#1e6823']

    var matrix = new Chart.Matrix(container, {
    	"width": width,
    	"height": height,
    	"gridSize": gridSize,
    	"areaColors": areaColors,
    	"getX": function (d) { return (d.week - 1) * gridSize; },
    	"getY": function (d) { return (d.day - 1) * gridSize; },
    	"getColor": function (d) { return areaColors[d.value % areaColors.length]; }
    });
    matrix.loadData(source);

    this.matrix = matrix;
	};

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  function getDateString(date) {
    var year = date.getFullYear();
    var month = pad(date.getMonth() + 1);
    var day = pad(date.getDate());
    return year + '年' + month + '月' + day + '日';
  }

	GitMatrix.prototype.render = function () {
		this.matrix.render();

		var conf = this.defaults;
		var startDate = conf.startDate;
		var endDate = conf.endDate;
		var textList = conf.textList;
		var rectNode = $(".rect");

    rectNode.attr("title", function () {
    	var self = $(this);
      var info = self.data("info");
      var value = info.value;
      var days = info.id;
      var date = new Date(startDate.valueOf());
      date.setDate(date.getDate() + days);
      return getDateString(date) + "\n" + (textList[value] || "");
    });

	};
})(window.Chart = window.Chart || {});
