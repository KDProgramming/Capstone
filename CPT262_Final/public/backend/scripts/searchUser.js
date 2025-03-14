var UserBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadUserFromServer: function () {

        $.ajax({
            url: '/getuser/',
            data: {
                'userid': userid.value,
                'usercategory': uscategory.value,
                'useremail': useremail.value,
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
                <h1>Search Users</h1>
                <UserForm2 onUserSubmit={this.loadUserFromServer} />
                <br />
                <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Category</th>
                                <th>Email</th>
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
            useremail: "",
        };
    },

    loadCategory: function() {
        $.ajax({
            url: '/getcategory/',
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
        var useremail = this.state.useremail.trim();

        this.props.onUserSubmit({ 
            userid: userid, 
            usercategory: usercategory,
            useremail: useremail, 
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
                <h2>User Details</h2>
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
                            <th>Category</th>
                            <td>
                                <CategoryList data={this.state.categorydata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>
                                <input 
                                name="useremail" 
                                id="useremail" 
                                value={this.state.useremail} 
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
                    uscategory={user.userCategoryName}
                    usname={user.userEmail}
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

