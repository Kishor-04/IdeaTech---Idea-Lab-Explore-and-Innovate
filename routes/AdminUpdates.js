import express from "express";
import multer from "multer";
import path from "path";
import { Parser } from "json2csv";
import pdf from "html-pdf";

// files import
import Newsletter from "../models/Newsletter.js"; // Ensure the '.js' extension is used for ESM

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: File upload only supports images!");
  },
}).fields([
  { name: "poster", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]);

router.get("/admin", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10; // Fetch 10 newsletters per page
  try {
    const newsletters = await Newsletter.find({})
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Newsletter.countDocuments();
    res.render("admin", { newsletters, currentPage: page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Error fetching newsletters:", error);
    res.status(500).send("Error fetching newsletters");
  }
});


router.get("/admin/export-csv/:id", async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).send("Newsletter not found");
    }

    const rsvps = newsletter.rsvps;

    if (rsvps.length > 0) {
      const filteredRsvps = rsvps.map((rsvp) => ({
        studentName: rsvp.studentName,
        studentEmail: rsvp.studentEmail,
      }));

      const fields = ["studentName", "studentEmail"];
      const csvParser = new Parser({ fields });
      const csv = csvParser.parse(filteredRsvps);

      res.header("Content-Type", "text/csv");
      res.attachment("rsvps.csv");
      return res.send(csv);
    } else {
      return res.status(400).send("No RSVPs available to export");
    }
  } catch (error) {
    console.error("Error exporting RSVPs to CSV:", error);
    res.status(500).send("Error exporting RSVPs");
  }
});

router.get("/admin/export-pdf/:id", async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).send("Newsletter not found");
    }

    const rsvps = newsletter.rsvps;
    const html = `
      <h1>RSVP List</h1>
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Student Email</th>
          </tr>
        </thead>
        <tbody>
          ${rsvps
            .map(
              (rsvp) => `
            <tr>
              <td>${rsvp.studentName}</td>
              <td>${rsvp.studentEmail}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    `;

    pdf.create(html).toBuffer((err, buffer) => {
      if (err) return res.status(500).send("Error creating PDF");
      res.header("Content-Type", "application/pdf");
      res.attachment("rsvps.pdf");
      res.send(buffer);
    });
  } catch (error) {
    console.error("Error exporting RSVPs to PDF:", error);
    res.status(500).send("Error exporting RSVPs");
  }
});

router.get("/create-newsletter", (req, res) => {
  res.render("createNewsletter");
});  

router.post("/create-newsletter", upload, async (req, res) => {
  const {
    title,
    description,
    theme,
    guidelines,
    prizes,
    keyDates,
    registrationLink,
    contactInfo,
    capacity,
  } = req.body;

  if (
    !title ||
    !description ||
    !req.files.poster ||
    !theme ||
    !guidelines ||
    !prizes ||
    !keyDates ||
    !registrationLink ||
    !contactInfo
  ) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const newNewsletter = new Newsletter({
      title,
      description,
      theme,
      guidelines,
      prizes,
      keyDates,
      registrationLink,
      contactInfo,
      poster: `/uploads/${req.files.poster[0].filename}`,  // Updated
      banner: req.files.banner
      ? `/uploads/${req.files.banner[0].filename}`        // Updated
      : null,
      capacity: capacity || 50,
    });

    await newNewsletter.save();
    res.redirect("/admin");
  } catch (error) {
    console.error("Error saving newsletter:", error);
    res.status(500).send("Error adding newsletter");
  }
});

router.post("/admin/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Newsletter.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).send("Newsletter not found");
    }

    console.log(`Newsletter with ID ${id} deleted successfully.`);
    res.redirect("/admin");
  } catch (error) {
    console.error("Error deleting newsletter:", error);
    res.status(500).send("Error deleting newsletter");
  }
});

export default router;
