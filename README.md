# wellness-tracker

## Website URL 
https://jasons-wellness-tracker.up.railway.app/

### Installation
frontend and backend run on separate folders, run npm i in both root directories, at the level of their respective package.json files

Front end
```bash
/// inside /wellness-tracker
npm run dev
```

Back End
```
/// Start server
npm run start
/// Seeding/syncing data in /backend from the zealthy api - must run seed-users first 
npm run seed-users
npm run sync-steps-data
npm run sync-sleep-data

/// .env values
MONGODB_URI
PORT=3001
TOKEN_SECRET=
```


This project is a full stack application using React(nextjs) and expressjs with mongodb. It is a wellness tracker that allows users to keep track of their personal health data and visualize it with a dashboard and features an entry log that they can use. I have seeded users that have data in a 3rd party api which i will occasionally sync data with. Sleep and step data will be synced into my database and be organzied in "sessions" to have personal behaviour information sorted by date.

universal login input - email: alice@email.net  password: password
libraries - bcrypt, jsonwebtoken, react hook forms, recharts, tailwindcss
Features - Login, register, dashboard (bar chart for sleep data visualization, editable entry section).

<img width="850" height="850" alt="Screenshot 2026-09-30 at 5 00 41 PM" src="https://github.com/user-attachments/assets/6fc9d47e-906a-445a-bc83-ca9b222a0c69" />

Notes - It is assumed sleep and step data come from a device or a strict 3rd party source so i will not allow the user to make 
changes to that data.

1 - Interactive calendar. This calendar allows the user to select a date, which will then render that specific dates tracked values on the number "2" section. They can then click on any of those individual boxes to quickly make edits to them. A green
dot means that the user has data filled for that date, even if just one field. Depending on how far back the sync script fetched the data, the user can go back to previous months to view data.

2 - This daily snapshot will initially have todays data (hours sleep will be from night before). The user can click on any of these modules to make edits. They cannot edit sleep or steps data as that will go against the zealthy api synced data. 

3 - This bar chart shows hours slept each night. It includes pagnation to go back previous weeks. The bars are color coded to represent missed goals, goals met, and just the current/last night. 

4 - Recent entries setion is where all of the daily data can be seen. This is a list of rows that can be individually dropped down to view the entry data in more detail, make changes, or delete.

5 - Averages sidebar. A 2 week view of the average of your tracked information.

datamodels - 

```ts
Users = {
    _id: object_id,
    username: String,
    email: String,
    password: String,
    entry_id: object_id - reference to Entry collection
}
Entries = {
    _id: object_id,
    user_id: object_id - reference to the User HTMLAllCollection,
    entries: array of daily entries: [
        {
            date: Date,
            mood: String,
            notes: String,
            steps: number,
            water: number,
            weight: Number,
            calories: number,
            screen_time: Number,
            medication: Number,
            _id: object_id
        },
        ...
    ]
}

SleepData = {
     _id: object_id,
     user_id: object_id - reference to the User,
     sleepSessions: [
        {
            date: Date,
            startTimestamp: Date,
            endTimestamp: Date,
            totalSleepMinutes: number,
            hoursSlept: number, 
            intervals: [
                {
                    timestamp: Date,
                    sleepMinutes: number
                },
                ...
            ]
        },
        ...
     ]
}

```

backend - 
seed scripts (create user, seed sleep data for each automatically)
Must run/rerun user seed script first before sleep data script.
Tracker collection was retired to just merge its data into the entries collection so all daily info can be tracked there. Sleep data now has its own collection, where sleep sessions are recorded via the zealthy api, syncing up occasionally and parsing a big array of values into more useful ones organizing them by date and still including those intervals within them.



Revision changes 
    - Instead of generating sleep data ourselves, use zealthy 3rd party api to add sleep and step data according to matching emails; sync users data they would have gotten using another app/device which zealthy 3rd party api would represent, parsing that data into "sessions" that parse many timestamp/count values into daily snapshot totals to track progress/behaviour.
    - More ways to edit and view past data with the interactive calendar to show a specified dates data. The user can make edits via the daily snapshot section after selecting a date or choosing an entry row from the entries section. Sleep trends bar chart now features pagination to scroll back to previous weeks sleep hours values.

Thoughts -
    Always more to add and revise but it is hard to make the dashboard look nice without more track worthy items. I can probably seed data during the sync scripts to populate empty fields. More features i would add is setting up a sleep goal, more user friendly buttons and ui fields to add to todays entries, especially notes and water with a bit new note button and plus minus buttons to change todays water. entry section can look alot better and user friendly but it is atleast functional. I should include either a better date selected day snapshot or date search/pagination in the entries section. 
    Syncing data can be done manually within the console, but i can also do it daily automatically to sync with zealthys api, uploading only newer date data, or data from a date specified that has data missing up to todays date. I still feel like the entry collection needs a bit more work, but it could just be that the only good data to work with is daily steps and the rest needs to be populated by the user or a seed script/function.
