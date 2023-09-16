const { google } = require("googleapis");
const youtube = google.youtube("v3");
const API_KEY = "AIzaSyBvBuQ3b_3wZ99iQbDNXzgeR2L_RSGu13k";

// Search for the song on YouTube
youtube.search.list(
  {
    key: API_KEY,
    q: "Bohemian rapsody lyrics", // Replace with your song and artist name
    type: "video",
    part: "snippet", // Add this line to specify the 'snippet' part
  },
  (err, response) => {
    if (err) {
      console.error("Error searching on YouTube:", err);
      return;
    }

    // Check if there are search results
    if (response.data.items.length === 0) {
      console.log("No search results found.");
      return;
    }

    // Extract the video ID of the first result
    const videoId = response.data.items[0].id.videoId;

    // Create the URL for the first video
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    console.log("URL of the first video:", videoUrl);
  }
);
