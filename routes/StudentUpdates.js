import express from "express";
import Newsletter from "../models/Newsletter.js";
import cors from 'cors';

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(cors());

export const event_id = async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).send("Event not found");
    }

    // Render the event details page with the newsletter data and rsvps
    res.render("part_Details", { rsvps: newsletter.rsvps });
  } catch (error) {
    console.er;
    ror("Error fetching event details:", error);
    res.status(500).send("Error fetching event details");
  }
}

// Student event details route
export const student_event_id = async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).send("Event not found");
    }

    // Render the event details page with the newsletter data
    res.render("eventDetails", { newsletter });
  } catch (error) {
    console.error("Error fetching event details:", error);
    res.status(500).send("Error fetching event details");
  }
}

// RSVP Submission Route
export const rsvp_id = async (req, res) => {
  const { studentName, studentEmail } = req.body;  

  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).send("Event not found");
    }

    // Check if the capacity has been reached
    if (newsletter.rsvps.length >= newsletter.capacity) {
      return res.status(400).send("Capacity reached. You cannot RSVP.");
    }

    newsletter.rsvps.push({ studentName, studentEmail });
    await newsletter.save();

    res.status(200).send("RSVP saved successfully");
  } catch (error) {
    console.error("Error saving RSVP:", error);
    res.status(500).send("Error saving RSVP");
  }
};




// router.get('/students', async (req, res) => {
//   try {
//     const newsletters = await Newsletter.find(); // Fetch the newsletters from your database
//     console.log(newsletters);

//     res.render('student', { newsletters: newsletters || [] }); // Pass the newsletters to the template
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server Error');
//   }
// });

export const details = (req,res)=>{
  res.render("part_Details");
}

