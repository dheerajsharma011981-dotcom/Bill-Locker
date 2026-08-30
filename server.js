const express = require('express');
const mongoose = require('mongoose'); 
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔌 आपकी मुफ़्त क्लाउड तिजोरी का लिंक
const DATABASE_URL = "mongodb+srv://dheerajsharma011981_db_user:IKy1PPgLAZnSj3yB@cluster0.ungpjcc.mongodb.net/BillLockerDB?appName=cluster0";

mongoose.connect(DATABASE_URL)
.then(() => console.log("💪 जादुई क्लाउड तिजोरी (MongoDB Atlas) सफलतापूर्वक कनेक्ट हो गई है!"))
.catch((err) => console.error("❌ क्लाउड डेटाबेस कनेक्ट करने में दिक्कत आई:", err));

// 📝 डेटाबेस का नियम
const UserSchema = new mongoose.Schema({
    phone: String,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 🔐 स्मार्ट लॉगिन रूट (किसी भी फोन से पुराना बिल खोलने के लिए)
app.post('/api/login', async (req, res) => {
    const { phone } = req.body;
    
    if (!phone || phone.length !== 10) {
        return res.status(400).json({ success: false, message: "Please enter a valid 10-digit number!" });
    }

    try {
        // 🔍 स्टेप 1: क्लाउड तिजोरी में चेक करो कि यह नंबर पहले से है या नहीं
        let existingUser = await User.findOne({ phone: phone });

        if (existingUser) {
            // 🔓 अगर नंबर मिल गया (पुराना ग्राहक है)
            console.log(`\n🎉 [पुराना ग्राहक वापस आया!]`);
            console.log(`📱 नंबर किसी भी फोन से लॉगिन हुआ: ${phone}`);
            return res.json({ 
                success: true, 
                message: "Welcome back! Fetching your bills...",
                isNewUser: false 
            });
        } else {
            // 🆕 अगर नंबर नहीं मिला (नया ग्राहक है), तो नया अकाउंट बनाओ
            const newUser = new User({ phone: phone });
            await newUser.save();
            console.log(`\n🎉 [नया ग्राहक रजिस्टर्ड हुआ!]`);
            console.log(`☁️ नया नंबर हमेशा के लिए क्लाउड पर सेव हुआ: ${phone}`);
            return res.json({ 
                success: true, 
                message: "Account created successfully!",
                isNewUser: true 
            });
        }
    } catch (err) {
        console.error("❌ डेटाबेस एरर आया:", err);
        res.status(500).json({ success: false, message: "Server error occurred!" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 पार्टनर, हमारा क्लाउड सर्वर ऑन हो गया है!`);
});
