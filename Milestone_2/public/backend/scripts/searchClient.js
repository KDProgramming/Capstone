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
    componentDidMount: function () {
        this.loadClientsFromServer();
    },

    render: function () {
        return (
            <div>
                <h1>Clients</h1>
                <Clientform2 onClientSubmit={this.loadClientFromServer} />
                <br />
                <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Phone</th>
                                <th>Email</th>
                            </tr>
                         </thead>
                        <ClientList data={this.state.data} />
                    </table>
                
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
                            <th>Client User</th>
                            <td>
                            <UserList data={this.state.userdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Client First Name</th>
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
                            <th>Client Last Name</th>
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
                            <th>Client Phone</th>
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
                            <th>Client Email</th>
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

    render: function () {
        return (

            <tr>
                            <td>
                                {this.props.cliid} 
                            </td>
                            <td>
                                {this.props.cliuserid}
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

ReactDOM.render(
    <ClientBox />,
    document.getElementById('content')
);

