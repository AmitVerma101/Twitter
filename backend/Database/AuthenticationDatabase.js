const pool = require("./database");
async function updateUsers(val1, val2, val3, val4, val5) {
  const client = await pool.connect();
  try {
    let result = await client.query(
      `update users set ${val1} = '${val2}',${val3} = '${val4}' where email = '${val5}';`
    );
    return "success";
  } catch (e) {
    // console.log(e);
    return "failure";
  } finally {
    client.release(true);
  }
}
async function insertIntoUser(u_name, email, u_password,username) {
  const client = await pool.connect();
  try {
    let result = await client.query(
      `insert into users (u_name,email,DOB,u_password,username) values('${u_name}','${email}',current_timestamp,'${u_password}','${username}');`
    );
    // console.log(result.rows);

    return { message: "success" };
  } catch (e) {
    console.log(
      "An error occur while inserting the values in the database" + e
    );
    return { message: "failure" };
  } finally {
    client.release(true);
  }
}

//update user
async function updateUser(user, field, value) {
  // console.log(user);
  const client = await pool.connect();
  //   await  client.connect();
  try {
    await client.query(
      `update users set ${field} = '${value}' where email =  '${user.email}';`
    );

    return { message: "success" };
  } catch (e) {
    return { message: "failure" };
  } finally {
    client.release(true);
  }
}

//findUser
async function findUser(field, value) {
  const client = await pool.connect();
  //    await client.connect();
  try {
    const checkQuery = `select u_name from users where ${field} = '${value}';`;
    let result = await client.query(
      `select * from users where ${field} = '${value}';`
    );
    // console.log("The result of the query in findUser is ");
    // console.log(checkQuery);
    // console.log(result);
    return { message: "success", body: result.rows };
  } catch (e) {
    console.log("Error occur while finding the user " + e);
    return { message: "failure" };
  } finally {
    client.release(true);
    // pool.end().then(()=>{console.log("pool closes")})
  }
}


async function findUserLike(field, value) {
  const client = await pool.connect();
  //    await client.connect();
  try {
    
    let result = await client.query(
      `select * from users where ${field} like '${value}%';`
    );
    // console.log("The result of the query in findUser is ");
  
    // console.log(result);
    return { message: "success", body: result.rows };
  } catch (e) {
    console.log("Error occur while finding the user " + e);
    return { message: "failure" };
  } finally {
    client.release(true);
    // pool.end().then(()=>{console.log("pool closes")})
  }
}

async function findHashTags(field, value) {
  const client = await pool.connect();
  //    await client.connect();
  try {
    
    let result = await client.query(
      `select * from hashTag where ${field} like '${value}%';`
    );
    // console.log("The result of the query in findUser is ");
  
    // console.log(result);
    return { message: "success", body: result.rows };
  } catch (e) {
    console.log("Error occur while finding the user " + e);
    return { message: "failure" };
  } finally {
    client.release(true);
    // pool.end().then(()=>{console.log("pool closes")})
  }
}

async function findNotifications(u_id){
  const client = await pool.connect();
  try {
    let result = await client.query(`select e4.likes,e3.* from likeTable e4 right join (select e1.u_name,e1.username,e1.profilepic,e2.* from users e1 inner join(select * from tweets where t_id in (select t_id from mentions where mention = ${u_id}))e2 on e1.u_id = e2.u_id) e3 on e4.t_id = e3.t_id and e4.u_id = ${u_id};
    `)

    // console.log("Result of the notifications is "+result)

    return {message:'success',body:result.rows};
  }
  catch(e){
    console.log("Error occur while fetching the notifications "+e);
    return {message:'failure'}
  }
  finally {
    client.release(true);
  }
}

async function makeTweet(user,mention,hashTag) {
  const client = await pool.connect();
  //    await client.connect();
  try {
    // console.log("In make tweet")
    let result = await client.query(
      `select u_id from users where email = '${user.email}';`
    );
    // console.log(result);
    let u_id = result.rows[0].u_id;
    result = result.rows[0].u_id;
    // console.log("u_id"+u_id)
    await client.query(
      `insert into tweets (u_id,image,description,time_of_tweet,commentOf) values(${result},'${user.image}','${user.description}',current_timestamp,${user.t_id});`
    );
    result = await client.query(`select e3.likes,e4.* from likeTable e3 right join (select e1.profilepic,e1.u_name,e1.username,e2.* from users e1 inner join (select * from tweets where t_id = (select max(t_id) from tweets where u_id = ${result}))e2 on e1.u_id = e2.u_id)e4 on e3.u_id = e4.u_id and e3.t_id = e4.t_id;`);
    // console.log(result)
    if(mention !== ""){
        let men = mention.split(',');

        for(let i=0;i<men.length;i++){
         
          const ans = await client.query(`select u_id from users where username = '${men[i]}'`);
            if(ans.rows.length == 1 ){
              await client.query(`insert into mentions values(${u_id},${result.rows[0].t_id},(select u_id from users where username = '${men[i]}'));`)
             }
        }
      }
      console.log("Before Hash")
      let hash = hashTag.split(',');
      for(let i=0;i<hash.length;i++){
        await client.query(`insert into hashTag values(${result.rows[0].t_id},'${hash[i]}')`)
        console.log("after hash");
      }
    
    return { message: "success",body:result.rows};
  } catch (e) {
    console.log("Error occur while finding the user " + e);
    return { message: "failure" };
    // return {message:'failure'};
  } finally {
    client.release(true);
    // pool.end().then(()=>{console.log("pool closes")})
  }
}

async function findTweets(user) {
  const client = await pool.connect();

  //    await client.connect();
  try {
    let result;
    
      
      result = await client.query(
        `select e3.*,e4.likes from likeTable e4 right join (select e1.*,e2.* from users e1 inner join tweets e2 on e1.u_id = e2.u_id order by time_of_tweet desc) e3 on e3.t_id = e4.t_id and e4.u_id = (select u_id from users where email = '${user.email}');`
      );
    
    return { message: "success", body: result.rows };
  } catch (e) {
    console.log("Error occur while finding the user " + e);
    return { message: "failure" };
    // return {message:'failure'};
  } finally {
    client.release(true);
    // pool.end().then(()=>{console.log("pool closes")})
  }
}

async function findFollowersTweets(user) {
  const client = await pool.connect();

  //    await client.connect();
  try {
    let result;
    
      
      result = await client.query(
        `select e3.likes,e4.* from likeTable e3 right join (select e1.username,e1.profilepic,e1.u_name,e2.* from users e1 inner join (select * from tweets where u_id in (select follower_id from followers where u_id = (select u_id from users where email = '${user.email}')))e2 on e1.u_id = e2.u_id)e4 on e3.u_id = (select u_id from users where email = '${user.email}') and e3.t_id = e4.t_id;`
      );
    
    return { message: "success", body: result.rows };
  } catch (e) {
    console.log("Error occur while finding the user " + e);
    return { message: "failure" };
    // return {message:'failure'};
  } finally {
    client.release(true);
    // pool.end().then(()=>{console.log("pool closes")})
  }
}

// giveTweet

async function giveTweet(t_id,u_id) {
  const client = await pool.connect();

  //    await client.connect();
  try {
    let result;
    // console.log("in makeTweet")
    result = await client.query(`select e4.likes,e3.* from likeTable e4 right join (select e2.u_name,e2.username,e2.profilepic,e1.* from tweets e1 inner join users e2 on e1.u_id = e2.u_id and t_id = ${t_id}) e3 on e4.t_id = e3.t_id and e4.u_id = ${u_id};`);  
      // result = await client.query(
      //   `select e3.*,e4.likes from likeTable e4 right join (select e1.*,e2.* from users e1 inner join tweets e2 on e1.u_id = e2.u_id order by time_of_tweet desc) e3 on e3.t_id = e4.t_id and e4.u_id = (select u_id from users where email = '${user.email}');`
      // );
    
    return { message: "success", body: result.rows };
  } catch (e) {
    console.log("Error occur while finding the user " + e);
    return { message: "failure" };
    // return {message:'failure'};
  } finally {
    client.release(true);
    // pool.end().then(()=>{console.log("pool closes")})
  }
}

async function findProfileReplies(u_id,user_id) {
  // console.log("In findProfileTweets")
  // console.log(u_id);
  const client = await pool.connect();

  //    await client.connect();
  try {
    let result;
    // console.log("in findProfileReplies")
    result = await client.query(`select e4.likes,e3.* from likeTable e4 right join (select e1.u_name,e1.username,e1.profilepic,e2.* from users e1 inner join (select * from tweets where u_id = ${u_id} and commentOf is not null)e2 on e1.u_id = e2.u_id)e3 on e4.u_id = ${user_id} and e4.t_id = e3.t_id;`);  
      
    return { message: "success", body: result.rows };
  } catch (e) {
    console.log("Error occur while finding the user " + e);
    return { message: "failure" };
    // return {message:'failure'};
  } finally {
    client.release(true);
    // pool.end().then(()=>{console.log("pool closes")})
  }
}

async function findProfileLikes(u_id,user_id) {
  // console.log("In findProfileLikes")
  // console.log(u_id);
  const client = await pool.connect();

  //    await client.connect();
  try {
    let result;
    // console.log("in findProfileLikes")
    result = await client.query(`select e3.likes,e4.* from likeTable e3 right join(select e1.username,e1.u_name,e1.profilepic,e2.* from users e1 inner join(select * from tweets where t_id in (select t_id from likeTable where u_id = ${u_id}))e2 on e1.u_id = e2.u_id)e4 on e3.u_id = ${user_id} and e3.t_id = e4.t_id;`);  
      
//select e3.likes,e4.* from likeTable right join(select e1.username,e1.u_name,e1.profilepic from users e1 inner join(select * from tweets where t_id = (select t_id from likeTable where u_id = ${u_id}))e2 on e1.u_id = e2.u_id)e4 on e3.u_id = ${user_id} and e3.t_id = e4.t_id;

    return { message: "success", body: result.rows };
  } catch (e) {
    console.log("Error occur while finding the user " + e);
    return { message: "failure" };
    // return {message:'failure'};
  } finally {
    client.release(true);
    // pool.end().then(()=>{console.log("pool closes")})
  }
}

async function findComments(t_id,u_id) {
  const client = await pool.connect();

  //    await client.connect();
  try {
    let result;
    // console.log("in findComments")
    result = await client.query(`select e4.likes,e3.* from likeTable e4 right join (select e2.u_name,e2.username,e2.profilepic,e1.* from tweets e1 inner join users e2 on e1.u_id = e2.u_id and commentOf = ${t_id}) e3 on e4.t_id = e3.t_id and e4.u_id = ${u_id};`);  
    return { message: "success", body: result.rows };
  } catch (e) {
    console.log("Error occur while finding the user " + e);
    return { message: "failure" };
    // return {message:'failure'};
  } finally {
    client.release(true);
    // pool.end().then(()=>{console.log("pool closes")})
  }
}

async function findUserProfile(u_id) {
  const client = await pool.connect();

  //    await client.connect();
  try {
    let result;
    // console.log("in findUserProfile")
    result = await client.query(`select *,(select count(u_id) as followers from followers where u_id = ${u_id}),(select count(follower_id) as following from followers where follower_id = ${u_id}) from users where u_id = ${u_id};`);  
    return { message: "success", body: result.rows };
  } catch (e) {
    console.log("Error occur while finding the user " + e);
    return { message: "failure" };
    // return {message:'failure'};
  } finally {
    client.release(true);
    // pool.end().then(()=>{console.log("pool closes")})
  }
}


async function findProfileTweets(u_id,user_id) {
  const client = await pool.connect();

  //    await client.connect();
  try {
    let result;
    // console.log("in findUserProfile")
    result = await client.query(`select e4.likes,e3.* from likeTable e4 right join (select e1.u_name,e1.username,e1.profilepic,e2.* from users e1 inner join (select * from tweets where commentOf is null)e2 on e1.u_id = e2.u_id and e1.u_id = ${u_id})e3 on e4.u_id = ${user_id}  and e3.t_id = e4.t_id;`);  
    return { message: "success", body: result.rows };
  } catch (e) {
    console.log("Error occur while finding the user " + e);
    return { message: "failure" };
    // return {message:'failure'};
  } finally {
    client.release(true);
    // pool.end().then(()=>{console.log("pool closes")})
  }
}

async function makeComment(details,u_name){
    // console.log(details)
    const client = await pool.connect();
    try {
      let result = await client.query(`select u_id from users where u_name = '${u_name}'`)
        await client.query(`insert into comment (t_id,u_id,description,image,time_of_comment) values(${details.t_id},${result.rows[0].u_id},'${details.description}','${details.image}',current_timestamp);`)
        return {message:'success'};
    }
    catch(e){
        console.log('Error Occur while making a comment '+e);
        return {message:'failure'};
    }
    finally{
        client.release(true);
    }
}

async function findFollower(user){
    // console.log("Inside findFollower");
    const client = await pool.connect();
    try {
        let result = await client.query(`select * from users where u_id not in(select follower_id from followers where u_id = (select u_id from users where email = '${user.email}'));`);
        return {message:'success',body:result.rows};
    }
    catch(e){
        console.log("Fail to execute findFollower"+e);
        return {message:'failure'}
    }
    finally {
        client.release(true);
    }
}

async function insertFollower(user,u_id){
  // console.log("Inside updateFollower");
  const client = await pool.connect();
  try {
    let result = await pool.query(`insert into followers values((select u_id from users where email = '${user.email}'),${u_id});`)
    return {message:'success'};
  }
  catch(e){
    console.log("Error occur while inserting a new Follower "+e);
    return {message:'failure'};
  }
  finally {
    client.release(true);
  }
}

async function removeFollower(user,u_id){
  // console.log("Inside updateFollower");
  const client = await pool.connect();
  try {
    let result = await pool.query(`delete from followers where u_id = (select u_id from users where email = '${user.email}') and follower_id = ${u_id};`)
    return {message:'success'};
  }
  catch(e){
    console.log("Error occur while inserting a new Follower "+e);
    return {message:'failure'};
  }
  finally {
    client.release(true);
  }
}

async function insertLike(user,t_id){
  // console.log("Inside updateFollower");
  const client = await pool.connect();
  try {
    let result = await pool.query(`insert into likeTable values((select u_id from users where email = '${user.email}'),${t_id},true);`)
    let result2 = await pool.query(`update tweets set likescount = (select likescount from tweets where t_id = ${t_id})+1 where t_id = ${t_id};`)
    return {message:'success'};
  }
  catch(e){
    console.log("Error occur while inserting a new Follower "+e);
    return {message:'failure'};
  }
  finally {
    client.release(true);
  }
}

async function deleteLike(user,t_id){
  // console.log("Inside updateFollower");
  const client = await pool.connect();
  try {
    let result = await pool.query(`delete from likeTable where t_id = ${t_id} and u_id = (select u_id from users where email = '${user.email}');`)
    let result2 = await pool.query(`update tweets set likescount = (select likescount from tweets where t_id = ${t_id})-1 where t_id = ${t_id};`)
    return {message:'success'};
  }
  catch(e){
    console.log("Error occur while inserting a new Follower "+e);
    return {message:'failure'};
  }
  finally {
    client.release(true);
  }
}

async function insertMessage(s_id,r_id,msg){
     
      // console.log("Inside insertMessage")
      // console.log(s_id,r_id,msg);
      const client = await pool.connect();
      try {
            let result = await client.query(`insert into messages values(${s_id},${r_id},'${msg}',current_timestamp) returning *;`)
            return {message:'success',body:result.rows}
      }
      catch(e){
          console.log("Error occur while inserting the message "+e );
          return {message:'failure'}
      }
      finally {
        client.release(true)
      }
}
async function fetchMessage(s_id,r_id){
  // console.log("Inside insertMessage")
  const client = await pool.connect();
  try {
        let result = await client.query(`select * from messages where (sender = ${s_id} and receiver = ${r_id}) or (sender = ${r_id} and receiver = ${s_id}) order by time ;`)
        return {message:'success',body:result.rows}
  }
  catch(e){
      console.log("Error occur while inserting the message "+e );
      return {message:'failure'}
  }
  finally {
    client.release(true)
  }
}

async function fetchUserChatters(s_id){
  // console.log("Inside insertMessage")
  const client = await pool.connect();
  try {
        let result = await client.query(`select distinct receiver as user from messages where sender = ${s_id} union select distinct sender as user from messages where receiver = ${r_id};`)
        return {message:'success',body:result.rows}
  }
  catch(e){
      console.log("Error occur while inserting the message "+e );
      return {message:'failure'}
  }
  finally {
    client.release(true)
  }
}


module.exports = {
  findHashTags, insertIntoUser,
  updateUser,
  findUser,
  updateUsers,
  makeTweet,
  findTweets,
  makeComment,findFollower,insertFollower,removeFollower,insertLike,deleteLike,findUserLike,giveTweet,findComments,findUserProfile,findProfileTweets,findProfileReplies,findProfileLikes,findNotifications,insertMessage,fetchUserChatters,fetchMessage,findFollowersTweets
};
