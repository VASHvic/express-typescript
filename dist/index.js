"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const app_1 = require("./app");
app_1.app.listen(config_1.PORT, () => {
    console.log(`Servidor en puerto ${config_1.PORT}`);
});
