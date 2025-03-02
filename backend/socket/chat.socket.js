const Chat = require("../modules/chat.module");
const Case = require("../modules/cases.module");
const axios = require("axios");
const mongoose = require("mongoose");

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("🔗 Client connected:", socket.id);
        // console.log(Date.now());

        // **User joins a room**
        socket.on("joinRoom", (caseId) => {
            if (caseId) {
                socket.join(caseId);
                console.log(`✅ User joined case: ${caseId}`);
            }
        });

        // **Handle sending messages**
        socket.on("sendMessage", async ({ caseId, patientId, doctorId , sender, message }, callback) => {
            try {
                console.log(`📩 Message from ${sender}: "${message}"`);
                console.log()

                // **1. If `caseId` is missing, create a new Case & Chat**
                if (!caseId) {
                    console.log("⚠️ No caseId provided, creating a new case...");
                    // const doctorObjectId = new mongoose.Types.ObjectId(doctorId);
                    // const patientObjectId = new mongoose.Types.ObjectId(patientId);

                    // **Create New Case**
                    const newCase = new Case({ patient_id: patientId, doctor_id: doctorId });
                    await newCase.save();

                    // **Create New Chat**
                    const newChat = new Chat({ _id: newCase._id, messages: [] });
                    await newChat.save();

                    caseId = newCase._id.toString();
                    console.log(`✅ New Case & Chat Created: ${caseId}`);
                }

                // **2. Join the Case Room**
                socket.join(caseId);

                // **3. Fetch or Create Chat**
                let chat = await Chat.findById(caseId);
                if (!chat) {
                    console.log(`⚠️ No chat found, creating a new one...`);
                    chat = new Chat({ _id: caseId, messages: [] });
                    await chat.save();
                }

                // **4. Store User's Message**
                chat.messages.push({ sender, message });
                await chat.save();
                console.log(`💾 Message Stored: "${message}"`);

                // **5. Emit User's Message to Frontend**
                // io.to(caseId).emit("newMessage", { sender, message, timestamp: Date.now() });

                // **6. Return `caseId` in callback (for new cases)**
                if (callback) {
                    callback({ caseId, success: true });
                }

                // **7. If Doctor sends a message, get AI response**
                if (sender === "Doctor") {
                    console.log(`🤖 Sending to AI: "${message}"`);
                    const flaskAPI = "https://4238-2405-201-27-e843-4804-28b1-e233-734b.ngrok-free.app/chat";

                    try {
                        const { data } = await axios.post(flaskAPI, { input: message , session_id: caseId });
                        if (data) {
                            const botMessage = data.answer;

                            console.log(`🤖 AI Response: "${botMessage}"`);

                            // **8. Store Bot's Message**
                            chat.messages.push({ sender: "Bot", message: botMessage });
                            await chat.save();
                            console.log(`💾 Bot Message Stored: "${botMessage}"`);

                            // **9. Emit Bot's Message to Frontend**
                            io.to(caseId).emit("newMessage", { sender: "Bot", message: botMessage, timestamp: Date.now() });
                            console.log(`✅ AI Response Sent to Frontend: "${botMessage}"`);
                        }else{
                            console.error("❌ AI API Error:", data);
                        }

                    } catch (flaskError) {
                        console.error("❌ AI API Error:", flaskError.message);
                    }
                }
            } catch (err) {
                console.error("❌ Error Processing Message:", err);
                if (callback) {
                    callback({ error: err.message, success: false });
                }
            }
        });

        // **User disconnects**
        socket.on("disconnect", () => {
            console.log("🔴 Client disconnected:", socket.id);
        });
    });
};
