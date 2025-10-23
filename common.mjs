
import { createUserDropdown, setupUserDropdown } from "./user-dropdown.mjs"
import { renderAllResults } from "./src/utils/renderers.mjs";
import { getUserIDs } from "./data.mjs";

export const countUsers = () => getUserIDs().length;

// only start window-specific behavior when running in a browser.
// this prevents Node's test runner from throwing 'window is not defined'.
if (typeof window !== "undefined") {
  window.onload = function () {
    // populate the dropdown
    createUserDropdown();

    // show the default message on page load
    import("./src/utils/renderers.mjs").then(({ renderResult }) => {
      renderResult("allResults", "<p>Please select a user to view results.</p>");
    });

    // attach the event change handler
    setupUserDropdown(function (userID) {
      if (userID) {
        renderAllResults(userID);
      }
    });
  };
}