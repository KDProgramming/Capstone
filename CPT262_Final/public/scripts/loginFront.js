var LoginBox = React.createClass({
    getInitialState: function () {
        return {
            data: []
        };
    },
    handleLogin: function (logininfo) {

        $.ajax({
            url: '/loginfront/',
            dataType: 'json',
            type: 'POST',
            data: logininfo,
            success: function (data) {
                this.setState({ data: data });
                if (typeof data.redirect == 'string') {
                    window.location = data.redirect;
                }
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    render: function () {
        return (
            <div>
                <h1>Login</h1>
                <LoginForm onLoginSubmit={this.handleLogin} />
                <br />
                
            </div>
        );
    }
});

var LoginForm = React.createClass({
    getInitialState: function () {
        return {
            clientemail: "",
            clientpw: "",
        };
    },
   
    handleSubmit: function (e) {
        e.preventDefault();

        var clientemail = this.state.clientemail.trim();
        var clientpw = this.state.clientpw.trim();
      
        this.props.onLoginSubmit({
            clientemail: clientemail,
            clientpw: clientpw
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
                <div id="theform">
                    <form onSubmit={this.handleSubmit}>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Email</th>
                                    <td>
                                        <input 
                                        name="clientemail" 
                                        id="clientemail" 
                                        value={this.state.clientemail} 
                                        onChange={this.handleChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Password</th>
                                    <td>
                                        <input 
                                        type = "password" 
                                        name="clientpw" 
                                        id="clientpw" 
                                        value={this.state.clientpw} 
                                        onChange={this.handleChange} />
                                    </td>
                                </tr>
                               
                            </tbody>
                        </table><br />
                        <input type="submit" value="Enter Login" />
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

ReactDOM.render(
    <LoginBox />,
    document.getElementById('content')
);