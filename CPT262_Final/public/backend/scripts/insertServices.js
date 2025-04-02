var ususer = 0;
var ServicesBox = React.createClass({
    getInitialState: function() {
        return { viewthepage: 0 };
    },
    loadAllowLogin: function () {
        $.ajax({
            url: '/getloggedinback/',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ viewthepage: data });
                ususer = this.state.viewthepage;
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadAllowLogin();
    }, 
    handleAppointmentSubmit: function (appointment) {
        $.ajax({ 
            url: '/appointment/',
            dataType: 'json',
            type: 'POST',
            data: appointment,
            success: function (data) {
                this.setState({ data: data}); 
            }.bind(this), 
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }, 
    handleServicesSubmit: function (services) {
        $.ajax({ 
            url: '/services/',
            dataType: 'json',
            type: 'POST',
            data: services,
            success: function (data) {
                this.setState({ data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
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
                <div className="ServicesBox">
                    <h1>Insert Service</h1>
                    <Servicesform2 onServicesSubmit={this.handleServicesSubmit}/>
                </div>
            );
        }
    }
});

var Servicesform2 = React.createClass({
    getInitialState: function () {
        return {
            kd_servicename: "",
            kd_serviceblocks: "",
            kd_serviceprice: "",
        };
    },

    handleSubmit: function (e) { 
        e.preventDefault(); 
        

        var kd_servicename = this.state.kd_servicename.trim();
        var kd_serviceblocks = this.state.kd_serviceblocks.trim();
        var kd_serviceprice = this.state.kd_serviceprice.trim();

        if (!kd_servicename || !kd_serviceblocks || !kd_serviceprice) {
            console.log("Field Missing");
            return;
        }

        if (kd_serviceblocks !== '1' && kd_serviceblocks !== '2') {
            console.log("Service Blocks Must Be 1 or 2!");
        }

        this.props.onServicesSubmit({ 
            kd_servicename: kd_servicename,
            kd_serviceblocks: kd_serviceblocks,
            kd_serviceprice: kd_serviceprice,
        });
    },
    validateDollars: function (value) {
        var regex = /^\$?[0-9]+(\.[0-9][0-9])?$/;
        return regex.test(value);
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
            <form className="ServicesForm" onSubmit={this.handleSubmit}>
                <h2>Service Details</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Service Name</th>
                            <td>
                                <TextInput
                                    value={this.state.kd_servicename}
                                    uniqueName="kd_servicename"
                                    textArea={false}
                                    required={true}
                                    minCharacters={1}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'kd_servicename')}
                                    errorMessage="Service Name is invalid"
                                    emptyMessage="Service Name is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Service Blocks</th>
                            <td>
                                <TextInput
                                    value={this.state.kd_serviceblocks}
                                    uniqueName="kd_serviceblocks"
                                    textArea={false}
                                    required={true}
                                    minCharacters={1}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'kd_serviceblocks')}
                                    errorMessage="Service Blocks is invalid"
                                    emptyMessage="Service Blocks is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Service Price</th>
                            <td>
                                <TextInput
                                    value={this.state.kd_serviceprice}
                                    uniqueName="kd_serviceprice"
                                    textArea={false}
                                    required={true}
                                    validate={this.validateDollars}
                                    onChange={this.setValue.bind(this, 'kd_serviceprice')}
                                    errorMessage="Service Price is invalid"
                                    emptyMessage="Service Price is required" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Insert Services" />
               
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
    <ServicesBox />,
    document.getElementById('content')
);
