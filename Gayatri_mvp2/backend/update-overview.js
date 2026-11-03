const mongoose = require("mongoose");
const ContentSection = require("./models/ContentSection");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log("Connected to MongoDB for update-overview block");

  const bodyContent = `Established in August 2021, Gayatri Grads Association is a multifaceted hub that abridges the Gayatri Vidya Parishad group of institutions and its graduates by carrying the legacy of the past, embodying the spirit of the present, and paving the way for the future.

• It contributes to the personal and professional growth of alumni, supports the institution's overall vision and development, and helps to create a strong and vibrant community.

• Gayatri Vidya Parishad has an excellent alumni army who is striving hard to fly the flag of GVP across the globe.

The Gayatri Grads Association is an alumni body that covers four institutions of GVP:
• Gayatri Vidya Parishad College for Degree and PG Courses (Autonomous)
• Gayatri Vidya Parishad College of Engineering (Autonomous)
• Gayatri Vidya Parishad College of Engineering for Women (Autonomous)
• Gayatri Vidya Parishad Institute of Healthcare and Medical Technology`;

  await ContentSection.findOneAndUpdate(
    { sectionId: 'overview' },
    { 
      title: 'About Us',
      body: bodyContent
    },
    { upsert: true, new: true }
  );

  console.log("Overview successfully updated!");
  process.exit();
})
.catch(err => {
  console.error(err);
  process.exit(1);
});
