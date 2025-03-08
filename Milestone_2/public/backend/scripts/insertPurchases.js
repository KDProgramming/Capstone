var PurchasesBox = React.createClass({
    handlePurchasesSubmit: function (purchases) {
        $.ajax({ 
            url: '/purchases/',
            dataType: 'json',
            type: 'POST',
            data: purchases,
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
            <div className="PurchasesBox">
                <h1>Purchases</h1>
                <Purchasesform2 onPurchasesSubmit={this.handlePurchasesSubmit}/>
            </div>
        );
    }
});

var Purchasesform2 = React.createClass({
    getInitialState: function () {
        return {
            userdata: [],
            purchasedate: "",
            statusdata: [],
            purchasetotal: "",
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
    loadStatus: function() {
        $.ajax({
            url: '/getpstatus/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({statusdata:data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadUsers();
        this.loadStatus();
    },

    handleSubmit: function (e) { 
        e.preventDefault(); 
        
        var purchaseuserid = puruser.value;
        var purchasedate = this.state.purchasedate;
        var purchasestatus = purstatus.value;
        var purchasetotal = this.state.purchasetotal.trim();

        
        if (!purchasedate || !purchasetotal) {
            console.log("Field Missing");
            return;
        }

        this.props.onPurchasesSubmit({ 
            purchaseuserid: purchaseuserid,
            purchasedate: purchasedate,
            purchasestatus: purchasestatus,
            purchasetotal: purchasetotal,
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
            <form className="PurchasesForm" onSubmit={this.handleSubmit}>
                <h2>Purchases</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Purchase User</th>
                            <td>
                                <UserList data={this.state.userdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Purchase Date</th>
                            <td>
                            <input 
                                type = "date" 
                                name="purchasedate" 
                                id="purchasedate" 
                                value={this.state.purchasedate} 
                                onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Purchase Status</th>
                            <td>
                            <StatusList data={this.state.statusdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Purchase Total</th>
                            <td>
                                <TextInput
                                    value={this.state.purchasetotal}
                                    uniqueName="purchasetotal"
                                    textArea={false}
                                    required={true}
                                    minCharacters={5}
                                    validate={this.validateDollars}
                                    onChange={this.setValue.bind(this, 'purchasetotal')}
                                    errorMessage="Total is invalid"
                                    emptyMessage="Total is required" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Insert Purchase" />
               
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
            <select name="puruser" id="puruser">
                {optionNodes}
            </select>
        );
    }
});

var StatusList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (status) {
            return (
                <option
                    key={status.purchaseStatusID}
                    value={status.purchaseStatusID}
                >
                    {status.purchaseStatusName}
                </option>
            );
        });
        return (
            <select name="purstatus" id="purstatus">
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
    <PurchasesBox />,
    document.getElementById('content')
);
