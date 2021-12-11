const inputField = document.getElementById("search-field");
const searchButton = document.getElementById("search-btn");
const meaningsList = document.getElementById("meanings-list");
const loading = document.getElementById("loading");

loading.style.display = "none";
inputField.focus();

searchButton.addEventListener("click", () => {
  let oldMessage = meaningsList.lastElementChild;
  while (oldMessage) {
    meaningsList.removeChild(oldMessage);
    oldMessage = meaningsList.lastElementChild;
  }

  loading.style.display = "block";

  const word = inputField.value;
  this.getMeaningsFor(word).then((meanings) => {
    loading.style.display = "none";
    meanings.forEach((meaning) => {
      const meaningItem = document.createElement("li");
      meaningItem.textContent = meaning;
      meaningsList.appendChild(meaningItem);
    });
  });
});

function getMeaningsFor(word) {
  return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response);
      }
      return response;
    })
    .then((response) => response.json())
    .then((response) => {
      const meanings = response[0]?.meanings.reduce(
        (allMeanings, meaningsForSpeech) => {
          const definitions = meaningsForSpeech.definitions.reduce(
            (allDefinitions, definition) => {
              allDefinitions.push(definition.definition);
              return allDefinitions;
            },
            []
          );

          allMeanings.push(...definitions);
          return allMeanings;
        },
        []
      );
      return meanings;
    })
    .catch((err) => {
      console.error(err);
      return ["Something went wrong! Please try again"];
    });
}
