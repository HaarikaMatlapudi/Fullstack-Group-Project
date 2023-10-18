var express = require('express');
var app=express();
app.use(express.static('public'));
var passwordHash = require('password-hash');

const ejs = require('ejs');
const bp = require('body-parser');
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Filter} = require('firebase-admin/firestore');
var serviceAccount = require("./key.json");
const bodyParser = require('body-parser');

initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();

const studentsData=[];

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/public/' + 'home.html');
});

app.get('/registerfacultysubmit', (req,res) => {
  res.sendFile(__dirname + '/public/' + 'register1.html');
});

app.get('/registerstudentsubmit', (req, res) => {
  res.sendFile(__dirname + '/public/' + 'register2.html');
});

app.post('/registerfacultysubmit', (req, res) => {
  console.log(req.body);
  const mail = req.body.mail;
  const password = req.body.password;
  db.collection('faculty')
  .where(
    Filter.or(
      Filter.where('mail','==',mail),
      Filter.where('password','==',password)
    )
  )
  .get()
  .then((docs) => {
    if (docs.size > 0) {
      res.send("hey already you have account with either this email or password");
    }
    else {
    db.collection('faculty')
      .add({
        Firstname:req.body.fname,
        Middlename:req.body.mname,
        Lastname:req.body.lname,
        Email: req.body.mail,
        Password: passwordHash.generate(req.body.password),
        Yearofjoining:req.body.yearj,
        Phonenumber:req.body.phone,
        Aadharnumber:req.body.aadhar,
        undergraduate_college:req.body.college1,
        Branch1:req.body.branch1,
        Grade1:req.body.grade1,
        Yearofgraduation:req.body.yearg1,
        postgraduate_college:req.body.college2,
        Branch2:req.body.branch2,
        Grade1:req.body.grade2,
        Yearofgraduation:req.body.yearg2,
        Doornumber:req.body.door,
        Street:req.body.street,
        District:req.body.district,
        State:req.body.state,
        Experience:req.body.experience,
      })
      .then(() => {
      //login page
        res.sendFile(__dirname + '/public/' + 'login1.html');
      })
      .catch(() => {
        res.send('something went wrong');
      });
    }
  });
});

app.post('/registerstudentsubmit', (req, res) => {
  console.log(req.body);
  const mail = req.body.mail;
  const password = req.body.password;
  db.collection('student')
  .where(
    Filter.or(
      Filter.where('mail','==',mail),
      Filter.where('password','==',password)
    )
  )
  .get()
  .then((docs) => {
    if (docs.size > 0) {
      res.send("hey already you have account with either this email or password");
    }
    else {
    db.collection('student')
      .add({
        Firstname:req.body.fname,
        Middlename:req.body.mname,
        Lastname:req.body.lname,
        Email: req.body.mail,
        Registration_Number: passwordHash.generate(req.body.password),
        Course:req.body.course,
        Section:req.body.sec,
        Yearofjoining:req.body.yearj,
        Yearofgraduation:req.body.yearg,
        Phoennumber:req.body.phone,
        Aadharnumber:req.body.aadhar,
        Doornumber:req.body.door,
        Street:req.body.street,
        District:req.body.district,
        State:req.body.state,
      })
      .then(() => {
      //login page
        res.sendFile(__dirname + '/public/' + 'login2.html');
      })
      .catch(() => {
        res.send('something went wrong');
      });
    }
  });
});

app.post('/loginfacultysubmit', function (req, res) {
  // passwordHash.verify(req.query.password, hashedPassword)
 
   db.collection('faculty')
   .where('Email','==',req.body.email)
   .get()
   .then((docs) => {
    const facultyData = [];
    let verified = false;
    docs.forEach((doc) => {
      verified = passwordHash.verify(req.body.password, doc.data().Password);
      facultyData.push(doc.data()); 
    });
     if (verified&&facultyData.length > 0) {
      res.render('faculty.ejs',{ facultyData });
      console.log(verified);
     } else {
        res.send('fail');
        console.log(verified);
     }
   })
   .catch((error) => {
    console.error("Error fetching data:", error);
    res.send('fail');
  });
 });

app.post('/loginstudentsubmit', function (req, res) {
  // passwordHash.verify(req.query.password, hashedPassword)
 
   db.collection('student')
   .where('Email','==',req.body.email)
   .get()
   .then((docs) => {
    const studentsData = [];
    let verified = false;
    docs.forEach((doc) => {
      verified = passwordHash.verify(req.body.password, doc.data().Registration_Number);
      studentsData.push(doc.data()); 
    });
     if (verified&&studentsData.length > 0) {
      res.render('student.ejs',{ studentsData });
      console.log(verified);
     } else {
        res.send('fail');
        console.log(verified);
     }
   })
   .catch((error) => {
    console.error("Error fetching data:", error);
    res.send('fail');
  });
 });
 
 app.get('/studentportal', (req,res) => {
  res.render("student.ejs",{studentsData: [] });
});


app.listen(3000, () => {
  console.log('server started');
});