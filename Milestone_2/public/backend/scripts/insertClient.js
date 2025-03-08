var ClientBox = React.createClass({
    handleClientSubmit: function (client) {
        $.ajax({ 
            url: '/client/',
            dataType: 'json',
            type: 'POST',
            data: client,
            success: function (data) {
                this.setState({ data: data});
            }.bind(this), 
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        return (
            <div className="ClientBox">
                <h1>Clients</h1>
                <Clientform2 onClientSubmit={this.handleClientSubmit}/>
            </div>
        );
    }
});

var Clientform2 = React.createClass({
    getInitialState: function () {
        return {
            userdata: [],
            clientfname: "",
            clientlname: "",
            clientphone: "",
            clientemail: ""
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
        
        var clientuserid = cliuser.value
        var clientfname = this.state.clientfname.trim();
        var clientlname = this.state.clientlname.trim();
        var clientphone = this.state.clientphone.trim();
        var clientemail = this.state.clientemail.trim();

        // validate data
        if (!this.validateEmail(clientemail)) {
            console.log("Bad Email" + this.validateEmail(clientemail));
            return;
        }
        if (!clientlname || !clientphone) {
            console.log("Field Missing");
            return;
        }

        this.props.onClientSubmit({
            clientuserid: clientuserid,
            clientfname: clientfname,
            clientlname: clientlname,
            clientphone: clientphone,
            clientemail: clientemail
        });
    },

    validateEmail: function (value) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value);
    },
    commonValidate: function () {
        return true;
    },
    setValue: function (field, event) {
        var object = {};
        object[field] = event.target.value;
        this.setState(object);
    },
    render: function () {

        return (
            <form className="clientForm" onSubmit={this.handleSubmit}>
                <h2>Clients</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Client User</th>
                            <td>
                            <UserList data={this.state.userdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Client First Name</th>
                            <td>
                                <TextInput
                                    value={this.state.clientfname}
                                    uniqueName="clientfname"
                                    textArea={false}
                                    required={false}
                                    minCharacters={2}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'clientfname')}
                                    errorMessage="First Name is invalid" />
                            </td>
                        </tr>
                        <tr>
                            <th>Client Last Name</th>
                            <td>
                                <TextInput
                                    value={this.state.clientlname}
                                    uniqueName="clientlname"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'clientlname')}
                                    errorMessage="Last Name is invalid"
                                    emptyMessage="Last Name is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Client Email</th>
                            <td>
                                <TextInput
                                    value={this.state.clientemail}
                                    uniqueName="clientemail"
                                    textArea={false}
                                    required={true}
                                    minCharacters={5}
                                    validate={this.validateEmail}
                                    onChange={this.setValue.bind(this, 'clientemail')}
                                    errorMessage="Email is invalid"
                                    emptyMessage="Email is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Client Phone</th>
                            <td>
                                <TextInput
                                    value={this.state.clientphone}
                                    uniqueName="clientphone"
                                    textArea={false}
                                    required={false}
                                    minCharacters={6}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'clientphone')}
                                    errorMessage="Phone Number is invalid" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Insert Client" />
               
            </form>
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

var InputError = React.createClass({
    getInitialState: function () {
        return {
            message: 'Input is invalid'
        };
    },
    render: function () {
        var errorClass = classNames(this.props.className, {
            'error_container': true,
            'visible': this.props.visible,
            'invisible': !this.props.visible
        });

        return (
                <td> {this.props.errorMessage} </td>
        )
    }
});

var TextInput = React.createClass({
    getInitialState: function () {
        return {
            isEmpty: true,
            value: null,
            valid: false,
            errorMessage: "",
            errorVisible: false
        };
    },

    handleChange: function (event) {
        this.validation(event.target.value);

        if (this.props.onChange) {
            this.props.onChange(event);
        }
    },

    validation: function (value, valid) {
        if (typeof valid === 'undefined') {
            valid = true;
        }

        var message = "";
        var errorVisible = false;

        if (!valid) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }
        else if (this.props.required && jQuery.isEmptyObject(value)) {
            message = this.props.emptyMessage;
            valid = false;
            errorVisible = true;
        }
        else if (value.length < this.props.minCharacters) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }

        this.setState({
            value: value,
            isEmpty: jQuery.isEmptyObject(value),
            valid: valid,
            errorMessage: message,
            errorVisible: errorVisible
        });

    },

    handleBlur: function (event) {
        var valid = this.props.validate(event.target.value);
        this.validation(event.target.value, valid);
    },
    render: function () {
        if (this.props.textArea) {
            return (
                <div className={this.props.uniqueName}>
                    <textarea
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        } else {
            return (
                <div className={this.props.uniqueName}>
                    <input
                        name={this.props.uniqueName}
                        id={this.props.uniqueName}
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        }
    }
});

ReactDOM.render(
    <ClientBox />,
    document.getElementById('content')
);
