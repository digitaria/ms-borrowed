var Content = {
	my: [],
	shared: [],

	makeDraggable: function () {
		// Make the my items that are actually "MINE" draggable
		jQuery('#myContentInner').find('.stateMine').draggable({
			appendTo: 'body',
			helper: 'clone',
			revert: true
		});

		// Warn the user if they try dragging an element they don't own
		jQuery('#myContentInner').find('.content:not(.stateMine)').draggable({
			appendTo: 'body',
			helper: 'clone',
			revert: true,
			start: function (event, ui) {
				var message;
				if (ui.helper.is('.stateMineOffered')) {
					message = "You have already offered to share this item. You must take it back before you can share it again.";
				} else if (ui.helper.is('.stateMineBorrowed')) {
					message = "This item is currently being borrowed. Until it is returned, you cannot share it again.";
				} else {
					message = "This is an item you have borrowed. You cannot share someone else's items.";
				}
				jQuery(event.currentTarget).draggable('disable');
				jQuery(event.currentTarget).draggable('enable');
				ui.helper.hide();
				alert(message);
			}
		});

		// Make the shared items draggable
		jQuery('#sharedContentInner').find('.content').draggable({
			appendTo: 'body',
			helper: 'clone',
			revert: true
		});

		// Make the my items container a droppable target
		jQuery('#myContent').droppable({
			accept: '#sharedContentInner .content',
			drop: function (event, ui) {
				var $_droppedEl, id;
				console.debug(ui);
				$_droppedEl = ui.draggable;
				id = $_droppedEl.attr('data-id');	
				try {
					id = parseInt(id, 10);
					$_droppedEl.hide();
					ui.helper.hide();
					Controller.update(Controller.actions.ACCEPTED, id);
				} catch (e) {
				}
			}
		});

		// Make the my items container a droppable target
		jQuery('#shareTarget').droppable({
			accept: '#myContentInner .content',
			drop: function (event, ui) {
				var friendID, $_droppedEl, id;
				// Find the currently selected friend
				friendID = Friends.getActive();
				// If no friend is currently selected
				if (friendID === null) {
					alert("You must choose a friend, first.");
					return;
				}
				// Find the dropped element and its id
				$_droppedEl = ui.draggable;
				id = $_droppedEl.attr('data-id');	
				try {
					// Convert the id to a numeric
					id = parseInt(id, 10);
					$_droppedEl.hide();
					ui.helper.hide();
					Controller.update(Controller.actions.SHARED, id, Friends.getActive());
				} catch (e) {
				}
			}
		});
	},

	bindLinks: function () {
		// For all take back/return/reject links
		jQuery('.mineOfferedInfo a, .theirsOfferedInfo a, .theirsBorrowedInfo a').click(function (e) {
			var $_this, $_content, id;
			// Stop the default link behavior
			e.preventDefault();
			// Get the link
			$_this = jQuery(this);
			// Get its parent content element
			$_content = $_this.parents('.content');
			// Get its id
			id = $_content.attr('data-id');
			try {
				// Convert the id to a numeric
				id = parseInt(id, 10);
				// Return the item
				Controller.update(Controller.actions.RETURNED, id);
			} catch (err) {
			}
		});
	},

	displaySingle: function (contentType) {
		"use strict";
		var thisData, $_container, $_template, count, $_new;
		// Copy data into the object
		Content.my = data.mycontent;
		Content.shared = data.sharedcontent;
		// Default contentType
		if (contentType !== "my") {
			contentType = "shared";
		}
		// Alias the data set
		thisData = Content[contentType];
		// Get the corrent content's inner container
		if (contentType === "my") {
			$_container = jQuery('#myContentInner');
		} else {
			$_container = jQuery('#sharedContentInner');
		}
		// Empty it
		$_container.empty();
		// Get the template
		$_template = jQuery('#templates .content');
		// For each friend
		for (count = 0; count < thisData.length; count += 1) {
			$_new = $_template.clone();
			$_new.attr('data-id', thisData[count].id);
			$_new.attr('data-original-owner', thisData[count].originalOwner);
			$_new.find('img').attr('src', thisData[count].img);
			$_new.find('.itemName').text(thisData[count].itemName);
			$_new.find('.theirsOfferedInfo span, .theirsBorrowedInfo span').text(thisData[count].originalUsername);
			$_new.find('.mineOfferedInfo span, .mineBorrowedInfo span').text(thisData[count].currentUsername);
			switch (thisData[count].state) {
			case States.MINE :
				$_new.addClass('stateMine');
				break;
			case States.MINE_OFFERED :
				$_new.addClass('stateMineOffered');
				break;
			case States.MINE_BORROWED :
				$_new.addClass('stateMineBorrowed');
				break;
			case States.THEIRS_OFFERED :
				$_new.addClass('stateTheirsOffered');
				break;
			case States.THEIRS_BORROWED :
				$_new.addClass('stateTheirsBorrowed');
				break;
			}
			if (contentType === "my") {
				$_new.addClass('containerMy');
			} else {
				$_new.addClass('containerShared');
			}
			$_container.append($_new.clone());
		}
	},

	resize: function () {
		"use strict";
		var $_container, width;
		$_container = jQuery('#myContentInner');
		width = 0;
		$_container.find('.content').each(function (index, el) {
			width += jQuery(el).width();
		});
		$_container.css('min-width', width);
	},

	display: function () {
		"use strict";
		Content.displaySingle("my");
		Content.displaySingle("shared");
		Content.makeDraggable();
		Content.bindLinks();
		Content.resize();
	}
};