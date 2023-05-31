require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const authRoute = require("./routes/auth");
const cookieSession = require("cookie-session");
const axios = require("axios");
const passportStrategy = require("./passport");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');

const app = express();

app.use(
	cors({
		origin: "http://localhost:3000",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

app.use(
	cookieSession({
		name: "session",
		keys: ["batman"],
		maxAge: 24 * 60 * 60 * 100,
	})
);

app.use(passport.initialize());
app.use(passport.session());

var token = "";

async function emailAnalysis(emailID) {
	try {
	  const config = {
		method: 'get',
		maxBodyLength: Infinity,
		url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailID}`,
		headers: { 
		  'Authorization': `Bearer ${token}` ////////////////////////////////////////
		},
	  };
  
	  const response = await axios.request(config);
	  const data = response.data;
  
	  const attachmentID = data.payload.parts[1].body.attachmentId;
	  if (attachmentID == null) {
		return { flag: 'SAFE', msg: 'No threat found.' };
	  } else {
		const attachmentName = data.payload["parts"][1].filename;
		let config2 = {
			method: 'get',
			maxBodyLength: Infinity,
			url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailID}/attachments/${attachmentID}`,
			headers: { 
				'Authorization': `Bearer ${token}` ////////////////////////////////////////////////////////////
			  }
		};
		const response2 = await axios.request(config2);
		const data2 = response2.data.data;
		fs.writeFileSync(attachmentName, data2, 'base64');
		console.log('Attachment downloaded successfully.');

		const yara_rules = await new Promise((resolve, reject) => {
			exec('ls ../rules/email', (error, stdout, stderr) => {
			  if (error) {
				console.error(`Error executing command: ${error}`);
				reject(error);
			  } else {
				const ruleFiles = stdout.split('\n').filter((fileName) => fileName.trim() !== '');
				resolve(ruleFiles);
			  }
			});
		  });

		compromised = false;

		yara_rules.forEach(element => {
			exec(`yara ../rules/email/${element} ${attachmentName}`, (error, stdout, stderr) => {
				if (error) {
				  console.error(`Error executing command: ${error}`);
				  return;
				}
				if(stdout != null)
					compromised = true;
			  });
		});

		if(compromised)
			return { flag: 'UNSAFE', msg: 'At least one potential threat found.' };
		else
			return { flag: 'SAFE', msg: 'No threat found.' };
	  }
	} catch (error) {
	  console.log(error);
	  throw error;
	}
  }
  

async function getMessages(token) {
	const config = {
	  headers: {
		'Authorization': `Bearer ${token}`
	  },
	  params: {
		maxResults: 500
	  }
	};
  
	try {
	  let nextPageToken;
	  let allMessages = [];
  
	  do {
		const url = nextPageToken
		  ? `https://gmail.googleapis.com/gmail/v1/users/me/messages?pageToken=${nextPageToken}`
		  : 'https://gmail.googleapis.com/gmail/v1/users/me/messages';
  
		const response = await axios.get(url, config);
  
		const messagePromises = response.data.messages.map(async (message) => {
		  const data = await axios.get(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`, config);
  
		  const messageData = {
			id: data.data.id,
			msg: data.data.snippet,
		  };
  
		  const sub_res = data.data.payload.headers.reduce((headers, header) => {
			if (
			  header.name === 'Date' ||
			  header.name === 'From' ||
			  header.name === 'To' ||
			  header.name === 'Subject'
			) {
			  headers[header.name.toLowerCase()] = header.value;
			}
			return headers;
		  }, {});
  
		  const ordered_sub_res = [
			sub_res.date,
			sub_res.from,
			sub_res.to,
			sub_res.subject
		  ];
  
		  messageData.headers = ordered_sub_res;
		  return messageData;
		});
  
		const results = await Promise.allSettled(messagePromises);
		const validResults = results.filter((result) => result.status === 'fulfilled');
		const messageDataArray = validResults.map((result) => result.value);
  
		allMessages = allMessages.concat(messageDataArray);
  
		nextPageToken = response.data.nextPageToken;
	  } while (nextPageToken);
  
	  return allMessages;
	} catch (error) {
	  console.error('Request error:', error);
	  return null; // Handle error case
	}
  }
  
app.get("/analyse", async (req,res) => {
	if(req.headers.authorization.split(" ")[1] != token)
	{
		token = req.headers.authorization.split(" ")[1];
		const data = await getMessages(token);
		res.json(data);
	}
})

app.get("/analyse/id", async (req, res) => {
	const id = req.headers.id;

	const data = await emailAnalysis(id);
	console.log("data: ", data)
	res.json(data);
})

app.use("/auth", authRoute);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listenting on port ${port}...`));



/* FUNCTIONS WHICH CAN BE USEFUL TO MANIPULATE GMAIL API


searchEmails = async (searchItem)=>{
	let config = {
	  method: 'get',
	  maxBodyLength: Infinity,
	  url: 'https://www.googleapis.com/gmail/v1/users/me/messages?q=' + searchItem,
	  headers: {
		'Authorization': `Bearer ${token}` //////////////////////////////////////////////////////
	  }
	};
	var threadID = "";


	await axios.request(config)
	.then(async (response) => {
	  threadID = await response.data["messages"][0].id;
	  console.log(threadID);
	})
	.catch((error) => {
	  console.log(error);
	});
	return threadID;
}

readAllEmails = async () => {
	let config = {
		method: 'get',
		maxBodyLength: Infinity,
		url: 'https://gmail.googleapis.com/gmail/v1/users/me/messages',
		headers: { 
			'Authorization': `Bearer ${token}` //////////////////////////////////////////////////////
		}
	  };
	  
	  await axios.request(config)
	  .then(async (response) => {
		data = await response.data;
		console.log("api data readAllEmails: " + data)
	  })
	  .catch((error) => {
		console.log(error);
	  });
	  return data;
}

readEmailContent = async (emailID)=>{
	let config = {
	  method: 'get',
	  maxBodyLength: Infinity,
	  url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailID}`,
	  headers: {
		'Authorization': `Bearer ${token}` ////////////////////////////////////////////////////////////
	  }
	};
	var data = {};

	await axios.request(config)
	.then(async (response) => {
		data = await response.data;
	})
	.catch((error) => {
	  console.log(error);
	});
	return data;
}

readEmail = async (searchText)=>{
	const threadID = await this.searchEmails(searchText);
	const message = await this.readEmailContent(threadID);

	const encodedData = message.payload["parts"][0].body.data;
	const decodedData = Buffer.from(encodedData, "base64").toString("ascii");
	
	const attachmentID = await this.getAttachmentID(threadID);
	const attachment = await this.getAttachment(threadID);
	console.log(attachment);

	return decodedData;
}

getAttachmentID = async (emailID)=>{
	const message = await this.readEmailContent(emailID);
	const attachmentID = message.payload["parts"][1].body.attachmentId;
	return attachmentID;
}

getAttachment = async (emailID)=>{
	let config = {
		method: 'get',
		maxBodyLength: Infinity,
		url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailID}/attachments/${await getAttachmentID(emailID)}`,
		headers: { 
			'Authorization': `Bearer ${token}` ////////////////////////////////////////////////////////////
		  }
	};

	const message = await this.readEmailContent(emailID);
	const attachmentName = message.payload["parts"][1].filename;

	var data = {};

	await axios.request(config)
	.then(async (response) => {
		data = await response.data.data;
		fs.writeFileSync(attachmentName, data, 'base64');
		console.log('Attachment downloaded successfully.');
	})
	.catch((error) => {
		console.log(error);
	});
	
	return data;
}
*/