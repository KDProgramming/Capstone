var ususer = 0;
var ClientBox = React.createClass({
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
                    this.loadClientFromServer();
                }
                ususer = this.state.viewthepage;
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadClientFromServer: function () {
        $.ajax({
            url: '/getclient/',
            data: {
                'kd_clientid': kd_clientid.value,
                'kd_clientemail': kd_clientemail.value,
                'kd_clientfname': kd_clientfname.value,
                'kd_clientlname': kd_clientlname.value,
                'kd_clientphone': kd_clientphone.value,          
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
        this.loadClientFromServer();
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
                    <h1>Client Search</h1>
                    <Clientform2 onClientSubmit={this.loadClientFromServer} />
                    <br />
                    <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Email</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Phone</th>
                                </tr>
                            </thead>
                            <ClientList data={this.state.data} />
                        </table>
                    
                </div>
            );
        }
    }
});

var Clientform2 = React.createClass({
    getInitialState: function () {
        return {
            kd_clientid: "",
            kd_clientemail: "",
            kd_clientfname: "",
            kd_clientlname: "",
            kd_clientphone: "",
        };
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var kd_clientid = this.state.kd_clientid.trim();
        var kd_clientemail = this.state.kd_clientemail.trim();
        var kd_clientfname = this.state.kd_clientfname.trim();
        var kd_clientlname = this.state.kd_clientlname.trim();
        var kd_clientphone = this.state.kd_clientphone.trim();

        this.props.onClientSubmit({ 
            kd_clientid: kd_clientid, 
            kd_clientemail: kd_clientemail, 
            kd_clientfname: kd_clientfname, 
            kd_clientlname: kd_clientlname, 
            kd_clientphone: kd_clientphone,
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
                <h2>Client Details</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <td>
                                <input 
                                type="text" 
                                name="kd_clientid" 
                                id="kd_clientid" 
                                value={this.state.kd_clientid} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>
                                <input 
                                type="text" 
                                name="kd_clientemail" 
                                id="kd_clientemail" 
                                value={this.state.kd_clientemail} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>First Name</th>
                            <td>
                                <input 
                                name="kd_clientfname" 
                                id="kd_clientfname" 
                                value={this.state.kd_clientfname} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Last Name</th>
                            <td>
                                <input 
                                name="kd_clientlname" 
                                id="kd_clientlname" 
                                value={this.state.kd_clientlname} 
                                onChange={this.handleChange}  
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Phone</th>
                            <td>
                                <input 
                                name="kd_clientphone" 
                                id="kd_clientphone" 
                                value={this.state.kd_clientphone} 
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
                    cliemail={client.clientEmail}
                    clifname={client.clientFirstName}
                    clilname={client.clientLastName}
                    cliphone={client.clientPhone}
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
                                {this.props.cliemail}
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
                </tr>
        );
    }
});

ReactDOM.render(
    <ClientBox />,
    document.getElementById('content')
);

