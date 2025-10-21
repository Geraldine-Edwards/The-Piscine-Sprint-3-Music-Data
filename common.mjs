import { getUserIDs } from "./data.mjs";
import { createUserDropdown, setupUserDropdown } from "./user-dropdown.mjs"
import { renderAllResults } from "./user-song-data.mjs";

// export const countUsers = () => getUserIDs().length;

window.onload = function () {
  // call the dropdown function  
  createUserDropdown();

   setupUserDropdown(function(userID) {
  renderAllResults(userID)
  });

};