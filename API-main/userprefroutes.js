const express = require('express');
const mongoose = require('mongoose');
const UserPref = require('./schema'); 
const router = express.Router();

// Middleware for CORS
const cors = require('cors');
router.use(cors());

// Create a new user preference
router.post('/userPrefs/create', async (req, res) => {
    try {
        const { keyValues } = req.body.preferences;

        // Check for duplicate keys
        const keySet = new Set();
        for (let i = 0; i < keyValues.length; i++) {
            if (keySet.has(keyValues[i].key)) {
                return res.status(400).send({ error: 'Duplicate keys found in preferences!' });
            }
            keySet.add(keyValues[i].key);
        }

        const userPref = new UserPref(req.body);
        await userPref.save();
        res.status(201).send(userPref);
    } catch (error) {
        console.error('Error:', error);
        res.status(400).send(error);
    }
});

// Add multiple key-value pairs to an existing user's preferences
router.post('/userPrefs/add/:id/preferences', async (req, res) => {
    try {
        const userId = req.params.id;
        const newKeyValues = req.body.keyValues;

        const userPref = await UserPref.findById(userId);
        if (!userPref) {
            return res.status(404).send({ error: 'User not found!' });
        }

        // Check for duplicate keys
        const existingKeys = new Set(userPref.preferences.keyValues.map(pref => pref.key));
        for (let i = 0; i < newKeyValues.length; i++) {
            if (existingKeys.has(newKeyValues[i].key)) {
                return res.status(400).send({ error: `Duplicate key found in preferences: ${newKeyValues[i].key}` });
            }
        }

        userPref.preferences.keyValues.push(...newKeyValues);
        await userPref.save();
        res.status(200).send(userPref);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send(error);
    }
});

// Read all user preferences
router.get('/userPrefs/getAll', async (req, res) => {
    try {
        const userPrefs = await UserPref.find();
        res.status(200).send(userPrefs);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Read a single user preference by ID
router.get('/userPrefs/get/:id', async (req, res) => {
    try {
        const userPref = await UserPref.findById(req.params.id);
        if (!userPref) {
            return res.status(404).send();
        }
        res.status(200).send(userPref);
    } catch (error) {
        res.status(500).send(error);
    }
});


// Update a specific key-value preference by user ID
router.patch("/userPrefs/update/:id", async (req, res) => {
  try {
    const updates = req.body.preferences.keyValues;

    if (!Array.isArray(updates)) {
      return res.status(400).send({ error: "Invalid update parameters!" });
    }
    const userPref = await UserPref.findById(req.params.id);
    if (!userPref) {
      return res.status(404).send({ error: "UserPref not found!" });
    }

    userPref.preferences.keyValues = updates;
    await userPref.save();
    res.status(200).send(userPref);
  } catch (error) {
    res.status(400).send(error);
  }
});



// Delete a single preference of a UserPreference by ID and key
router.delete('/userPrefs/delete/:userId/preferences/:key', async (req, res) => {
    const { userId, key } = req.params;

    try {
        const userPref = await UserPref.findById(userId);
        if (!userPref) {
            return res.status(404).send({ error: 'UserPref not found!' });
        }

        const prefIndex = userPref.preferences.keyValues.findIndex(pref => pref.key === key);
        if (prefIndex === -1) {
            return res.status(404).send({ error: 'Preference key not found!' });
        }

        userPref.preferences.keyValues.splice(prefIndex, 1); // Remove the specific key-value pair
        await userPref.save();
        res.status(200).send(userPref);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
