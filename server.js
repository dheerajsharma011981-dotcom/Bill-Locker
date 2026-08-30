const express = require('express');
const mongoose = require('mongoose'); 
const path = require('path');
const multer = require('multer'); // फोटो अपलोड के लिए
const Tesseract = require('tesseract.js'); // असली AI OCR
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// फोटो को अस्थाई रूप से सेव करने की सेटिंग
const upload = multer({ dest: 'uploads/' });

// 🔌 आपकी मुफ़्त क्लाउड तिजोरी का लिंक
const DATABASE_URL = "mongodb+srv://dheerajsharma011981_db_user:IKy1PPgLAZnSj3yB@cluster0.ungpjcc.mongodb.net/BillLockerDB?appName=cluster0";

mongoose.connect(DATABASE_URL)
.then(() => console.log("💪 जादुई क्लाउड तिजोरी सफलतापूर्वक कनेक्ट हो गई है!"))
.catch((err) => console.error("❌ क्लाउड डेटाबेस एरर:", err));

// 📝 डेटाबेस का नया नियम (बिल डिटेल्स के साथ)
const BillSchema = new mongoose.Schema({
    phone: String,
    billDetails: String,
    createdAt: { type: Date, default: Date.now }
});
const Bill = mongoose.model('Bill', BillSchema);

const UserSchema = new mongoose.Schema({
    phone: String,
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 🔐 लॉगिन रूट
app.post('/api/login', async (req, res) => {
    const { phone } = req.body;
    if (!phone || phone.length !== 10) return res.status(400).json({ success: false, message: "Invalid number!" });

    try {
        let existingUser = await User.findOne({ phone: phone });
        if (!existingUser) {
            const newUser = new User({ phone: phone });
            await newUser.save();
        }
        res.json({ success: true, message: "Login successful!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error!" });
    }
});

// 📸 असली AI मैजिक स्कैन रूट (यह फोटो से टेक्स्ट निकालेगा)
app.post('/api/scan-bill', upload.single('billPhoto'), async (req, res) => {
    const { phone } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: "No photo uploaded!" });

    console.log("🔄 AI बिल को स्कैन कर रहा है...");

    try {
        // Tesseract AI फोटो को पढ़ रहा है
        const result = await Tesseract.recognize(req.file.path, 'eng');
        const extractedText = result.data.text;

        console.log("✨ AI ने बिल से यह टेक्स्ट निकाला:\n", extractedText);

        // डेटाबेस में बिल का टेक्स्ट सुरक्षित सेव करना
        const newBill = new Bill({
            phone: phone,
            billDetails: extractedText
        });
        await newBill.save();

        res.json({ 
            success: true, 
            message: "Bill scanned and saved by AI!", 
            details: extractedText 
        });
    } catch (error) {
        console.error("❌ AI स्कैनिंग फेल हुई:", error);
        res.status(500).json({ success: false, message: "AI Scan failed!" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 पार्टनर, हमारा AI क्लाउड सर्वर ऑन हो गया है!`);
});
