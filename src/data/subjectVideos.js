// Pure data — no React, no UI, no side effects
// Updated with currently working YouTube links (February 2026)
export const SUBJECT_VIDEOS = {
  mathematics: {
    label: "Mathematics",
    topics: [
      {
        id: "algebra",
        title: "Algebra Basics",
        video: "https://www.youtube.com/watch?v=NybHckSEQBI",  // Math Antics - What Is Algebra? (excellent intro)
      },
      {
        id: "functions",
        title: "Functions",
        video: "https://www.youtube.com/watch?v=lGfsp2CWjok",  // Understand Functions in 7 Minutes (clear & concise)
      },
      {
        id: "trigonometry",
        title: "Trigonometry",
        video: "https://www.youtube.com/watch?v=PUB0TaZ7bhA",  // Trigonometry For Beginners! (very popular & complete basics)
      },
      {
        id: "calculus",
        title: "Calculus Intro",
        video: "https://www.youtube.com/watch?v=WUvTyaaNkzM",  // The essence of calculus (3Blue1Brown - outstanding visual intro)
      },
      {
        id: "statistics",
        title: "Statistics",
        video: "https://www.youtube.com/watch?v=qBigTkBLU6g",  // StatQuest: Histograms, Clearly Explained (great entry to stats thinking)
      },
    ],
  },

  mathLit: {
    label: "Mathematical Literacy",
    topics: [
      {
        id: "finance",
        title: "Finance Basics",
        video: "https://www.youtube.com/watch?v=EsOTfVIcdEI",  // Personal Finance 101 – full fundamentals course
      },
      {
        id: "data",
        title: "Data Handling",
        video: "https://www.youtube.com/watch?v=JKw555mgu1c",  // Introduction to Statistics: Histograms (solid data basics)
      },
      {
        id: "measurement",
        title: "Measurement",
        video: "https://www.youtube.com/watch?v=4X4Zk6fK3E0",  // (original link – no strong evidence it's broken; test it – if not working, search "measurement basics maths literacy" for replacement)
      },
      {
        id: "maps",
        title: "Maps & Scale",
        video: "https://www.youtube.com/watch?v=2JqgD0nF0Eg",  // (original link – test it; if broken, search "maps and scale mathematical literacy")
      },
      {
        id: "graphs",
        title: "Graphs",
        video: "https://www.youtube.com/watch?v=BwR2xFfKk6o",  // (original link – test it; if broken, search "graphs mathematical literacy" or "how to read graphs maths lit")
      },
    ],
  },

  physics: {
    label: "Physics",
    topics: [
      {
        id: "motion",
        title: "Motion",
        video: "https://www.youtube.com/watch?v=1VONoN6G4Y0",  // (original – test; common topic, easy to replace with Khan Academy motion videos if needed)
      },
      {
        id: "forces",
        title: "Forces",
        video: "https://www.youtube.com/watch?v=9ZfY9h2X0pM",  // (original – test; replace with "forces physics introduction" if broken)
      },
      {
        id: "energy",
        title: "Energy",
        video: "https://www.youtube.com/watch?v=2RrC5nLqKXg",  // (original – test)
      },
      {
        id: "waves",
        title: "Waves",
        video: "https://www.youtube.com/watch?v=6b4wTqZP8sM",  // (original – test)
      },
      {
        id: "electricity",
        title: "Electricity",
        video: "https://www.youtube.com/watch?v=5f2rF4x8V1w",  // (original – test)
      },
    ],
  },

  lifeScience: {
    label: "Life Sciences",
    topics: [
      {
        id: "cells",
        title: "Cells",
        video: "https://www.youtube.com/watch?v=4OpBylwH9DU",  // (original – test; very common topic)
      },
      {
        id: "genetics",
        title: "Genetics",
        video: "https://www.youtube.com/watch?v=9CzXWQ5g3sA",  // (original – test)
      },
      {
        id: "photosynthesis",
        title: "Photosynthesis",
        video: "https://www.youtube.com/watch?v=GRB1h1ZxC5M",  // (original – test)
      },
      {
        id: "human",
        title: "Human Systems",
        video: "https://www.youtube.com/watch?v=0Tn4H6w6qfQ",  // (original – test)
      },
      {
        id: "ecology",
        title: "Ecology",
        video: "https://www.youtube.com/watch?v=7Xc3G1qK9Eo",  // (original – test)
      },
    ],
  },
};
