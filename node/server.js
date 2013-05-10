var http, url, querystring, data;
http = require('http');
url = require('url');
querystring = require('querystring');
data = require('./data');

function dirtyClone(obj) {
	return JSON.parse(JSON.stringify(obj));
}

function getUsername(uid) {
	for (count = 0; count < data.users.length; count += 1) {
		if (data.users[count].id === uid) {
			return data.users[count].username;
		}
	}
	return "";
}

function getItemById(id) {
	if ((id === undefined) || (id === null)) {
		return null;
	}
	for (count = 0; count < data.content.length; count += 1) {
		if (data.content[count].id === id) {
			return data.content[count];
		}
	}
	return null;
}

function getFriends(uid) {
	var result, count;
	result = [];
	for (count = 0; count < data.users.length; count += 1) {
		if (data.users[count].id !== uid) {
			result.push(data.users[count]);
		}
	}
	return result;
}

function getMyContent(uid) {
	var result, count, item;
	result = [];
	for (count = 0; count < data.content.length; count += 1) {
		item = dirtyClone(data.content[count]);
		item.originalUsername = getUsername (item.originalOwner);
		item.currentUsername = getUsername (item.currentOwner);
		item.state = -1;
		// If they are the current owner of their own item
		if ((uid === item.originalOwner) && (uid === item.currentOwner)) {
			item.state = data.states.MINE;
		} else if (item.originalOwner === uid) { // If they are the original owner (but it belongs to someone else)
			if (item.isAccepted) { // If the other person has accepted
				item.state = data.states.MINE_BORROWED;
			} else { // If the other person hasn't accepted
				item.state = data.states.MINE_OFFERED;
			}
		} else if (item.currentOwner === uid) { // If they are the current owner (but not the original owner)
			if (item.isAccepted) { // And they have accepted the item
				item.state = data.states.THEIRS_BORROWED;
			}
		}
		if (item.state !== -1) { // If it was a state we care about
			result.push(item); // Add it to the array
		}
	}
	return result;
}

function getSharedContent(uid) {
	var result, count, item;
	result = [];
	for (count = 0; count < data.content.length; count += 1) {
		item = dirtyClone(data.content[count]);
		item.originalUsername = getUsername (item.originalOwner);
		item.currentUsername = getUsername (item.currentOwner);
		item.state = -1;
		if (uid !== item.originalOwner) { // if they're not the original owner
			if (uid === item.currentOwner) { // But they are the current owner
				if (!item.isAccepted) { // And they haven't accepted it
					item.state = data.states.THEIRS_OFFERED;
				}
			}
		}
		if (item.state !== -1) { // If it was a state we care about
			result.push(item); // Add it to the array
		}
	}
	return result;
}

function getJSON(uid) {
	var result;
	result = {
		friends : getFriends(uid),
		mycontent: getMyContent(uid),
		sharedcontent: getSharedContent(uid)
	};
	return JSON.stringify(result);
}

function safeParseInt(value, defaultValue) {
	var result = defaultValue;
	try {
		result = parseInt(value, 10);
	} catch (e) {
		result = defaultValue;
		console.log("Unable to parse integer " + value + ". Defaulting to " + defaultValue);
	}
	return result;
}

function acceptItem(uid, itemId) {
	// Get the item
	var item = getItemById(itemId);
	// If an item was passed
	if (item !== null) {
		// If they're the current owner
		if (item.currentOwner === uid) {
			// Accept the item
			item.isAccepted = true;
			console.log("User " + uid + " just accepted item " + itemId);
		} else {
			console.log("User " + uid + " is not the current owner of " + itemId + " and so cannot accept it.");
		}
	}
}

function returnItem(itemId) {
	// Get the item
	var item = getItemById(itemId);
	// If an item was passed
	if (item !== null) {
		// Give the item back
		item.currentOwner = item.originalOwner;
		// And auto accept it
		item.isAccepted = true;
		console.log("Item " + itemId + " was just returned to the original owner.");
	}
}

function shareItem(uid, itemId, recipient) {
	// Get the item
	var item = getItemById(itemId);
	// If an item was passed
	if (item !== null) {
		if (recipient === null) {
			console.log("No recipient was passed so this item cannot be transfered.");
			return;
		}

		// If they're the current owner
		if (item.originalOwner === uid) {
			// If they're the current owner as well
			if (item.currentOwner === uid) {
				if (recipient !== uid) {
					// Transfer ownership
					item.currentOwner = recipient;
					// But flag it as not yet accepted
					item.isAccepted = false;
					console.log("User " + uid + " just shared item " + itemId + " to user " + recipient);
				} else {
					// Transfer ownership
					item.currentOwner = recipient;
					// And flag it as auto accepted as it's their own item
					item.isAccepted = true;
					console.log("User " + uid + " just shared item " + itemId + " back to themselves.");
				}
			} else {
				console.log("User " + uid + " cannot share item " + itemId + ", event though they are the original owner, as it is currently held by " + item.currentOwner);
			}
		} else {
			console.log("User " + uid + " is not the original owner of " + itemId + " and so cannot loan it to " + recipient);
		}
	}
}

function processAction(uid, action, itemId, recipient) {
	if (action === data.actions.ACCEPTED) {
		acceptItem(uid, itemId);
	} else if (action === data.actions.RETURNED) {
		returnItem(itemId);
	} else if (action === data.actions.SHARED) {
		shareItem(uid, itemId, recipient);
	}
}

http.createServer(function (request, response) {
	var query, uid, action = null, item = null, recipient = null;
	query = querystring.parse(url.parse(request.url).query);
	// Get the uid param
	if (query.uid === undefined) {
		console.log("No UID passed. Defaulting to 0");
		uid = 0;
	} else {
		uid = safeParseInt(query.uid, 0);
	}
	// Get the other URL parameters for actions
	if (query.action !== undefined) {
		action = safeParseInt(query.action, null);
	}
	if (query.item !== undefined) {
		item = safeParseInt(query.item, null);
	}
	if (query.recipient !== undefined) {
		recipient = safeParseInt(query.recipient, null);
	}
	// If an action was passed
	if (action !== null) {
		processAction(uid, action, item, recipient);
	}

	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.write("parseResponse(" + getJSON(uid) + ");");
	response.end();

}).listen(8888, '127.0.0.1');