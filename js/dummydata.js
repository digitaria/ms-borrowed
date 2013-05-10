var States = {
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

var data = {
	friends : [
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
	],

	mycontent : [
		{
			id: 0,
			img: "images/content/starwars.gif",
			itemName: "Star Wars - A New Hope",
			originalOwner: 0,
			state: States.MINE
		},
		{
			id: 1,
			img: "images/content/godfather.gif",
			itemName: "The Godfather",
			originalOwner: 1,
			state: States.THEIRS_BORROWED
		},
		{
			id: 2,
			img: "images/content/princess.gif",
			itemName: "The Princess Bride",
			originalOwner: 0,
			state: States.MINE_OFFERED
		}
	],
	sharedcontent : [
		{
			id: 0,
			img: "images/content/drno.gif",
			itemName: "Dr. No",
			originalOwner: 1,
			state: States.THEIRS_OFFERED
		},
		{
			id: 1,
			img: "images/content/pump.gif",
			itemName: "Pump Up The Volume",
			originalOwner: 2,
			state: States.THEIRS_OFFERED
		},
		{
			id: 2,
			img: "images/content/crow.gif",
			itemName: "The Crow",
			originalOwner: 1,
			state: States.THEIRS_OFFERED
		}
	]
}