'use strict';
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const jwtKey = 'my_secret_key'
const jwtExpirySeconds = 3000

const mysql = require('mysql2');
const e = require('express');

const con = mysql.createConnection({
    host: "istwebclass.org",
    user: "kdrawdy_CPT262",
    password: "KDcpt262DB!!",
    database: "kdrawdy_CapstoneDB"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res){
    res.sendFile(path.join(__dirname + '/public/login.html'));
});

// < ------------------------- Login ------------------------- > //

app.get('/getloggedoutback/', function (req, res) {
    res.cookie('token', 2, { maxAge: 0 })
    res.send({ redirect: '/backend/index.html'});
});

app.get('/getloggedinback/', function (req, res) {

    var viewpage = 0;
    const validtoken = req.cookies.token
    console.log('token new:', validtoken);
    var payload;
    
    if(!validtoken) {
        viewpage = 0;
        console.log("Not Valid Token");
    } else {
        try {
            payload = jwt.verify(validtoken, jwtKey);
            if (!payload) {
                console.log("Payload is undefined!");
            } else {
                console.log("Token Payload:", payload);
                console.log('Client ID:', payload.clientid || payload.userid);
            }
            viewpage = payload.userid;
          } catch (e) {
            if (e instanceof jwt.JsonWebTokenError) {
                console.error("Token Verification Error:", e);
                viewpage = 0;
                console.log("Not Valid Token 2");
            }
            viewpage = 0;
            console.log("Not Valid Token 3");
          }
    }
    
    console.log("View: " + viewpage);
    
    return res.send(JSON.stringify(viewpage));
    
});

app.get('/getloggedoutfront/', function (req, res) {
    res.cookie('token', 2, { maxAge: 0 })
    res.send({ redirect: 'login.html'});
});

app.get('/getloggedinfront/', function (req, res) {

    var viewpage = 0;
    const validtoken = req.cookies.token
    console.log('token new:', validtoken);
    var payload;
    
    if(!validtoken) {
        viewpage = 0;
        console.log("Not Valid Token");
    } else {
        try {
            payload = jwt.verify(validtoken, jwtKey);
            if (!payload) {
                console.log("Payload is undefined!");
            } else {
                console.log("Token Payload:", payload); 
                console.log('Client ID:', payload.clientid || payload.userid);
            }
            viewpage = payload.clientid;
          } catch (e) {
            if (e instanceof jwt.JsonWebTokenError) {
                console.error("Token Verification Error:", e);
                viewpage = 0;
                console.log("Not Valid Token 2");
            }
            viewpage = 0;
            console.log("Not Valid Token 3");
          }
    }
    
    console.log("View: " + viewpage);
    
    return res.send(JSON.stringify(viewpage));
    
});

app.post('/loginback/', function (req, res) {
    var uemail = req.body.kd_useremail;
    var upw = req.body.kd_userpw;

    var sqlsel = `SELECT * 
                FROM Users 
                where userEmail = ?`;

    var inserts = [uemail];

    var sql = mysql.format(sqlsel, inserts);
    console.log(sql);

    con.query(sql, function (err, data)     {
        //Checks to see if there is data in the result
        if (data.length > 0) {
            console.log("Email correct: ");
            var userid=data[0].userID;
            console.log(data[0].userPassword);

            bcrypt.compare(upw, data[0].userPassword, function (err, passwordCorrect ) {
                if (err) {
                    throw err;
                } else if (!passwordCorrect) {
                    console.log("Password Incorrect");
                } else {
                    console.log("Password Correct");
                    const token = jwt.sign({ userid }, jwtKey, {
                        algorithm: 'HS256',
                        expiresIn: jwtExpirySeconds
                    });
                    res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 })
                    res.send({ redirect: '/backend/searchUser.html'});
                }
            });
        } else {
            console.log("Incorrect user name or password!!");
        }
    });
});

app.post('/loginfront/', function (req, res) {
    var cemail = req.body.kd_clientemail;
    var cpw = req.body.kd_clientpw;

    var sqlsel = `SELECT * 
                FROM Clients 
                where clientEmail = ?`;

    var inserts = [cemail];

    var sql = mysql.format(sqlsel, inserts);
    console.log(sql);

    con.query(sql, function (err, data)     {
        //Checks to see if there is data in the result
        if (data.length > 0) {
            console.log("Email correct: ");
            var cliid=data[0].clientID;
            console.log(data[0].clientPassword);

            bcrypt.compare(cpw, data[0].clientPassword, function (err, passwordCorrect ) {
                if (err) {
                    throw err;
                } else if (!passwordCorrect) {
                    console.log("Password Incorrect");
                } else {
                    console.log("Password Correct");
                    const token = jwt.sign({ clientid: cliid }, jwtKey, {
                        algorithm: 'HS256',
                        expiresIn: jwtExpirySeconds
                    });
                    res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 })
                    res.send({ redirect: '/insertClient.html'});
                }
            });
        } else {
            console.log("Incorrect user name or password!!");
        }
    });
});



// < ------------------------- Appointments ------------------------- > //

app.post('/appointment/', function (req, res,) {

    var aservice = req.body.kd_appointmentservice;
    var aclient = req.body.kd_appointmentclient;
    var astatus = req.body.kd_appointmentstatus;
    var astart = req.body.kd_appointmentstart;
    var aend = req.body.kd_appointmentend;

    var sqlins = `INSERT INTO Appointments
                (serviceID, clientID, appointmentStatusID, appointmentStart, 
                appointmentEnd)
                VALUES (?, ?, ?, ?, ?)`;

    var inserts = [aservice, aclient, astatus, astart, aend];
        
    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect('insertAppointment.html');
        res.end();
    });
});

app.get('/getappointment/', function (req, res) {
    var aid = req.query.kd_appointmentid;
    var aservice = req.query.kd_appointmentservice;
    var aclient = req.query.kd_appointmentclient;
    var astart = req.query.kd_appointmentstart;
    var aend = req.query.kd_appointmentend;
    var astatus = req.query.kd_appointmentstatus;

    var sqlsel = `SELECT a.appointmentID, 
                ap.appointmentStatusName, 
                s.serviceName, 
                c.clientEmail,
                DATE_FORMAT(a.appointmentStart, '%Y-%m-%d %H:%i:%s') AS formattedStart,
                DATE_FORMAT(a.appointmentEnd, '%Y-%m-%d %H:%i:%s') AS formattedEnd
                FROM Appointments a
                INNER JOIN appointmentStatus ap ON a.appointmentStatusID = ap.appointmentStatusID
                INNER JOIN Services s ON a.serviceID = s.serviceID
                INNER JOIN Clients c ON a.clientID = c.clientID
                WHERE 1=1`;

    if (aid) {
        var idaddon = ' AND a.appointmentID = ?';
        var idaddonvar = aid;
    } else {
        var idaddon = '';
        var idaddonvar = null;
    }

    if (aservice > 0) {
        var serviceaddon = ' AND a.serviceID = ?';
        var serviceaddonvar = aservice;
    } else {
        var serviceaddon = ' AND a.serviceID LIKE ?';
        var serviceaddonvar = '%%';
    }

    if (astatus > 0) {
        var statusaddon = ' AND a.appointmentStatusID = ?';
        var statusaddonvar = astatus;
    } else {
        var statusaddon = ' AND a.appointmentStatusID LIKE ?';
        var statusaddonvar = '%%';
    }

    if (aclient > 0) {
        var clientaddon = ' AND a.clientID = ?';
        var clientaddonvar = aclient;
    } else {
        var clientaddon = ' AND a.clientID LIKE ?';
        var clientaddonvar = '%%';
    }

    if (astart) {
        var startaddon = ' AND a.appointmentStart >= ?';
        var startaddonvar = astart;
    } else {
        var startaddon = '';
        var startaddonvar = null;
    }

    if (aend) {
        var endaddon = ' AND a.appointmentEnd < ?';
        var endaddonvar = aend;
    } else {
        var endaddon = '';
        var endaddonvar = null;
    }

    sqlsel += idaddon + serviceaddon + statusaddon + clientaddon + startaddon + endaddon;

    var inserts = [];
    if (idaddonvar !== null) inserts.push(idaddonvar);
    inserts.push(serviceaddonvar, statusaddonvar, clientaddonvar);
    if (startaddonvar !== null) inserts.push(startaddonvar);
    if (endaddonvar !== null) inserts.push(endaddonvar);

    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function(err, data) { 
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});




app.get('/getsingleappointment/', function (req, res) {

    var aid = req.query.kd_upapptid;

    var sqlsel = `SELECT * FROM Appointments WHERE appointmentID = ?`;
    var inserts = [aid];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        
        res.send(JSON.stringify(data));
    });
});

app.post('/updatesingleappointment', function (req, res, ) {

    var aid = req.body.kd_upappointmentid;
    var aclient = req.body.kd_upappointmentclient;
    var astart = req.body.kd_upappointmentstart;
    var aend = req.body.kd_upappointmentend;
    var aservice = req.body.kd_upappointmentservice;
    var astatus = req.body.kd_upappointmentstatus;
    
    var sqlins = `UPDATE Appointments 
                SET clientID = ?, 
                appointmentStart = ?, 
                appointmentEnd = ?,
                serviceID = ?, 
                appointmentStatusID = ?
                WHERE appointmentID = ? `;
    var inserts = [aclient, astart, aend, aservice, astatus, aid];

    var sql = mysql.format(sqlins, inserts);

    console.log(sql);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record updated");
            
            res.end();
        });
});

app.get('/getservice/', function (req, res) {
    
    var sqlsel = 'SELECT * FROM Services';
    var sql = mysql.format(sqlsel);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getclients/', function (req, res) {
    
    var sqlsel = 'SELECT * FROM Clients';
    var sql = mysql.format(sqlsel);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getapptstatus/', function (req, res) {
    
    var sqlsel = 'SELECT * FROM appointmentStatus';
    var sql = mysql.format(sqlsel);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

// < -------------------------- Clients -------------------------- > //

app.post('/client/', function (req, res,) {

    var cfname = req.body.kd_clientfname;
    var clname = req.body.kd_clientlname;
    var cphone = req.body.kd_clientphone;
    var cemail = req.body.kd_clientemail
    var cpw = req.body.kd_clientpw;

    var saltRounds = 10;
    var theHashedPW = '';

    bcrypt.hash(cpw, saltRounds, function (err, hashedPassword) {

        if (err) {
            console.log("Bad on encrypt");
            return;
        } else {
            
            theHashedPW = hashedPassword;
            console.log("Password Enc: " + theHashedPW);

            var sqlins = `INSERT INTO Clients
                        (clientFirstName, clientLastName, clientPhone, clientEmail, clientPassword)
                         VALUES (?, ?, ?, ?, ?)`;

            var inserts = [cfname, clname, cphone, cemail, theHashedPW];

            var sql = mysql.format(sqlins, inserts);

            con.execute(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                res.redirect('insertClient.html');
                res.end();
            });
        }
    });
});

app.get('/getclient/', function (req, res) {

    var cid = req.query.kd_clientid;
    var cfname = req.query.kd_clientfname;
    var clname = req.query.kd_clientlname;
    var cphone = req.query.kd_clientphone;
    var cemail = req.query.kd_clientemail;

    var sqlsel = `SELECT * FROM Clients
                WHERE 1=1`;

    if (cid) {
        var idaddon = ' AND clientID = ?'
        var idaddonvar = cid;
    } else {
        var idaddon = '';
        var idaddonvar = null;
    }

    if (cfname) {
        var fnameaddon = ' AND clientFirstName LIKE ?'
        var fnamaddonvar = `%${cfname}%`;
    } else {
        var fnameaddon = ' AND clientFirstName LIKE ?'
        var fnamaddonvar = '%%'
    }

    if (clname) {
        var lnameaddon = ' AND clientLastName LIKE ?'
        var lnameaddonvar = `%${clname}%`;
    } else {
        var lnameaddon = ' AND clientLastName LIKE ?'
        var lnameaddonvar = '%%';
    }

    if (cphone) {
        var phoneaddon = ' AND clientPhone LIKE ?'
        var phoneaddonvar = `%${cphone}%`;
    } else {
        var phoneaddon = ' AND clientPhone LIKE ?'
        var phoneaddonvar = '%%';
    }

    if (cemail) {
        var emailaddon = ' AND clientEmail LIKE ?'
        var emailaddonvar = `%${cemail}%`;
    } else {
        var emailaddon = ' AND clientEmail LIKE ?'
        var emailaddonvar = '%%';
    }

    sqlsel += idaddon + fnameaddon + lnameaddon + phoneaddon + emailaddon;
    
    var inserts = [];
    if (idaddonvar !== null) inserts.push(idaddonvar);
    inserts.push(fnamaddonvar, lnameaddonvar, phoneaddonvar, emailaddonvar)

    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getsingleclient/', function (req, res) {

    var cid = req.query.kd_upcliid;

    var sqlsel = `SELECT * FROM Clients WHERE clientID = ?`;
    var inserts = [cid];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        
        res.send(JSON.stringify(data));
    });
});

app.post('/updatesingleclient', function (req, res, ) {

    var cid = req.body.kd_upclientid;
    var cemail = req.body.kd_upclientemail;
    var cfname = req.body.kd_upclientfname;
    var clname = req.body.kd_upclientlname;
    var cphone = req.body.kd_upclientphone;
    
    var sqlins = `UPDATE Clients 
                SET clientEmail = ?, 
                clientFirstName = ?, 
                clientLastName = ?,
                clientPhone = ?
                WHERE clientID = ? `;
    var inserts = [cemail, cfname, clname, cphone, cid];

    var sql = mysql.format(sqlins, inserts);
console.log(sql);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record updated");
            
            res.end();
        });
});

app.get('/getusers/', function (req, res) {
    
    var sqlsel = 'SELECT * FROM Users';
    var sql = mysql.format(sqlsel);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

// < -------------------------- Inventory -------------------------- > //

app.post('/inventory/', function (req, res,) {

    var ilevel = req.body.kd_inventorylevel;
    var ilastupdated = req.body.kd_inventorylastupdated;
    var iproduct = req.body.kd_inventoryproduct;

    var sqlins = `INSERT INTO Inventory
                (inventoryLevel, productID, inventoryLastUpdated)
                VALUES (?, ?, ?)`;

    var inserts = [ilevel, iproduct, ilastupdated];
        
    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect('insertInventory.html');
        res.end();
    });
});

app.get('/getinventory/', function (req, res) {
    var iid = req.query.kd_inventoryid;
    var ilevel = req.query.kd_inventorylevel;
    var ilastupdated = req.query.kd_inventorylastupdated;
    var iproduct = req.query.kd_inventoryproduct;

    var sqlsel = `SELECT i.*, p.productName,
                DATE_FORMAT(i.inventoryLastUpdated, '%Y-%m-%d %H:%i:%s') AS formattedupdate
                FROM Inventory i
                INNER JOIN Products p ON i.productID = p.productID
                WHERE 1=1`;

    if (iid) {
        var idaddon = ' AND i.inventoryID = ?';
        var idaddonvar = iid;
    } else {
        var idaddon = '';
        var idaddonvar = null;
    }

    if (ilevel) {
        var leveladdon  = ' AND inventoryLevel = ?';
        var leveladdonvar = ilevel;
    } else {
        var leveladdon = '';
        var leveladdonvar = null;
    }

    if (ilastupdated) {
        var updatedaddon = ' AND i.inventoryLastUpdated >= ?';
        var updatedaddonvar = ilastupdated;
    } else {
        var updatedaddon = '';
        var updatedaddonvar = null;
    }
            
    if (iproduct > 0) {
        var productaddon = ' AND p.productID LIKE ?';
        var productaddonvar = iproduct;
    } else {
        var productaddon = ' AND p.productID LIKE ?';
        var productaddonvar = '%%';
    }

    sqlsel += idaddon + leveladdon + updatedaddon + productaddon;
    
    var inserts = [];
    if (idaddonvar !== null) inserts.push(idaddonvar);
    if (leveladdonvar !== null) inserts.push(leveladdonvar);
    if (updatedaddonvar !== null) inserts.push(updatedaddonvar);
    inserts.push (productaddonvar);

    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getsingleinventory/', function (req, res) {

    var iid = req.query.kd_upinvid;

    var sqlsel = `SELECT * FROM Inventory WHERE inventoryID = ?`;
    var inserts = [iid];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        
        res.send(JSON.stringify(data));
    });
});

app.post('/updatesingleinventory', function (req, res, ) {

    var iid = req.body.kd_upinventoryid;
    var ilevel = req.body.kd_upinventorylevel;
    var iproduct = req.body.kd_upinventoryproduct;
    var ilastupdated = req.body.kd_upinventorylastupdated;
    
    var sqlins = `UPDATE Inventory 
                SET inventoryLevel = ?, 
                productID = ?, 
                inventoryLastUpdated = ?
                WHERE inventoryID = ? `;
    var inserts = [ilevel, iproduct, ilastupdated, iid];

    var sql = mysql.format(sqlins, inserts);
console.log(sql);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record updated");
            
            res.end();
        });
});

app.get('/getproducts/', function (req, res) {
    
    var sqlsel = 'SELECT * FROM Products';
    var sql = mysql.format(sqlsel);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

// < --------------------------- Products --------------------------- > //

app.post('/product/', function (req, res, ) { 

    var pname = req.body.kd_productname;
    var pquantity = req.body.kd_productquantity;
    var pprice = req.body.kd_productprice;
    console.log(pname); 


    var sqlins = `INSERT INTO Products 
                (productName, productQuantity, productPrice) 
                VALUES (?, ?, ?)`;
    var inserts = [pname, pquantity, pprice]; 

    var sql = mysql.format(sqlins, inserts); 

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted!");
        res.redirect('insertProduct.html'); 
    });
});

app.get('/getproduct/', function (req, res) {
    var pid = req.query.kd_productid;
    var pname = req.query.kd_productname;
    var pprice = req.query.kd_productprice;
    var pquantity = req.query.kd_productquantity;

    var sqlsel = `SELECT * FROM Products 
                WHERE 1=1`;

    if (pid) {
        var idaddon = ' AND productID = ?';
        var idaddonvar = pid;
    } else {
        var idaddon = '';
        var idaddonvar = null;
    }

    if (pname) {
        var nameaddon = ' AND productName LIKE ?';
        var nameaddonvar = `%${pname}%`;
    } else {
        var nameaddon = ' AND productName LIKE ?';
        var nameaddonvar = '%%';
    }

    if (pprice) {
        var priceaddon = ' AND productPrice LIKE ?';
        var priceaddonvar = `%${pprice}%`;
    } else {
        var priceaddon = ' AND productPrice LIKE ?';
        var priceaddonvar = '%%'
    }

    if (pquantity) {
        var quantityaddon = ' AND productQuantity LIKE ?';
        var quantityaddonvar = `%${pquantity}%`;
    } else {
        var quantityaddon = ' AND productQuantity LIKE ?';
        var quantityaddonvar = '%%';
    }

    sqlsel += idaddon + nameaddon + priceaddon + quantityaddon;
    
    var inserts = [];
    if (idaddonvar !== null) inserts.push(idaddonvar);
    inserts.push(nameaddonvar, priceaddonvar, quantityaddonvar);

    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getsingleproduct/', function (req, res) {

    var pid = req.query.kd_upprodid;

    var sqlsel = `SELECT * FROM Products WHERE productID = ?`;
    var inserts = [pid];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        
        res.send(JSON.stringify(data));
    });
});

app.post('/updatesingleproduct', function (req, res, ) {

    var pid = req.body.kd_upproductid;
    var pname = req.body.kd_upproductname;
    var pprice = req.body.kd_upproductprice;
    var pquantity = req.body.kd_upproductquantity;
    
    var sqlins = `UPDATE Products 
                SET productName = ?, 
                productPrice = ?, 
                productQuantity = ?
                WHERE productID = ? `;
    var inserts = [pname, pprice, pquantity, pid];

    var sql = mysql.format(sqlins, inserts);
console.log(sql);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record updated");
            
            res.end();
        });
});

// < --------------------------- Purchases --------------------------- > //

app.post('/purchases/', function (req, res, ) { 

    var puser= req.body.kd_purchaseuser;
    var pdate = req.body.kd_purchasedate;
    var pstatus = req.body.kd_purchasestatus;
    var ptotal = req.body.kd_purchasetotal;
    console.log(pdate); 


    var sqlins = `INSERT INTO Purchases 
                (userID, purchaseDate, purchaseStatusID, purchaseTotal) 
                VALUES (?, ?, ?, ?)`;
    var inserts = [puser, pdate, pstatus, ptotal]; 

    var sql = mysql.format(sqlins, inserts); 

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted!");
        res.redirect('insertPurchases.html'); 
    });
});

app.get('/getpurchases/', function (req, res) {
    var pid = req.query.kd_purchaseid;
    var puser = req.query.kd_purchaseuser;
    var pdate = req.query.kd_purchasedate;
    var pstatus = req.query.kd_purchasestatus;
    var ptotal = req.query.kd_purchasetotal;

    var sqlsel = `SELECT p.*, 
                u.userEmail, 
                s.purchaseStatusName,
                DATE_FORMAT(p.purchaseDate, '%Y-%m-%d %H:%i:%s') AS formattedDate
                FROM Purchases p
                INNER JOIN Users u ON p.userID = u.userID
                INNER JOIN purchaseStatus s ON p.purchaseStatusID = s.purchaseStatusID
                WHERE 1=1`;

    if (pid) {
        var idaddon = ' AND p.purchaseID = ?';
        var idaddonvar = pid;
    } else {
        var idaddon = '';
        var idaddonvar = null;
    }

    if (puser > 0) {
        var useraddon = ' AND u.userID = ?';
        var useraddonvar = puser;
    } else {
        var useraddon = ' AND u.userID LIKE ?';
        var useraddonvar = '%%';
    }

    if (pdate) {
        var dateaddon = ' AND p.purchaseDate >= ?';
        var dateaddonvar = pdate;
    } else {
        var dateaddon = '';
        var dateaddonvar = null;
    }

    if (pstatus > 0) {
        var statusaddon = ' AND s.purchaseStatusID = ?';
        var statusaddonvar = pstatus;
    } else {
        var statusaddon = ' AND s.purchaseStatusID LIKE ?';
        var statusaddonvar = '%%';
    }

    if (ptotal) {
        var totaladdon = ' AND p.purchaseTotal = ?';
        var totaladdonvar = ptotal;
    } else {
        var totaladdon = ' AND p.purchaseTotal LIKE ?';
        var totaladdonvar = '%%';
    }
          
    sqlsel += idaddon + useraddon + dateaddon + statusaddon + totaladdon;

    var inserts = [];
    if (idaddonvar !== null) inserts.push(idaddonvar);
    inserts.push(useraddonvar);
    if (dateaddonvar !== null) inserts.push(dateaddonvar);
    inserts.push(statusaddonvar, totaladdonvar);

    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getsinglepurchase/', function (req, res) {

    var pid = req.query.kd_uppurid;

    var sqlsel = `SELECT * FROM Purchases WHERE purchaseID = ?`;
    var inserts = [pid];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        
        res.send(JSON.stringify(data));
    });
});

app.post('/updatesinglepurchase/', function (req, res, ) {

    var pid = req.body.kd_uppurchaseid;
    var puser = req.body.kd_uppurchaseuser;
    var pdate = req.body.kd_uppurchasedate;
    var pstatus = req.body.kd_uppurchasestatus;
    var ptotal = req.body.kd_uppurchasetotal;
    
    var sqlins = `UPDATE Purchases 
                SET userID = ?, 
                purchaseDate = ?, 
                purchaseStatusID = ?,
                purchaseTotal = ?
                WHERE purchaseID = ? `;
    var inserts = [puser, pdate, pstatus, ptotal, pid];

    var sql = mysql.format(sqlins, inserts);
    console.log(sql);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record updated");
            
            res.end();
        });
});

app.get('/getpstatus/', function (req, res) {
    
    var sqlsel = 'SELECT * FROM purchaseStatus';
    var sql = mysql.format(sqlsel);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

// < ----------------------- Purchase Details ----------------------- > //

app.post('/purchasedets/', function (req, res, ) { 

    var ppurchaseid = req.body.kd_purchasedetpurchaseid;
    var pproduct = req.body.kd_purchasedetproduct;
    var pquantity = req.body.kd_purchasedetquantity;
    var ptotal = req.body.kd_purchasedettotal;
    console.log(ptotal); 


    var sqlins = `INSERT INTO purchaseDetails 
                (purchaseID, productID, purchaseQuantity, purchaseTotal) 
                VALUES (?, ?, ?, ?)`;
    var inserts = [ppurchaseid, pproduct, pquantity, ptotal]; 

    var sql = mysql.format(sqlins, inserts); 

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted!");
        res.redirect('insertPurchaseDetails.html'); 
    });
});

app.get('/getpurchasedets/', function (req, res) {
    var pid = req.query.kd_purchasedetid;
    var ppurchaseid = req.query.kd_purchasedetpurchaseid;
    var pproduct = req.query.kd_purchasedetproduct;
    var pquantity = req.query.kd_purchasedetquantity;
    var ptotal = req.query.kd_purchasedettotal;

    var sqlsel = `SELECT pd.*, p.productName
                FROM purchaseDetails pd
                INNER JOIN Products p ON pd.productID = p.productID
                INNER JOIN Purchases pc ON pd.purchaseID = pc.purchaseID
                WHERE 1=1`;

    if (pid) {
        var idaddon = ' AND pd.purchaseDetailID = ?';
        var idaddonvar = pid;
    } else {
        var idaddon = '';
        var idaddonvar = null;
    }

    if (ppurchaseid) {
        var pidaddon = ' AND pd.purchaseID = ?';
        var pidaddonvar = ppurchaseid;
    } else {
        var pidaddon = '';
        var pidaddonvar = null;
    }

    if (pproduct > 0) {
        var productaddon = ' AND pd.productID LIKE ?';
        var productaddonvar = pproduct;
    } else {
        var productaddon = ' AND pd.productID LIKE ?';
        var productaddonvar = '%%';
    }

    if (pquantity) {
        var quantityaddon = ' AND pd.purchaseQuantity = ?';
        var quantityaddonvar = pquantity;
    } else {
        var quantityaddon = ' AND pd.purchaseQuantity LIKE ?';
        var quantityaddonvar = '%%';
    }

    if (ptotal) {
        var totaladdon = ' AND pd.purchaseTotal = ?';
        var totaladdonvar = ptotal;
    } else {
        var totaladdon = ' AND pd.purchaseTotal LIKE ?';
        var totaladdonvar = '%%';
    }

    sqlsel += idaddon + pidaddon + productaddon + quantityaddon + totaladdon;
    
    var inserts = [];
    if (idaddonvar !== null) inserts.push(idaddonvar);
    if (pidaddonvar !== null) inserts.push(pidaddonvar);
    inserts.push(productaddonvar, quantityaddonvar, totaladdonvar);

    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getsinglepurchasedets/', function (req, res) {

    var pid = req.query.kd_uppurdetid;

    var sqlsel = `SELECT * FROM purchaseDetails WHERE purchaseDetailID = ?`;
    var inserts = [pid];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        
        res.send(JSON.stringify(data));
    });
});

app.post('/updatesinglepurchasedets', function (req, res, ) {

    var pid = req.body.kd_uppurchasedetid;
    var ppurchaseid = req.body.kd_uppurchasedetpurchaseid;
    var pproduct = req.body.kd_uppurchasedetproduct;
    var pquantity = req.body.kd_uppurchasedetquantity;
    var ptotal = req.body.kd_uppurchasedettotal;
    
    var sqlins = `UPDATE purchaseDetails
                SET purchaseID = ?, 
                productID = ?, 
                purchaseQuantity = ?,
                purchaseTotal = ?
                WHERE purchaseDetailID = ? `;
    var inserts = [ppurchaseid, pproduct, pquantity, ptotal, pid];

    var sql = mysql.format(sqlins, inserts);
    console.log(sql);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record updated");
            
            res.end();
        });
});

// < ---------------------------- Users ---------------------------- > //

app.post('/user/', function (req, res) {
    var ucategoryid = req.body.kd_usercategoryid;
    var uemail = req.body.kd_useremail;
    var upw = req.body.kd_userpw;
    console.log("PW: " + upw);

    var saltRounds = 10;
    var theHashedPW = '';

    bcrypt.hash(upw, saltRounds, function (err, hashedPassword) {

        if (err) {
            console.log("Bad on encrypt");
            return;
        } else {
            
            theHashedPW = hashedPassword;
            console.log("Password Enc: " + theHashedPW);

            var sqlins = `INSERT INTO Users 
                        (userCategoryID, userEmail, userPassword) 
                        VALUES (?, ?, ?)`;

            var inserts = [ucategoryid, uemail, theHashedPW];

            var sql = mysql.format(sqlins, inserts);

            con.execute(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                res.redirect('insertUser.html');
                res.end();
            });
        }
    });
});

app.get('/getuser/', function (req, res) {
    var uid = req.query.kd_userid;
    var ucategory = req.query.kd_usercategory;
    var uemail = req.query.kd_useremail;

    var sqlsel = `SELECT u.*, c.userCategoryName
                FROM Users u
                INNER JOIN userCategory c ON u.userCategoryID = c.userCategoryID
                WHERE 1=1`;

    if (uid) {
        var idaddon = ' AND u.userID = ?';
        var idaddonvar = uid;
    } else {
        var idaddon = '';
        var idaddonvar = null;
    }

    if (ucategory > 0) {
        var categoryaddon = ' AND u.userCategoryID = ?';
        var categoryaddonvar = ucategory;
    } else {
        var categoryaddon = ' AND u.userCategoryID LIKE ?';
        var categoryaddonvar = '%%';
    }

    if (uemail) {
        var emailaddon = ' AND u.userEmail LIKE ?';
        var emailaddonvar = `%${uemail}%`;
    } else {
        var emailaddon = ' AND u.userEmail LIKE ?';
        var emailaddonvar = '%%';
    }

    sqlsel += idaddon + categoryaddon + emailaddon;
    
    var inserts = [];
    if (idaddonvar !== null) inserts.push(idaddonvar);
    inserts.push(categoryaddonvar, emailaddonvar);

    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getsingleuser/', function (req, res) {

    var uid = req.query.kd_upusid;

    var sqlsel = `SELECT * FROM Users WHERE userID = ?`;
    var inserts = [uid];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        
        res.send(JSON.stringify(data));
    });
});

app.post('/updatesingleuser/', function (req, res, ) {

    var uid = req.body.kd_upuserid;
    var ucategory = req.body.kd_upusercategory;
    var uemail = req.body.kd_upuseremail;
    
    var sqlins = `UPDATE Users
                SET userCategoryID = ?, 
                userEmail = ?
                WHERE userID = ? `;
    var inserts = [ucategory, uemail, uid];

    var sql = mysql.format(sqlins, inserts);
    console.log(sql);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record updated");
            
            res.end();
        });
});

app.get('/getcategory/', function (req, res) {
    
    var sqlsel = 'SELECT * FROM userCategory';
    var sql = mysql.format(sqlsel);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});


// < --------------------------- Services --------------------------- > //

app.post('/services/', function (req, res, ) { 

    var sname = req.body.kd_servicename;
    var sblocks = req.body.kd_serviceblocks;
    var sprice = req.body.kd_serviceprice;
    console.log(sprice); 


    var sqlins = `INSERT INTO Services 
                (serviceName, serviceBlocks, servicePrice) 
                VALUES (?, ?, ?)`;
    var inserts = [sname, sblocks, sprice]; 

    var sql = mysql.format(sqlins, inserts); 

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted!");
        res.redirect('insertServices.html'); 
    });
});

app.get('/getservices/', function (req, res) {
    var sid = req.query.kd_serviceid;
    var sname = req.query.kd_servicename;
    var sblocks = req.query.kd_serviceblocks;
    var sprice = req.query.kd_serviceprice;

    var sqlsel = `SELECT * FROM Services 
                WHERE 1=1`;

    if (sid) {
        var idaddon = ' AND serviceID = ?';
        var idaddonvar = sid;
    } else {
        var idaddon = '';
        var idaddonvar = null;
    }

    if (sname) {
        var nameaddon = ' AND serviceName LIKE ?';
        var nameaddonvar = `%${sname}%`;
    } else {
        var nameaddon = ' AND serviceName LIKE ?';
        var nameaddonvar = '%%';
    }

    if (sblocks) {
        var blocksaddon = ' AND serviceBlocks = ?';
        var blocksaddonvar = sblocks;
    } else {
        var blocksaddon = '';
        var blocksaddonvar = null;
    }

    if (sprice) {
        var priceaddon = ' AND servicePrice LIKE ?';
        var priceaddonvar = `%${sprice}%`;
    } else {
        var priceaddon = ' AND servicePrice LIKE ?';
        var priceaddonvar = '%%';
    }
    
    sqlsel += idaddon + nameaddon + blocksaddon + priceaddon;

    var inserts = [];
    if (idaddonvar !== null) inserts.push(idaddonvar);
    inserts.push(nameaddonvar);
    if (blocksaddonvar !== null) inserts.push(blocksaddonvar);
    inserts.push(priceaddonvar);

    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getsingleservice/', function (req, res) {

    var sid = req.query.kd_upservid;

    var sqlsel = `SELECT * FROM Services WHERE serviceID = ?`;
    var inserts = [sid];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        
        res.send(JSON.stringify(data));
    });
});

app.post('/updatesingleservice', function (req, res, ) {

    var sid = req.body.kd_upserviceid;
    var sname = req.body.kd_upservicename;
    var sblocks = req.body.kd_upserviceblocks;
    var sprice = req.body.kd_upserviceprice;
    
    var sqlins = `UPDATE Services
                SET serviceName = ?, 
                serviceBlocks = ?, 
                servicePrice = ?
                WHERE serviceID = ? `;
    var inserts = [sname, sblocks, sprice, sid];

    var sql = mysql.format(sqlins, inserts);
    console.log(sql);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record updated");
            
            res.end();
        });
});

// < --------------------------- ------- --------------------------- > //


app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
