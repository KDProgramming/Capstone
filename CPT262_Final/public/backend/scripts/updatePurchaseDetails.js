var ususer = 0;
var PurchaseDetsBox = React.createClass({
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
                    this.loadPurchaseDetsFromServer();
                }
                ususer = this.state.viewthepage;
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadPurchaseDetsFromServer: function () {
        $.ajax({
            url: '/getpurchasedets/',
            data: {
                'kd_purchasedetid': kd_purchasedetid.value,
                'kd_purchasedetpurchaseid': kd_purchasedetpurchaseid.value,
                'kd_purchasedetproduct': purdetproduct.value,
                'kd_purchasedetquantity': kd_purchasedetquantity.value,
                'kd_purchasedettotal': kd_purchasedettotal.value,         
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
        this.loadAllowLogin();
        this.loadPurchaseDetsFromServer();
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
    }
});

var PurchaseDetsform2 = React.createClass({
    getInitialState: function () {
        return {
            kd_purchasedetid: "",
            kd_purchasedetpurchaseid: "",
            kd_productdata: [],
            kd_purchasedetquantity: "",
            kd_purchasedettotal: "",
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

        var kd_purchasedetid = this.state.kd_purchasedetid.trim();
        var kd_purchasedetpurchaseid = this.state.kd_purchasedetpurchaseid.trim();
        var kd_purchasedetproduct = purdetproduct.value;
        var kd_purchasedetquantity = this.state.kd_purchasedetquantity.trim();
        var kd_purchasedettotal = this.state.kd_purchasedettotal.trim();

        this.props.onPurchaseDetsSubmit({ 
            kd_purchasedetid: kd_purchasedetid, 
            kd_purchasedetpurchaseid: kd_purchasedetpurchaseid, 
            kd_purchasedetproduct: kd_purchasedetproduct, 
            kd_purchasedetquantity: kd_purchasedetquantity, 
            kd_purchasedettotal: kd_purchasedettotal,
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
                                name="kd_purchasedetid" 
                                id="kd_purchasedetid" 
                                value={this.state.kd_purchasedetid} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Purchase ID</th>
                            <td>
                                <input 
                                name="kd_purchasedetpurchaseid" 
                                id="kd_purchasedetpurchaseid" 
                                value={this.state.kd_purchasedetpurchaseid} 
                                onChange={this.handleChange}  
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Product</th>
                            <td>
                                <ProductList data={this.state.kd_productdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Quantity</th>
                            <td>
                                <input 
                                name="kd_purchasedetquantity" 
                                id="kd_purchasedetquantity" 
                                value={this.state.kd_purchasedetquantity} 
                                onChange={this.handleChange}  
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Total</th>
                            <td>
                                <input 
                                name="kd_purchasedettotal" 
                                id="kd_purchasedettotal" 
                                value={this.state.kd_purchasedettotal} 
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
            kd_uppurchasedetid: "",
            kd_uppurchasedetpurchaseid: "",
            kd_upproductdata: [],
            kd_uppurchasedetquantity: "",
            kd_uppurchasedettotal: "",
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

        var kd_uppurchasedetid = kd_uppurdetid.value;
        var kd_uppurchasedetpurchaseid = kd_uppurdetpurchaseid.value;
        var kd_uppurchasedetproduct = uppurdetproduct.value;
        var kd_uppurchasedetquantity = kd_uppurdetquantity.value;
        var kd_uppurchasedettotal = kd_uppurdettotal.value;

        this.props.onUpdateSubmit({ 
            kd_uppurchasedetid: kd_uppurchasedetid, 
            kd_uppurchasedetpurchaseid: kd_uppurchasedetpurchaseid, 
            kd_uppurchasedetproduct: kd_uppurchasedetproduct, 
            kd_uppurchasedetquantity: kd_uppurchasedetquantity, 
            kd_uppurchasedettotal: kd_uppurchasedettotal,
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
                                name="kd_uppurdetpurchaseid" 
                                id="kd_uppurdetpurchaseid" 
                                value={this.state.kd_uppurdetpurchaseid} 
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
                            <th>Quantity</th>
                            <td>
                                <input 
                                name="kd_uppurdetquantity" 
                                id="kd_uppurdetquantity" 
                                value={this.state.kd_uppurdetquantity} 
                                onChange={this.handleUpChange}  
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Total</th>
                            <td>
                                <input 
                                name="kd_uppurdettotal" 
                                id="kd_uppurdettotal" 
                                value={this.state.kd_uppurdettotal} 
                                onChange={this.handleUpChange} 
                                />
                            </td>
                        </tr>  
                    </tbody>
                </table><br />
                        <input type="hidden" name="kd_uppurdetid" id="kd_uppurdetid" onChange={this.handleUpChange} />
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
            kd_uppurdetid: "",
            kd_singledata: []
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
                'kd_uppurdetid': theuppurdetid
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ kd_singledata: data });
                console.log(this.state.kd_singledata);
                var populatePurchaseDets = this.state.kd_singledata.map(function (purchasedetails) {
                    kd_uppurdetid.value = theuppurdetid;
                    kd_uppurdetpurchaseid.value = purchasedetails.purchaseID;
                    uppurdetproduct.value = purchasedetails.productID;
                    kd_uppurdetquantity.value = purchasedetails.purchaseQuantity;
                    kd_uppurdettotal.value = purchasedetails.purchaseTotal;

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