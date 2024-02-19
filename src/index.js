import app from "./app.js";
import { sequelize } from "./database/database.js"
import './models/User.js'
import './models/Role.js'

async function main() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Database connected');
        app.listen(4040);
        console.log("Serven is listening on port", 4040);
    } catch (error) {
        console.log('Unable to connect to database', error);
    }
}

main();