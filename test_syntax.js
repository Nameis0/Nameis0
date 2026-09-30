
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
    import { getFirestore, collection, getDocs, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

    const firebaseConfig = {
      apiKey: "AIzaSyAkexz2MU9ndsby4KHOdz5de1SjkQ1-uSY",
      authDomain: "watchteluguott-8c93c.firebaseapp.com",
      projectId: "watchteluguott-8c93c",
      storageBucket: "watchteluguott-8c93c.appspot.com",
      messagingSenderId: "1074128527265",
      appId: "1:1074128527265:web:53177ce778000b957640f0"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    let rawMovies = [];
    let currentFiltered = [];
    let currentPlayingYt = "";

    // Real-time listener for Firestore movies collection
    const q = query(collection(db, "movies"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      rawMovies = [];
      snapshot.forEach(docSnap => {
        rawMovies.push({ id: docSnap.id, ...docSnap.data() });
      });
      currentFiltered = rawMovies;
      renderGrid(currentFiltered);
    }, (error) => {
      console.error("Firestore error:", error);
      document.getElementById("moviesGrid").innerHTML = "<div style=\"grid-column: 1/-1; text-align: center; color: #ff5252;\">Error loading content: " + error.message + "</div>";
    });

    function renderGrid(list) {
      window.currentMoviesList = list;
      window.currentMoviesList = list;
      const grid = document.getElementById("moviesGrid");
      if (!list || list.length === 0) {
        grid.innerHTML = "<div style=\"grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;\">No movies found.</div>";
        return;
      }

      grid.innerHTML = list.map((m, idx) => {
        const title = m.title || m.title_te || "Telugu Movie";
        const yt = m.youtubeId || m.ytId || "";
        const poster = m.poster || (yt ? `https://img.youtube.com/vi/${yt}/hqdefault.jpg` : "/logo.png");
        const plat = m.platform || "OTT";

        const isRealOtt = plat && plat.toLowerCase() !== "youtube" && plat.toLowerCase() !== "ott";
        const badgeHtml = isRealOtt ? `<span class="mr-card-badge">${plat}</span>` : "";
        
        let metaHtml = "";
        if (isRealOtt) {
          const rel = m.releaseDate && m.releaseDate !== "Available Now" ? m.releaseDate : "Streaming on " + plat;
          metaHtml = `<div class="mr-card-meta">${rel}</div>`;
        }

        return `
          <div class="mr-card" onclick="openDetail(${idx})">
            <div class="mr-poster-wrap">
              <img class="mr-poster-img" src="${poster}" alt="${title}" loading="lazy">
              ${badgeHtml}
            </div>
            <div class="mr-card-info">
              <div class="mr-card-title">${title}</div>
              ${metaHtml}
            </div>
          </div>
        `;
      }).join("");
    };

    window.liveSearch = function() {
      const qVal = (document.getElementById("searchInput").value || "").toLowerCase().trim();
      if (!qVal) {
        currentFiltered = rawMovies;
      } else {
        currentFiltered = rawMovies.filter(m => {
          const t = (m.title || "").toLowerCase();
          const p = (m.platform || "").toLowerCase();
          const d = (m.description || "").toLowerCase();
          return t.includes(qVal) || p.includes(qVal) || d.includes(qVal);
        });
      }
      renderGrid(currentFiltered);
    };

    window.filterCategory = function(cat, btn) {
      document.querySelectorAll(".mr-nav-btn").forEach(b => b.classList.remove("active"));
      if (btn) btn.classList.add("active");

      if (cat === "ALL") {
        currentFiltered = rawMovies;
        document.getElementById("gridTitle").innerText = "LATEST TELUGU MOVIES & RELEASES";
      } else if (cat === "FEATURED") {
        currentFiltered = rawMovies.filter(m => m.isUpcoming || m.isThisWeek);
        document.getElementById("gridTitle").innerText = "FEATURED OTT RELEASES";
      } else if (cat === "Trailer") {
        currentFiltered = rawMovies.filter(m => m.category === "Trailer");
        document.getElementById("gridTitle").innerText = "LATEST TELUGU TRAILERS";
      } else {
        currentFiltered = rawMovies.filter(m => (m.platform || "").toLowerCase() === cat.toLowerCase());
        document.getElementById("gridTitle").innerText = `${cat.toUpperCase()} TELUGU RELEASES`;
      }
      renderGrid(currentFiltered);
      goBackToGrid();
    };

    

    window.toggleTrailer = function() {
      const tBox = document.getElementById("trailerBox");
      const tFrame = document.getElementById("trailerFrame");
      if (!currentPlayingYt) {
        alert("Trailer available ledhu!");
        return;
      }
      if (tBox.style.display === "block") {
        tBox.style.display = "none";
        tFrame.src = "";
      } else {
        tBox.style.display = "block";
        tFrame.src = `https://www.youtube.com/embed/${currentPlayingYt}?autoplay=1`;
      }
    };

    window.goBackToGrid = function() {
      if (typeof window.stopTrailerPlayer === function) window.stopTrailerPlayer();
      const tBox = document.getElementById("trailerBox");
      const tFrame = document.getElementById("trailerFrame");
      if (tBox) tBox.style.display = "none";
      if (tFrame) tFrame.src = "";

      document.getElementById("detailView").style.display = "none";
      document.getElementById("gridView").style.display = "block";
    };
  
    // Native Back Button & Scroll Memory Support
    window.lastScrollPos = window.lastScrollPos || 0;

    

    window.addEventListener("popstate", function(e) {
      const dtView = document.getElementById("detailView");
      if (dtView && dtView.style.display !== "none") {
        closeDetailView(true);
      }
    });

  
    window.lastScrollPos = window.lastScrollPos || 0;

    
    window.closeDetailView = function() {
      if (typeof window.goBackToGrid === "function") {
        window.goBackToGrid();
      } else {
        const dv = document.getElementById("detailView");
        const gv = document.getElementById("gridView");
        if (dv) dv.style.display = "none";
        if (gv) gv.style.display = "block";
      }
    };

    
    window.currentTrailerYtId = "";

    window.playTrailerNow = function() {
      if (!window.currentTrailerYtId) return;
      const iframe = document.getElementById("dtIframe");
      const poster = document.getElementById("dtPoster");
      const playBtn = document.getElementById("dtPlayBtn");
      if (iframe && poster && playBtn) {
        iframe.src = "https://www.youtube.com/embed/" + window.currentTrailerYtId + "?autoplay=1&rel=0&modestbranding=1";
        iframe.style.display = "block";
        poster.style.display = "none";
        playBtn.style.display = "none";
      }
    };

    window.stopTrailerPlayer = function() {
      const iframe = document.getElementById("dtIframe");
      const poster = document.getElementById("dtPoster");
      const playBtn = document.getElementById("dtPlayBtn");
      if (iframe) {
        iframe.src = "";
        iframe.style.display = "none";
      }
      if (poster) poster.style.display = "block";
      if (playBtn) playBtn.style.display = window.currentTrailerYtId ? "flex" : "none";
    };

    window.openDetail = function(idx) {
      const list = window.currentMoviesList || window.allMoviesData || [];
      const m = list[idx];
      if (!m) return;

      lastScrollPos = window.scrollY || window.pageYOffset;

      const title = m.title || m.title_te || "Untitled Movie";
      const hEl = document.getElementById("dtHeading");
      if (hEl) hEl.innerText = title + " HDRip [Telugu]";

      const infoEl = document.getElementById("dtInfoTitle");
      if (infoEl) infoEl.innerText = title.toUpperCase() + " MOVIE INFORMATION";

      const descEl = document.getElementById("dtDesc");
      if (descEl) descEl.innerText = m.description || "Details updating shortly...";

      const pEl = document.getElementById("dtPoster");
      if (pEl) pEl.src = m.poster || (m.youtubeId ? `https://img.youtube.com/vi/${m.youtubeId}/hqdefault.jpg` : "/logo.png");
      window.currentTrailerYtId = m.youtubeId || m.ytId || ;
      window.stopTrailerPlayer();

      const platEl = document.getElementById("dtPlatform");
      if (platEl) platEl.innerText = m.platform || "OTT";

      const relEl = document.getElementById("dtRelease");
      if (relEl) relEl.innerText = m.releaseDate || "Available Now";

      const ottBtn = document.getElementById("dtOttBtn");
      const ottText = document.getElementById("dtOttText");
      const plat = m.platform || "OTT";
      const isRealOtt = plat && plat.toLowerCase() !== "youtube" && plat.toLowerCase() !== "ott";

      if (ottBtn) {
        if (isRealOtt) {
          ottBtn.style.display = "flex";
          if (ottText) ottText.innerText = "Watch on " + plat;
          if (m.ottLink && m.ottLink.startsWith("http")) {
            ottBtn.href = m.ottLink;
          } else {
            ottBtn.href = "https://www.google.com/search?q=" + encodeURIComponent(title + " " + plat + " watch online");
          }
        } else {
          ottBtn.style.display = "none";
        }
      }

      const trBtn = document.getElementById("dtTrailerBtn");
      if (trBtn) {
        const yt = m.youtubeId || m.ytId;
        if (yt) {
          trBtn.style.display = "flex";
          trBtn.href = "https://www.youtube.com/watch?v=" + yt;
        } else {
          trBtn.style.display = "none";
        }
      }

      document.getElementById("gridView").style.display = "none";
      document.getElementById("detailView").style.display = "block";
      window.scrollTo(0, 0);

      // Push history state so phone back button works
      if (window.location.hash !== "#movie") {
        history.pushState({ inDetail: true }, "", "#movie");
      }
    };

    window.goBackToGrid = function() {
      if (typeof window.stopTrailerPlayer === function) window.stopTrailerPlayer();
      if (window.location.hash === "#movie") {
        history.back();
      } else {
        document.getElementById("detailView").style.display = "none";
        document.getElementById("gridView").style.display = "block";
        window.scrollTo(0, lastScrollPos);
      }
    };

    window.addEventListener("popstate", function() {
      const dv = document.getElementById("detailView");
      if (dv && dv.style.display !== "none") {
        dv.style.display = "none";
        const gv = document.getElementById("gridView");
        if (gv) gv.style.display = "block";
        window.scrollTo(0, lastScrollPos);
      }
    });

  