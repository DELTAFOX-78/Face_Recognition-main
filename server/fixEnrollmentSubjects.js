import mongoose from "mongoose";

// Fix enrollment subjects and remove duplicates
mongoose
    .connect("mongodb://127.0.0.1:27017/face-recognition")
    .then(async () => {
        console.log("Connected to MongoDB\n");

        const db = mongoose.connection.db;
        const enrollments = db.collection("enrollments");

        // Step 1: List all enrollments
        console.log("=== CURRENT ENROLLMENTS ===\n");
        const all = await enrollments.find({}).toArray();
        all.forEach((e, i) => {
            console.log(`${i + 1}. ID: ${e._id}`);
            console.log(`   Teacher: ${e.teacher}, Student: ${e.student}`);
            console.log(`   Class: ${e.class}, Subject: ${e.subject}\n`);
        });

        // Step 2: Find and delete duplicates (keep first occurrence)
        console.log("=== REMOVING DUPLICATES ===\n");
        const seen = new Set();
        const toDelete = [];

        for (const enrollment of all) {
            const key = `${enrollment.teacher}_${enrollment.student}_${enrollment.class}`;

            if (seen.has(key)) {
                toDelete.push(enrollment._id);
                console.log(`✗ Duplicate found: ${key} (ID: ${enrollment._id})`);
            } else {
                seen.add(key);
            }
        }

        if (toDelete.length > 0) {
            await enrollments.deleteMany({ _id: { $in: toDelete } });
            console.log(`\n✓ Deleted ${toDelete.length} duplicate enrollments\n`);
        } else {
            console.log("✓ No duplicates found\n");
        }

        // Step 3: Update all enrollments to set subject = class
        console.log("=== SETTING SUBJECTS ===\n");
        const remaining = await enrollments.find({}).toArray();

        for (const enrollment of remaining) {
            await enrollments.updateOne(
                { _id: enrollment._id },
                { $set: { subject: enrollment.class } }
            );
            console.log(`✓ Set subject="${enrollment.class}" for enrollment ${enrollment._id}`);
        }

        // Step 4: Verify
        console.log("\n=== FINAL STATE ===\n");
        const final = await enrollments.find({}).toArray();
        final.forEach((e, i) => {
            console.log(`${i + 1}. Class: ${e.class}, Subject: ${e.subject}`);
        });

        console.log("\n✓ COMPLETE\n");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Error:", err);
        process.exit(1);
    });
