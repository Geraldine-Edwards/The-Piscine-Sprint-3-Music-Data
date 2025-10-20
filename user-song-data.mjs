import { getListenEvents, getUserIDs, getSong } from "./data.mjs";



export function userSongListensData(userID) {
    const displayDiv = document.getElementById("displayData");

    let songDiv = document.getElementById("songResult");
    if (!songDiv) {
        songDiv = document.createElement("div");
        songDiv.id = "songResult";
        displayDiv.appendChild(songDiv);
    }  

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
    
    // if there is no data after the sort display a user message
    if (sortedSongCount.length === 0) {
        songDiv.innerHTML = `<p>User ${userID} has not listened to any songs yet.</p>`
        return;
    }

    // get the most listened song at index [0] then get the song ID [0] from that entry
    const mostListenedSongID = sortedSongCount[0][0]; 

    //get teh song details for the ID
    const mostListenedSong = getSong(mostListenedSongID); 
    const songMessage = `User ${userID}'s most often listened to song: ${mostListenedSong.title}`;
    songDiv.innerHTML = `<p>${songMessage}</p>`;

};

export function userMostListenedArtist(userID) {
    const displayDiv = document.getElementById("displayData");

    let artistDiv = document.getElementById("artistResult");
    if (!artistDiv) {
        artistDiv = document.createElement("div");
        artistDiv.id = "artistResult";
        displayDiv.appendChild(artistDiv);
    }

    const songEvents = getListenEvents(userID);

    // starting with an empty object, use the reduce method to count how many times each artist was listened to by the user.
    // each key is an artist name and each value is the total number of listens.
    const artistCounts = songEvents.reduce((count, event) => {
        // get the artist name for the current song using its song ID
        // if the artist has been counted before, add 1, but if not or the artist doesn't exist, start from zero and add 1
        const artist = getSong(event.song_id).artist;
        count[artist] = (count[artist] || 0) + 1;
        return count;
    }, {});

    // Object.entries(artistCounts) returns an array of [0] the artist name and [1] the artist count, in an array itself.
    // sorted [1] will sort the number of listens count in descending order (highest to lowest).
    const sortedArtistCount = Object.entries(artistCounts).sort((a, b) => b[1] - a[1]);
    
    // if there is no data after the sort display a user message
    if (sortedArtistCount.length === 0) {
        artistDiv.innerHTML = `<p>User ${userID} has not listened to any artists yet.</p>`;
        return;
    }

    // get the most listened artist at index [0] then get the artist name [0] from that entry
    const mostListenedArtist = sortedArtistCount[0][0];
    const artistMessage = `User ${userID}'s most often listened to artist: ${mostListenedArtist}`;
    artistDiv.innerHTML = `<p>${artistMessage}</p>`;
};
