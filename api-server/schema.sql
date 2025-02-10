CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    date DATE NOT NULL
);

INSERT INTO reports (name, date) VALUES
    ('Monthly Sales Report', '2024-02-06'),
    ('User Engagement Analysis', '2024-02-05'),
    ('Revenue Forecast', '2024-02-04');
