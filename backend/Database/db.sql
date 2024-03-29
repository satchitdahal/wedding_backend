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

CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE groups (
    group_id SERIAL PRIMARY KEY,
    last_name VARCHAR(100) NOT NULL,
    num_invited INT DEFAULT 0,
    letter CHAR(1)
);

CREATE TABLE members (
    member_id SERIAL PRIMARY KEY,
    group_id INT REFERENCES groups(group_id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    wedding BOOLEAN ,
    reception BOOLEAN ,
    -- this is for the none
    zero BOOLEAN, 
-- this is for the both 
    two BOOLEAN
);
