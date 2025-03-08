var UserBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadUserFromServer: function () {

        $.ajax({
            url: '/getuser/',
            data: {
                'userid': userid.value,
                'usercategory': usercategory.value,
                'username': username.value,
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
        this.loadUserFromServer();
    },

    render: function () {
        return (
            <div>
                <h1>Update Users</h1>
                <Userform2 onUserSubmit={this.loadUsersFromServer} />
                <br />
                <div id = "theresults">
                    <div id = "theleft">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Category</th>
                                <th>Username</th>
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
});

var UserForm2 = React.createClass({
    getInitialState: function () {
        return {
            userid: "",
            categorydata: [],
            username: "",
        };
    },

    loadCategory: function() {
        $.ajax({
            url: '/getcategory',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({categorydata:data});
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

        var userid = this.state.userid.trim();
        var usercategory = uscategory.value;
        var username = this.state.username.trim();

        this.props.onUserSubmit({ 
            userid: userid, 
            usercategory: usercategory,
            username: username, 
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
                                name="userid" 
                                id="userid" 
                                value={this.state.userid} 
                                onChange={this.handleChange}  
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>User Category</th>
                            <td>
                                <CategoryList data={this.state.categorydata} />
                            </td>
                        </tr>
                        <tr>
                            <th>User Name</th>
                            <td>
                                <input 
                                name="username" 
                                id="username" 
                                value={this.state.username} 
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
            upuserid: "",
            upcategorydata: [],
            upuseremail: "",
        };
    },
    handleUpSubmit: function (e) {
        e.preventDefault();

        var upuserid = upusid.value;
        var upusercategory = upuscategory.value;
        var upusername = upusname.value;

        this.props.onUpdateSubmit({ 
            upuserid: upuserid, 
            upusercategory: upusercategory, 
            upusername: upusername, 
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
                                <CategoryUpdateList data={this.state.upcategorydata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Username</th>
                            <td>
                                <input 
                                name="upusname" 
                                id="upusname" 
                                value={this.state.upusname} 
                                onChange={this.handleUpChange} 
                                />
                            </td>
                        </tr>
                    </tbody>
                </table><br/>
                <input type="hidden" name="upusid" id="upusid" onChange={this.handleUpChange} />
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
                    uscategory={user.userCategoryID}
                    usname={user.userName}
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
            upusid: "",
            singledata: []
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
                'upusid': theupusid
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateUser = this.state.singledata.map(function (user) {
                    upusid.value = theupusid;
                    upuscategory.value = user.userCategoryID;
                    upusname.value = user.userUsername;
                    

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
                                {this.props.usname}
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
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <UserBox />,
    document.getElementById('content')
);