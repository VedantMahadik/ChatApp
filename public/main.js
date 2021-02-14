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

	const getTypingMessage = data => {
		return $(".typing.message").filter(function (i) {
			return $(this).data("username" === data.username);
		});
	};

	const getUsernameColor = () => {
		let hash = 7;
		for (let i = 0; i < username.length; i++) {
			hash = username.charCodeAt(i) + (hash << 5) - hash;
		}

		const index = Math.abs(hash % COLORS.length);
		return COLORS[index];
	};

	const addMessageElement = (el, options) => {
		const $el = $(el);

		if (!options) {
			options = {};
		}
		if (typeof options.fade === "undefined") {
			options.fade = true;
		}
		if (typeof options.pretend === "undefined") {
			options.pretend = true;
		}

		if (options.fade) {
			$el.hide().fadeIn(FADE_TIME);
		}
		if (options.prepend) {
			$messages.prepend($el);
		} else {
			$messages.append($el);
		}

		$messages[0].scrollTop = $messages[0].scrollHeight;
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

		// if username is valid
		if (username) {
			$loginPage.fadeOut();
			$chatPage.show();
			$loginPage.off("click");
			$currentInput = $inputMessage.focus();

			socket.emit("add user", username);
		}
	};

	const sendMessage = () => {
		let message = $inputMessage.val();

		// prevent XSS
		message = cleanInput(message);

		// if message not null
		if (message && connected) {
			$inputMessage.val("");
			addChatMessage({ username, message });
			socket.emit("new message", message);
		}
	};

	const addChatMessage = (data, options) => {
		// show the 'X is typing' message to screen
		const $typingMessages = getTypingMessage(data);
		if ($typingMessages.length !== 0) {
			options.fade = false;
			$typingMessages.remove();
		}

		// adding the message 'X is typing' to screen
		const $usernameDiv = $("<span class='username'/>")
			.text(data.username)
			.css("color", getUsernameColor(data.username));

		const $messagesBodyDiv = $('<span class="messageBody">').text(data.message);

		const typingClass = data.typing ? "typing" : "";
		const $messagesDiv = $('<li class = "message"/>')
			.data("username", data.username)
			.addClass(typingClass)
			.append($usernameDiv, $messagesBodyDiv);
		/*
			<li class = "message">
				<span class='username'/>
				<span class="messageBody">
			</li>
		*/
		addMessageElement($messagesDiv, options);
	};
});
