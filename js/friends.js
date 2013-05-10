var Friends = {
	activeFriend: null,
	friends: [],

	setActive: function (newActive) {
		"use strict";
		var $_active;
		if (newActive === undefined) {
			newActive = Friends.activeFriend;
		}
		// Store the new active friend
		Friends.activeFriend = newActive;
		// Remove any existing active state
		jQuery('#friends .friend').removeClass('active');
		// If we're not setting the new friend to null
		if (newActive !== null) {
			// Find the active friend
			$_active = jQuery('#friends .friend[data-id=' + newActive + ']');
			// If there was no active friend
			if ($_active.length === 0) {
				// Clear the stored active friend
				Friends.activeFriend = null;
			} else {
				$_active.addClass('active');
			}
		}
	},

	getActive: function () {
		// Ensure the active value is real
		Friends.setActive();
		return Friends.activeFriend;
	},

	display: function () {
		"use strict";
		var $_friends, $_template, count, $_new;
		Friends.friends = data.friends;
		// Get the friends inner container
		$_friends = jQuery('#friendsInner');
		// Empty it
		$_friends.empty();
		// Get the template
		$_template = jQuery('#templates .friend');
		// For each friend
		for (count = 0; count < Friends.friends.length; count += 1) {
			$_new = $_template.clone();
			$_new.attr('data-id', Friends.friends[count].id);
			$_new.find('img').attr('src', Friends.friends[count].img);
			$_new.find('.itemName').text(Friends.friends[count].username);
			$_friends.append($_new.clone());
		}
		// Activate the active friend
		Friends.setActive();
		// Bind the clicks
		$_friends.find('.friend').click(function (e) {
			var id;
			e.preventDefault();
			id = jQuery(this).attr('data-id');
			try {
				parseInt(id, 10);
				Friends.setActive(id);
			} catch (e) {
				if (console !== undefined) {
					if (console.log !== undefined) {
						console.log("Unable to parse friend's id");
					}
				}
			}
		});
	}
};