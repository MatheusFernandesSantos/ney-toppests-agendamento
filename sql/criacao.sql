CREATE DATABASE agendamento;
CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(20),
    date DATE,
    time TIME,
    service VARCHAR(100)
);
use agendamento;

select * from appointments;

ALTER TABLE appointments ADD CONSTRAINT unique_date_time UNIQUE (date, time);
