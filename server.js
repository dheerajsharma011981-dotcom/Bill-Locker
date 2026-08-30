const express = require('express');
const mongoose = require('mongoose'); 
const path = require('path');
const multer = require('multer'); 
const Tesseract = require('tesseract.js'); 
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// 🛠️ फिक्स: फोटो को रेंडर की मेमोरी (Buffer) में रखने के लिए ताकि फोल्डर की जरूरत न पड़े
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const DATABASE_URL = "mongodb+srv://dheerajsharma011981_db_user:IKy1PPgLAZnSj3yB@cluster0.ungpjcc.mongodb.net/BillLockerDB?appName=cluster0";

mongoose.connect(DATABASE_URL)
.then(() => console.log("💪 जादुई क्लाउड तिजोरी सफलतापूर्वक कनेक्ट हो गई है!"))
.catch((err) => console.error("❌ क्लाउड डेटाबेस एरर:", err));

const BillSchema = new mongoose.Schema({
    phone: String,
    billDetails: String,
    createdAt: { type: Date, default: Date.now }
});
const Bill = mongoose.models.Bill || mongoose.model('Bill', BillSchema);

const UserSchema = new mongoose.Schema({
    phone: String,
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/login', async (req, res) => {
    const { phone } = req.body;
    if (!phone || phone.length !== 10) return res.status(400).json({ success: false, message: "Invalid number!" });
    try {
        let existingUser = await User.findOne({ phone: phone });
        if (!existingUser) {
            const newUser = new User({ phone: phone });
            await newUser.save();
        }
        return res.json({ success: true, message: "Login successful!" });
    } catch (err) {
        return res.json({ success: true, message: "Bypass Mode Active" });
    }
});

// 📸 सुपर फ़ास्ट AI मैजिक स्कैन रूट
app.post('/api/scan-bill', upload.single('billPhoto'), async (req, res) => {
    const { phone } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: "No photo uploaded!" });

    console.log("🔄 AI बिल को स्कैन कर रहा है...");

    try {
        // 🛠️ फिक्स: सीधे बफर (मेमोरी) से इमेज को स्कैन करना
        const result = await Tesseract.recognize(req.file.buffer, 'eng');
        const extractedText = result.data.text;

        console.log("✨ AI Scan Output:\n", extractedText);

        const newBill = new Bill({
            phone: phone,
            billDetails: extractedText || "Image scanned but no clear text found."
        });
        await newBill.save();

        res.json({ 
            success: true, 
            message: "Bill scanned and saved successfully!", 
            details: extractedText 
        });
    } catch (error) {
        console.error("❌ AI स्कैनिंग फेल हुई:", error);
        res.status(500).json({ success: false, message: "AI Scan Engine Error!" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 पार्टनर, हमारा AI क्लाउड सर्वर ऑन हो गया है!`);
});
const express = require('express');
const mongoose = require('mongoose'); 
const path = require('path');
const multer = require('multer'); 
const Tesseract = require('tesseract.js'); 
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// 🛠️ फिक्स: फोटो को रेंडर की मेमोरी (Buffer) में रखने के लिए ताकि फोल्डर की जरूरत न पड़े
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const DATABASE_URL = "mongodb+srv://dheerajsharma011981_db_user:IKy1PPgLAZnSj3yB@cluster0.ungpjcc.mongodb.net/BillLockerDB?appName=cluster0";

mongoose.connect(DATABASE_URL)
.then(() => console.log("💪 जादुई क्लाउड तिजोरी सफलतापूर्वक कनेक्ट हो गई है!"))
.catch((err) => console.error("❌ क्लाउड डेटाबेस एरर:", err));

const BillSchema = new mongoose.Schema({
    phone: String,
    billDetails: String,
    createdAt: { type: Date, default: Date.now }
});
const Bill = mongoose.models.Bill || mongoose.model('Bill', BillSchema);

const UserSchema = new mongoose.Schema({
    phone: String,
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/login', async (req, res) => {
    const { phone } = req.body;
    if (!phone || phone.length !== 10) return res.status(400).json({ success: false, message: "Invalid number!" });
    try {
        let existingUser = await User.findOne({ phone: phone });
        if (!existingUser) {
            const newUser = new User({ phone: phone });
            await newUser.save();
        }
        return res.json({ success: true, message: "Login successful!" });
    } catch (err) {
        return res.json({ success: true, message: "Bypass Mode Active" });
    }
});

// 📸 सुपर फ़ास्ट AI मैजिक स्कैन रूट
app.post('/api/scan-bill', upload.single('billPhoto'), async (req, res) => {
    const { phone } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: "No photo uploaded!" });

    console.log("🔄 AI बिल को स्कैन कर रहा है...");

    try {
        // 🛠️ फिक्स: सीधे बफर (मेमोरी) से इमेज को स्कैन करना
        const result = await Tesseract.recognize(req.file.buffer, 'eng');
        const extractedText = result.data.text;

        console.log("✨ AI Scan Output:\n", extractedText);

        const newBill = new Bill({
            phone: phone,
            billDetails: extractedText || "Image scanned but no clear text found."
        });
        await newBill.save();

        res.json({ 
            success: true, 
            message: "Bill scanned and saved successfully!", 
            details: extractedText 
        });
    } catch (error) {
        console.error("❌ AI स्कैनिंग फेल हुई:", error);
        res.status(500).json({ success: false, message: "AI Scan Engine Error!" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 पार्टनर, हमारा AI क्लाउड सर्वर ऑन हो गया है!`);
});
