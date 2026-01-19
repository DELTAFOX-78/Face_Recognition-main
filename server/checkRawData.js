import mongoose from "mongoose";

// Connect and directly query collections
mongoose
    .connect("mongodb://127.0.0.1:27017/face-recognition")
    .then(async () => {
        console.log("Connected to MongoDB\n");

        // Query teachers collection directly
        const teachersData = await mongoose.connection.collection("teachers").find({}).toArray();
        console.log("=== TEACHERS (RAW DATA) ===");
        teachersData.forEach((t) => {
            console.log(`\nTeacher: ${t.username}`);
            console.log("  subject (old):", t.subject);
            console.log("  subjects (new):", t.subjects);
        });

        // Query enrollments collection directly
        const enrollmentsData = await mongoose.connection.collection("enrollments").find({}).toArray();
        console.log("\n\n=== ENROLLMENTS (RAW DATA) ===");
        console.log(`Total: ${enrollmentsData.length}`);
        enrollmentsData.forEach((e, i) => {
            console.log(`\n${i + 1}. Enrollment ID: ${e._id}`);
            console.log("   Teacher:");, e.teacher);
        console.log("   Student:", e.student);
        console.log("   Subject:", e.subject);
        console.log("   Class:", e.class);
        console.log("   Section:", e.section);
    });

process.exit(0);
  })
  .catch ((err) => {
    console.error("Error:", err);
    process.exit(1);
});
