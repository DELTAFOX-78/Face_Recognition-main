import mongoose from 'mongoose';
import Student from './models/Student.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect('mongodb://127.0.0.1:27017/face-recognition')
    .then(async () => {
        try {
            const regNo = '1RV24CS423';
            const correctPhoto = 'uploads\\1RV24CS423.jpeg'; // Use the correct existing file

            console.log(`Updating student ${regNo}...`);
            const result = await Student.updateOne(
                { registerNo: regNo },
                { $set: { photo: correctPhoto } }
            );

            console.log('Update result:', result);

            const s = await Student.findOne({ registerNo: regNo });
            console.log('New Photo Path:', s.photo);

        } catch (e) {
            console.error(e);
        } finally {
            mongoose.connection.close();
        }
    });
