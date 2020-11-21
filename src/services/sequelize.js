'use strict';

const { DataTypes, Sequelize, ValidationError, Utils } = require('sequelize');
const config = require('../config.json');

class JSONTEXT extends DataTypes.TEXT.prototype.constructor {
    _stringify(value) {
        if (value === null) {
            return null;
        } else if (this.options.space !== undefined) {
            return JSON.stringify(value, this.options.replacer, this.options.space);
        } else if (this.options.replacer !== undefined) {
            return JSON.stringify(value, this.options.replacer);
        } else {
            return JSON.stringify(value);
        }
    }

    validate(value) {
        try {
            JSON.parse(value);
        } catch (err) {
            throw ValidationError(err.message);
        }
        return true;
    }

    static parse(value) {
        return JSON.parse(value);
    }
}
JSONTEXT.prototype.key = JSONTEXT.key = 'JSONTEXT';
DataTypes.JSONTEXT = Utils.classToInvokable(JSONTEXT);

// initialize the singleton database in-place; it should not be closed ever
module.exports = new Sequelize(config.db.database, config.db.username, config.db.password, {
    host: config.db.host,
    port: config.db.port,
    // TODO: customizable?
    dialect: 'mysql',
    dialectOptions: {
        supportBigNumbers: true,
    },
    define: {
        charset: config.db.charset,
    },
    pool: {
        max: config.db.connectionLimit,
    },
    logging: false,
});
