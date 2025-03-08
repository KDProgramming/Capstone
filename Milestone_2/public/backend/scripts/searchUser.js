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
    componentDidMount: function () {
        this.loadUserFromServer();
    },

    render: function () {
        return (
            <div>
                <h1>Users</h1>
                <UserForm2 onUserSubmit={this.loadUserFromServer} />
                <br />
                <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Category</th>
                                <th>Username</th>
                            </tr>
                         </thead>
                        <UserList data={this.state.data} />
                    </table>
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

    render: function () {

        //display an individual user
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

ReactDOM.render(
    <UserBox />,
    document.getElementById('content')
);

