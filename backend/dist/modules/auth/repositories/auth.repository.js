"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = void 0;
const connection_1 = require("../../../database/connection");
const findUserByEmail = async (email) => {
    return (0, connection_1.db)("users as u")
        .join("roles as r", "r.id", "u.role_id")
        .select("u.id", "u.full_name", "u.email", "u.phone", "u.password_hash", "u.role_id", "r.code as role_code")
        .where("u.email", email)
        .whereNull("u.deleted_at")
        .first();
};
const findUserByPhone = async (phone) => {
    return (0, connection_1.db)("users as u")
        .join("roles as r", "r.id", "u.role_id")
        .select("u.id", "u.full_name", "u.email", "u.phone", "u.password_hash", "u.role_id", "r.code as role_code")
        .where("u.phone", phone)
        .whereNull("u.deleted_at")
        .first();
};
const findRoleByCode = async (code) => {
    return (0, connection_1.db)("roles").where({ code }).first();
};
const findUserById = async (userId) => {
    return (0, connection_1.db)("users as u")
        .join("roles as r", "r.id", "u.role_id")
        .select("u.id", "u.full_name", "u.email", "u.phone", "u.password_hash", "u.role_id", "r.code as role_code")
        .where("u.id", userId)
        .whereNull("u.deleted_at")
        .first();
};
const createUser = async (payload) => {
    const [createdId] = await (0, connection_1.db)("users").insert({
        role_id: payload.roleId,
        full_name: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        password_hash: payload.passwordHash
    });
    return Number(createdId);
};
const updateProfile = async (payload) => {
    await (0, connection_1.db)("users")
        .where("id", payload.userId)
        .update({
        full_name: payload.fullName,
        email: payload.email,
        phone: payload.phone
    });
};
const updatePasswordHash = async (userId, passwordHash) => {
    await (0, connection_1.db)("users")
        .where("id", userId)
        .update({
        password_hash: passwordHash
    });
};
exports.authRepository = {
    findUserById,
    findUserByEmail,
    findUserByPhone,
    findRoleByCode,
    createUser,
    updateProfile,
    updatePasswordHash
};
