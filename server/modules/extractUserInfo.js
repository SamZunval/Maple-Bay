import env from './env.js';
import * as db from './db.js';

const DATABASE_NAME = "UsersInfo";
const USER_COLLECTION = "Users";

/**
 * Extract and display user information from the database
 */
const extractUserInfo = async () => {
    let context = undefined;
    try {
        console.log("Extracting user information from database...");

        // Initialize the database connection
        context = await db.initDatabase(env.DB_URI);
        console.log("Database connected successfully");

        // Retrieve all users
        const users = await db.findDocuments(context, DATABASE_NAME, USER_COLLECTION, {}, {});

        console.log(`Found ${users.length} users in the database\n`);

        if (users.length === 0) {
            console.log("No users found in the database");
            return;
        }

        // Display user information
        users.forEach((user, index) => {
            console.log(` User ${index + 1}:`);
            console.log(`   Username: ${user.userName || 'N/A'}`);
            console.log(`   Name: ${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A');
            console.log(`   Email: ${user.email || 'N/A'}`);
            console.log(`   Birthday: ${user.birthDay || 'N/A'}`);
            console.log(`   Location: ${user.city || 'N/A'}, ${user.province || ''}`.trim());
            console.log(`   Address: ${user.address || 'N/A'}`);
            console.log(`   Postal Code: ${user.postalCode || 'N/A'}`);
            console.log(`   College: ${user.college || 'N/A'}`);
            console.log(`   Career: ${user.career || 'N/A'}`);

            // Display additional fields if they exist
            if (user.likes && user.likes.length > 0) {
                console.log(`   Likes: ${user.likes.join(', ')}`);
            }
            if (user.liked && user.liked.length > 0) {
                console.log(`   Liked by: ${user.liked.join(', ')}`);
            }
            if (user.interests && user.interests.length > 0) {
                console.log(`   Interests: ${user.interests.join(', ')}`);
            }
            if (user.bio) {
                console.log(`   Bio: ${user.bio}`);
            }
            if (user.profileImage) {
                console.log(`   Profile Image: ${user.profileImage}`);
            }

            console.log('   ---');
        });

        // Summary statistics
        console.log(`\nSummary:`);
        console.log(`   Total Users: ${users.length}`);
        console.log(`   Users with email: ${users.filter(u => u.email).length}`);
        console.log(`   Users with birthday: ${users.filter(u => u.birthDay).length}`);
        console.log(`   Users with location: ${users.filter(u => u.city || u.province).length}`);
        console.log(`   Users with college: ${users.filter(u => u.college).length}`);
        console.log(`   Users with career: ${users.filter(u => u.career).length}`);

    } catch (error) {
        console.error("Error extracting user information:", error);
    } finally {
        if (context) {
            context.close();
            console.log("Database connection closed");
        }
    }
};

/**
 * Extract specific user by username
 */
const extractUserByUsername = async (username) => {
    let context = undefined;
    try {
        console.log(`Extracting user information for: ${username}`);

        context = await db.initDatabase(env.DB_URI);

        const user = await db.findDocument(context, DATABASE_NAME, USER_COLLECTION, { userName: username }, {});

        if (!user) {
            console.log(`User '${username}' not found`);
            return null;
        }

        console.log("User Details:");
        console.log(`   Username: ${user.userName || 'N/A'}`);
        console.log(`   Name: ${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A');
        console.log(`   Email: ${user.email || 'N/A'}`);
        console.log(`   Birthday: ${user.birthDay || 'N/A'}`);
        console.log(`   Location: ${user.city || 'N/A'}, ${user.province || ''}`.trim());
        console.log(`   Address: ${user.address || 'N/A'}`);
        console.log(`   Postal Code: ${user.postalCode || 'N/A'}`);
        console.log(`   College: ${user.college || 'N/A'}`);
        console.log(`   Career: ${user.career || 'N/A'}`);

        return user;

    } catch (error) {
        console.error("Error extracting user information:", error);
        return null;
    } finally {
        if (context) {
            context.close();
        }
    }
};

/**
 * Export user data to JSON file
 */
const exportUsersToJSON = async (filename = 'users_export.json') => {
    let context = undefined;
    try {
        console.log(`Exporting user data to ${filename}...`);

        context = await db.initDatabase(env.DB_URI);

        const users = await db.findDocuments(context, DATABASE_NAME, USER_COLLECTION, {}, {});

        // Remove sensitive information like passwords before export
        const sanitizedUsers = users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        const fs = await import('fs/promises');
        await fs.writeFile(filename, JSON.stringify(sanitizedUsers, null, 2));

        console.log(`Successfully exported ${users.length} users to ${filename}`);

    } catch (error) {
        console.error("Error exporting user data:", error);
    } finally {
        if (context) {
            context.close();
        }
    }
};

// Export functions for use in other modules
export {
    extractUserInfo,
    extractUserByUsername,
    exportUsersToJSON
};

// If this file is run directly, extract all user info
if (import.meta.url === `file://${process.argv[1]}`) {
    extractUserInfo();
}