const express = require('express');
const mongoose = require('mongoose'); 
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

// 💾 सुधरा हुआ रूट: यह सिर्फ एआई द्वारा निकाले गए टेक्स्ट को डेटाबेस में सेव करेगा
app.post('/api/save-bill', async (req, res) => {
    const { phone, billDetails } = req.body;
    try {
        const newBill = new Bill({
            phone: phone,
            billDetails: billDetails || "No text found."
        });
        await newBill.save();
        res.json({ success: true, message: "Saved to Cloud DB!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Database Save Error!" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 लाइटवेट सर्वर ऑन हो गया है!`);
});
