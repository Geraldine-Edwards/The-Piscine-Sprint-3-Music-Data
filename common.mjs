import { getUserIDs } from "./data.mjs";
import { createUserDropdown } from "./user-dropdown.mjs"

export const countUsers = () => getUserIDs().length;

window.onload = function () {

// call the dropdown function
  createUserDropdown();

};