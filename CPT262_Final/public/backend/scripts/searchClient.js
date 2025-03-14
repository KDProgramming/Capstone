var ClientBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadClientFromServer: function () {
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
                console.log("API Response:", data);
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },
    componentDidMount: function () {
        this.loadClientFromServer();
    },

    render: function () {
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
                <h2>Client Details</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>ID</th>
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

