var PurchaseDetsBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadPurchaseDetsFromServer: function () {
        $.ajax({
            url: '/getpurchasedets/',
            data: {
                'purchasedetid': purchasedetid.value,
                'purchasedetpurchaseid': purchasedetpurchaseid.value,
                'purchasedetproduct': purdetproduct.value,
                'purchasedetquantity': purchasedetquantity.value,
                'purchasedettotal': purchasedettotal.value,         
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
    updateSinglePurchaseDetsFromServer: function (purchasedetails) {
        
        $.ajax({
            url: '/updatesinglepurchasedets/',
            dataType: 'json',
            data: purchasedetails,
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
        this.loadPurchaseDetsFromServer();
    },

    render: function () {
        return (
            <div>
                <h1>Update Purchase Details</h1>
                <PurchaseDetsform2 onPurchaseDetsSubmit={this.loadPurchaseDetsFromServer} />
                <br />
                <div id = "theresults">
                    <div id = "theleft">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Purchase ID</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th></th>
                            </tr>
                         </thead>
                        <PurchaseDetsList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <PurchaseDetsUpdateform onUpdateSubmit={this.updateSinglePurchaseDetsFromServer} />
                    </div>                
                </div>
            </div>
        );
    }
});

var PurchaseDetsform2 = React.createClass({
    getInitialState: function () {
        return {
            purchasedetid: "",
            purchasedetpurchaseid: "",
            productdata: [],
            purchasedetquantity: "",
            purchasedettotal: "",
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

        var purchasedetid = this.state.purchasedetid.trim();
        var purchasedetpurchaseid = this.state.purchasedetpurchaseid.trim();
        var purchasedetproduct = purdetproduct.value;
        var purchasedetquantity = this.state.purchasedetquantity.trim();
        var purchasedettotal = this.state.purchasedettotal.trim();

        this.props.onPurchaseDetsSubmit({ 
            purchasedetid: purchasedetid, 
            purchasedetpurchaseid: purchasedetpurchaseid, 
            purchasedetproduct: purchasedetproduct, 
            purchasedetquantity: purchasedetquantity, 
            purchasedettotal: purchasedettotal,
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
                <h2>Purchase Details</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Purchase Details ID</th>
                            <td>
                                <input 
                                type="text" 
                                name="purchasedetid" 
                                id="purchasedetid" 
                                value={this.state.purchasedetid} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Purchase ID</th>
                            <td>
                                <input 
                                name="purchasedetpurchaseid" 
                                id="purchasedetpurchaseid" 
                                value={this.state.purchasedetpurchaseid} 
                                onChange={this.handleChange}  
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Product</th>
                            <td>
                                <ProductList data={this.state.productdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Quantity</th>
                            <td>
                                <input 
                                name="purchasedetquantity" 
                                id="purchasedetquantity" 
                                value={this.state.purchasedetquantity} 
                                onChange={this.handleChange}  
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Total</th>
                            <td>
                                <input 
                                name="purchasedettotal" 
                                id="purchasedettotal" 
                                value={this.state.purchasedettotal} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>  
                    </tbody>
                </table>
                <input type="submit" value="Search Purchase Details" />

            </form>
        );
    }
});

var PurchaseDetsUpdateform = React.createClass({
    getInitialState: function () {
        return {
            uppurchasedetid: "",
            uppurchasedetpurchaseid: "",
            upproductdata: [],
            uppurchasedetquantity: "",
            uppurchasedettotal: "",
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

        var uppurchasedetid = uppurdetid.value;
        var uppurchasedetpurchaseid = uppurdetpurchaseid.value;
        var uppurchasedetproduct = uppurdetproduct.value;
        var uppurchasedetquantity = uppurdetquantity.value;
        var uppurchasedettotal = uppurdettotal.value;

        this.props.onUpdateSubmit({ 
            uppurchasedetid: uppurchasedetid, 
            uppurchasedetpurchaseid: uppurchasedetpurchaseid, 
            uppurchasedetproduct: uppurchasedetproduct, 
            uppurchasedetquantity: uppurchasedetquantity, 
            uppurchasedettotal: uppurchasedettotal,
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
                            <th>Purchase ID</th>
                            <td>
                                <input 
                                name="uppurdetpurchaseid" 
                                id="uppurdetpurchaseid" 
                                value={this.state.uppurdetpurchaseid} 
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
                            <th>Quantity</th>
                            <td>
                                <input 
                                name="uppurdetquantity" 
                                id="uppurdetquantity" 
                                value={this.state.uppurdetquantity} 
                                onChange={this.handleUpChange}  
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Total</th>
                            <td>
                                <input 
                                name="uppurdettotal" 
                                id="uppurdettotal" 
                                value={this.state.uppurdettotal} 
                                onChange={this.handleUpChange} 
                                />
                            </td>
                        </tr>  
                    </tbody>
                </table><br />
                        <input type="hidden" name="uppurdetid" id="uppurdetid" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Purchase Details" />
                    </form>
                </div>
            </div>
        );
    }
});

var PurchaseDetsList = React.createClass({
    render: function () {
        var purchaseDetsNodes = this.props.data.map(function (purchasedets) {
            return (
                <PurchaseDets
                    key={purchasedets.purchaseDetailID} // never forget this line!
                    purdetid={purchasedets.purchaseDetailID}
                    purdetpurchaseid={purchasedets.purchaseID}
                    purdetproduct={purchasedets.productName}
                    purdetquantity={purchasedets.purchaseQuantity}
                    purdettotal={purchasedets.purchaseTotal}
                >
                </PurchaseDets>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {purchaseDetsNodes}
            </tbody>
        );
    }
});

var PurchaseDets = React.createClass({
    getInitialState: function () {
        return {
            uppurdetid: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theuppurdetid = this.props.purdetid;
        
        this.loadSinglePurchaseDets(theuppurdetid);
    },
    loadSinglePurchaseDets: function (theuppurdetid) {
        $.ajax({
            url: '/getsinglepurchasedets/',
            data: {
                'uppurdetid': theuppurdetid
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populatePurchaseDets = this.state.singledata.map(function (purchasedetails) {
                    uppurdetid.value = theuppurdetid;
                    uppurdetpurchaseid.value = purchasedetails.purchaseID;
                    uppurdetproduct.value = purchasedetails.productID;
                    uppurdetquantity.value = purchasedetails.purchaseQuantity;
                    uppurdettotal.value = purchasedetails.purchaseTotal;

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
                                {this.props.purdetid} 
                            </td>
                            <td>
                                {this.props.purdetpurchaseid}
                            </td>
                            <td>
                                {this.props.purdetproduct}
                            </td>
                            <td>
                                {this.props.purdetquantity}
                            </td>
                            <td>
                                {this.props.purdettotal}
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
            <select name="purdetproduct" id="purdetproduct">
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
            <select name="uppurdetproduct" id="uppurdetproduct">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <PurchaseDetsBox />,
    document.getElementById('content')
);