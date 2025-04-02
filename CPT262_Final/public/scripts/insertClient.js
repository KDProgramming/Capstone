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
            kd_clientemail: "",
            kd_clientfname: "",
            kd_clientlname: "",
            kd_clientphone: "",
            kd_clientpw: "",
            kd_clientpw2: "",
        };
    },

    handleSubmit: function (e) { 
        e.preventDefault(); 
        
        var kd_clientemail = this.state.kd_clientemail.trim();
        var kd_clientfname = this.state.kd_clientfname.trim();
        var kd_clientlname = this.state.kd_clientlname.trim();
        var kd_clientphone = this.state.kd_clientphone.trim();
        var kd_clientpw = this.state.kd_clientpw.trim();
        var kd_clientpw2 = this.state.kd_clientpw2.trim();
        console.log(kd_clientpw);

        if (!kd_clientlname || !kd_clientphone) {
            alert("Field Missing");
            return;
        }
        if (!this.validateEmail(kd_clientemail)) {
            alert("Email Invalid" + this.validateEmail(kd_clientemail));
            return;
        }
        if (kd_clientpw != kd_clientpw2) {
            alert("Passwords Do Not Match!");
            return;
        }

        this.props.onClientSubmit({
            kd_clientemail: kd_clientemail,
            kd_clientfname: kd_clientfname,
            kd_clientlname: kd_clientlname,
            kd_clientphone: kd_clientphone,
            kd_clientpw: kd_clientpw,
            kd_clientpw2: kd_clientpw2,
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
                                    value={this.state.kd_clientemail}
                                    uniqueName="kd_clientemail"
                                    textArea={false}
                                    required={true}
                                    validate={this.validateEmail}
                                    onChange={this.setValue.bind(this, 'kd_clientemail')}
                                    errorMessage="Invalid EMail Address"
                                    emptyMessage="EMail Address is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>First Name</th>
                            <td>
                                <TextInput
                                    value={this.state.kd_clientfname}
                                    uniqueName="kd_clientfname"
                                    textArea={false}
                                    required={false}
                                    minCharacters={2}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'kd_clientfname')}
                                    errorMessage="First Name is invalid" />
                            </td>
                        </tr>
                        <tr>
                            <th>Last Name</th>
                            <td>
                                <TextInput
                                    value={this.state.kd_clientlname}
                                    uniqueName="kd_clientlname"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'kd_clientlname')}
                                    errorMessage="Last Name is invalid"
                                    emptyMessage="Last Name is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Phone</th>
                            <td>
                                <TextInput
                                    value={this.state.kd_clientphone}
                                    uniqueName="kd_clientphone"
                                    textArea={false}
                                    required={false}
                                    minCharacters={6}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'kd_clientphone')}
                                    errorMessage="Phone Number is invalid" />
                            </td>
                        </tr>
                        <tr>
                            <th>Password</th>
                            <td>
                                <TextInput
                                    inputType="password"
                                    value={this.state.kd_clientpw}
                                    uniqueName="kd_clientpw"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'kd_clientpw')}
                                    errorMessage="Password is Invalid" 
                                    emptyMessage="Password is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Verify Password</th>
                            <td>
                                <TextInput
                                    inputType="password"
                                    value={this.state.kd_clientpw2}
                                    uniqueName="kd_clientpw2"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'kd_clientpw2')}
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
