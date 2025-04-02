var ususer = 0;
var UserBox = React.createClass({
    getInitialState: function () {
        return { data: [], viewthepage: 0 };
    },
    loadAllowLogin: function () {
        $.ajax({
            url: '/getloggedinback/',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ viewthepage: data });
                if (data !== 0) {
                    this.loadUserFromServer();
                }
                ususer = this.state.viewthepage;
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadUserFromServer: function () {

        $.ajax({
            url: '/getuser/',
            data: {
                'kd_userid': kd_userid.value,
                'kd_usercategory': uscategory.value,
                'kd_useremail': kd_useremail.value,
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
    updateSingleUserFromServer: function (user) {
        $.ajax({
            url: '/updatesingleuser/',
            dataType: 'json',
            data: user,
            type: 'POST',
            cache: false,
            success: function (upsingledata) {
                this.setState({ upsingledata: upsingledata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        window.location.reload(true);
    },
    componentDidMount: function () {
        this.loadAllowLogin();
        this.loadUserFromServer();
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
                <div>
                    <h1>Update Users</h1>
                    <Userform2 onUserSubmit={this.loadUserFromServer} />
                    <br />
                    <div id = "theresults">
                        <div id = "theleft">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Category</th>
                                    <th>Email</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <UserList data={this.state.data} />
                        </table>
                        </div>
                        <div id="theright">
                            <UserUpdateform onUpdateSubmit={this.updateSingleUserFromServer} />
                        </div>                
                    </div>
                </div>
            );
        }
    }
});

var Userform2 = React.createClass({
    getInitialState: function () {
        return {
            kd_userid: "",
            kd_categorydata: [],
            kd_useremail: "",
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

        var kd_userid = this.state.kd_userid.trim();
        var kd_usercategory = uscategory.value;
        var kd_useremail = this.state.kd_useremail.trim();

        this.props.onUserSubmit({ 
            kd_userid: kd_userid, 
            kd_usercategory: kd_usercategory,
            kd_useremail: kd_useremail, 
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
                <h2>Users</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>User ID</th>
                            <td>
                                <input 
                                type="text"
                                name="kd_userid" 
                                id="kd_userid" 
                                value={this.state.kd_userid} 
                                onChange={this.handleChange}  
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>User Category</th>
                            <td>
                                <CategoryList data={this.state.kd_categorydata} />
                            </td>
                        </tr>
                        <tr>
                            <th>User Email</th>
                            <td>
                                <input 
                                name="kd_useremail" 
                                id="kd_useremail" 
                                value={this.state.kd_useremail} 
                                onChange={this.handleChange}  
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Search user" />

            </form>
        );
    }
});


var UserUpdateform = React.createClass({
    getInitialState: function () {
        return {
            kd_upuserid: "",
            kd_upcategorydata: [],
            kd_upuseremail: "",
        };
    },

    loadCategory: function() {
        $.ajax({
            url: '/getcategory',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({ kd_upcategorydata:data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadCategory();
    },

    handleUpSubmit: function (e) {
        e.preventDefault();

        var kd_upuserid = kd_upusid.value;
        var kd_upusercategory = upuscategory.value;
        var kd_upuseremail = kd_upusemail.value;

        this.props.onUpdateSubmit({ 
            kd_upuserid: kd_upuserid, 
            kd_upusercategory: kd_upusercategory, 
            kd_upuseremail: kd_upuseremail, 
        });
    },

    handleUpChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },

    render: function () {

        return (
            <div>
            <div id="thefornm">
            <form onSubmit={this.handleUpSubmit}>
                <table>
                    <tbody>
                        <tr>
                            <th>Category</th>
                            <td>
                                <CategoryUpdateList data={this.state.kd_upcategorydata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>
                                <input 
                                name="kd_upusemail" 
                                id="kd_upusemail" 
                                value={this.state.kd_upusemail} 
                                onChange={this.handleUpChange} 
                                />
                            </td>
                        </tr>
                    </tbody>
                </table><br/>
                <input type="hidden" name="kd_upusid" id="kd_upusid" onChange={this.handleUpChange} />
                <input type="submit" value="Update User" />
            </form>
            </div>
            </div>
        );
    }
});

var UserList = React.createClass({
    render: function () {
        var userNodes = this.props.data.map(function (user) {
            return (
                <User
                    key={user.userID} // never forget this line!
                    usid={user.userID}
                    uscategory={user.userCategoryName}
                    usemail={user.userEmail}
                >
                </User>
            );       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {userNodes}
            </tbody>
        );
    }
});

var User = React.createClass({
    getInitialState: function () {
        return {
            kd_upusid: "",
            kd_singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupusid = this.props.usid;
        
        this.loadSingleUser(theupusid);
    },
    loadSingleUser: function (theupusid) {
        $.ajax({
            url: '/getsingleuser/',
            data: {
                'kd_upusid': theupusid
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ kd_singledata: data });
                console.log(this.state.kd_singledata);
                var populateUser = this.state.kd_singledata.map(function (user) {
                    kd_upusid.value = theupusid;
                    upuscategory.value = user.userCategoryID;
                    kd_upusemail.value = user.userEmail;
                    

                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        
    },

    render: function () {
        return (

            <tr>
                            <td>
                                {this.props.usid}
                            </td>
                            <td>
                                {this.props.uscategory}
                            </td>
                            <td>
                                {this.props.usemail}
                            </td>
                            <td>
                                <form onSubmit={this.updateRecord}>
                                    <input type="submit" value="Update Record" />
                                </form>
                            </td>
                </tr>
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
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});

var CategoryUpdateList = React.createClass({
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
            <select name="upuscategory" id="upuscategory">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <UserBox />,
    document.getElementById('content')
);