var ususer = 0;
var InventoryBox = React.createClass({
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
                    this.loadInventoryFromServer();
                }
                ususer = this.state.viewthepage;
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadInventoryFromServer: function () {
        $.ajax({
            url: '/getinventory/',
            data: {
                'kd_inventoryid': kd_inventoryid.value,
                'kd_inventorylevel': kd_inventorylevel.value,
                'kd_inventorylastupdated': kd_inventorylastupdated.value,
                'kd_inventoryproduct': invproduct.value,         
            },
            
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },
    componentDidMount: function () {
        this.loadAllowLogin();
        this.loadInventoryFromServer();
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
                    <h1>Inventory</h1>
                    <Inventoryform2 onInventorySubmit={this.loadInventoryFromServer} />
                    <br />
                    <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Level</th>
                                    <th>Last Updated</th>
                                    <th>Product</th>
                                </tr>
                            </thead>
                            <InventoryList data={this.state.data} />
                        </table>
                    
                </div>
            );
        }
    }
});

var Inventoryform2 = React.createClass({
    getInitialState: function () {
        return {
            kd_inventoryid: "",
            kd_inventorylevel: "",
            kd_inventorylastupdated: "",
            kd_productdata: [],
        };
    },

    loadProducts: function() {
        $.ajax({
            url: '/getproducts/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({kd_productdata:data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadProducts();
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var kd_inventoryid = this.state.kd_inventoryid.trim();
        var kd_inventorylevel = this.state.kd_inventorylevel.trim();
        var kd_inventorylastupdated = this.state.kd_inventorylastupdated.trim();
        var kd_inventoryproduct = invproduct.value;

        this.props.onInventorySubmit({ 
            kd_inventoryid: kd_inventoryid, 
            kd_inventorylevel: kd_inventorylevel, 
            kd_inventorylastupdated: kd_inventorylastupdated, 
            kd_inventoryproduct: kd_inventoryproduct,
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
                <h2>Inventory</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Inventory ID</th>
                            <td>
                                <input 
                                type="text" 
                                name="kd_inventoryid" 
                                id="kd_inventoryid" 
                                value={this.state.kd_inventoryid} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Inventory Level</th>
                            <td>
                                <input 
                                name="kd_inventorylevel" 
                                id="kd_inventorylevel" 
                                value={this.state.kd_inventorylevel} 
                                onChange={this.handleChange}  
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Inventory Last Updated</th>
                            <td>
                                <input 
                                type = "datetime-local" 
                                name="kd_inventorylastupdated" 
                                id="kd_inventorylastupdated" 
                                value={this.state.kd_inventorylastupdated} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Inventory Product</th>
                            <td>
                                <ProductList data={this.state.kd_productdata} /> 
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Search Inventory" />

            </form>
        );
    }
});

var InventoryList = React.createClass({
    render: function () {
        var inventoryNodes = this.props.data.map(function (inventory) {
            return (
                <Inventory
                    key={inventory.inventoryID} // never forget this line!
                    invid={inventory.inventoryID}
                    invlevel={inventory.inventoryLevel}
                    invlastupdated={inventory.formattedupdate}
                    invproduct={inventory.productName}
                >
                </Inventory>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {inventoryNodes}
            </tbody>
        );
    }
});



var Inventory = React.createClass({

    render: function () {
        return (

            <tr>
                            <td>
                                {this.props.invid} 
                            </td>
                            <td>
                                {this.props.invlevel}
                            </td>
                            <td>
                                {this.props.invlastupdated}
                            </td>
                            <td>
                                {this.props.invproduct}
                            </td>
                </tr>
        );
    }
});

var ProductList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (products) {
            return (
                <option
                    key={products.productID}
                    value={products.productID}
                >
                    {products.productName}
                </option>
            );
        });
        return (
            <select name="invproduct" id="invproduct">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});


ReactDOM.render(
    <InventoryBox />,
    document.getElementById('content')
);

