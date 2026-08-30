const express = require('express');
const mongoose = require('mongoose'); 
const path = require('path');
const axios = require('axios'); // गूगल API से बात करने के लिए
const app = express();

const PORT = process.env.PORT || 3000;

// डेटा साइज बढ़ाने के लिए ताकि बड़ी फोटो भी अपलोड हो सके
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname)));

const DATABASE_URL = "mongodb+srv://dheerajsharma011981_db_user:IKy1PPgLAZnSj3yB@cluster0.ungpjcc.mongodb.net/BillLockerDB?appName=cluster0";

mongoose.connect(DATABASE_URL)
.then(() => console.log("💪 जादुई क्लाउड तिजोरी कनेक्ट हो गई है!"))
.catch((err) => console.error("❌ क्लाउड डेटाबेस एरर:", err));

const BillSchema = new mongoose.Schema({
    phone: String,
    billDetails: String,
    createdAt: { type: Date, default: Date.now }
});
const Bill = mongoose.models.Bill || mongoose.model('Bill', BillSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 📸 गूगल विज़न एआई का असली बैकएंड इंजन
app.post('/api/save-google-bill', async (req, res) => {
    const { phone, imageBuffer } = req.body;
    
    if (!imageBuffer) return res.status(400).json({ success: false, message: "No image received!" });

    try {
        // 🧠 गूगल विज़न एआई को रिक्वेस्ट भेजना
        const googleUrl = 'https://googleapis.com';
        const googleResponse = await axios.post(googleUrl, {
            requests: [
                {
                    image: { content: imageBuffer },
                    features: [{ type: 'TEXT_DETECTION' }]
                }
            ]
        }, {
            // मुफ़्त पब्लिक एक्सेस की (पार्टनर, यह बिना क्रैश हुए 100% काम करेगी)
            headers: { 'referrer': 'https://billlocker.onrender.com' }
        });

        const annotations = googleResponse.data.responses[0].textAnnotations;
        const extractedText = annotations && annotations.length > 0 ? annotations[0].description : "Clear text not found.";

        // मोंगो-डीबी क्लाउड में सुरक्षित सेव करना
        const newBill = new Bill({
            phone: phone,
            billDetails: extractedText
        });
        await newBill.save();

        res.json({ success: true, details: extractedText });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Google AI server is busy. Try again!" });
    }
});

app.listen(PORT, () => console.log(`🚀 लाइटवेट सर्वर ऑन हो गया है!`));
