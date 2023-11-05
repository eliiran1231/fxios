import Fxios from "fxios";
import { createRequire } from "module";
import proxies from "./proxies.js"
import axios from "axios";

import { Agent } from "http";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
let usernames=new Array(50).fill(null).map((e,i)=>"omershallpay"+i);

/*
const databaseName = 'blues_new.db';
const tableName = 'blues';

// Create a new SQLite database
const db = new sqlite3.Database(databaseName);

// Create the table if it doesn't exist
db.serialize(async () => {
  let seen = new Set();
  db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (username TEXT, id INTEGER, thread INTEGER, state TEXT)`);
  
  // Prepare the INSERT statement
  const insertStmt = db.prepare(`INSERT INTO ${tableName} (username, id, thread, state) VALUES (?, ?, ?, ?)`);
  
  // Execute the statement multiple times with different values
  for (let blue of data) {
    if(blue.title.includes("משתמש")) continue;
    bot.getThreadInfo(blue.id).then((async (thread)=>{
      let matches = thread.content.match(/\[url=https:\/\/www.fxp.co.il\/member.php\?u=(.*?)\](.*?)\[\/url\]/g);
      if(!matches) return;
      for (const match of matches) {
        let userId = match.match(/\[url=https:\/\/www.fxp.co.il\/member.php\?u=(.*?)\](.*?)\[\/url\]/)[1];
        if(seen.has(userId)) continue;
        seen.add(userId);
        let user = await bot.getUserInfo(userId);
        let rank = "";
        switch (user.rank) {
          case "usermarkup banned":
            rank="banned";
          break;
          case "user_nick_s1":
            if(user.subname.includes("לשעבר") || user.subname.includes("בדימוס")) rank = "tat nick";
            else rank="member";
          break;
          case "usermarkup principaldirectorpast":
          case "usermarkup respectuser":
          case "usermarkup menaelforum":
            rank="respect";
          break;
          default: 
          rank="serving";
          break;
        }
        insertStmt.run(user.name,user.id, "https://www.fxp.co.il/showthread.php?t="+blue.id, rank);
        console.log({
          username:user.name,
          id:user.id, 
          thread:"https://www.fxp.co.il/showthread.php?t="+blue.id, 
          rank,
          title:blue.title
        })
      }
    }))
    await sleep(500);
  }

  // Finalize the prepared statement after all executions are done
  insertStmt.finalize();
  
  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error('Error closing the database:', err.message);
    } else {
      console.log('Database closed.');
    }
  });
});
*/



let bot = new Fxios(proxies);
bot.addmembers(usernames,"kfirdark123");
