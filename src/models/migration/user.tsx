import { MongoClient } from 'mongodb';
import { connect } from '../../dbConfig/dbConfig'; // Adjust the path as necessary

async function migrateUserModel() {
    try {
        // Use the existing connect function to establish a connection
        await connect();

        const client = new MongoClient(process.env.MONGO_URI!, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('test'); // Your database name

        // Update User documents
        const result = await db.collection('users').updateMany({}, {
            $set: {
                'profile.bio': '',
                'profile.nationality': '',
                'profile.occupation': '',
                'profile.maritalStatus': 'single',
                'profile.socialLinks': {
                    twitter: '',
                    linkedin: '',
                    facebook: '',
                    instagram: ''
                },
                'profile.createdAt': new Date(),
                'profile.updatedAt': new Date(),
                'company': {
                    companyName: '',
                    companyAddress: '',
                    companyEmail: '',
                    companyPhone: '',
                    registrationNumber: '',
                    website: '',
                    industry: '',
                    companyLogo: '',
                    contactPerson: '',
                    position: '',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            }
        });

        console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        // Ensure the connection is closed
        await mongoose.connection.close();
    }
}

migrateUserModel(); 