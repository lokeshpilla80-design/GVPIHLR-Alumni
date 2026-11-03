console.log("1. Starting require test...");
try {
  console.log("Loading express...");
  const express = require("express");
  console.log("Loading mongoose...");
  const mongoose = require("mongoose");
  console.log("Loading dns...");
  const dns = require("dns");
  console.log("Loading cors...");
  const cors = require("cors");
  console.log("Loading dotenv...");
  require("dotenv").config({ path: '../.env' });

  console.log("Setting dns servers...");
  dns.setServers(["8.8.8.8", "8.8.4.4"]);

  console.log("Express app init...");
  const app = express();

  console.log("Loading routes...");
  const authRoutes = require("../routes/authRoutes");
  console.log("Loaded authRoutes");
  const contentRoutes = require("../routes/contentRoutes");
  console.log("Loaded contentRoutes");
  const alumniStackRoutes = require("../routes/alumniStackRoutes");
  console.log("Loaded alumniStackRoutes");
  const eventRoutes = require("../routes/eventRoutes");
  console.log("Loaded eventRoutes");
  const contactRoutes = require("../routes/contactRoutes");
  console.log("Loaded contactRoutes");
  const heritageRoutes = require("../routes/heritageRoutes");
  console.log("Loaded heritageRoutes");
  const galleryRoutes = require("../routes/galleryRoutes");
  console.log("Loaded galleryRoutes");
  const sponsorRoutes = require("../routes/sponsorRoutes");
  console.log("Loaded sponsorRoutes");
  const notificationRoutes = require("../routes/notificationRoutes");
  console.log("Loaded notificationRoutes");
  const entrepreneurRoutes = require("../routes/entrepreneurRoutes");
  console.log("Loaded entrepreneurRoutes");

  console.log("Require test completed successfully!");
} catch (e) {
  console.error("CRASHED:", e);
}
