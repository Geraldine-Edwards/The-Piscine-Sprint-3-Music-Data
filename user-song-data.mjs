import { getSong } from "./data.mjs";
import { getUserListenEvents, countBy, getMostBy, } from "./src/utils/utils.mjs";



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
    [
    "What was the user's most often listened to song by listening time (not number of listens)",
    getMostListenedSongByTime
    ],
    [
    "What was the user's most often listened to Artist by listening time (not number of listens)",
    getMostListenedArtistByTime
    ],
    [
    "What was the user's most often listened to song on Friday nights (between 5pm and 4am) by listening time (not number of listens)",
    getMostListenedSongFridayByTime
    ],
    ["What song did the user listen to the most times in a row (i.e. without any other song being listened to in between) and many times was the song listened to?",
    getMostConsecutivelyPlayedSong
    ],
    ["Are there any songs that, on each day the user listened to music, they listened to every day? Which ones(s)",
    songListenedEveryDay
    ],
    ["What were the user's top three genres to listen to by number of listens?",
    userTopThreeGenres
    ]
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
 * and returns the song with the highest play count or an empty string if there's no countable data.
 */
export function getMostOftenSongTitle(userID) {
    // get all listen events for the user by calling the helper function
    const events = getUserListenEvents(userID);
    if (!events.length) return "";

    // get the song ID with the highest listen count 
    const mostListenedSongID = getMostBy(events, event => event.song_id);

    // retrieve the song details for song ID
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
 * and returns the artist with the highest count or an empty string if there's no data.
 */
export function getMostOftenArtist(userID) { 
    const events = getUserListenEvents(userID)
    if (!events.length) return "";

    // get the artist  with the highest listen count
    const mostListenedArtist = getMostBy(events, event => {
      const song = getSong(event.song_id);
      return song ? song.artist : "";
  });
  
    return mostListenedArtist || "";
}


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
  if (!events.length) return "";

  // check for the 'friday night' window
  const filteredEvents = events.filter(event  => {
    const date = new Date(event.timestamp);
    const day = date.getDay();

    // convert the timestamp to seconds (for total accuracy )
    const seconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();

    // total seconds for Friday 5pm - Midnight = 61200 + 0 + 0 = 61200 seconds.
    if (day === 5 && seconds >= 17 * 3600) return true;

    // total seconds for Midnight to Saturday 4am = 14400 + 0 + 0 = 14400 seconds
    if (day === 6 && seconds < 4 * 3600) return true

    return false
  });

    if (!filteredEvents.length) return "";

    // get the song ID & details with the highest listen count 
    const mostListenedSongFridayID = getMostBy(filteredEvents, event => event.song_id);
    const mostListenedSongFriday = getSong(mostListenedSongFridayID);

  return mostListenedSongFriday  ? `${mostListenedSongFriday.artist} - ${mostListenedSongFriday.title}` : "";
}


/**
 * Retrieves the song that a user has listened to for the longest total time.
 *
 * @param {string} userID - the ID of the user
 * @returns {string} - a formatted string of the artist and song title (e.g., "Artist - Title"),
 *                     or an empty string ("") if teh user has no listening data.
 *
 * This function sums the total listening time (duration in seconds, looked up from the song data) for each song
 * for each song in the user's listening history and returns the song with the highest total duration.
 * It uses `getMostBy` to group by song ID and sum the durations.
 */
export function getMostListenedSongByTime(userID) {
  const events = getUserListenEvents(userID);
  if (!events.length) return "";

  // use getMostBy to group events by song_id and sum of total listening time for each song
  const mostListenedSongID = getMostBy(
    events,
    event => event.song_id,
    event => {
      // get the song’s duration using the song id from the event data
      const song = getSong(event.song_id);
      return song ? song.duration_seconds : 0;
    });

  // retrieve the song details using song ID and duration
  const MostListenedSongByTime = getSong(mostListenedSongID);
  
  return MostListenedSongByTime ? `${MostListenedSongByTime.artist} - ${MostListenedSongByTime.title}` : "";

};


/**
 * Retrieves the artist that a user has listened to for the longest total time.
 *
 * @param {string} userID - the ID of the user.
 * @returns {string} - the name of the most listened to artist by total listening time (in seconds),
 *                     or an empty string ("") if no data is available.
 *
 * This function sums the total listening time (in seconds, looked up from the song data)
 * for each artist in the user's listening history, and returns the artist with the highest total duration.
 * It uses `getMostBy` to group by artist and sum the durations.
 */
export function getMostListenedArtistByTime(userID) {
  const events = getUserListenEvents(userID);
  if (!events.length) return "";

  // use getMostBy to group events by artist and sum total listening time for each artist
  const mostListenedArtist = getMostBy(
    events,
    event => {
      // retrieve the artist using the song_id from teh event
      const song = getSong(event.song_id);
      return song ? song.artist : "";
    },
    event => {
      // retreive the total listening time in seconds
      const song = getSong(event.song_id);
      return song ? song.duration_seconds : 0;
    }
  );

  return mostListenedArtist || "";
}


/**
 * Retrieves the song that a user has listened to for the longest total time on Friday nights (5pm–4am).
 *
 * @param {string} userID - the ID of the user.
 * @returns {string} - a formatted string of the artist and song title (e.g., "Artist - Title"),
 *                     or an empty string if no data is available.
 *
 * This function filters the user's listening events to only those on Friday nights (Friday 5pm to Saturday 4am),
 * then sums the total listening time (duration in seconds, looked up from the song data) for each song,
 * and returns the song with the highest total duration in that window.
 */
export function getMostListenedSongFridayByTime(userID){
    const events = getUserListenEvents(userID);
    if (!events.length) return "";

    // check for the 'Friday night' window
    const filteredEvents = events.filter(event  => {
      const date = new Date(event.timestamp);
      const day = date.getDay();

      // convert the timestamp to seconds (for total accuracy )
      const seconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();

      // total seconds for Friday 5pm - Midnight = 61200 + 0 + 0 = 61200 seconds.
      if (day === 5 && seconds >= 17 * 3600) return true;

      // total seconds for Midnight to Saturday 4am = 14400 + 0 + 0 = 14400 seconds
      if (day === 6 && seconds < 4 * 3600) return true

      return false
    });

  // use getMostBy to group by song_id and sum total listening time for each song
  const mostListenedSongID = getMostBy(
    filteredEvents,
    event => event.song_id,
    event => {
      // Look up the song's duration using the song_id from the event
      const song = getSong(event.song_id);
      return song ? song.duration_seconds : 0;
    }
  );

  // retrieve the song details for the most listened song by duration on Friday night
  const song = getSong(mostListenedSongID);
  if (song) {
    return song ? `${song.artist} - ${song.title}` : "";
  }
}


/**
 * Retrieves the song that the user listened to the most times in a row (consecutively),
 * without any other song being played in between, and how many times it was played.
 *
 * @param {string} userID - the ID of the user
 * @returns {string} - a formatted string of the artist and song title and times played 
 *                      (e.g., "Artist - Title (5 times)"), or an empty string ("") if the user has no listening data.
 *
 * This function analyzes the user's listening events in order and finds the song
 * with the longest consecutive repeat streak (with no other songs in between). 
 * It returns the song with the highest number of consecutive plays.
 */
export function getMostConsecutivelyPlayedSong(userID) {
    const events = getUserListenEvents(userID);
    if (!events.length) return "";

    // track the ID of the song currently in the streak (by index)
    let currentSongID = events[0].song_id;

    // set the variable to 1 because a song is always played at least once
    let currentStreak = 1;

    const streaks = {};
    for (let i = 1; i < events.length; i++) {
      const songID = events[i].song_id;

      // if the song is the same then the streak continues and the length increases 
      if (songID === currentSongID) {
        currentStreak++;
      } else {

        // if the streak has ended (a new song occurred),start a new streak with the new id
        currentSongID = songID;
        // reset the streak length to 1 again as earlier
        currentStreak = 1
      }

    // compare the existing longest streak for current song in the streaks object,
    // with the current streak just counted and keep the highest one (max)
    streaks[currentSongID] = Math.max(streaks[currentSongID] || 0, currentStreak);
  }

let longestStreak = 0;

let longestSongs = [];

// find the songs with the overall longest streak
for (const songID in streaks) {
  if (streaks[songID] > longestStreak) {
    // if a new highest streak is found reset the array
    longestStreak = streaks[songID];
    longestSongs = [songID]; // 
  } else if (streaks[songID] === longestStreak) {
    // add to the array
    longestSongs.push(songID); 
  }
}

let resultArray = [];
for (const id of longestSongs) {
  // retrieve the song details for the song id
  const song = getSong(id);
  if (song) { 
    resultArray.push(`${song.artist} - ${song.title} (${longestStreak} times)`);
  }
}

return resultArray.join(", ");
}


/**
 * Identifies songs that the user listened to on **every day** they were active.
 *
 * @param {string} userID - The ID of the user whose listening history is analyzed.
 * @returns {string} - A comma-separated string of songs (formatted as "Artist - Title"),
 *                     or an empty string ("") if no songs were listened to every day.
 *
 * This function analyzes the user's listening events to determine whether any songs
 * were played at least once on every distinct day the user listened to music.
 */
export function songListenedEveryDay(userID){
  const events = getUserListenEvents(userID);
  if (!events.length) return "";

  // group events by day
  const days = {}

  for (const event of events) {
    const date = new Date(event.timestamp);
    const dayKey = date.getFullYear() + "-" +
      String(date.getMonth() + 1).padStart(2, "0") + "-" +
      String(date.getDate()).padStart(2, "0");

    // if no dayKeys get a new Set if this is the first time the day appears
    if (!days[dayKey]) {
      // use new Set() so no matter how many times a song appears on a day, the set keeps only one entry for that id
      days[dayKey] = new Set();
    }

    // key is the date and value is a Set of song events for that day
    days[dayKey].add(event.song_id);
  }

  // create an array of ALL days
  const dayKeys = Object.keys(days);

  if (dayKeys.length === 0) return "";

  // create a set by taking the first day in the list of days and get all the songs listened to that day.
  let songsEveryDay = new Set(days[dayKeys[0]]);

  // for each following day
  for (let i = 1; i < dayKeys.length; i++) {
    // get the songs played on the current day
    const daySongs = days[dayKeys[i]];
    // newSongSet contains the songs that are common to songsEveryDay and current day
    const newSongSet = new Set();

  // check each song currently being tracked as 'played every day'
  for (const songID of songsEveryDay) {
    // if the current day also has that song, add it to newSongSet
    if (daySongs.has(songID)) {
      newSongSet.add(songID);
    }
  }

  // at the end, songsEveryDay contains only the songs that were played on every single day
  songsEveryDay = newSongSet;

    if (songsEveryDay.size === 0) return "";
  }

  // retreive the song details for the id 
  const resultArray = [];
  for (const songID of songsEveryDay) {
    const song = getSong(songID);
    if (song) {
      resultArray.push(`${song.artist} - ${song.title}`);
    }
  }

  // join all songs into a single string
  return resultArray.join(", ");
  
};

/**
 * Retrieves the user's top three music genres ranked by number of listens.
 *
 * @param {string} userID - The ID of the user whose top genres are being retrieved.
 * @returns {Array<string>} An array containing up to three genre names, ordered from most listened to least.
 *
 * The function analyzes all listening events of the user, counts listens per genre,
 * and returns the top three genres by listen count.
 * If the user has fewer than three genres listened to, it returns as many as available.
 */
export function userTopThreeGenres(userID) {
  const events = getUserListenEvents(userID);
    if (!events.length) return "";

    //count the listens per genre (key = genre, value = counts)
    const  genreCounts = countBy(events, event => {
      const song = getSong(event.song_id)
      return song && song.genre
    })

    // convert genreCounts to an array, and sort highest to lowest, then get the top 3 genre entries
    return Object.entries(genreCounts)
      .sort((a,b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre]) => genre)
}
