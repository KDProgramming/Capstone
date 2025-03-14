var ServicesBox = React.createClass({

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
        return (
            <div className="ServicesBox">
                <h1>Insert Service</h1>
                <Servicesform2 onServicesSubmit={this.handleServicesSubmit}/>
            </div>
        );
    }
});

var Servicesform2 = React.createClass({
    getInitialState: function () {
        return {
            servicename: "",
            serviceblocks: "",
            serviceprice: "",
        };
    },

    handleSubmit: function (e) { 
        e.preventDefault(); 
        

        var servicename = this.state.servicename.trim();
        var serviceblocks = this.state.serviceblocks.trim();
        var serviceprice = this.state.serviceprice.trim();

        if (!servicename || !serviceblocks || !serviceprice) {
            console.log("Field Missing");
            return;
        }

        if (serviceblocks !== '1' && serviceblocks !== '2') {
            console.log("Service Blocks Must Be 1 or 2!");
        }

        this.props.onServicesSubmit({ 
            servicename: servicename,
            serviceblocks: serviceblocks,
            serviceprice: serviceprice,
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
                                    value={this.state.servicename}
                                    uniqueName="servicename"
                                    textArea={false}
                                    required={true}
                                    minCharacters={1}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'servicename')}
                                    errorMessage="Service Name is invalid"
                                    emptyMessage="Service Name is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Service Blocks</th>
                            <td>
                                <TextInput
                                    value={this.state.serviceblocks}
                                    uniqueName="serviceblocks"
                                    textArea={false}
                                    required={true}
                                    minCharacters={1}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'serviceblocks')}
                                    errorMessage="Service Blocks is invalid"
                                    emptyMessage="Service Blocks is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Service Price</th>
                            <td>
                                <TextInput
                                    value={this.state.serviceprice}
                                    uniqueName="serviceprice"
                                    textArea={false}
                                    required={true}
                                    validate={this.validateDollars}
                                    onChange={this.setValue.bind(this, 'serviceprice')}
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
