import AuthManager from "./script.js";

const DB = []; // This should be your database or an array to store users
const auth = new AuthManager(DB, "registerContainer", "loginContainer"); // Parameters: Database, RegContainerId as String, LogContainerId as String
auth.formCreator();

export default formCreator;