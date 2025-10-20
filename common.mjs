import { getUserIDs } from "./data.mjs";
import { createUserDropdown, setupUserDropdown } from "./user-dropdown.mjs"
import { userSongListensData, userMostListenedArtist } from "./user-song-data.mjs";

// export const countUsers = () => getUserIDs().length;

window.onload = function () {
  // call the dropdown function  
  createUserDropdown();

   setupUserDropdown(function(userID) {
    userSongListensData(userID);
    userMostListenedArtist(userID);
  });

};