import { getSong } from "./data.mjs";
import { getUserListenEvents, countBy, getMostListened, } from "./src/utils/utils.mjs";



/**
 * Returns a list of questions paired with their corresponding answer functions.
 *
 * @returns {Array<[string, Function]>} - an array of [question, function] tuples.
 *
 * Each function takes a `userID` and returns the answer to the question based on the user's listening data.
 * This structure is used to dynamically generate results for a user.
 */
export function questionsAndAnswerFns() {
  return [
    ["What was the user's most often listened to song",
    getMostOftenSongTitle
    ],
    [
    "What was the user's most often listened to artist?",
    getMostOftenArtist
    ],
    // ["What was the user's most often listened to song on Friday nights (between 5pm and 4am)",
    // getMostOftenSongFriday
    // ],
    // [
    // "What was the user's most often listened to song by listening time (not number of listens)",
    // getMostListenedMinutesSong
    // ],
    // [
    // "What was the user's most often listened to Artist by listening time (not number of listens)",
    // getMostListenedMinutesArtist
    // ],
    // ["What song did the user listen to the most times in a row (i.e. without any other song being listened to in between)?",
    // getMostConsecutiveSong
    // ],
    // ["How many times was most consecutive song listened to?",
    // getMostConsecutiveSongTimes   
    // ],
    // ["Are there any songs that, on each day the user listened to music, they listened to every day? Which ones(s)",
    // songListenedEveryDay
    // ],
    // ["What were the user's top three genres to listen to by number of listens?",
    // userTopThreeGenres
    // ]
]
};


/**
 * Retrieves the most frequently listened-to song for a given user.
 *
 * @param {string} userID - tehe ID of the user.
 * @returns {string} - a formatted string of the artist and song title (e.g., "Artist - Title"),
 *                     or an empty string if no data is available.
 *
 * This function analyzes all listening events, counts frequency by song ID,
 * and returns the song with the highest play count an empty string ("") if there's no countable data.
 */
export function getMostOftenSongTitle(userID) {
    // get all the events via the helper function 
    const events  = getUserListenEvents(userID)

    // use the helper countBy to count all the listen events per song id
    const songCounts = countBy(events, event => event.song_id);

    // use the helper function to get the highest song ID frequency
    const mostListenedSongID = getMostListened(songCounts); 

    // identify the song with the highest listen count and render in the browser
    const mostListenedSong = getSong(mostListenedSongID);
 
    return mostListenedSong ? `${mostListenedSong.artist} - ${mostListenedSong.title}` : "";
};

/**
 * Retrieves the most frequently listened-to artist for a given user.
 *
 * @param {string} userID - the ID of the user.
 * @returns {string} - the name of the most listened-to artist,
 *                     or an empty string if no data is available.
 *
 * This function counts how often each artist appears in the user's listening history
 * and returns teh one with the highest count or an empty string ("") if there's no countable data.
 */
export function getMostOftenArtist(userID) { 
    // get the events via helper function
    const events = getUserListenEvents(userID)

    // count how many times each artist appears by mapping each event -> song -> artist
    const artistCounts = countBy(events, event => getSong(event.song_id).artist)

    // find the artist with the highest listen count
    const mostListenedArtist = getMostListened(artistCounts); 
  
    return mostListenedArtist ? mostListenedArtist: "";
};
