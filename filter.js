// Extension filtering configurations
const maleColor = "red";
const maleWords = ["el"];

const femaleColor = "violete";
const femaleWords = ["la"];

const settings = {
	male: {
		color: maleColor,
		words: maleWords,
	},
	female: {
		color: femaleColor,
		words: femaleWords,
	},
};

// Functionalities
const replaceWords = (words, backgroundColor) => {
	let counter = 0;
	let body = document.body;

	words.forEach((word) => {
		const reg = new RegExp(`\\b${word}\\b`, "gim");

		if (reg.test(body.innerHTML)) {
			counter += body.innerHTML.match(reg).length;
		}

		// Esto se debe cambiar para que reemplaze la palabra nativa, no la de la lista de filtrado (deberia hacer un recorrido del
		// body.innerHTML??? puede ser)
		body.innerHTML = body.innerHTML.replace(
			reg,
			(match, index, wholeString) => {
				return `<mark style="background-color:${backgroundColor};">${match}</mark>`;
			}
		);
	});

	return counter;
};

const filterContent = () => {
	let femaleCounter = replaceWords(
		settings.female.words,
		settings.female.color
	);
	let maleCounter = replaceWords(settings.male.words, settings.male.color);

	return { male: maleCounter, female: femaleCounter };
};

// Message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "run-filter") {
		const data = filterContent();
		chrome.runtime.sendMessage({
			status: "run-filter-successful",
			counters: data,
		});
	}
	return true;
});