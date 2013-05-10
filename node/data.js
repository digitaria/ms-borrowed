exports.actions = {
	ACCEPTED: 0,
	RETURNED: 1,
	SHARED: 2
};

exports.states = {
	// This is my item, always has been
	MINE: 0,
	// This is my item but it's currently offered to someone else
	MINE_OFFERED: 1,
	// This is my item but it's currently borrowed by someone else
	MINE_BORROWED: 2,
	// This is someone else's item but currently offered to me
	THEIRS_OFFERED: 3,
	// This is someone else's item that I am currently borrowing
	THEIRS_BORROWED: 4
};

exports.users = [
	{
		id: 0,
		img: "images/users/nick.jpg",
		username: "Nick"
	},
	{
		id: 1,
		img: "images/users/dale.jpg",
		username: "Dale"
	},
	{
		id: 2,
		img: "images/users/chuck.jpg",
		username: "Chuck"
	}
];

exports.content = [
	{
		id: 0,
		img: "images/content/starwars.gif",
		itemName: "Star Wars - A New Hope",
		originalOwner: 0,
		currentOwner: 0,
		isAccepted: true
	},
	{
		id: 1,
		img: "images/content/godfather.gif",
		itemName: "The Godfather",
		originalOwner: 0,
		currentOwner: 0,
		isAccepted: true
	},
	{
		id: 2,
		img: "images/content/princess.gif",
		itemName: "The Princess Bride",
		originalOwner: 0,
		currentOwner: 0,
		isAccepted: true
	},
	{
		id: 3,
		img: "images/content/pump.gif",
		itemName: "Pump Up The Volume",
		originalOwner: 1,
		currentOwner: 1,
		isAccepted: true
	},
	{
		id: 4,
		img: "images/content/crow.gif",
		itemName: "The Crow",
		originalOwner: 1,
		currentOwner: 1,
		isAccepted: true
	},
	{
		id: 5,
		img: "images/content/drno.gif",
		itemName: "Doctor No",
		originalOwner: 2,
		currentOwner: 2,
		isAccepted: true
	}
];