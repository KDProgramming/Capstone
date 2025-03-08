var LoginBox = React.createClass({
    getInitialState: function () {
        return {
            data: []
        };
    },
    handleLogin: function (logininfo) {

        $.ajax({
            url: '/loginback/',
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
            username: "",
            userpw: "",

        };
    },
   
    handleSubmit: function (e) {
        e.preventDefault();

        var username = this.state.username.trim();
        var userpw = this.state.userpw.trim();
      
        this.props.onLoginSubmit({
            username: username,
            userpw: userpw
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
                                    <th>Username</th>
                                    <td>
                                        <input 
                                        name="username" 
                                        id="username" 
                                        value={this.state.username} 
                                        onChange={this.handleChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Password</th>
                                    <td>
                                        <input 
                                        type = "password" 
                                        name="userpw" 
                                        id="userpw" 
                                        value={this.state.userpw} 
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

