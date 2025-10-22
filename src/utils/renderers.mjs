import { questionsAndAnswerFns } from "../../user-song-data.mjs";


/**
 * Renders a message inside a dynamically created or existing result div.
 *
 * @param {string} resultDivId - the ID of the div where the message will be displayed.
 * @param {string} message - the HTML string to render inside the result div.
 *
 * This function checks for DOM availability and updates the UI accordingly.
 * It is safe to use in environments where `document` may be undefined (e.g., Node.js tests).
 */
export function renderResult(resultDivId, message) {
    // if there's no DOM (Node/test environment), do nothing
  if (typeof document === "undefined") return;
    const displayDiv = document.getElementById("displayData");
    // clear previous results
    displayDiv.innerHTML = "";
    let resultDiv = document.getElementById("resultDivId");
    //if there is no div, create one
    if (!resultDiv) {
        resultDiv = document.createElement("div");
        resultDiv.id = resultDivId;
        displayDiv.appendChild(resultDiv);
    }  
    resultDiv.innerHTML = message;
}


/**
 * Builds an HTML table string from a list of question-answer(fn) pairs.
 *
 * @param {Array<[string, string]>} results - an array of [question, answer] tuples.
 * @returns {string} - a HTML string representing a styled results table.
 *
 * This function is used internally to structure user data in a readable format.
 */
export function buildResultsTable(results) {
  return `
    <table style="border-collapse: collapse; width: 100%; margin: 1em 0;">
      <caption style="caption-side: top; font-weight: bold; text-align: left; margin-bottom: 0.5em;">
        User's Music Data Results
      </caption>
      <thead>
        <tr>
          <th scope="col" style="border: 1px solid #333; padding: 0.5em; background: #f2f2f2;">Question</th>
          <th scope="col" style="border: 1px solid #333; padding: 0.5em; background: #f2f2f2;">Answer</th>
        </tr>
      </thead>
      <tbody>
        ${results.map(([q, a]) => `
          <tr>
            <td style="border: 1px solid #333; padding: 0.5em;">${q}</td>
            <td style="border: 1px solid #333; padding: 0.5em;">${a}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}


/**
 * Renders all non-empty results for a given user by building a summary table.
 *
 * @param {string} userID - the ID of the user whose data will be rendered.
 *
 * This function calls `questionsAndAnswerFns()` to retrieve an array of [question, function] pairs.
 * It then calls each answer function with the user ID, filters out empty results,
 * and renders them as a table using `renderResult`. If no results exist, it shows a fallback message.
 */
export function renderAllResults(userID){
    const results = []
    // loop through every question and answer function
    for (const [question, answerFn] of questionsAndAnswerFns()) {
      const answer = answerFn(userID);
      // keep only non-empty answers and push into a results array
      if(answer) {
      results.push([question, answer])
      }
    }
    // if there are answers build and render the table
    if (results.length > 0){
    const table = buildResultsTable(results);
    renderResult("allResults", table);
    } else {
      // if the user has no data (results empty), render a short message instead.
      renderResult("allResults", "<p>This user hasn't listened to any songs yet.</p>")
    }
}