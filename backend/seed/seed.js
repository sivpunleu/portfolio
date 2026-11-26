const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const pool = require("../config/db");

const createProfile = async () => {
    try {
        const [existing] = await pool.query("SELECT id FROM personal_info LIMIT 1");
        if (existing.length > 0) {
            console.log("Profile already exists, skipping seed");
            return;
        }

        await pool.query(
            `INSERT INTO personal_info (full_name, title, bio, email, phone, location, avatar_url, resume_url, github_url, linkedin_url, twitter_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                "Siv Punleu",
                "Full Stack Developer",
                "ខ្ញុំជា Developer ដែលចូលចិត្តបង្កើត Web Application ដោយប្រើ Vue.js, Node.js និង MySQL...",
                "sivpunleu174.email@gmail.com",
                "0969596217",
                "Phnom Penh, Cambodia",
                null,
                null,
                null,
                null,
                null,
            ],
        );
        console.log("Profile created successfully");
    } catch (error) {
        console.error("Error creating profile:", error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
};

createProfile();
