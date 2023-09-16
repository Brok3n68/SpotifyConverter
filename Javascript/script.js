document.addEventListener("DOMContentLoaded", () => {
  const fetchButton = document.getElementById("fetchButton");
  const spotifyLinkInput = document.getElementById("link-box");
  const metadataResult = document.getElementById("metadataResult");
  const userChoice = document.getElementById("choice");

  fetchButton.addEventListener("click", async () => {
    const spotifyLink = spotifyLinkInput.value;

    fetchButton.remove();
    spotifyLinkInput.remove();
    userChoice.remove();

    // Regular expression to match a playlist
    const playlistIdMatch = spotifyLink.match(/playlist\/([a-zA-Z0-9]+)/);
    const trackIdMatch = spotifyLink.match(/track\/([a-zA-Z0-9]+)/);
    const albumIdMatch = spotifyLink.match(/album\/([a-zA-Z0-9]+)/);

    if (playlistIdMatch) {
      // Handle playlist link
      const playlistId = playlistIdMatch[1];
      const initialPlaylistUrl = `https://api.spotify.com/v1/playlists/${playlistId}`;

      // Your Spotify Developer App Client ID and Client Secret
      const clientId = "65400afdb63f4a758b4daa4f4333a362";
      const clientSecret = "d768613ce77841029180d17d5d78f239";

      // Base64 encode the client ID and client secret
      const basicAuth = btoa(`${clientId}:${clientSecret}`);

      // Request an access token
      try {
        const tokenResponse = await fetch(
          "https://accounts.spotify.com/api/token",
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${basicAuth}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "grant_type=client_credentials", // For server-to-server authentication
          }
        );

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          const accessToken = tokenData.access_token;

          // Fetch the initial playlist data to get the total number of tracks
          const initialPlaylistResponse = await fetch(initialPlaylistUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (initialPlaylistResponse.ok) {
            const initialPlaylistData = await initialPlaylistResponse.json();
            const totalTracks = initialPlaylistData.tracks.total;

            // Initialize variables for pagination
            let offset = 0;
            const limit = 100; // Maximum number of tracks per request
            let allTracks = [];

            // Fetch all tracks using pagination
            while (offset < totalTracks) {
              const playlistApiUrl = `${initialPlaylistUrl}/tracks?offset=${offset}&limit=${limit}`;
              const playlistResponse = await fetch(playlistApiUrl, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              });

              if (playlistResponse.ok) {
                const playlistData = await playlistResponse.json();
                allTracks = allTracks.concat(playlistData.items);
                offset += limit;
              } else {
                // Handle error for playlist request
                metadataResult.innerHTML =
                  "<p>Failed to fetch playlist data. Please check the Spotify playlist link and try again.</p>";
                return;
              }
            }

            // Now 'allTracks' contains all the tracks in the playlist
            // Print metadata for each track
            metadataResult.innerHTML = `<h2>Metadata for Playlist Tracks:</h2>
              <button type=button id="downloadButton">Scarica La Playlist</button>`;
            allTracks.forEach((track, index) => {
              metadataResult.innerHTML += `
                <h3>[${index + 1} / ${allTracks.length}]</h3>
                  <p><strong>Name:</strong> ${track.track.name}</p>
                  <p><strong>Artist(s):</strong> ${track.track.artists
                    .map((artist) => artist.name)
                    .join(", ")}</p>
                  <p><strong>Album:</strong> ${track.track.album.name}</p>
                  <p><strong>Release Date:</strong> ${
                    track.track.album.release_date
                  }</p>
                  <br>
                  <br>`;
            });
          } else {
            // Handle error for initial playlist request
            metadataResult.innerHTML =
              "<p>Failed to fetch initial playlist data. Please check the Spotify playlist link and try again.</p>";
          }
        } else {
          metadataResult.innerHTML =
            "<p>Failed to obtain access token. Please check your credentials.</p>";
        }
      } catch (error) {
        console.error(error);
        metadataResult.innerHTML =
          "<p>An error occurred while fetching metadata.</p>";
      }
    } else if (trackIdMatch) {
      // Handle single track link

      const trackId = trackIdMatch[1];
      const apiUrl = `https://api.spotify.com/v1/tracks/${trackId}`;

      // Your Spotify Developer App Client ID and Client Secret
      const clientId = "65400afdb63f4a758b4daa4f4333a362";
      const clientSecret = "d768613ce77841029180d17d5d78f239";

      // Base64 encode the client ID and client secret
      const basicAuth = btoa(`${clientId}:${clientSecret}`);

      // Request an access token
      try {
        const tokenResponse = await fetch(
          "https://accounts.spotify.com/api/token",
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${basicAuth}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "grant_type=client_credentials", // For server-to-server authentication
          }
        );

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          const accessToken = tokenData.access_token;

          // Now that you have the access token, you can get the metadata
          const response = await fetch(apiUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();

            // Display metadata for the single track
            metadataResult.innerHTML = "<h2>Metadata for Single Track:</h2>";
            metadataResult.innerHTML += `
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Artist(s):</strong> ${data.artists
                  .map((artist) => artist.name)
                  .join(", ")}</p>
                <p><strong>Album:</strong> ${data.album.name}</p>
                <p><strong>Release Date:</strong> ${
                  data.album.release_date
                }</p>`;
          } else {
            metadataResult.innerHTML =
              "<p>Failed to fetch metadata. Please check the Spotify link and try again.</p>";
          }
        } else {
          metadataResult.innerHTML =
            "<p>Failed to obtain access token. Please check your credentials.</p>";
        }
      } catch (error) {
        console.error(error);
        metadataResult.innerHTML =
          "<p>An error occurred while fetching metadata.</p>";
      }
    } else if (albumIdMatch) {
      const albumId = albumIdMatch[1];
      const initialAlbumUrl = `https://api.spotify.com/v1/albums/${albumId}`;

      // Your Spotify Developer App Client ID and Client Secret
      const clientId = "65400afdb63f4a758b4daa4f4333a362";
      const clientSecret = "d768613ce77841029180d17d5d78f239";

      // Base64 encode the client ID and client secret
      const basicAuth = btoa(`${clientId}:${clientSecret}`);

      // Request an access token
      try {
        const tokenResponse = await fetch(
          "https://accounts.spotify.com/api/token",
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${basicAuth}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "grant_type=client_credentials", // For server-to-server authentication
          }
        );

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          const accessToken = tokenData.access_token;

          // Fetch the initial playlist data to get the total number of tracks
          const initialAlbumResponse = await fetch(initialAlbumUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          try {
            const initialAlbumResponse = await fetch(initialAlbumUrl, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

            if (initialAlbumResponse.ok) {
              const initialAlbumData = await initialAlbumResponse.json();
              const albumName = initialAlbumData.name;
              const artistNames = initialAlbumData.artists.map(
                (artist) => artist.name
              );

              // Ottieni direttamente le tracce dell'album
              const allTracks = initialAlbumData.tracks.items;

              metadataResult.innerHTML = `<h2>Metadata for Album: ${albumName} by ${artistNames.join(
                ", "
              )}</h2>
                <button type="button" id="downloadButton">Scarica L'Album</button>`;

              allTracks.forEach((track, index) => {
                metadataResult.innerHTML += `
                    <h3>[${index + 1} / ${allTracks.length}]</h3>
                    <p><strong>Name:</strong> ${track.name}</p>
                    <p><strong>Artist(s):</strong> ${track.artists
                      .map((artist) => artist.name)
                      .join(", ")}</p>
                    ${
                      track.album
                        ? `<p><strong>Album:</strong> ${track.album.name}</p>`
                        : ""
                    }
                    ${
                      track.album
                        ? `<p><strong>Release Date:</strong> ${track.album.release_date}</p>`
                        : ""
                    }
                    <br>
                    <br>`;
              });
            } else {
              metadataResult.innerHTML =
                "<p>Failed to fetch album data. Please check the Spotify album link and try again.</p>";
            }
          } catch (error) {
            console.error(error);
            metadataResult.innerHTML =
              "<p>An error occurred while fetching album metadata.</p>";
          }
        } else {
          metadataResult.innerHTML =
            "<p>Failed to obtain access token. Please check your credentials.</p>";
        }
      } catch (error) {
        console.error(error);
        metadataResult.innerHTML =
          "<p>An error occurred while fetching metadata.</p>";
      }
    } else {
      // Handle invalid link
      metadataResult.innerHTML =
        "<p>Invalid Spotify link. Please enter a valid Spotify track or playlist link.</p>";
    }
  });

  console.log();
});
