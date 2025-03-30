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
    updateSingleInventoryFromServer: function (inventory) {
        
        $.ajax({
            url: '/updatesingleinventory/',
            dataType: 'json',
            data: inventory,
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
        this.loadInventoryFromServer();
    },

    render: function () {
        return (
            <div>
                <h1>Update Inventory</h1>
                <Inventoryform2 onInventorySubmit={this.loadInventoryFromServer} />
                <br />
                <div id = "theresults">
                    <div id = "theleft">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Level</th>
                                <th>Product</th>
                                <th>Last Updated</th>
                                <th></th>
                            </tr>
                         </thead>
                        <InventoryList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <InventoryUpdateform onUpdateSubmit={this.updateSingleInventoryFromServer} />
                    </div>                
                </div>
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
                                step="1800" />
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

var InventoryUpdateform = React.createClass({
    getInitialState: function () {
        return {
            upinventoryid: "",
            upinventorylevel: "",
            upproductdata: [],
            upinventorylastupdated: "",
        };
    },

    loadProducts: function() {
        $.ajax({
            url: '/getproducts/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({upproductdata:data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadProducts();
    },
    
    handleUpSubmit: function (e) {
        e.preventDefault();

        var upinventoryid = upinvid.value;
        var upinventorylevel = upinvlevel.value;
        var upinventoryproduct = upinvproduct.value;
        var upinventorylastupdated = upinvlastupdated.value;

        this.props.onUpdateSubmit({ 
            upinventoryid: upinventoryid, 
            upinventorylevel: upinventorylevel, 
            upinventoryproduct: upinventoryproduct, 
            upinventorylastupdated: upinventorylastupdated, 
        });
    },
    
    render: function () {
        return (
            <div>
                <div id="theform">
                    <form onSubmit={this.handleUpSubmit}>
                    <table>
                    <tbody>
                        <tr>
                            <th>Level</th>
                            <td>
                                <input 
                                name="upinvlevel" 
                                id="upinvlevel" 
                                value={this.state.upinvlevel} 
                                onChange={this.handleUpChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Product</th>
                            <td>
                                <ProductUpdateList data={this.state.upproductdata} /> 
                            </td>
                        </tr>
                        <tr>
                            <th>Last Updated</th>
                            <td>
                                <input 
                                name="upinvlastupdated" 
                                id="upinvlastupdated" 
                                value={this.state.upinvlastupdated} 
                                onChange={this.handleUpChange} />
                            </td>
                        </tr>  
                    </tbody>
                </table><br />
                        <input type="hidden" name="upinvid" id="upinvid" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Inventory" />
                    </form>
                </div>
            </div>
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
    getInitialState: function () {
        return {
            upinvid: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupinvid = this.props.invid;
        
        this.loadSingleInventory(theupinvid);
    },
    loadSingleInventory: function (theupinvid) {
        $.ajax({
            url: '/getsingleinventory/',
            data: {
                'upinvid': theupinvid
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateInventory = this.state.singledata.map(function (inventory) {
                    upinvid.value = theupinvid;
                    upinvlevel.value = inventory.inventoryLevel;
                    upinvproduct.value = inventory.productID;
                    upinvlastupdated.value = inventory.inventoryLastUpdated;

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
                                {this.props.invid} 
                            </td>
                            <td>
                                {this.props.invlevel}
                            </td>
                            <td>
                                {this.props.invproduct}
                            </td>
                            <td>
                                {this.props.invlastupdated}
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

var ProductUpdateList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (product) {
            return (
                <option
                    key={product.productID}
                    value={product.productID}
                >
                    {product.productName}
                </option>
            );
        });
        return (
            <select name="upinvproduct" id="upinvproduct">
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