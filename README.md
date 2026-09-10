# wellness-tracker

This project is a full stack application using React(nextjs) and expressjs with mongodb. It is a wellness tracker that allows users to keep track of their personal health data and visualize it with a dashboard and features an entry log that they can use. i wrote scripts to manually create randomized users and sleep data and referenced them together in the database

<img width="1152" height="1215" alt="Screenshot 2026-09-10 at 6 26 17 PM" src="https://github.com/user-attachments/assets/5636dd8c-0fa4-408e-a322-86b0b1aab3d2" />

universal login input - email: alice@email.net  password: password

libraries - bcrypt, jsonwebtoken, react hook forms, recharts, tailwindcss

Features - Login, register, dashboard (bar chart for sleep data visualization, editable entry section).



datamodels - 

```ts
Users = {
    _id: object_id,
    username: String,
    email: String,
    password: String,
    tracker_id: object_id - reference to Tracker collection,
    entry_id: object_id - reference to Entry collection
}
Entries = {
    _id: object_id 
    user_id: object_id - reference to the User HTMLAllCollection,
    entries: array of daily entries: [
        {
            date: Date,
            mood: String,
            notes: String,
            hours_slept: Number, 
            weight: Number,
            screen_time: Number,
            medication: Number,
            _id: object_id
        }
    ]
}
Trackers = {
    _id: object_id,
    sleep_data: array of objects: [
        {
            timeStamp: Date,
            sleepMinutes: Number
        }
    ],
    water_data: Number,
    steps_data: Number, 
    calories_data: Number
}
```

backend - 
seed scripts (create user, seed sleep data for each automatically)
Must run/rerun user seed script first before sleep data script
