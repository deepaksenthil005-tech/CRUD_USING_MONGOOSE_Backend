const mongoose = require('mongoose');

function safeMongoHost(uri) {
    if (!uri) return null;
    const srvMatch = uri.match(/mongodb\+srv:\/\/[^@]*@([^/?]+)/);
    if (srvMatch) return srvMatch[1];
    const standardMatch = uri.match(/^mongodb:\/\/([^/?]+)/);
    if (standardMatch) return standardMatch[1];
    return null;
}

function validateMongoUri(uri) {
    if (!uri || uri.trim() === '') {
        return 'MONGO_URI is not set.';
    }
    if (!/^mongodb(\+srv)?:\/\//.test(uri)) {
        const shown = uri.length > 80 ? `${uri.slice(0, 77)}...` : uri;
        return `MONGO_URI must start with "mongodb://" or "mongodb+srv://". Current value looks like: "${shown}"`;
    }
    // Detect mongodb+srv://...@HOST/... - reject if HOST is placeholder (e.g. 1234)
    const srvMatch = uri.match(/mongodb\+srv:\/\/[^@]*@([^/?]+)/);
    if (srvMatch) {
        const host = srvMatch[1];
        if (/^\d+$/.test(host) || host === '1234' || host.length < 5) {
            return `MONGO_URI has invalid host "${host}". Use your Atlas cluster hostname (e.g. cluster0.xxxxx.mongodb.net).`;
        }
    }
    // Detect mongodb://HOST - reject if HOST is 1234
    const standardMatch = uri.match(/^mongodb:\/\/([^/?]+)/);
    if (standardMatch) {
        const host = standardMatch[1].split(':')[0];
        if (host === '1234' || /^\d+$/.test(host)) {
            return `MONGO_URI has invalid host "${host}". Use localhost or your MongoDB host.`;
        }
    }
    return null;
}

const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    const invalid = validateMongoUri(uri);
    if (invalid) {
        const host = safeMongoHost(uri);
        console.error('Error: ' + invalid);
        if (host) console.error(`Detected MongoDB host: ${host}`);
        console.error('');
        console.error('Set MONGO_URI correctly:');
        console.error('  Local:    MONGO_URI=mongodb://localhost:27017/your_db_name');
        console.error('  Atlas:   MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/DBNAME');
        console.error('');
        console.error('On Render: Dashboard → Your Service → Environment → add MONGO_URI.');
        process.exit(1);
    }
    try {
        await mongoose.connect(uri);
        console.log("MongoDB Connected!");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        if (error.message.includes('querySrv ENOTFOUND')) {
            console.error('Fix MONGO_URI: use a valid MongoDB host (e.g. cluster0.xxxxx.mongodb.net for Atlas).');
        }
        process.exit(1);
    }
};

module.exports = connectDB;