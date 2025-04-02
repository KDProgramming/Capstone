var ususer = 0;
var PurchasesBox = React.createClass({
    getInitialState: function () {
        return { data: [], viewthepage: 0 };
    },
    loadAllowLogin: function () {
        $.ajax({
            url: '/getloggedinback/',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ viewthepage: data });
                if (data !== 0) {
                    this.loadPurchasesFromServer();
                }
                ususer = this.state.viewthepage;
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadPurchasesFromServer: function () {
        $.ajax({
            url: '/getpurchases/',
            data: {
                'kd_purchaseid': kd_purchaseid.value,
                'kd_purchaseuser': puruser.value,
                'kd_purchasedate': kd_purchasedate.value,
                'kd_purchasestatus': purstatus.value,
                'kd_purchasetotal': kd_purchasetotal.value,         
            },
            
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    updateSinglePurchaseFromServer: function (purchase) {
        
        $.ajax({
            url: '/updatesinglepurchase/',
            dataType: 'json',
            data: purchase,
            type: 'POST',
            cache: false,
            success: function (upsingledata) {
                this.setState({ upsingledata: upsingledata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        window.location.reload(true);
    },
    componentDidMount: function () {
        this.loadAllowLogin();
        this.loadPurchasesFromServer();
    },

    render: function () {
        if (this.state.viewthepage == 0) {
            return (
                <div>
                    <br/>Please Login!
                    <br/><a href="index.html">Access Login Page Here</a>
                </div>
            );
        } else { 
            return (
                <div>
                    <h1>Update Purchase</h1>
                    <Purchasesform2 onPurchaseSubmit={this.loadPurchasesFromServer} />
                    <br />
                    <div id = "theresults">
                        <div id = "theleft">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>User Email</th>
                                    <th>Purchase Date</th>
                                    <th>Status</th>
                                    <th>Total</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <PurchasesList data={this.state.data} />
                        </table>
                        </div>
                        <div id="theright">
                            <PurchasesUpdateform onUpdateSubmit={this.updateSinglePurchaseFromServer} />
                        </div>                
                    </div>
                </div>
            );
        }
    }
});

var Purchasesform2 = React.createClass({
    getInitialState: function () {
        return {
            kd_purchaseid: "",
            kd_userdata: [],
            kd_purchasedate: "",
            kd_statusdata: [],
            kd_purchasetotal: "",
        };
    },

    loadUsers: function() {
        $.ajax({
            url: '/getusers/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({kd_userdata:data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadStatus: function() {
        $.ajax({
            url: '/getpstatus/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({kd_statusdata:data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadUsers();
        this.loadStatus();
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var kd_purchaseid = this.state.kd_purchaseid.trim();
        var kd_purchaseuser = puruser.value;
        var kd_purchasedate = this.state.kd_purchasedate;
        var kd_purchasestatus = purstatus.value;
        var kd_purchasetotal = this.state.kd_purchasetotal.trim();

        this.props.onPurchaseSubmit({ 
            kd_purchaseid: kd_purchaseid, 
            kd_purchaseuser: kd_purchaseuser, 
            kd_purchasedate: kd_purchasedate, 
            kd_purchasestatus: kd_purchasestatus, 
            kd_purchasetotal: kd_purchasetotal,
        });
    },
    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    
    render: function () {

        return (
        <div>
            <div id = "theform">
            <form onSubmit={this.handleSubmit}>
                <h2>Purchases</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <td>
                                <input 
                                type="text" 
                                name="kd_purchaseid" 
                                id="kd_purchaseid" 
                                value={this.state.kd_purchaseid} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>User Email</th>
                            <td>
                                <UserList data={this.state.kd_userdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Purchase Date</th>
                            <td>
                            <input 
                                type = "datetime-local" 
                                name="kd_purchasedate" 
                                id="kd_purchasedate" 
                                value={this.state.kd_purchasedate} 
                                onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Status</th>
                            <td>
                                <StatusList data={this.state.kd_statusdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Total</th>
                            <td>
                                <input 
                                name="kd_purchasetotal" 
                                id="kd_purchasetotal" 
                                value={this.state.kd_purchasetotal} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>  
                    </tbody>
                </table>
                <input type="submit" value="Search Purchase" />
            </form>
            </div>
            <div>
                <br />
                <form onSubmit={this.getInitialState}>
                    <input type="submit" value="Clear Form" />
                </form>
            </div>
        </div>
        );
    }
});

var PurchasesUpdateform = React.createClass({
    getInitialState: function () {
        return {
            kd_uppurchaseid: "",
            kd_upuserdata: [],
            kd_uppurchasedate: "",
            kd_upstatusdata: [],
            kd_uppurchasetotal: "",
        };
    },

    loadUsers: function() {
        $.ajax({
            url: '/getusers/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({kd_upuserdata:data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadStatus: function() {
        $.ajax({
            url: '/getpstatus/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({kd_upstatusdata:data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadUsers();
        this.loadStatus();
    },
    
    handleUpSubmit: function (e) {
        e.preventDefault();

        var kd_uppurchaseid = kd_uppurid.value;
        var kd_uppurchaseuser = uppuruser.value;
        var kd_uppurchasedate = kd_uppurdate.value;
        var kd_uppurchasestatus = uppurstatus.value;
        var kd_uppurchasetotal = kd_uppurtotal.value;

        this.props.onUpdateSubmit({ 
            kd_uppurchaseid: kd_uppurchaseid, 
            kd_uppurchaseuser: kd_uppurchaseuser, 
            kd_uppurchasedate: kd_uppurchasedate, 
            kd_uppurchasestatus: kd_uppurchasestatus, 
            kd_uppurchasetotal: kd_uppurchasetotal,
        });
    },
    handleUpChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    
    render: function () {
        return (
            <div>
                <div id="theform">
                    <form onSubmit={this.handleUpSubmit}>
                    <table>
                    <tbody>
                        <tr>
                            <th>User Email</th>
                            <td>
                                <UserUpdateList data={this.state.kd_upuserdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Purchase Date</th>
                            <td>
                                <input 
                                type = "datetime-local" 
                                name="kd_uppurdate" 
                                id="kd_uppurdate" 
                                value={this.state.kd_uppurdate} 
                                onChange={this.handleUpChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Status</th>
                            <td>
                                <StatusUpdateList data={this.state.kd_upstatusdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Total</th>
                            <td>
                                <input 
                                name="kd_uppurtotal" 
                                id="kd_uppurtotal" 
                                value={this.state.kd_uppurtotal} 
                                onChange={this.handleUpChange} 
                                />
                            </td>
                        </tr>  
                    </tbody>
                </table><br />
                        <input type="hidden" name="kd_uppurid" id="kd_uppurid" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Purchase" />
                    </form>
                </div>
            </div>
        );
    }
});

var PurchasesList = React.createClass({
    render: function () {
        var purchasesNodes = this.props.data.map(function (purchases) {
            return (
                <Purchase
                    key={purchases.purchaseID} // never forget this line!
                    purid={purchases.purchaseID}
                    puruser={purchases.userEmail}
                    purdate={purchases.formattedDate}
                    purstatus={purchases.purchaseStatusName}
                    purtotal={purchases.purchaseTotal}
                >
                </Purchase>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {purchasesNodes}
            </tbody>
        );
    }
});

var Purchase = React.createClass({
    getInitialState: function () {
        return {
            kd_uppurid: "",
            kd_singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theuppurid = this.props.purid;
        
        this.loadSinglePurchase(theuppurid);
    },
    loadSinglePurchase: function (theuppurid) {
        $.ajax({
            url: '/getsinglepurchase/',
            data: {
                'kd_uppurid': theuppurid
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ kd_singledata: data });
                console.log(this.state.kd_singledata);
                var populatePurchase = this.state.kd_singledata.map(function (purchase) {
                    kd_uppurid.value = theuppurid;
                    uppuruser.value = purchase.userID;
                    kd_uppurdate.value = purchase.purchaseDate;
                    uppurstatus.value = purchase.purchaseStatusID;
                    kd_uppurtotal.value = purchase.purchaseTotal;

                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        
    },

    render: function () {
        return (
            <tr>
                            <td>
                                {this.props.purid} 
                            </td>
                            <td>
                                {this.props.puruser}
                            </td>
                            <td>
                                {this.props.purdate}
                            </td>
                            <td>
                                {this.props.purstatus}
                            </td>
                            <td>
                                {this.props.purtotal}
                            </td>
                            <td>
                                <form onSubmit={this.updateRecord}>
                                    <input type="submit" value="Update Record" />
                                </form>
                            </td>
                </tr>
        );
    }
});

var UserList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (user) {
            return (
                <option
                    key={user.userID}
                    value={user.userID}
                >
                    {user.userEmail}
                </option>
            );
        });
        return (
            <select name="puruser" id="puruser">
                <option value="0"></option>
                {optionNodes}
            </select>
        );
    }
});

var StatusList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (status) {
            return (
                <option
                    key={status.purchaseStatusID}
                    value={status.purchaseStatusID}
                >
                    {status.purchaseStatusName}
                </option>
            );
        });
        return (
            <select name="purstatus" id="purstatus">
                <option value="0"></option>
                {optionNodes}
            </select>
        );
    }
});

var UserUpdateList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (users) {
            return (
                <option
                    key={users.userID}
                    value={users.userID}
                >
                    {users.userEmail}
                </option>
            );
        });
        return (
            <select name="uppuruser" id="uppuruser">
                <option value="0"></option>
                {optionNodes}
            </select>
        );
    }
});

var StatusUpdateList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (stat) {
            return (
                <option
                    key={stat.purchaseStatusID}
                    value={stat.purchaseStatusID}
                >
                    {stat.purchaseStatusName}
                </option>
            );
        });
        return (
            <select name="uppurstatus" id="uppurstatus">
                <option value="0"></option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <PurchasesBox />,
    document.getElementById('content')
);