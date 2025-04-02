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
                                step="1800" />
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

var InventoryUpdateform = React.createClass({
    getInitialState: function () {
        return {
            kd_upinventoryid: "",
            kd_upinventorylevel: "",
            kd_upproductdata: [],
            kd_upinventorylastupdated: "",
        };
    },

    loadProducts: function() {
        $.ajax({
            url: '/getproducts/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({kd_upproductdata:data});
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

        var kd_upinventoryid = kd_upinvid.value;
        var kd_upinventorylevel = kd_upinvlevel.value;
        var kd_upinventoryproduct = upinvproduct.value;
        var kd_upinventorylastupdated = kd_upinvlastupdated.value;

        this.props.onUpdateSubmit({ 
            kd_upinventoryid: kd_upinventoryid, 
            kd_upinventorylevel: kd_upinventorylevel, 
            kd_upinventoryproduct: kd_upinventoryproduct, 
            kd_upinventorylastupdated: kd_upinventorylastupdated, 
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
                                name="kd_upinvlevel" 
                                id="kd_upinvlevel" 
                                value={this.state.kd_upinvlevel} 
                                onChange={this.handleUpChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Product</th>
                            <td>
                                <ProductUpdateList data={this.state.kd_upproductdata} /> 
                            </td>
                        </tr>
                        <tr>
                            <th>Last Updated</th>
                            <td>
                                <input 
                                name="kd_upinvlastupdated" 
                                id="kd_upinvlastupdated" 
                                value={this.state.kd_upinvlastupdated} 
                                onChange={this.handleUpChange} />
                            </td>
                        </tr>  
                    </tbody>
                </table><br />
                        <input type="hidden" name="kd_upinvid" id="kd_upinvid" onChange={this.handleUpChange} />
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
            kd_upinvid: "",
            kd_singledata: []
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
                'kd_upinvid': theupinvid
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ kd_singledata: data });
                console.log(this.state.kd_singledata);
                var populateInventory = this.state.kd_singledata.map(function (inventory) {
                    kd_upinvid.value = theupinvid;
                    kd_upinvlevel.value = inventory.inventoryLevel;
                    upinvproduct.value = inventory.productID;
                    kd_upinvlastupdated.value = inventory.inventoryLastUpdated;

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