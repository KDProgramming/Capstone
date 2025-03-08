var ClientBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadClientFromServer: function () {
        $.ajax({
            url: '/getclient/',
            data: {
                'clientid': client.value,
                'clientuserid': clientuserid.value,
                'clienfname': clientfname.value,
                'clientlname': clientlname.value,
                'clientphone': clientphone.value,
                'clientemail': clientemail.value,           
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
    updateSingleClientFromServer: function (client) {
        
        $.ajax({
            url: '/updatesingleclient/',
            dataType: 'json',
            data: client,
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
        this.loadClientsFromServer();
    },

    render: function () {
        return (
            <div>
                <h1>Update Client</h1>
                <Clientform2 onClientSubmit={this.loadClientFromServer} />
                <br />
                <div id = "theresults">
                    <div id = "theleft">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th></th>
                            </tr>
                         </thead>
                        <ClientList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <ClientUpdateform onUpdateSubmit={this.updateSingleClientFromServer} />
                    </div>                
                </div>
            </div>
        );
    }
});

var Clientform2 = React.createClass({
    getInitialState: function () {
        return {
            clientid: "",
            userdata: [],
            clientfname: "",
            clientlname: "",
            clientphone: "",
            clientemail: "",
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
    componentDidMount: function() {
        this.loadUsers();
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var clientid = this.state.clientid.trim();
        var clientuserid =  cliuser.value;
        var clientfname = this.state.clientfname.trim();
        var clientlname = this.state.clientlname.trim();
        var clientphone = this.state.clientphone.trim();
        var clientemail = this.state.clientemail.trim();

        this.props.onClientSubmit({ 
            clientid: clientid, 
            clientuserid: clientuserid, 
            clientfname: clientfname, 
            clientlname: clientlname, 
            clientphone: clientphone,
            clientemail: clientemail,
        });
    },
    
    render: function () {
        return (
            <form onSubmit={this.handleSubmit}>
                <h2>Clients</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Client ID</th>
                            <td>
                                <input 
                                type="text" 
                                name="clientid" 
                                id="clientid" 
                                value={this.state.clientid} 
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
                            <th>First Name</th>
                            <td>
                                <input 
                                name="clientfname" 
                                id="clientfname" 
                                value={this.state.clientfname} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Last Name</th>
                            <td>
                                <input 
                                name="clientlname" 
                                id="clientlname" 
                                value={this.state.clientlname} 
                                onChange={this.handleChange}  
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Phone</th>
                            <td>
                                <input 
                                name="clientphone" 
                                id="clientphone" 
                                value={this.state.clientphone} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>  
                        <tr>
                            <th>Email</th>
                            <td>
                                <input 
                                name="clientemail" 
                                id="clientemail" 
                                value={this.state.clientemail} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr> 
                    </tbody>
                </table>
                <input type="submit" value="Search Client" />

            </form>
        );
    }
});

var ClientUpdateform = React.createClass({
    getInitialState: function () {
        return {
            upclient: "",
            upuserdata: [],
            upclientfname: "",
            upclientlname: "",
            upclientphone: "",
            upclientemail: "",
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
    componentDidMount: function() {
        this.loadUsers();
    },
    
    handleUpSubmit: function (e) {
        e.preventDefault();

        var upclientid = upcliid.value;
        var upclientuser = upcliuser.value;
        var upclientfname = upclifname.value;
        var upclientlname = upclilname.value;
        var upclientphone = upcliphone.value;
        var upclientemail = upcliemail.value;

        this.props.onUpdateSubmit({ 
            upclientid: upclientid, 
            upclientuser: upclientuser, 
            upclientfname: upclientfname, 
            upclientlname: upclientlname, 
            upclientphone: upclientphone,
            upclientemail: upclientemail,
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
                            <th>First Name</th>
                            <td>
                                <input 
                                name="upclifname" 
                                id="upclifname" 
                                value={this.state.upclifname} 
                                onChange={this.handleUpChange}  
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Last Name</th>
                            <td>
                                <input 
                                name="upclilname" 
                                id="upclilname" 
                                value={this.state.upclilname} 
                                onChange={this.handleUpChange} 
                                />
                            </td>
                        </tr>  
                        <tr>
                            <th>Phone</th>
                            <td>
                                <input 
                                name="upcliphone" 
                                id="upcliphone" 
                                value={this.state.upcliphone} 
                                onChange={this.handleUpChange} 
                                />
                            </td>
                        </tr> 
                        <tr>
                            <th>Email</th>
                            <td>
                                <input 
                                name="upcliemail" 
                                id="upcliemail" 
                                value={this.state.upcliemail} 
                                onChange={this.handleUpChange} 
                                />
                            </td>
                        </tr> 
                    </tbody>
                </table><br />
                        <input type="hidden" name="upcliid" id="upcliid" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Client" />
                    </form>
                </div>
            </div>
        );
    }
});

var ClientList = React.createClass({
    render: function () {
        var clientNodes = this.props.data.map(function (client) {
            return (
                <Client
                    key={client.clientID} // never forget this line!
                    cliid={client.clientID}
                    cliuserid={client.userID}
                    clifname={client.clientFirstName}
                    clilname={client.clientLastName}
                    cliphone={client.clientPhone}
                    cliemail={client.clientEmail}
                >
                </Client>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {clientNodes}
            </tbody>
        );
    }
});

var Client = React.createClass({
    getInitialState: function () {
        return {
            upcliid: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupcliid = this.props.cliid;
        
        this.loadSingleClient(theupcliid);
    },
    loadSingleClient: function (theupcliid) {
        $.ajax({
            url: '/getsingleclient/',
            data: {
                'upcliid': theupcliid
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateClient = this.state.singledata.map(function (client) {
                    upcliid.value = theupcliid;
                    upcliuser.value = client.userID;
                    upclifname.value = client.clientFirstName;
                    upclilname.value = client.clientLastName;
                    upcliemail.value = client.clientEmail;

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
                                {this.props.cliid} 
                            </td>
                            <td>
                                {this.props.cliuser}
                            </td>
                            <td>
                                {this.props.clifname}
                            </td>
                            <td>
                                {this.props.clilname}
                            </td>
                            <td>
                                {this.props.cliphone}
                            </td>
                            <td>
                                {this.props.cliemail}
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
            <select name="cliuser" id="cliuser">
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
            <select name="upcliuser" id="upcliuser">
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <ClientBox />,
    document.getElementById('content')
);