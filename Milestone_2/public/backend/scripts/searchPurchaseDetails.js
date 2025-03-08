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
                'purchasedetproduct': purchasedetproduct.value,
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
    componentDidMount: function () {
        this.loadPurchaseDetsFromServer();
    },

    render: function () {
        return (
            <div>
                <h1>Purchase Details</h1>
                <PurchaseDetsform2 onPurchaseDetsSubmit={this.loadPurchaseDetsFromServer} />
                <br />
                <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Purchase ID</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                         </thead>
                        <PurchaseDetsList data={this.state.data} />
                    </table>
                
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

var PurchaseDetsList = React.createClass({
    render: function () {
        var purchaseDetsNodes = this.props.data.map(function (purchasedets) {
            return (
                <PurchaseDets
                    key={purchasedets.purchaseDetailID} // never forget this line!
                    purdetid={purchasedets.purchaseDetailID}
                    purdetpurchaseid={purchasedets.purchaseID}
                    purdetproduct={purchasedets.productID}
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
                    {product.productName}
                </option>
            );
        });
        return (
            <select name="purdetproduct" id="purdetproduct">
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <PurchaseDetsBox />,
    document.getElementById('content')
);

