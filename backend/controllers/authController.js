import jwt from "jsonwebtoken";
import db from "../datab.js"; 
import bcrypt from "bcrypt"; 
import "dotenv/config";

const rounds = 10; 

export const loginuser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
        if (result.rows.length == 0) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }
        
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.SESSION_KEY, 
            { expiresIn: "1h" }
        );
        
        return res.json({
            message: "login successful",
            token: token,
            user: { id: user.id, username: user.username, role: user.role }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const registeruser = async (req, res) => {
    const { username, password, role } = req.body; 
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    try {
        const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
        if (result.rows.length != 0) {
            return res.status(400).json({ error: "Username already exists" }); 
        }

        const passwordHash = await bcrypt.hash(password, rounds);

        const newUser = await db.query(
            "INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role",
            [username, passwordHash, role || 'buyer']
        );
        return res.status(201).json({
            message: "User registered successfully",
            user: newUser.rows[0]
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const logout = async(req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Could not log out" });
        }
        res.clearCookie("connect.sid");
        return res.json({ message: "Logout successful" });
    });
};

export const getStatus = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(200).json({ loggedIn: false });
        }
        jwt.verify(token, process.env.SESSION_KEY, async (err, decodedPayload) => {
            if (err) {
                return res.status(200).json({ loggedIn: false, error: "Session expired" });
            }
            const userQuery = await db.query(
                "SELECT id, username, role FROM users WHERE id = $1",
                [decodedPayload.id]
            );

            if (userQuery.rows.length === 0) {
                return res.status(200).json({ loggedIn: false, error: "User record missing" });
            }
            return res.status(200).json({
                loggedIn: true,
                user: userQuery.rows[0]
            });
        });

    } catch (error) {
        console.error("Session verification crashed:", error);
        return res.status(500).json({ loggedIn: false, error: "Internal validation failure" });
    }
};