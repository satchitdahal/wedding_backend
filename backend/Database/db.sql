-- Contacts table
CREATE TABLE Contacts (
    id SERIAL PRIMARY KEY,
    f_name VARCHAR(255) NOT NULL,
    l_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL
);


CREATE TABLE Address (
    address_id SERIAL PRIMARY KEY,
    f_name VARCHAR(255) NOT NULL,
    l_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    street_add VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    zipcode VARCHAR(10) NOT NULL,
    states VARCHAR(255) NOT NULL
);


CREATE TABLE RSVP (
    rsvp_id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL REFERENCES Address(phone_number),
    num_of_ppl INT,
    CONSTRAINT positive_num_of_ppl CHECK (num_of_ppl >= 0)
);
