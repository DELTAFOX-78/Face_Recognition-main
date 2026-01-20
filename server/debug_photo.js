import mongoose from 'mongoose';
import Student from './models/Student.js';
import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';

mongoose.connect('mongodb://127.0.0.1:27017/face-recognition')
    .then(async () => {
        try {
            const regNos = ['1RV24CS423', '1RV24BCS423'];
            for (const reg of regNos) {
                const s = await Student.findOne({ registerNo: reg });
                console.log(`\nChecking Record: ${reg}`);
                if (s) {
                    console.log(`  Name: ${s.name}`);
                    console.log(`  Photo DB Path: ${s.photo}`);

                    const diskPath = path.join(process.cwd(), s.photo);
                    console.log(`  Disk Path: ${diskPath}`);
                    if (fs.existsSync(diskPath)) {
                        console.log('  File exists on disk: YES');
                    } else {
                        console.log('  File exists on disk: NO');
                    }
                } else {
                    console.log('  Student not found in DB');
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            mongoose.connection.close();
        }
    });
