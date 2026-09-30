
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
    import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
    import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

    const firebaseConfig = {
      apiKey: "AIzaSyAkexz2MU9ndsby4KHOdz5de1SjkQ1-uSY",
      authDomain: "watchteluguott-8c93c.firebaseapp.com",
      projectId: "watchteluguott-8c93c",
      storageBucket: "watchteluguott-8c93c.appspot.com",
      messagingSenderId: "1074128527265",
      appId: "1:1074128527265:web:53177ce778000b957640f0"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const TMDB_KEY = "ca45e5cf6ec928f62f0f46bc65fe3684";

    // Track authentication state
    onAuthStateChanged(auth, (user) => {
      if (user) {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("dashboardBox").style.display = "block";
        loadAdminContent();
      } else {
        document.getElementById("loginBox").style.display = "block";
        document.getElementById("dashboardBox").style.display = "none";
      }
    });

    // Handle Login
    window.handleAdminLogin = async function() {
      const email = document.getElementById("adminEmail").value.trim();
      const pass = document.getElementById("adminPassword").value.trim();
      const errBox = document.getElementById("loginError");
      errBox.innerText = "";

      if (!email || !pass) {
        errBox.innerText = "Email mariyu Password enter cheyandi!";
        return;
      }

      try {
        await signInWithEmailAndPassword(auth, email, pass);
      } catch(err) {
        errBox.innerText = "Login Failed: " + err.message;
      }
    };

    // Handle Logout
    window.logoutAdmin = async function() {
      await signOut(auth);
    };

    // Auto-fetch from TMDB
    window.
    async function fetchTrailerId(movieName) {
      try {
        const q = encodeURIComponent(movieName + " Telugu official trailer");
        const endpoints = [
          "https://inv.nadeko.net/api/v1/search?q=" + q + "&type=video",
          "https://invidious.nerdvpn.de/api/v1/search?q=" + q + "&type=video",
          "https://vid.priv.au/api/v1/search?q=" + q + "&type=video"
        ];
        
        const spamKeywords = ["fan made", "concept", "fake", "review", "reaction", "whatsapp status", "bgm", "spoof"];
        const officialKeywords = ["official trailer", "trailer", "glimpse"];

        for (let ep of endpoints) {
          try {
            const r = await fetch(ep, { signal: AbortSignal.timeout(3500) });
            if (!r.ok) continue;
            const items = await r.json();
            if (!items || !items.length) continue;

            for (let vid of items) {
              const titleLower = (vid.title || "").toLowerCase();
              
              // 1. ఫేక్ / ఫ్యాన్-మేడ్ కీవర్డ్స్ ఉంటే స్కిప్ చేస్తుంది
              const isSpam = spamKeywords.some(kw => titleLower.includes(kw));
              if (isSpam) continue;

              // 2. టైటిల్ లో ఖచ్చితంగా సినిమా పేరు మరియు అధికారిక ట్రైలర్ ఉండాలి
              const hasTrailerTag = officialKeywords.some(kw => titleLower.includes(kw));
              if (hasTrailerTag && vid.videoId) {
                return vid.videoId;
              }
            }
          } catch(e) {}
        }
      } catch (err) {}
      return "";
    }

    // ఫుల్ యూట్యూబ్ లింక్ పేస్ట్ చేసినా కేవలం 11 అక్షరాల ID మాత్రమే తీసుకునేలా హెల్పర్
    function cleanAndPreviewYt(input) {
      let val = input.value.trim();
      const match = val.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match && match[1]) {
        val = match[1];
        input.value = val;
      }
      const prevBtn = document.getElementById("ytPreviewBtn");
      if (prevBtn) {
        prevBtn.style.display = val ? "inline-block" : "none";
        prevBtn.href = "https://www.youtube.com/watch?v=" + val;
      }
    }

    runTmdbFetch = async function() {
      const qInput = document.getElementById("fetchQuery");
      const queryVal = qInput.value.trim();
      const status = document.getElementById("fetchStatus");

      if (!queryVal) {
        status.style.color = "#ef4444";
        status.innerText = "సినిమా పేరు టైప్ చేయండి!";
        return;
      }

      status.style.color = "#60a5fa";
      status.innerText = "వివరాలు & OTT ప్లాట్‌ఫారమ్ సేకరిస్తున్నాం...";

      try {
        const searchApi = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + encodeURIComponent(queryVal + " Telugu film") + "&utf8=&format=json&origin=*";
        const sRes = await fetch(searchApi);
        const sData = await sRes.json();

        let pageTitle = queryVal;
        if (sData.query && sData.query.search && sData.query.search.length > 0) {
          pageTitle = sData.query.search[0].title;
        }

        // Fetch Summary
        const summaryApi = "https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(pageTitle);
        const sumRes = await fetch(summaryApi);
        if (!sumRes.ok) throw new Error("దొరకలేదు");

        const data = await sumRes.json();
        const cleanTitle = data.title.replace(/\s*\([^)]*\)/g, "").trim();

        document.getElementById("movieTitle").value = cleanTitle || queryVal;
        document.getElementById("movieDesc").value = data.extract || "";

        let posterHd = "";
        if (data.originalimage && data.originalimage.source) {
          posterHd = data.originalimage.source;
        } else if (data.thumbnail && data.thumbnail.source) {
          // Upgrade thumbnail URL to full resolution
          posterHd = data.thumbnail.source.replace(/\/thumb\//, "/").replace(/\/[^\/]+$/, "");
          if (!posterHd.startsWith("http")) posterHd = data.thumbnail.source;
        }
        document.getElementById("moviePoster").value = posterHd;

        document.getElementById("movieReleaseDate").value = "Available Now";

        // Fetch full article text to detect OTT Platform & Website Link
        let detectedPlatform = "Netflix"; // default
        try {
          const parseApi = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=&explaintext=&titles=" + encodeURIComponent(pageTitle) + "&format=json&origin=*";
          const pRes = await fetch(parseApi);
          const pData = await pRes.json();
          const pages = pData.query ? pData.query.pages : {};
          const fullText = (data.extract + " " + Object.values(pages).map(p => p.extract || "").join(" ")).toLowerCase();

          if (fullText.includes("prime video") || fullText.includes("amazon prime")) {
            detectedPlatform = "Prime Video";
          } else if (fullText.includes("aha") || fullText.includes("aha video")) {
            detectedPlatform = "Aha Video";
          } else if (fullText.includes("hotstar") || fullText.includes("disney+")) {
            detectedPlatform = "JioHotstar";
          } else if (fullText.includes("zee5") || fullText.includes("zee 5")) {
            detectedPlatform = "ZEE5";
          } else if (fullText.includes("netflix")) {
            detectedPlatform = "Netflix";
          }
        } catch(e) {
          console.warn("Platform parse note:", e);
        }

        // Set Platform dropdown
        document.getElementById("moviePlatform").value = detectedPlatform;

        // Auto-fill official Direct App / Website streaming link
        const encTitle = encodeURIComponent(cleanTitle || queryVal);
        let directOttLink = "";
        if (detectedPlatform === "Netflix") {
          directOttLink = "https://www.netflix.com/search?q=" + encTitle;
        } else if (detectedPlatform === "Prime Video") {
          directOttLink = "https://app.primevideo.com/detail?phrase=" + encTitle;
        } else if (detectedPlatform === "Aha Video") {
          directOttLink = "https://www.aha.video/search?q=" + encTitle;
        } else if (detectedPlatform === "JioHotstar") {
          directOttLink = "https://www.hotstar.com/in/explore?search_query=" + encTitle;
        } else if (detectedPlatform === "ZEE5") {
          directOttLink = "https://www.zee5.com/search?q=" + encTitle;
        }

        document.getElementById("movieOttLink").value = directOttLink;

        status.style.color = "#00e676";
        status.innerText = `✔ ${cleanTitle} వివరాలు, ${detectedPlatform} & Direct Link ఆటో-ఫిల్ అయ్యాయి!`;
      } catch(err) {
        status.style.color = "#ef4444";
        status.innerText = "సినిమా వివరాలు అందలేదు, పేరును సరిగ్గా టైప్ చేయండి.";
      }
    };

    window.saveMovieContent = async function() {
      const status = document.getElementById("addStatus");
      const title = document.getElementById("movieTitle").value.trim();
      const poster = document.getElementById("moviePoster").value.trim();
      const youtubeId = document.getElementById("movieYoutube").value.trim();
      const description = document.getElementById("movieDesc").value.trim();
      const platform = document.getElementById("moviePlatform").value;
      const category = document.getElementById("movieCategory").value;
      const releaseDate = document.getElementById("movieReleaseDate").value.trim();
      let ottLink = document.getElementById("movieOttLink").value.trim();

      if (!title) {
        status.style.color = "#ef4444";
        status.innerText = "Please enter Movie Title!";
        return;
      }

      // Disallow third party themoviedb / justwatch links
      if (ottLink.includes("themoviedb.org") || ottLink.includes("justwatch.com")) {
        ottLink = "";
      }

      status.style.color = "#60a5fa";
      status.innerText = "Saving to database...";

      try {
        await addDoc(collection(db, "movies"), {
          title: title,
          poster: poster,
          youtubeId: youtubeId,
          ytId: youtubeId,
          description: description,
          platform: platform,
          category: category,
          releaseDate: releaseDate || "Available Now",
          ottLink: ottLink,
          isUpcoming: document.getElementById("checkUpcoming").checked,
          isThisWeek: document.getElementById("checkThisWeek").checked,
          createdAt: serverTimestamp()
        });

        status.style.color = "#00e676";
        status.innerText = "✔ Content successfully saved!";

        // Reset inputs
        document.getElementById("movieTitle").value = "";
        document.getElementById("moviePoster").value = "";
        document.getElementById("movieYoutube").value = "";
        document.getElementById("movieDesc").value = "";
        document.getElementById("movieReleaseDate").value = "";
        document.getElementById("movieOttLink").value = "";
        document.getElementById("fetchQuery").value = "";
        document.getElementById("fetchStatus").innerText = "";
      } catch(err) {
        status.style.color = "#ef4444";
        status.innerText = "Save Error: " + err.message;
      }
    };

    // Real-time Database Content Listing
    function loadAdminContent() {
      const listEl = document.getElementById("adminList");
      const q = query(collection(db, "movies"), orderBy("createdAt", "desc"));

      onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
          listEl.innerHTML = "<div style=\"color:#64748b; font-size:12px;\">No content added yet.</div>";
          return;
        }

        let html = "";
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          const docId = docSnap.id;
          html += `
            <div class="movie-item">
              <div>
                <div class="movie-item-title">${d.title || "Untitled"}</div>
                <div class="movie-item-sub">${d.platform || "OTT"} &bull; ${d.category || "General"}</div>
              </div>
              <button class="btn-del" onclick="deleteMovieDoc(\x27${docId}\x27)">Delete</button>
            </div>
          `;
        });
        listEl.innerHTML = html;
      });
    }

    // Delete Content
    window.deleteMovieDoc = async function(id) {
      if (confirm("Are you sure you want to delete this content?")) {
        try {
          await deleteDoc(doc(db, "movies", id));
        } catch(err) {
          alert("Delete failed: " + err.message);
        }
      }
    };
  