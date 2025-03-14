var ClientBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadClientsFromServer: function () {
        $.ajax({
            url: '/getclient/',
            data: {
                'clientid': clientid.value,
                'clientemail': clientemail.value,
                'clientfname': clientfname.value,
                'clientlname': clientlname.value,
                'clientphone': clientphone.value,         
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
});

var Clientform2 = React.createClass({
    getInitialState: function () {
        return {
            clientid: "",
            clientemail: "",
            clientfname: "",
            clientlname: "",
            clientphone: "",
        };
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var clientid = this.state.clientid.trim();
        var clientemail = this.state.clientemail.trim();
        var clientfname = this.state.clientfname.trim();
        var clientlname = this.state.clientlname.trim();
        var clientphone = this.state.clientphone.trim();

        this.props.onClientSubmit({ 
            clientid: clientid, 
            clientemail: clientemail, 
            clientfname: clientfname, 
            clientlname: clientlname, 
            clientphone: clientphone,
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
                                name="clientid" 
                                id="clientid" 
                                value={this.state.clientid} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>
                                <input 
                                type="text" 
                                name="clientemail" 
                                id="clientemail" 
                                value={this.state.clientemail} 
                                onChange={this.handleChange} 
                                />
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
            upclientemail: "",
            upclientfname: "",
            upclientlname: "",
            upclientphone: "",
        };
    },
    
    handleUpSubmit: function (e) {
        e.preventDefault();

        var upclientid = upcliid.value;
        var upclientemail = upcliemail.value;
        var upclientfname = upclifname.value;
        var upclientlname = upclilname.value;
        var upclientphone = upcliphone.value;

        this.props.onUpdateSubmit({ 
            upclientid: upclientid, 
            upclientemail: upclientemail, 
            upclientfname: upclientfname, 
            upclientlname: upclientlname, 
            upclientphone: upclientphone,
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
                                name="upcliemail" 
                                id="upcliemail" 
                                value={this.state.upcliemail} 
                                onChange={this.handleUpChange} 
                                />
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
                    upcliemail.value = client.clientEmail;
                    upclifname.value = client.clientFirstName;
                    upclilname.value = client.clientLastName;
                    upcliphone.value = client.clientPhone;

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