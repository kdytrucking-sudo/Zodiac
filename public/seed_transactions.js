import { db, auth } from "./app.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const sampleTransactions = [
    { description: "Annual Membership Subscription", amount: 188.00, status: "Successful" },
    { description: "Personal Fortune Report", amount: 28.00, status: "Successful" },
    { description: "Monthly Premium Access", amount: 19.99, status: "Successful" },
    { description: "Zodiac Compatibility Guide", amount: 15.00, status: "Successful" },
    { description: "Feng Shui Consultation", amount: 88.00, status: "Pending" }
];

export async function seedTransactions() {
    const user = auth.currentUser;

    if (!user) {
        alert("Please log in first to seed transactions for your account.");
        return;
    }

    try {
        const transactionsRef = collection(db, "transactions");

        // Insert sample transactions with different timestamps
        for (let i = 0; i < sampleTransactions.length; i++) {
            const tx = sampleTransactions[i];
            const date = new Date();
            date.setDate(date.getDate() - i * 15); // Spread dates out

            await addDoc(transactionsRef, {
                uid: user.uid,
                description: tx.description,
                amount: tx.amount,
                status: tx.status,
                date: date.toISOString()
            });
        }

        console.log(`Successfully added ${sampleTransactions.length} transactions for user ${user.uid}`);
        alert("Successfully added sample transactions to your account!");

    } catch (error) {
        console.error("Error seeding transactions:", error);
        alert("Error seeding transactions: " + error.message);
    }
}

export async function seedAllUsersTransactions() {
    try {
        const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js");
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);

        if (snapshot.empty) {
            alert("No users found in the database.");
            return;
        }

        let count = 0;
        for (const doc of snapshot.docs) {
            await addTransactionsForUser(doc.id);
            count++;
        }

        console.log(`Seeded transactions for ${count} users.`);
        alert(`Successfully seeded transactions for all ${count} users!`);

    } catch (error) {
        console.error("Error seeding all users transactions:", error);
        alert("Error: " + error.message);
    }
}

async function addTransactionsForUser(uid) {
    const transactionsRef = collection(db, "transactions");

    for (let i = 0; i < sampleTransactions.length; i++) {
        const tx = sampleTransactions[i];
        const date = new Date();
        date.setDate(date.getDate() - i * 15);

        await addDoc(transactionsRef, {
            uid: uid,
            description: tx.description,
            amount: tx.amount,
            status: tx.status,
            date: date.toISOString()
        });
    }
}
