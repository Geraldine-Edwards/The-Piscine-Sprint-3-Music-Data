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
    ["What was the user's most often listened to song on Friday nights (between 5pm and 4am)",
    getMostOftenSongFriday
    ],
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
 * Retrieves the most frequently listened to song for a given user.
 *
 * @param {string} userID - tehe ID of the user.
 * @returns {string} - a formatted string of the artist and song title (e.g., "Artist - Title"),
 *                     or an empty string if no data is available.
 *
 * This function analyzes all listening events, counts frequency by song ID,
 * and returns the song with the highest play count an empty string ("") if there's no countable data.
 */
export function getMostOftenSongTitle(userID) {
    // get all listen events for the user by calling the helper function
    const events = getUserListenEvents(userID);

    // use 'countBy' to count the occurrences of each song_id in the events
    const songCounts = countBy(events, event => event.song_id);

    // get the song ID with the highest listen count using the 'getMostListened'
    const mostListenedSongID = getMostListened(songCounts);

    // retrieve the song details (artist and title) for the song with the highest listen count
    const mostListenedSong = getSong(mostListenedSongID);

    // return the formatted string with artist and title, or an empty string if no song was found
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
 * and returns teh artist with the highest count or an empty string ("") if there's no countable data.
 */
export function getMostOftenArtist(userID) { 
    const events = getUserListenEvents(userID)

    // count how many times each artist appears by mapping each event with song and artist
    const artistCounts = countBy(events, event => getSong(event.song_id).artist)

    // find the artist with the highest listen count
    const mostListenedArtist = getMostListened(artistCounts); 
  
    return mostListenedArtist ? mostListenedArtist: "";
};


/**
 *  Retrieves the most frequently listened to song on Firday nights for a given user.
 *
 * @param {string} userID - the ID of the user.
 * @returns {string} - a formatted string of the artist and song title (e.g., "Artist - Title"),
 *                     or an empty string if no data is available.
 *
 * This function retrieves all listening events for the given user,
 * then filters events that occur on a Friday where the time is between 5pm (17*3600) and 4am (4 *3600) the next day (Saturday),
 * then counts frequency of listens by song ID, and retreives the song with the highest frequency,
 * and returns the artist and song title or an empty string ("") if there's no countable data.
 */
export function getMostOftenSongFriday(userID) {
  const events = getUserListenEvents(userID);

  // check for the 'friday night' window
  const checkFridayNight = event => {

    // get the timestamp data for an event
    const fullDate = new Date(event.timestamp);

    // get the day from the date using getDay() method
    const day = fullDate.getDay();

    // convert the timestamp to seconds (for total accuracy )
    // e.g. total seconds at 5:00pm PM = 61200 + 0 + 0 = 61200 seconds.
    const seconds = fullDate.getHours() * 3600 + fullDate.getMinutes() * 60 + fullDate.getSeconds();

    // check if the timestamp falls between Friday 'night' or Saturday 'early morning' (returns a boolean)
    return (day === 5 && seconds >= 17 * 3600) || (day === 6 && seconds < 4 * 3600);
  }

  // filter the events with the checkFridayNight values
  const fridayEvents = events.filter(checkFridayNight);

  // return an empty string if no Friday events
  if (fridayEvents.length === 0) return "";

  // get the count in the fridayEvents array
  const songCounts = countBy(fridayEvents, event => event.song_id);

  // get the song with the highest listen count
  const topSongId = getMostListened(songCounts);

  // get the song details from the song ID
  const song = getSong(topSongId);

  return song ? `${song.artist} - ${song.title}` : "";
}
