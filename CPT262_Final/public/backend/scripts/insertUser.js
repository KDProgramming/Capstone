var ususer = 0;
var UserBox = React.createClass({
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
    handleUserSubmit: function (user) {
        $.ajax({
            url: '/user/',
            dataType: 'json',
            type: 'POST',
            data: user,
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
                <div className="UserBox">
                    <h1>Insert User</h1>
                    <Userform2 onUserSubmit={this.handleUserSubmit}/>
                </div>
            );
        }
    }
});

var Userform2 = React.createClass({
    getInitialState: function () {
        return {
            kd_categorydata: [],
            kd_useremail: "",
            kd_userpw: "",
            kd_userpw2: "",
        };
    },
    loadCategory: function() {
        $.ajax({
            url: '/getcategory',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({kd_categorydata:data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadCategory();
    },
    
    handleSubmit: function (e) { 
        e.preventDefault(); 
        
        var kd_usercategoryid = uscategory.value;
        var kd_useremail = this.state.kd_useremail.trim();
        var kd_userpw = this.state.kd_userpw.trim();
        var kd_userpw2 = this.state.kd_userpw2.trim();

        if (!kd_useremail || !kd_userpw || !kd_userpw2) {
            alert("Field Missing");
            return;
        }
        if (kd_userpw != kd_userpw2) {
            alert("Passwords Do Not Match!");
            return;
        }
 
        this.props.onUserSubmit({ 
            kd_usercategoryid: kd_usercategoryid,
            kd_useremail: kd_useremail,
            kd_userpw: kd_userpw,
            kd_userpw2: kd_userpw2,
        });
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
            <form className="UserForm" onSubmit={this.handleSubmit}>
                <h2>User Details</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Email</th>
                            <td>
                                <TextInput
                                    value={this.state.kd_useremail}
                                    uniqueName="kd_useremail"
                                    textArea={false}
                                    required={true}
                                    minCharacters={2}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'kd_useremail')}
                                    errorMessage="User Name is invalid"
                                    emptyMessage="User Name is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Category</th>
                            <td>
                            <CategoryList data={this.state.kd_categorydata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Password</th>
                            <td>
                                <TextInput
                                    inputType="password"
                                    value={this.state.kd_userpw}
                                    uniqueName="kd_userpw"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'kd_userpw')}
                                    errorMessage="Password is Invalid" 
                                    emptyMessage="Password is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Verify Password</th>
                            <td>
                                <TextInput
                                    inputType="password"
                                    value={this.state.kd_userpw2}
                                    uniqueName="kd_userpw2"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'kd_userpw2')}
                                    errorMessage="Password is Invalid" 
                                    emptyMessage="Password Verification is Required" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Insert User" />

            </form>
        );
    }
});

var CategoryList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (category) {
            return (
                <option
                    key={category.userCategoryID}
                    value={category.userCategoryID}
                >
                    {category.userCategoryName}
                </option>
            );
        });
        return (
            <select name="uscategory" id="uscategory">
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
    <UserBox />,
    document.getElementById('content')
);
