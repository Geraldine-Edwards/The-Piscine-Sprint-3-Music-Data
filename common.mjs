import { getUserIDs } from "./data.mjs";
import { createUserDropdown, setupUserDropdown } from "./user-dropdown.mjs";
import { userSongListensData } from "./user-song-data.mjs";


export const countUsers = () => getUserIDs().length;

window.onload = function () {
  // call the dropdown functions 
  createUserDropdown();
  setupUserDropdown(userSongListensData)

  

};