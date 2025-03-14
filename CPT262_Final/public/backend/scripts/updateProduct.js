var ProductBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadProductFromServer: function () {
        $.ajax({
            url: '/getproduct/',
            data: {
                'productid': productid.value,
                'productname': productname.value,
                'productquantity': productquantity.value,
                'productprice': productprice.value,
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
    updateSingleProductFromServer: function (product) {
        
        $.ajax({
            url: '/updatesingleproduct/',
            dataType: 'json',
            data: product,
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
        this.loadProductFromServer();
    },

    render: function () {
        return (
            <div>
                <h1>Update Product</h1>
                <Productform2 onProductSubmit={this.loadProductFromServer} />
                <br />
                <div id = "theresults">
                    <div id = "theleft">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th></th>
                            </tr>
                         </thead>
                         <ProductList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <ProductUpdateform onUpdateSubmit={this.updateSingleProductFromServer} />
                    </div>                
                </div>
            </div>
        );
    }
});

var Productform2 = React.createClass({
    getInitialState: function () {
        return {
            productid: "",
            productname: "",
            productquantity: "",
            productprice: "",
        };
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var productid = this.state.productid.trim();
        var productname = this.state.productname.trim();
        var productquantity = this.state.productquantity.trim();
        var productprice = this.state.productprice.trim();

        this.props.onProductSubmit({ 
            productid: productid, 
            productname: productname, 
            productquantity: productquantity, 
            productprice: productprice,
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
                <h2>Products</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Product ID</th>
                            <td>
                                <input 
                                name="productid" 
                                id="productid" 
                                value={this.state.productid} 
                                onChange={this.handleChange}  
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Product Name</th>
                            <td>
                                <input 
                                name="productname" 
                                id="productname" 
                                value={this.state.productname} 
                                onChange={this.handleChange}  
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Product Quantity</th>
                            <td>
                                <input 
                                name="productquantity" 
                                id="productquantity" 
                                value={this.state.productquantity} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>    
                        <tr>
                            <th>Product Price</th>
                            <td>
                                <input 
                                name="productprice" 
                                id="productprice" 
                                value={this.state.productprice}
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>  
                    </tbody>
                </table>
                <input type="submit" value="Search Product" />

            </form>
        );
    }
});

var ProductUpdateform = React.createClass({
    getInitialState: function () {
        return {
            upproductid: "",
            upproductname: "",
            upproductprice: "",
            upproductquantity: "",
        };
    },

    handleUpSubmit: function (e) {
        e.preventDefault();

        var upproductid = upprodid.value;
        var upproductname = upprodname.value;
        var upproductprice = upprodprice.value;
        var upproductquantity = upprodquantity.value;

        this.props.onUpdateSubmit({ 
            upproductid: upproductid, 
            upproductname: upproductname, 
            upproductprice: upproductprice,
            upproductquantity: upproductquantity, 
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
                            <th>Product Name</th>
                            <td>
                                <input 
                                name="upprodname" 
                                id="upprodname" 
                                value={this.state.upprodname} 
                                onChange={this.handleUpChange}  
                                />
                            </td>
                        </tr>   
                        <tr>
                            <th>Product Price</th>
                            <td>
                                <input 
                                name="upprodprice" 
                                id="upprodprice" 
                                value={this.state.upprodprice}
                                onChange={this.handleUpChange} 
                                />
                            </td>
                        </tr>  
                        <tr>
                            <th>Product Quantity</th>
                            <td>
                                <input 
                                name="upprodquantity" 
                                id="upprodquantity" 
                                value={this.state.upprodquantity} 
                                onChange={this.handleUpChange} 
                                />
                            </td>
                        </tr>
                    </tbody>
                </table><br/>
                <input type="hidden" name="upprodid" id="upprodid" onChange={this.handleUpChange} />
                <input type="submit" value="Update Product" />
            </form>
            </div>
            </div>
        );
    }
});

var ProductList = React.createClass({
    render: function () {
        var productNodes = this.props.data.map(function (product) {
            return (
                <Product
                    key={product.productID} // never forget this line!
                    prodid={product.productID}
                    prodname={product.productName}
                    prodquantity={product.productQuantity}
                    prodprice={product.productPrice}
                >
                </Product>
            );       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {productNodes}
            </tbody>
        );
    }
});

var Product = React.createClass({
    getInitialState: function () {
        return {
            upprodid: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupprodid = this.props.prodid;
        
        this.loadSingleProduct(theupprodid);
    },
    loadSingleProduct: function (theupprodid) {
        $.ajax({
            url: '/getsingleproduct/',
            data: {
                'upprodid': theupprodid
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateProd = this.state.singledata.map(function (product) {
                    upprodid.value = theupprodid;
                    upprodname.value = product.productName;
                    upprodprice.value = product.productPrice; 
                    upprodquantity.value = product.productQuantity;
                    
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
                                {this.props.prodid}
                            </td>
                            <td>
                                {this.props.prodname}
                            </td>
                            <td>
                                {this.props.prodprice}
                            </td>
                            <td>
                                {this.props.prodquantity}
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

ReactDOM.render(
    <ProductBox />,
    document.getElementById('content')
);