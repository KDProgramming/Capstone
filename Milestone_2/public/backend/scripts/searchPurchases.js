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
    componentDidMount: function () {
        this.loadPurchasesFromServer();
    },

    render: function () {
        return (
            <div>
                <h1>Purchases</h1>
                <Purchasesform2 onPurchasesSubmit={this.loadPurchasesFromServer} />
                <br />
                <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Total</th>
                            </tr>
                         </thead>
                        <PurchasesList data={this.state.data} />
                    </table>
                
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
                            <th>Purchase ID</th>
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
                            <th>Purchase User</th>
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
                            <th>Purchase Status</th>
                            <td>
                                <StatusList data={this.state.statusdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Purchase Total</th>
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

var PurchaseList = React.createClass({
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

var Purchases = React.createClass({

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

ReactDOM.render(
    <PurchasesBox />,
    document.getElementById('content')
);

