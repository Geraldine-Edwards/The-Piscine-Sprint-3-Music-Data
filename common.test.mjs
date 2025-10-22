import assert from "node:assert";
import test from "node:test";
import { countUsers } from "./common.mjs";
import { getMostOftenArtist, getMostOftenSongTitle, countBy } from "./user-song-data.mjs";


// assert.equal - "loose" comparisons
// assert.deepEqual - object/array comparisons

test("User count is correct", () => {
  assert.equal(countUsers(), 4);
});

// returns song and artist data
test("User with listened data returns song title and artist", () => {
  const song = getMostOftenSongTitle("1");
  const artist = getMostOftenArtist("2");
  assert(song.length > 0, `expected song for user 1 "${song}"`);
  assert(artist.length > 0, `expect artist for user 2, "${artist}"`)
})

// returns empty data
test("User with no listened data returns empty", () => {
  assert.equal(getMostOftenSongTitle("4"), "");
  assert.equal(getMostOftenArtist("4"), "");
})

// key values are counted
test("countBy counts values by key", () => {
  const events = [
    { song_id: "a" },
    { song_id: "b" },
    { song_id: "c" },
    { song_id: "a" },
    { song_id: "b" },
    { song_id: "a" },
  ];
  const counts = countBy(events, event => event.song_id);
  assert.deepEqual(counts, { a: 3, b: 2, c: 1 });
});

// empty key values are handled in teh count
test("countBy handles empty values", () => {
  const counts = countBy([], event => event.song_id);
  assert.deepEqual(counts, {});
});