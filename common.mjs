
import { createUserDropdown, setupUserDropdown } from "./user-dropdown.mjs"
import { renderAllResults } from "./src/utils/renderers.mjs";
import { getUserIDs } from "./data.mjs";

export const countUsers = () => getUserIDs().length;

// only start window-specific behavior when running in a browser.
// this prevents Node's test runner from throwing 'window is not defined'.
if (typeof window !== "undefined") {
  window.onload = function () {
    // populate the dropdown and attach the event change handler
    createUserDropdown();

    setupUserDropdown(function (userID) {
      renderAllResults(userID);
    });
  };
}