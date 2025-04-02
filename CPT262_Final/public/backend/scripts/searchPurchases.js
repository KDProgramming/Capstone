var ususer = 0;
var PurchasesBox = React.createClass({
    getInitialState: function () {
        return { data: [],viewthepage: 0 };
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
                console.log("API Response:", data);
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

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
                    <h1>Purchases</h1>
                    <Purchasesform2 onPurchasesSubmit={this.loadPurchasesFromServer} />
                    <br />
                    <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Purchaser Email</th>
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

        this.props.onPurchasesSubmit({ 
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
            <form onSubmit={this.handleSubmit}>
                <h2>Search Purchases</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Purchase ID</th>
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
                            <th>Purchaser Email</th>
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
                            <th>Purchase Status</th>
                            <td>
                                <StatusList data={this.state.kd_statusdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Purchase Total</th>
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
                <input type="submit" value="Search Purchases" />

            </form>
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
                    puruser={purchases.userEmail}
                    purdate={purchases.formattedDate}
                    purstatus={purchases.purchaseStatusName}
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
                    {user.userEmail}
                </option>
            );
        });
        return (
            <select name="puruser" id="puruser">
                <option value ="0"></option>
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
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <PurchasesBox />,
    document.getElementById('content')
);

