var PurchasesBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadPurchasesFromServer: function () {
        $.ajax({
            url: '/getpurchases/',
            data: {
                'purchaseid': purchaseid.value,
                'purchaseuser': purchaseuser.value,
                'purchasedate': purchasedate.value,
                'purchasestatus': purchasestatus.value,
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
    updateSinglePurchasesFromServer: function (purchase) {
        
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
                <Purchasesform2 onPurchasesSubmit={this.loadPurchasesFromServer} />
                <br />
                <div id = "theresults">
                    <div id = "theleft">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
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
            purchaseTotal: "",
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
    
    render: function () {

        return (
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
                            <th>Username</th>
                            <td>
                                <UserList data={this.state.userdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Purchase Date</th>
                            <td>
                            <input 
                                type = "date" 
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
    
    handleUpSubmit: function (e) {
        e.preventDefault();

        var uppurchaseid = uppurid.value;
        var uppurchaseuser = uppuruser.value;
        var uppurchasedate = uppurdate.value;
        var uppurchasedtatus = uppurstatus.value;
        var uppurchasetotal = uppurtotal.value;

        this.props.onUpdateSubmit({ 
            uppurchaseid: uppurchaseid, 
            uppurchaseuser: uppurchaseuser, 
            uppurchasedate: uppurchasedate, 
            uppurchasedtatus: uppurchasedtatus, 
            uppurchasetotal: uppurchasetotal,
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
                            <th>Username</th>
                            <td>
                                <UserUpdateList data={this.state.upuserdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Purchase Date</th>
                            <td>
                                <input 
                                type = "date" 
                                name="uppurdate" 
                                id="uppurdate" 
                                value={this.state.uppurdate} 
                                onChange={this.handleChange}  />
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
                <Purchases
                    key={purchases.purchaseID} // never forget this line!
                    purid={purchases.purchaseID}
                    puruser={purchases.userID}
                    purdate={purchases.purchaseDate}
                    purstatus={purchases.purchaseStatusID}
                    purtotal={purchases.purchaseTotal}
                >
                </Purchases>
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
                    {user.userUsername}
                </option>
            );
        });
        return (
            <select name="puruser" id="puruser">
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
                {optionNodes}
            </select>
        );
    }
});

var UserUpdateList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (user) {
            return (
                <option
                    key={user.userID}
                    value={user.userID}
                >
                    {user.userUsername}
                </option>
            );
        });
        return (
            <select name="uppuruser" id="uppuruser">
                {optionNodes}
            </select>
        );
    }
});

var StatusUpdateList = React.createClass({
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
            <select name="uppurstatus" id="uppurstatus">
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <PurchasesBox />,
    document.getElementById('content')
);