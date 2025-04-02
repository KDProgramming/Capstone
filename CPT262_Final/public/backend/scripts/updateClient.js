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
                    this.loadClientsFromServer();
                }
                ususer = this.state.viewthepage;
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadClientsFromServer: function () {
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
        this.loadAllowLogin();
        this.loadClientsFromServer();
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
                    <h1>Update Client</h1>
                    <Clientform2 onClientSubmit={this.loadClientsFromServer} />
                    <br />
                    <div id = "theresults">
                        <div id = "theleft">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Email</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Phone</th>
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
                <h2>Clients</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Client ID</th>
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

var ClientUpdateform = React.createClass({
    getInitialState: function () {
        return {
            kd_upclient: "",
            kd_upclientemail: "",
            kd_upclientfname: "",
            kd_upclientlname: "",
            kd_upclientphone: "",
        };
    },
    
    handleUpSubmit: function (e) {
        e.preventDefault();

        var kd_upclientid = kd_upcliid.value;
        var kd_upclientemail = kd_upcliemail.value;
        var kd_upclientfname = kd_upclifname.value;
        var kd_upclientlname = kd_upclilname.value;
        var kd_upclientphone = kd_upcliphone.value;

        this.props.onUpdateSubmit({ 
            kd_upclientid: kd_upclientid, 
            kd_upclientemail: kd_upclientemail, 
            kd_upclientfname: kd_upclientfname, 
            kd_upclientlname: kd_upclientlname, 
            kd_upclientphone: kd_upclientphone,
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
                            <th>Email</th>
                            <td>
                                <input 
                                name="kd_upcliemail" 
                                id="kd_upcliemail" 
                                value={this.state.kd_upcliemail} 
                                onChange={this.handleUpChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>First Name</th>
                            <td>
                                <input 
                                name="kd_upclifname" 
                                id="kd_upclifname" 
                                value={this.state.kd_upclifname} 
                                onChange={this.handleUpChange}  
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Last Name</th>
                            <td>
                                <input 
                                name="kd_upclilname" 
                                id="kd_upclilname" 
                                value={this.state.kd_upclilname} 
                                onChange={this.handleUpChange} 
                                />
                            </td>
                        </tr>  
                        <tr>
                            <th>Phone</th>
                            <td>
                                <input 
                                name="kd_upcliphone" 
                                id="kd_upcliphone" 
                                value={this.state.kd_upcliphone} 
                                onChange={this.handleUpChange} 
                                />
                            </td>
                        </tr> 
                    </tbody>
                </table><br />
                        <input type="hidden" name="kd_upcliid" id="kd_upcliid" onChange={this.handleUpChange} />
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
    getInitialState: function () {
        return {
            kd_upcliid: "",
            kd_singledata: []
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
                'kd_upcliid': theupcliid
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ kd_singledata: data });
                console.log(this.state.kd_singledata);
                var populateClient = this.state.kd_singledata.map(function (client) {
                    kd_upcliid.value = theupcliid;
                    kd_upcliemail.value = client.clientEmail;
                    kd_upclifname.value = client.clientFirstName;
                    kd_upclilname.value = client.clientLastName;
                    kd_upcliphone.value = client.clientPhone;

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
                            <td>
                                <form onSubmit={this.updateRecord}>
                                    <input type="submit" value="Update Record" />
                                </form>
                            </td>
                </tr>
        );
    }
});

ReactDOM.render(
    <ClientBox />,
    document.getElementById('content')
);