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
                <h1>Insert Client</h1>
                <Clientform2 onClientSubmit={this.handleClientSubmit}/>
            </div>
        );
    }
});

var Clientform2 = React.createClass({
    getInitialState: function () {
        return {
            clientemail: "",
            clientfname: "",
            clientlname: "",
            clientphone: "",
            clientpw: "",
            clientpw2: "",
        };
    },

    handleSubmit: function (e) { 
        e.preventDefault(); 
        
        var clientemail = this.state.clientemail.trim();
        var clientfname = this.state.clientfname.trim();
        var clientlname = this.state.clientlname.trim();
        var clientphone = this.state.clientphone.trim();
        var clientpw = this.state.clientpw.trim();
        var clientpw2 = this.state.clientpw2.trim();
        console.log(clientpw);

        if (!clientlname || !clientphone) {
            alert("Field Missing");
            return;
        }
        if (!this.validateEmail(clientemail)) {
            alert("Email Invalid" + this.validateEmail(clientemail));
            return;
        }
        if (clientpw != clientpw2) {
            alert("Passwords Do Not Match!");
            return;
        }

        this.props.onClientSubmit({
            clientemail: clientemail,
            clientfname: clientfname,
            clientlname: clientlname,
            clientphone: clientphone,
            clientpw: clientpw,
            clientpw2: clientpw2,
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
                <h2>Client Details</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Email</th>
                            <td>
                                <TextInput
                                    value={this.state.clientemail}
                                    uniqueName="clientemail"
                                    textArea={false}
                                    required={true}
                                    validate={this.validateEmail}
                                    onChange={this.setValue.bind(this, 'clientemail')}
                                    errorMessage="Invalid EMail Address"
                                    emptyMessage="EMail Address is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>First Name</th>
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
                            <th>Last Name</th>
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
                            <th>Phone</th>
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
                        <tr>
                            <th>Password</th>
                            <td>
                                <TextInput
                                    inputType="password"
                                    value={this.state.clientpw}
                                    uniqueName="clientpw"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'clientpw')}
                                    errorMessage="Password is Invalid" 
                                    emptyMessage="Password is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Verify Password</th>
                            <td>
                                <TextInput
                                    inputType="password"
                                    value={this.state.clientpw2}
                                    uniqueName="clientpw2"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'clientpw2')}
                                    errorMessage="Password is Invalid" 
                                    emptyMessage="Password Verification is Required" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Insert Client" />
               
            </form>
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
        const inputType = this.props.inputType || 'text';

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
                        type={inputType}
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
