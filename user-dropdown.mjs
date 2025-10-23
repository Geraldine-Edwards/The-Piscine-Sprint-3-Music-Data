import { getUserIDs } from './data.mjs';
import { renderResult } from "./src/utils/renderers.mjs";


export function createUserDropdown () {
  // create the dropdown elements
  const userSelect = document.getElementById("userSelect");

  const defaultOption = document.createElement("option");
  defaultOption.value = ""
  defaultOption.text = "--Please select a user--";
  userSelect.appendChild(defaultOption);
    

  // get the user Ids array
  const userIds = getUserIDs();

  // iterate through each user ID and create an option element for it
  userIds.forEach((userID) => {
    const userOption = document.createElement("option");
    userOption.value = userID;
    userOption.text = `User ${userID}`;
    userSelect.appendChild(userOption);
  });
}

// add a change event listener to the user dropdown.
// when a user is selected (by mouse or keyboard), calls the provided function with the selected user ID.
export function setupUserDropdown(onUserChange) {
  const userSelect = document.getElementById("userSelect");
  userSelect.addEventListener("change", (event) => {
    const userID = event.target.value;
    if (!userID) {
      // when the default option is selected, clear the results and show message here
      renderResult("allResults", "<p>Please select a user to view results.</p>");
      return;
    }
      onUserChange(userID);
  });
}