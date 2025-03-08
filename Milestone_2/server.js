'use strict';
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var bcrypt = require('bcrypt');

const mysql = require('mysql2');

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
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res){
    res.sendFile(path.join(__dirname + '/public/backend/index.html'));
});

// < ------------------------- Login ------------------------- > //

app.post('/loginback/', function (req, res) {
    var uname = req.body.username;
    var upw = req.body.userpw;

    var sqlsel = `SELECT * 
                FROM Users 
                where userUsername = ?`;

    var inserts = [uname];

    var sql = mysql.format(sqlsel, inserts);
    console.log(sql);

    con.query(sql, function (err, data)     {
        //Checks to see if there is data in the result
        if (data.length > 0) {
            console.log("User name correct: ");
            console.log(data[0].userPassword);

            bcrypt.compare(upw, data[0].userPassword, function (err, passwordCorrect ) {
                if (err) {
                    throw err;
                } else if (!passwordCorrect) {
                    console.log("Password Incorrect");
                } else {
                    console.log("Password Correct");
                    res.send({ redirect: '/backend/searchUser.html'});
                }
            });
        } else {
            console.log("Incorrect user name or password!!");
        }
    });
});

app.post('/loginfront/', function (req, res) {
    var uname = req.body.username;
    var upw = req.body.userpw;

    var sqlsel = `SELECT * 
                FROM Users 
                where userUsername = ?`;

    var inserts = [uname];

    var sql = mysql.format(sqlsel, inserts);
    console.log(sql);

    con.query(sql, function (err, data)     {
        //Checks to see if there is data in the result
        if (data.length > 0) {
            console.log("User name correct: ");
            console.log(data[0].userPassword);

            bcrypt.compare(upw, data[0].userPassword, function (err, passwordCorrect ) {
                if (err) {
                    throw err;
                } else if (!passwordCorrect) {
                    console.log("Password Incorrect");
                } else {
                    console.log("Password Correct");
                    res.send({ redirect: '/backend/searchUser.html'});
                }
            });
        } else {
            console.log("Incorrect user name or password!!");
        }
    });
});



// < ------------------------- Appointments ------------------------- > //

app.post('/appointment/', function (req, res,) {

    var aservice = req.body.appointmentService;
    var aclient = req.body.appointmentClient;
    var astatus = req.body.appointmentStatus;
    var astart = req.body.appointmentStart;
    var aend = req.body.appointmentEnd;

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
    var aid = req.query.appointmentid;
    var aserviceid = req.query.appointmentserviceid;
    var aclientid = req.query.appointmentclientid;
    var astart = req.query.appointmentstart;
    var aend = req.query.appointmentend;
    var astatusid = req.query.appointmentstatusid;

    console.log(emailer);

    if (aserviceid > 0) {
        var serviceaddon = ' AND serviceID LIKE ?';
        var serviceaddonvar = aserviceid;
    } else {
        var serviceaddon = ' AND serviceID LIKE ?';
        var serviceaddonvar = '%%';
    }
    if (astatusid > 0) {
        var statusaddon = ' AND appointmentStatusID LIKE ?';
        var statusaddonvar = astatusid;
    } else {
        var statusaddon = ' AND appointmentStatusID LIKE ?';
        var statusaddonvar = '%%';
    }

    var sqlsel = `SELECT a.*, ap.appointmentStatusName, s.serviceName, c.clientID
                FROM Appointments a
                INNER JOIN appointmentStatus ap ON a.appointmentStatusID = ap.appointmentStatusID
                INNER JOIN Services s ON a.serviceID = s.serviceID
                INNER JOIN Clients c ON a.clientID = c.clientID
                WHERE a.appointmentID LIKE ?
                AND a.clientID LIKE ? 
                AND a.appointmentStart LIKE ? 
                AND a.appointmentEnd LIKE ?`
                + serviceaddon + statusaddon;
    
    var inserts = ['%' + aid + '%', '%' + aclientid + '%', '%' + astart + '%', '%' + aend + '%', 
                serviceaddonvar, statusaddonvar];

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

app.get('/getsingleappointment/', function (req, res) {

    var aid = req.query.upapptid;

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

    var aid = req.body.upappointmentid;
    var aclientid = req.body.upappointmentservice;
    var astart = req.body.upappointmentstart;
    var aend = req.body.upappointmentend;
    var aservice = req.body.upappointmentservice;
    var astatus = req.body.upappointmentstatus;
    
    var sqlins = `UPDATE Appointments 
                SET clientID = ?, 
                appointmentStart = ?, 
                appointmentEnd = ?,
                serviceID = ?, 
                appointmentStatusID = ?
                WHERE appointmentID = ? `;
    var inserts = [aclientid, astart, aend, aservice, astatus, aid];

    var sql = mysql.format(sqlins, inserts);
console.log(sql);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record updated");
            
            res.end();
        });
});

app.get('/getservices/', function (req, res) {
    
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

    var cuserid = req.body.clientuserid;
    var cfname = req.body.clientfname;
    var clname = req.body.clientlname;
    var cphone = req.body.clientphone;
    var cemail = req.body.clientemail;

    var sqlins = `INSERT INTO Client
                (userID, clientFirstName, clientLastName, clientPhone, 
                clientEmail)
                VALUES (?, ?, ?, ?, ?)`;

    var inserts = [cuserid, cfname, clname, cphone, cemail];
        
    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect('insertClient.html');
        res.end();
    });
});

app.get('/getclient/', function (req, res) {
    var cid = req.query.clientid;
    var cuserid = req.query.clientuserid;
    var cfname = req.query.clientfname;
    var clname = req.query.clientlname;
    var cphone = req.query.clientphone;
    var cemail = req.query.clientemail;

    var sqlsel = `SELECT c.*, u.userID
                FROM Clients c
                INNER JOIN Users u ON c.userID = u.UserID
                WHERE c.appointmentID LIKE ?
                AND c.clientID LIKE ? 
                AND c.userID LIKE ? 
                AND c.clientFirstName LIKE ?
                AND c.clientLastName LIKE ?
                AND c.clientPhone LIKE ?
                AND c.clientEmail LIKE ?`;
    
    var inserts = ['%' + cid + '%', '%' + cuserid + '%', '%' + cfname + '%', '%' + clname + '%', 
                '%' + cphone + '%', '%' + cemail + '%'];

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

    var cid = req.query.upcliid;

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

app.post('/updatesinglclient', function (req, res, ) {

    var cid = req.body.upclientid;
    var cuser = req.body.upclientuser;
    var cfname = req.body.upclientfname;
    var clname = req.body.upclientlname;
    var cphone = req.body.upclientphone;
    var cemail = req.body.upcemail;
    
    var sqlins = `UPDATE Clients 
                SET userID = ?, 
                clientFirstName = ?, 
                clientLastName = ?,
                clientPhone = ?, 
                clientEmail = ?
                WHERE clientID = ? `;
    var inserts = [cuser, cfname, clname, cphone, cemail, cid];

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

    var ilevel = req.body.inventorylevel;
    var ilastupdated = req.body.inventorylastupdated;
    var iproduct = req.body.inventoryproduct;

    var sqlins = `INSERT INTO Inventory
                (inventoryLevel, productID, inventoryLastUpdated,)
                VALUES (?, ?, ?)`;

    var inserts = [ilevel, ilastupdated, iproduct];
        
    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect('insertInventory.html');
        res.end();
    });
});

app.get('/getinventory/', function (req, res) {
    var iid = req.query.inventoryid;
    var ilevel = req.query.inventorylevel;
    var ilastupdated = req.query.inventorylastupdated;
    var iproduct = req.query.inventoryproduct;

    if (iproduct > 0) {
        var productaddon = ' AND productID LIKE ?';
        var productaddonvar = iproduct;
    } else {
        var productaddon = ' AND productID LIKE ?';
        var productaddonvar = '%%';
    }

    var sqlsel = `SELECT i.*, p.productID
                FROM Inventory i
                INNER JOIN Products p ON i.productID = p.productID
                WHERE i.inventoryID LIKE ?
                AND i.inventoryLevel LIKE ? 
                AND i.inventoryLastUpdated LIKE ?` + productaddon;
    
    var inserts = ['%' + iid + '%', '%' + ilevel + '%', '%' + ilastupdated + '%', productaddonvar];

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

    var iid = req.query.upinvid;

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

    var iid = req.body.upinventoryid;
    var ilevel = req.body.upinventorylevel;
    var iproduct = req.body.upinventoryproduct;
    var ilastupdated = req.body.upinventorylastupdated;
    
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

    var pname = req.body.productname;
    var pquantity = req.body.productquantity;
    var pprice = req.body.productprice;
    console.log(pname); 


    var sqlins = `INSERT INTO Products 
                (productName, Quantity, Price) 
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
    var pid = req.query.productid;
    var pname = req.query.productname;
    var pprice = req.query.productprice;
    var pquantity = req.query.productquantity;

    var sqlsel = `SELECT * Products 
                WHERE productID LIKE ?
                AND productName LIKE ? 
                AND productPrice LIKE ? 
                AND productQuanitity LIKE ?`;
    
    var inserts = ['%' + pid + '%', '%' + pname + '%', '%' + pprice + '%', '%' + pquantity + '%'];

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

    var pid = req.query.upprodid;

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

    var pid = req.body.upproductid;
    var pname = req.body.upproductname;
    var pprice = req.body.upproductprice;
    var pquantity = req.body.upproductquantity;
    
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

    var puserid = req.body.purchaseuserid;
    var pdate = req.body.purchasedate;
    var pstatus = req.body.purchasestatus;
    var ptotal = req.body.purchasetotal;
    console.log(pdate); 


    var sqlins = `INSERT INTO Purchases 
                (userID, purchaseDate, purchaseStatusID, purchaseTotal) 
                VALUES (?, ?, ?, ?)`;
    var inserts = [puserid, pdate, pstatus, ptotal]; 

    var sql = mysql.format(sqlins, inserts); 

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted!");
        res.redirect('insertPurchases.html'); 
    });
});

app.get('/getpurchases/', function (req, res) {
    var pid = req.query.purchaseid;
    var puser = req.query.purchaseuser;
    var pdate = req.query.purchasedate;
    var pstatus = req.query.purchasestatus;
    var ptotal = req.query.purchasetotal;

    if (puser > 0) {
        var useraddon = ' AND userID LIKE ?';
        var useraddonvar = puser;
    } else {
        var useraddon = ' AND userID LIKE ?';
        var useraddonvar = '%%';
    }
    if (pstatus > 0) {
        var statusaddon = ' AND statusID LIKE ?';
        var statusaddonvar = pstatus;
    } else {
        var statusaddon = ' AND statusID LIKE ?';
        var statusaddonvar = '%%';
    }

    var sqlsel = `SELECT p.*, u.userID, s.statusID
                FROM Purchases p
                INNER JOIN Users u ON p.userID = u.userID
                INNER JOIN purchaseStatus s ON p.purchaseStatusID = s.statusID
                WHERE p.purchaseID LIKE ?
                AND p.purchaseDate LIKE ? 
                AND p.purchaseTotal LIKE ?` + useraddon + statusaddon;
    
    var inserts = ['%' + pid + '%', '%' + pdate + '%', '%' + ptotal + '%', 
                useraddonvar, statusaddonvar];

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

    var pid = req.query.uppurid;

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

app.post('/updatesinglepurchase', function (req, res, ) {

    var pid = req.body.uppurchaseid;
    var puser = req.body.uppurchaseuser;
    var pdate = req.body.uppurchasedate;
    var pstatus = req.body.uppurchasestatus;
    var ptotal = req.body.uppurchasetotal;
    
    var sqlins = `UPDATE Purchases 
                SET userID = ?, 
                purchaseDate = ?, 
                purchaseStatusID = ?
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

    var ppurchaseid = req.body.purchasedetpurchaseid;
    var pproductid = req.body.purchasedetproductid;
    var pquantity = req.body.purchasedetquantity;
    var ptotal = req.body.purchasedettotal;
    console.log(ptotal); 


    var sqlins = `INSERT INTO purchaseDetails 
                (purchaseID, productID, purchaseQuantity, purchaseTotal) 
                VALUES (?, ?, ?, ?)`;
    var inserts = [ppurchaseid, pproductid, pquantity, ptotal]; 

    var sql = mysql.format(sqlins, inserts); 

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted!");
        res.redirect('insertPurchaseDetails.html'); 
    });
});

app.get('/getpurchasedets/', function (req, res) {
    var pid = req.query.purchasedetid;
    var ppurchaseid = req.query.purchasedetpurchaseid;
    var pproduct = req.query.purchasedetproduct;
    var pquantity = req.query.purchasedetquantity;
    var ptotal = req.query.purchasedettotal;

    if (pproduct > 0) {
        var productaddon = ' AND productID LIKE ?';
        var productaddonvar = pproduct;
    } else {
        var productaddon = ' AND productID LIKE ?';
        var productaddonvar = '%%';
    }

    var sqlsel = `SELECT pd.*, p.productID
                FROM purchaseDetails pd
                INNER JOIN Products p ON pd.productID = p.productID
                WHERE pd.purchaseDetailID LIKE ?
                AND pd.purchaseID LIKE ? 
                AND pd.purchaseQuantity LIKE ?
                AND pd.purchaseTotal LIKE ?` + productaddon;
    
    var inserts = ['%' + pid + '%', '%' + ppurchaseid + '%', '%' + pquantity + '%', '%' + ptotal + '%', 
                productaddonvar];

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

    var pid = req.query.uppurdetid;

    var sqlsel = `SELECT * FROM PurchaseDetails WHERE purchaseDetailID = ?`;
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

    var pid = req.body.uppurchasedetid;
    var ppurchaseid = req.body.uppurchasedetpurchaseid;
    var pproduct = req.body.uppurchasedetproduct;
    var pquantity = req.body.uppurchasedetquantity;
    var ptotal = req.body.uppurchasedettotal;
    
    var sqlins = `UPDATE PurchaseDetails
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
    var ucategoryid = req.body.usercategoryid;
    var uname = req.body.username;
    var upw = req.body.userpw;
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
                        (userCategoryID, userUsername, userPassword) 
                        VALUES (?, ?, ?)`;

            var inserts = [ucategoryid, uname, theHashedPW];

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
    var uid = req.query.userid;
    var ucategory = req.query.usercategory;
    var uname = req.query.username;

    if (ucategory > 0) {
        var categoryaddon = ' AND userCategoryID LIKE ?';
        var categoryaddonvar = ucategory;
    } else {
        var categoryaddon = ' AND userCategoryID LIKE ?';
        var categoryaddonvar = '%%';
    }

    var sqlsel = `SELECT u.*, c.userCategoryID
                FROM Users u
                INNER JOIN userCategory c ON u.userCategoryID = c.userCategoryID
                WHERE u.userID LIKE ?
                AND u.userUsername LIKE ?` + categoryaddon;
    
    var inserts = ['%' + uid + '%', '%' + uname + '%', + categoryaddonvar];

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

    var uid = req.query.upusid;

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

app.post('/updatesingleuser', function (req, res, ) {

    var uid = req.body.upuserid;
    var ucategory = req.body.upusercategory;
    var uname = req.body.upusername;
    
    var sqlins = `UPDATE Users
                SET userCategoryID = ?, 
                userUsername = ?
                WHERE userID = ? `;
    var inserts = [ucategory, uname, uid];

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

    var sname = req.body.servicename;
    var sblocks = req.body.serviceblocks;
    var sprice = req.body.serviceprice;
    console.log(sname); 


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
    var sid = req.query.serviceid;
    var sname = req.query.servicename;
    var sblocks = req.query.serviceblocks;
    var sprice = req.query.serviceprice;

    var sqlsel = `SELECT * Services 
                WHERE serviceID LIKE ?
                AND serviceName LIKE ? 
                AND serviceBlocks LIKE ? 
                AND servicePrice LIKE ?`;
    
    var inserts = ['%' + sid + '%', '%' + sname + '%', '%' + sblocks + '%', '%' + sprice + '%'];

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

    var sid = req.query.upservid;

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

    var sid = req.body.upserviceid;
    var sname = req.body.upservicename;
    var sblocks = req.body.upserviceblocks;
    var sprice = req.body.upserviceprice;
    
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
