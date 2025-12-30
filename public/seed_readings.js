import { db, auth } from "./app.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const sampleReadings = [
    { title: "Daily Fortune", category: "Daily", result: "Great luck in career today. Avoid risky investments." },
    { title: "Love Compatibility Analysis", category: "Love", result: "High compatibility with Rat and Dragon. Good time for dates." },
    { title: "Career Path Guidance", category: "Career", result: "A promotion is likely in the near future. Keep working hard." },
    { title: "Weekly Health Outlook", category: "Health", result: "Pay attention to digestive health. Drink more water." },
    { title: "Wealth Prediction 2025", category: "Wealth", result: "Steady income growth. Good year for savings." }
];

export async function seedReadingLogs() {
    const user = auth.currentUser;

    if (!user) {
        alert("Please log in first to seed reading logs for your account.");
        return;
    }

    await addReadingLogsForUser(user.uid);
    alert("Successfully added sample reading logs to your account!");
}

export async function seedAllUsersReadingLogs() {
    try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);

        if (snapshot.empty) {
            alert("No users found in the database.");
            return;
        }

        let count = 0;
        for (const doc of snapshot.docs) {
            await addReadingLogsForUser(doc.id);
            count++;
        }

        console.log(`Seeded reading logs for ${count} users.`);
        alert(`Successfully seeded reading logs for all ${count} users!`);

    } catch (error) {
        console.error("Error seeding all users reading logs:", error);
        alert("Error: " + error.message);
    }
}

async function addReadingLogsForUser(uid) {
    const readingsRef = collection(db, "reading_logs");

    // Insert sample readings with different timestamps
    for (let i = 0; i < sampleReadings.length; i++) {
        const reading = sampleReadings[i];
        const date = new Date();
        date.setDate(date.getDate() - i * 2); // Spread dates out

        await addDoc(readingsRef, {
            uid: uid,
            title: reading.title,
            category: reading.category,
            result: reading.result,
            timestamp: date.toISOString()
        });
    }
}
