var InventoryBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadInventoryFromServer: function () {
        $.ajax({
            url: '/getinventory/',
            data: {
                'inventoryid': inventoryid.value,
                'inventorylevel': inventorylevel.value,
                'inventorylastupdated': inventorylastupdated.value,
                'inventoryproduct': invproduct.value,         
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
        this.loadInventoryFromServer();
    },

    render: function () {
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
});

var Inventoryform2 = React.createClass({
    getInitialState: function () {
        return {
            inventoryid: "",
            inventorylevel: "",
            inventorylastupdated: "",
            productdata: [],
        };
    },

    loadProducts: function() {
        $.ajax({
            url: '/getproducts/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({productdata:data});
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

        var inventoryid = this.state.inventoryid.trim();
        var inventorylevel = this.state.inventorylevel.trim();
        var inventorylastupdated = this.state.inventorylastupdated.trim();
        var inventoryproduct = invproduct.value;

        this.props.onInventorySubmit({ 
            inventoryid: inventoryid, 
            inventorylevel: inventorylevel, 
            inventorylastupdated: inventorylastupdated, 
            inventoryproduct: inventoryproduct,
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
                                name="inventoryid" 
                                id="inventoryid" 
                                value={this.state.inventoryid} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Inventory Level</th>
                            <td>
                                <input 
                                name="inventorylevel" 
                                id="inventorylevel" 
                                value={this.state.inventorylevel} 
                                onChange={this.handleChange}  
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Inventory Last Updated</th>
                            <td>
                                <input 
                                type = "datetime-local" 
                                name="inventorylastupdated" 
                                id="inventorylastupdated" 
                                value={this.state.inventorylastupdated} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Inventory Product</th>
                            <td>
                                <ProductList data={this.state.productdata} /> 
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

