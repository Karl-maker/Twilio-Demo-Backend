const Twilio = require('twilio');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000; // Set your desired port

// Initialize Twilio client with your credentials
const YOUR_TWILIO_ACCOUNT_SID = process.env.YOUR_TWILIO_ACCOUNT_SID;
const YOUR_TWILIO_AUTH_TOKEN = process.env.YOUR_TWILIO_AUTH_TOKEN;
const YOUR_TWILIO_PHONE_NUMBER = process.env.YOUR_TWILIO_PHONE_NUMBER;

const twilioClient = Twilio(YOUR_TWILIO_ACCOUNT_SID, YOUR_TWILIO_AUTH_TOKEN);

// Middleware to parse JSON and enable CORS
app.use(express.json());
app.use(cors());

// Define a route for sending SMS
app.post('/send-sms', async (req, res) => {
  try {
    const { number, lesson } = req.body;

    if (!number || !lesson) {
      return res.status(400).json({ error: "Missing 'number' or 'lesson' in the request body" });
    }

    // Use Twilio to send the SMS
    const message = await twilioClient.messages.create({
      body: lesson,
      from: YOUR_TWILIO_PHONE_NUMBER,
      to: number,
    });

    // Optionally, you can handle success or show a confirmation message
    console.log("SMS sent successfully");
    res.status(200).json({ message: "SMS sent successfully", messageId: message.sid });
  } catch (error) {
    // Handle errors and send an error response
    console.error("Error sending SMS:", error);
    res.status(500).json({ error: "Failed to send SMS" });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
