const fs = require("fs");

const initialItems = [
  // --- 🎞 VINTAGE CLASSICS ---
  {
    title: "Mayabazar (1957)",
    category: "classics",
    type: "classics",
    poster: "https://upload.wikimedia.org/wikipedia/en/8/86/Mayabazar_%281957_film%29.jpg",
    youtubeId: "W7P9p0_fAoo",
    platform: "YouTube",
    ottUrl: "https://www.youtube.com/watch?v=W7P9p0_fAoo",
    releaseDate: "1957",
    desc: "Legendary mythological epic starring SV Ranga Rao, NTR, ANR, and Savitri."
  },
  {
    title: "Jagadeka Veerudu Athiloka Sundari (1990)",
    category: "classics",
    type: "classics",
    poster: "https://upload.wikimedia.org/wikipedia/en/8/87/Jagadeka_Veerudu_Athiloka_Sundari.jpg",
    youtubeId: "L9YhW50yV5Y",
    platform: "YouTube",
    ottUrl: "",
    releaseDate: "1990",
    desc: "Chiranjeevi and Sridevi starrer timeless fantasy blockbuster directed by K. Raghavendra Rao."
  },
  {
    title: "Sagara Sangamam (1983)",
    category: "classics",
    type: "classics",
    poster: "https://upload.wikimedia.org/wikipedia/en/9/91/Sagara_Sangamam.jpg",
    youtubeId: "V_J_U6tqj5E",
    platform: "YouTube",
    ottUrl: "",
    releaseDate: "1983",
    desc: "K. Viswanath's masterpiece with unforgettable dance performances by Kamal Haasan."
  },
  {
    title: "Shiva (1989)",
    category: "classics",
    type: "classics",
    poster: "https://upload.wikimedia.org/wikipedia/en/a/a2/Shiva_%281989_Telugu_film%29.jpg",
    youtubeId: "2Xy3KzZ4nJw",
    platform: "YouTube",
    ottUrl: "",
    releaseDate: "1989",
    desc: "Trendsetting gangster action drama directed by Ram Gopal Varma starring Akkineni Nagarjuna."
  },
  {
    title: "Aditya 369 (1991)",
    category: "classics",
    type: "classics",
    poster: "https://upload.wikimedia.org/wikipedia/en/e/eb/Aditya_369.jpg",
    youtubeId: "gGgP_yE_bE8",
    platform: "YouTube",
    ottUrl: "",
    releaseDate: "1991",
    desc: "India's pioneer science-fiction time travel classic starring Nandamuri Balakrishna."
  },

  // --- 🎵 RETRO MELODIES (MUSIC) ---
  {
    title: "Priye Charuseele - Geethanjali (1989)",
    category: "music",
    type: "music",
    poster: "https://upload.wikimedia.org/wikipedia/en/d/d4/Geethanjali_1989_poster.jpg",
    youtubeId: "6iR_jL1G7yU",
    platform: "YouTube",
    ottUrl: "",
    releaseDate: "1989",
    desc: "Evergreen romantic melody composed by Ilaiyaraaja with SPB's magical vocals."
  },
  {
    title: "Botany Pathamundi - Shiva (1989)",
    category: "music",
    type: "music",
    poster: "https://upload.wikimedia.org/wikipedia/en/a/a2/Shiva_%281989_Telugu_film%29.jpg",
    youtubeId: "vD2G6Y7M8qE",
    platform: "YouTube",
    ottUrl: "",
    releaseDate: "1989",
    desc: "Youth anthem composed by Ilaiyaraaja that defined Telugu college vibes."
  },
  {
    title: "Abbani Teeyani Debba - JVKS (1990)",
    category: "music",
    type: "music",
    poster: "https://upload.wikimedia.org/wikipedia/en/8/87/Jagadeka_Veerudu_Athiloka_Sundari.jpg",
    youtubeId: "jXN_U8t7qY4",
    platform: "YouTube",
    ottUrl: "",
    releaseDate: "1990",
    desc: "Iconic duet by SPB and Chithra featuring Megastar Chiranjeevi and Sridevi."
  },
  {
    title: "Lalitha Priya Kamalam - Rudraveena (1988)",
    category: "music",
    type: "music",
    poster: "https://upload.wikimedia.org/wikipedia/en/1/1a/Rudraveena_film_poster.jpg",
    youtubeId: "5F9Z4zB6yQ0",
    platform: "YouTube",
    ottUrl: "",
    releaseDate: "1988",
    desc: "Carnatic classical melody composed by Ilaiyaraaja with national award-winning composition."
  },

  // --- 🎭 CULT COMEDIES ---
  {
    title: "Venky Train Comedy Episode (2004)",
    category: "comedy",
    type: "comedy",
    poster: "https://upload.wikimedia.org/wikipedia/en/9/9d/Venky_poster.jpg",
    youtubeId: "s3G9k_mE_Xg",
    platform: "YouTube",
    ottUrl: "",
    releaseDate: "2004",
    desc: "Legendary Gajala & Bhattu comedy riot featuring Brahmanandam and Ravi Teja."
  },
  {
    title: "Nuvvu Naaku Nachav Comedy Riot (2001)",
    category: "comedy",
    type: "comedy",
    poster: "https://upload.wikimedia.org/wikipedia/en/8/89/Nuvvu_Naaku_Nachav.jpg",
    youtubeId: "K1p8h6t-8nI",
    platform: "YouTube",
    ottUrl: "",
    releaseDate: "2001",
    desc: "Trivikram Srinivas signature witty punches featuring Venkatesh, Brahmanandam, and MS Narayana."
  },
  {
    title: "Malliswari - Padmanabha Simha Scene (2004)",
    category: "comedy",
    type: "comedy",
    poster: "https://upload.wikimedia.org/wikipedia/en/5/52/Malliswari_2004_poster.jpg",
    youtubeId: "7c6Q2k9x8Jw",
    platform: "YouTube",
    ottUrl: "",
    releaseDate: "2004",
    desc: "Hilarious interaction scenes with Brahmanandam as King of Ooty."
  },
  {
    title: "Race Gurram - Kill Bill Pandey Scene (2014)",
    category: "comedy",
    type: "comedy",
    poster: "https://upload.wikimedia.org/wikipedia/en/5/58/Race_Gurram_poster.jpg",
    youtubeId: "9gN_Z8r8p_Y",
    platform: "YouTube",
    ottUrl: "",
    releaseDate: "2014",
    desc: "Cult police comedy act by Brahmanandam alongside Allu Arjun."
  }
];

fs.writeFileSync("public/curated_content.json", JSON.stringify(initialItems, null, 2));
console.log("✅ public/curated_content.json లో డేటా విజయవంతంగా సేవ్ అయ్యింది!");
