var Controller = {
	actions: {
		ACCEPTED: 0,
		RETURNED: 1,
		SHARED: 2,
	},

	uid: 0,

	getUIDFromUrl: function () {
		var queryString, parts, i, parts2, uid;
		queryString = document.location.search;
		if (queryString.indexOf('?') === 0) {
			queryString = queryString.substring(1);
		}
		parts = queryString.split("&");
		for (i = 0; i < parts.length; i += 1) {
			parts2 = parts[i].split("=");
			if (parts2[0] === "uid") { 
				try {
					uid = parseInt(parts2[1], 10);
					Controller.uid = uid;
				} catch (e) {
				}
			}
		}
	},

	init: function () {
		Controller.getUIDFromUrl();
		Controller.update();
		setInterval(function () {
			Controller.update();
		}, 2000);
	},

	display: function () {
		Content.display();
		Friends.display();
	},

	parseResponse: function (serverdata) {
		if (JSON.stringify(data) !== JSON.stringify(serverdata)) {
			data = serverdata;
			Controller.display();
			if (console !== undefined) {
				if (console.log !== undefined) {
					console.log("Updating data");
				}
			}
		}
	},

	update: function (action, item, recipient) {
		var queryData = {
			uid : Controller.uid
		};
		if ((action !== undefined) && (action !== null)) {
			queryData['action'] = action;
		}
		if ((item !== undefined) && (item !== null)) {
			queryData['item'] = item;
		}
		if ((recipient !== undefined) && (recipient !== null)) {
			queryData['recipient'] = recipient;
		}
		jQuery.ajax({
			url: "http://127.0.0.1:8888/json.json",
			data: queryData,
			dataType: "jsonp",
			jsonpCallback: "parseResponse",
			success: function (serverdata, textStatus, jqXHR) {
				
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log("Error");
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	}
};

parseResponse = Controller.parseResponse;

jQuery(document).ready(function () {
	Controller.init();
});