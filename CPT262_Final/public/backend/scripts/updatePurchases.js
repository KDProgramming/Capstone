var PurchasesBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadPurchasesFromServer: function () {
        $.ajax({
            url: '/getpurchases/',
            data: {
                'purchaseid': purchaseid.value,
                'purchaseuser': puruser.value,
                'purchasedate': purchasedate.value,
                'purchasestatus': purstatus.value,
                'purchasetotal': purchasetotal.value,         
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
        this.loadPurchasesFromServer();
    },

    render: function () {
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
});

var Purchasesform2 = React.createClass({
    getInitialState: function () {
        return {
            purchaseid: "",
            userdata: [],
            purchasedate: "",
            statusdata: [],
            purchasetotal: "",
        };
    },

    loadUsers: function() {
        $.ajax({
            url: '/getusers/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({userdata:data});
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
                this.setState({statusdata:data});
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

        var purchaseid = this.state.purchaseid.trim();
        var purchaseuser = puruser.value;
        var purchasedate = this.state.purchasedate;
        var purchasestatus = purstatus.value;
        var purchasetotal = this.state.purchasetotal.trim();

        this.props.onPurchaseSubmit({ 
            purchaseid: purchaseid, 
            purchaseuser: purchaseuser, 
            purchasedate: purchasedate, 
            purchasestatus: purchasestatus, 
            purchasetotal: purchasetotal,
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
                                name="purchaseid" 
                                id="purchaseid" 
                                value={this.state.purchaseid} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>User Email</th>
                            <td>
                                <UserList data={this.state.userdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Purchase Date</th>
                            <td>
                            <input 
                                type = "datetime-local" 
                                name="purchasedate" 
                                id="purchasedate" 
                                value={this.state.purchasedate} 
                                onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Status</th>
                            <td>
                                <StatusList data={this.state.statusdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Total</th>
                            <td>
                                <input 
                                name="purchasetotal" 
                                id="purchasetotal" 
                                value={this.state.purchasetotal} 
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
            uppurchaseid: "",
            upuserdata: [],
            uppurchasedate: "",
            upstatusdata: [],
            uppurchasetotal: "",
        };
    },

    loadUsers: function() {
        $.ajax({
            url: '/getusers/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({upuserdata:data});
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
                this.setState({upstatusdata:data});
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

        var uppurchaseid = uppurid.value;
        var uppurchaseuser = uppuruser.value;
        var uppurchasedate = uppurdate.value;
        var uppurchasestatus = uppurstatus.value;
        var uppurchasetotal = uppurtotal.value;

        this.props.onUpdateSubmit({ 
            uppurchaseid: uppurchaseid, 
            uppurchaseuser: uppurchaseuser, 
            uppurchasedate: uppurchasedate, 
            uppurchasestatus: uppurchasestatus, 
            uppurchasetotal: uppurchasetotal,
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
                                <UserUpdateList data={this.state.upuserdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Purchase Date</th>
                            <td>
                                <input 
                                type = "datetime-local" 
                                name="uppurdate" 
                                id="uppurdate" 
                                value={this.state.uppurdate} 
                                onChange={this.handleUpChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Status</th>
                            <td>
                                <StatusUpdateList data={this.state.upstatusdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Total</th>
                            <td>
                                <input 
                                name="uppurtotal" 
                                id="uppurtotal" 
                                value={this.state.uppurtotal} 
                                onChange={this.handleUpChange} 
                                />
                            </td>
                        </tr>  
                    </tbody>
                </table><br />
                        <input type="hidden" name="uppurid" id="uppurid" onChange={this.handleUpChange} />
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
                    purdate={purchases.purchaseDate}
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
            uppurid: "",
            singledata: []
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
                'uppurid': theuppurid
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populatePurchase = this.state.singledata.map(function (purchase) {
                    uppurid.value = theuppurid;
                    uppuruser.value = purchase.userID;
                    uppurdate.value = purchase.purchaseDate;
                    uppurstatus.value = purchase.purchaseStatusID;
                    uppurtotal.value = purchase.purchaseTotal;

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