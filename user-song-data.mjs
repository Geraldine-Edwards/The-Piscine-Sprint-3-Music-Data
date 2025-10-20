import { getListenEvents, getUserIDs, getSong } from "./data.mjs";

const displayDiv = document.getElementById("displayData");
// displayDiv.innerHTML = "<p>Your formatted data here</p>";


export function userSongListensData(userID) {
    const songEvents = getListenEvents(userID);

    // starting with an empty object, use the reduce method to count how many times each song ID was listened to by the user.
    // each key is a song ID and each value is the total number of listens.
    const songCounts = songEvents.reduce((count, event) => {
        // if the song has been counted before, add 1, but if not or the song doesn't exist, start from zero and add 1
        count[event.song_id] = (count[event.song_id] || 0) + 1;
        return count;
    }, {});

    // Object.entries(songCounts) returns an array of [0] the song ID and [1] the song count, in an array itself.
    // sorted [1] will sort the number of listens count in descending order (highest to lowest).
    const sortedSongCount = Object.entries(songCounts).sort((a, b) => b[1] - a[1]);
    console.log(sortedSongCount);
    return sortedSongCount;

}
