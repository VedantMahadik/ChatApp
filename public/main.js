$(function () {
	const FADE_TIME = 150; // ms
	const TYPING_TIMER_LENGTH = 400; // ms
	const COLORS = [
		"#e21400",
		"#91580f",
		"#f8a700",
		"#f78b00",
		"#58dc00",
		"#287b00",
		"#a8f07a",
		"#4ae8c4",
		"#3b88eb",
		"#3824aa",
		"#a700ff",
		"#d300e7",
	];

	// variable instantiation
	const window = $(window);
	const $usernameInput = $(".usernameInput");
	const $messages = $(".messages");
	const $inputMessage = $(".inputMessage");

	const $loginPage = $(".loginPage");
	const $chatPage = $(".chatPage");

	const socket = io();

	let username;
	let connected = false;
	let typing = false;
	let lastTypingTime;
	let $currentInput = $usernameInput.focus();

	const log = (message, options) => {
		const $el = $("<li>").addClass("log").text(message);
		addMessageElement($el, options);
	};

	const addParticipantsMessage = data => {
		let message = "";

		if (data.message === 1) {
			message += "There is 1 participant";
		} else {
			message += `There are ${data.numUsers} participants`;
		}
		log(message);
	};

	const setUsername = () => {
		username = cleanInput($usernameInput.val().trim());
		if (username) {
			$loginPage.fadeOut();
			$chatPage.show();
			$loginPage.off("click");
			$currentInput = $inputMessage.focus();

			socket.emit("add user", username);
		}
	};
});
