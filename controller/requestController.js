const connection = require("../model/db");
const { getUserByIdPromisified } = require("./userController");

function addInFollowingTablePromisified(user_id, following_id, is_public) {
  return new Promise(function (resolve, reject) {
    let sql;
    if (is_public) {
      sql = `INSERT INTO user_following(user_id , following_id,is_accepted) VALUES('${user_id}' , '${following_id}' , true)`;
    } else {
      sql = `INSERT INTO user_following(user_id , following_id , is_accepted ) VALUES('${user_id}' , '${following_id}' , false )`;
    }
    connection.query(sql, function (error, data) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}
function addInFollowerTablePromisified(follower_id, user_id) {
  return new Promise(function (resolve, reject) {
    let sql = `INSERT INTO user_follower(user_id , follower_id) VALUES('${user_id}' , '${follower_id}')`;
    connection.query(sql, function (error, data) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}
function acceptRequestPromisified(following_id, user_id) {
  return new Promise(function (resolve, reject) {
    let sql = `UPDATE user_following SET is_accepted = 1 WHERE user_id = '${user_id}' AND following_id = '${following_id}'`;
    connection.query(sql, function (error, data) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}
function getPendingRequestsPromisfied(following_id) {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT * FROM user_following WHERE following_id = '${following_id}' AND is_accepted = false`;
    connection.query(sql, function (error, data) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}
function cancelRequestPromisified(following_id, user_id) {
  return new Promise(function (resolve, reject) {
    let sql = `DELETE FROM user_following WHERE user_id = '${user_id}' AND following_id = '${following_id}'`;
    connection.query(sql, function (error, data) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}
function getAllFollowersIdsPromisifed(user_id) {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT follower_id FROM user_follower WHERE user_id = '${user_id}'`;
    connection.query(sql, function (error, data) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}
function getAllFollowingIdsPromisifed(user_id) {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT following_id FROM user_following WHERE user_id = '${user_id}' AND is_accepted = true`;
    connection.query(sql, function (error, data) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}
function deleteFromFollowingTable(user_id, following_id) {
  return new Promise(function (resolve, reject) {
    let sql = `DELETE FROM user_following WHERE user_id = '${user_id}' AND following_id = '${following_id}'`;
    console.log(sql);
    connection.query(sql, function (error, data) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}
function deleteFromFollowerTable(follower_id, user_id) {
  return new Promise(function (resolve, reject) {
    let sql = `DELETE FROM user_follower WHERE user_id = '${user_id}' AND follower_id = '${follower_id}'`;
    console.log(sql);
    connection.query(sql, function (error, data) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}
async function sendRequest(req, res) {
  try {
    let { user_id, follow_id } = req.body;
    console.log(user_id, follow_id);
    let user = await getUserByIdPromisified(follow_id);
    let is_public = user[0].is_public;
    if (is_public) {
      // console.log("inside is Public true");
      //add in following table with is_accepted = true
      let followingData = await addInFollowingTablePromisified(
        user_id,
        follow_id,
        true
      );
      let followerData = await addInFollowerTablePromisified(
        user_id,
        follow_id
      );
      res.json({
        message: "Request sent and accepted !!",
        followingData,
        followerData,
      });
    } else {
      // console.log("inside is_public false");
      //add in following table with is_accepted = fals
      console.log(user_id, follow_id);
      let data = await addInFollowingTablePromisified(user_id, follow_id);
      res.json({
        message: "Request Sent and is Pending !!",
        data,
      });
    }
  } catch (error) {
    res.json({
      message: "failed to send request !!",
      error: error,
    });
  }
}
async function acceptRequest(req, res) {
  try {
    let { user_id, accept_id } = req.body;
    console.log(user_id, accept_id);
    let acceptData = await acceptRequestPromisified(user_id, accept_id);
    let followerData = await addInFollowerTablePromisified(accept_id, user_id);
    res.json({
      message: "Accepted Request !",
      acceptData,
      followerData,
    });
  } catch (error) {
    res.json({
      message: "Failed to accept request !",
      error,
    });
  }
}
async function getPendingRequests(req, res) {
  try {
    let user_id = req.params.uid;
    let requests = await getPendingRequestsPromisfied(user_id);
    // console.log(requests);
    let requestsNames = [];
    for (let i = 0; i < requests.length; i++) {
      let user = await getUserByIdPromisified(requests[i].user_id);
      requestsNames.push(user[0]);
    }
    // console.log(requestsNames);
    res.json({
      message: "Got All Pending Requests !",
      requestsNames,
    });
  } catch (error) {
    res.json({
      message: "Failed to get requests !!",
      error,
    });
  }
}

async function getPendingRequestsUserObject(req, res) {
  try {
    let user_id = req.params.uid;
    let requestsUid = await getPendingRequestsPromisfied(user_id);
    let requests = [];
    for (let i = 0; i < requestsUid.length; i++) {
      let aUser = await getUserByIdPromisified(requestsUid[i].user_id);
      requests.push(aUser);
    }
    res.json({
      message: "Got All Pending Requests User Object !",
      requests,
    });
  } catch (error) {
    res.json({
      message: "Failed to get User of Pending requests !!",
      error,
    });
  }
}

async function cancelRequest(req, res) {
  try {
    let { user_id, cancel_id } = req.body;
    let cancelObj = await cancelRequestPromisified(user_id, cancel_id);
    res.json({
      message: "Cancelled Request !",
      cancelObj,
    });
  } catch (error) {
    res.json({
      message: "Failed to cancel Request",
      error,
    });
  }
}
async function getAllFollowers(req, res) {
  try {
    let user_id = req.params.uid;
    let followersIds = await getAllFollowersIdsPromisifed(user_id);
    let followers = [];
    for (let i = 0; i < followersIds.length; i++) {
      let follower_id = followersIds[i].follower_id;
      let user = await getUserByIdPromisified(follower_id);
      followers.push(user[0]);
    }
    res.json({
      message: "got all followers !",
      followers,
    });
  } catch (error) {
    res.json({
      message: "failed to get all followers !!",
    });
  }
}

function uniqueElements(arr) {
  let temp = [];
  for (let i = 0; i < arr.length; i++) {
    if (!temp.includes(arr[i])) {
      temp.push(arr[i]);
    }
  }
  return temp;
}

async function getAllFollowing(req, res) {
  try {
    let user_id = req.params.uid;
    let followingIds = await getAllFollowingIdsPromisifed(user_id);
    followingIds = uniqueElements(followingIds);
    let following = [];
    for (let i = 0; i < followingIds.length; i++) {
      let following_id = followingIds[i].following_id;
      let user = await getUserByIdPromisified(following_id);
      4;
      following.push(user[0]);
    }
    res.json({
      message: "got all following !",
      following,
    });
  } catch (error) {
    res.json({
      message: "failed to get all following !!",
    });
  }
}

async function unfollow(req, res) {
  try {
    // console.log(req);
    let { user_id, unfollow_id } = req.body;
    if (user_id && unfollow_id) {
      let followingObj = await deleteFromFollowingTable(user_id, unfollow_id);
      let followerObj = await deleteFromFollowerTable(user_id, unfollow_id);
      res.json({
        message: "Unfollowed succesfully !",
        followingObj,
        followerObj,
      });
    } else {
      res.json({
        message: "User Id Undefined",
      });
    }
  } catch (error) {
    res.json({
      message: "Failed to unfollow !",
      error,
    });
  }
}

// CAN IMPROVISE BY BREADTH FIRST SEARCH = AS THEN NEAREST FRIENDS WILL BE SHOWN FIRST
// THAT TOO 

// abhi aisa kiya hua h ki followings ke friends jo mere firends nhi h voh show karo as suggestions
// BFS / GRAPH HOW
// mutual ke basis pr improvisation is possible

async function getSuggestions(req, res) {
  try {
    let { uid } = req.params;
    let followingIdsArray = await getAllFollowingIdsPromisifed(uid);
    // console.log("FOLLOWING OF USER", followingIdsArray);

    let followingIds = followingIdsArray.map((obj) => {
      return obj.following_id;
    });
    // console.log("FOLLOWING ID OF USER FOLLWING", followingIds);

    let suggestionsIds = [];
    for (let i = 0; i < followingIds.length; i++) {
      let following_id = followingIds[i];
      // B,C,D
      let followingIdsOf_User_ith_Following = await getAllFollowingIdsPromisifed(
        following_id
      );

      for (let j = 0; j < followingIdsOf_User_ith_Following.length; j++) {
        let fid = followingIdsOf_User_ith_Following[j].following_id;
        // console.log(fid);
        if (
          fid != uid &&
          !followingIds.includes(fid) &&
          !suggestionsIds.includes(fid)
        ) {
          suggestionsIds.push(fid);
        }
      }
    }

    let suggestionsUser = [];
    for (let i = 0; i < suggestionsIds.length; i++) {
      let user = await getUserByIdPromisified(suggestionsIds[i]);
      suggestionsUser.push(user[0]);
    }
    res.json({
      message: "Suggestions got Successfully!!!",
      suggestions: suggestionsUser,
    });
  } catch (error) {
    res.json({
      message: "Failed to get suggestions !!",
    });
  }
}

module.exports.sendRequest = sendRequest;
module.exports.acceptRequest = acceptRequest;
module.exports.getPendingRequests = getPendingRequests;
module.exports.cancelRequest = cancelRequest;
module.exports.getAllFollowers = getAllFollowers;
module.exports.getAllFollowing = getAllFollowing;
module.exports.unfollow = unfollow;
module.exports.getSuggestions = getSuggestions;
module.exports.getPendingRequestsUserObject = getPendingRequestsUserObject;
