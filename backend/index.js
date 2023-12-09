const express = require('express')
const path = require('path')
const app = express()
const twilio = require('twilio')
const cors = require("cors")
const pool = require("./db")
const bcrypt = require('bcrypt')
const saltRound = 10;
require('dotenv').config()

//middleware
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("hello")
})

//ROUTES FOR CONTACTS START
//**********************************************************************************
//create a contact
app.post("/contacts", async (req, res) => {
    try {
        const { f_name, l_name, phone_number } = req.body
        const new_contact = await pool.query("INSERT INTO contacts (f_name, l_name, phone_number) VALUES($1,$2,$3) RETURNING *",
            [f_name, l_name, phone_number])
        res.json(new_contact.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).json("Server error")
    }
})
//get all contacts
app.get("/contacts", async (req, res) => {
    try {
        const all_contacts = await pool.query("SELECT * FROM contacts")
        res.json(all_contacts.rows)
    } catch (err) {
        console.error(err.message)
        res.status(500).json("Server error here")
    }
})

//get contact/id
app.get("/contacts/:id", async (req, res) => {
    try {
        const { id } = req.params
        const contact = await pool.query("SELECT * FROM CONTACTS WHERE id = $1", [id])
        res.json(contact.rows)
    } catch (err) {
        console.error(err.message)
        res.status(500).json("Server error")
    }
})
//edit a contact
app.put("/contacts/:id", async (req, res) => {
    try {
        const { id } = req.params
        const { f_name, l_name, phone_number } = req.body
        const update_contact = await pool.query("UPDATE CONTACTS SET f_name =$1, l_name = $2, phone_number = $3 WHERE id =$4",
            [f_name, l_name, phone_number, id])
        res.json("TODO was updated successfully")
    } catch (err) {
        console.error(err.message)
        res.status(500).json("Server error")
    }
})
//delete a contact
app.delete("/contacts/:id", async (req, res) => {
    try {
        const { id } = req.params
        const del_contact = await pool.query("DELETE FROM CONTACTS WHERE id = $1", [id])
        res.send("DELETED FROM DB")
    } catch (err) {
        console.error(err.message)
    }
})
//ROUTES FOR CONTACTS END
//********************************************************************************** */
//ROUTES FOR ADDRESS
//post an address
app.post("/address", async (req, res) => {
    try {
        const { f_name, l_name, phone_number, street_add, city, zipcode, states } = req.body;

        // // Verify that the phone_number exists in Contacts table
        // const existingContact = await pool.query('SELECT * FROM Contacts WHERE phone_number = $1', [phone_number]);

        // if (existingContact.rows.length === 0) {
        //     return res.status(400).json({ error: 'Contact with provided phone_number does not exist.' });
        // }

        const addAddrQuery = `
            INSERT INTO Address (f_name, l_name, phone_number, street_add, city, zipcode, states)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`;

        const addedAddress = await pool.query(addAddrQuery, [f_name, l_name, phone_number, street_add, city, zipcode, states]);

        res.json(addedAddress.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to get all addresses
app.get("/address", async (req, res) => {
    try {
        const addresses = await pool.query('SELECT * FROM Address');
        res.json(addresses.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//edit an address

// Update an address by address_id
app.put("/address/:address_id", async (req, res) => {
    try {
        const { address_id } = req.params;
        const { f_name, l_name, phone_number, street_add, city, zipcode, states } = req.body;

        // Check if the address exists
        const existingAddress = await pool.query('SELECT * FROM Address WHERE address_id = $1', [address_id]);

        if (existingAddress.rows.length === 0) {
            return res.status(404).json({ error: 'Address not found' });
        }

        // Update the address
        const updateQuery = `
            UPDATE Address
            SET f_name = $1, l_name = $2, phone_number = $3, street_add = $4, city = $5, zipcode = $6, states = $7
            WHERE address_id = $8
            RETURNING *`;

        const updatedAddress = await pool.query(updateQuery, [f_name, l_name, phone_number, street_add, city, zipcode, states, address_id]);

        res.json(updatedAddress.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete an address by address_id
app.delete("/address/:address_id", async (req, res) => {
    try {
        const { address_id } = req.params;

        // Check if the address exists
        const address = await pool.query('SELECT * FROM Address WHERE address_id = $1', [address_id]);

        if (address.rows.length === 0) {
            return res.status(404).json({ error: 'Address not found' });
        }

        // Delete the address
        await pool.query('DELETE FROM Address WHERE address_id = $1', [address_id]);

        res.json({ message: 'Address deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ROUTES FOR ADDRESS END 
// *********************************************************************************

// login route 
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Fetch the user from the database by username
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            // User not found
            return res.status(401).send('Invalid username or password');
        }

        const user = result.rows[0];

        // Compare the entered password with the stored hash
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            // Passwords match, log in the user
            res.send('Login successful!');
        } else {
            // Passwords don't match
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/hash-password', async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'Password is required.' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        res.json({ hashedPassword });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`APP IS RUNNING on PORT ${PORT}`)
})

