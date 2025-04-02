var ususer = 0;
var ProductBox = React.createClass({
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
                    this.loadProductFromServer();
                }
                ususer = this.state.viewthepage;
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadProductFromServer: function () {
        $.ajax({
            url: '/getproduct/',
            data: {
                'kd_productid': kd_productid.value,
                'kd_productname': kd_productname.value,
                'kd_productquantity': kd_productquantity.value,
                'kd_productprice': kd_productprice.value,
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
        this.loadAllowLogin();
        this.loadProductFromServer();
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
    }
});

var Productform2 = React.createClass({
    getInitialState: function () {
        return {
            kd_productid: "",
            kd_productname: "",
            kd_productquantity: "",
            kd_productprice: "",
        };
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var kd_productid = this.state.kd_productid.trim();
        var kd_productname = this.state.kd_productname.trim();
        var kd_productquantity = this.state.kd_productquantity.trim();
        var kd_productprice = this.state.kd_productprice.trim();

        this.props.onProductSubmit({ 
            kd_productid: kd_productid, 
            kd_productname: kd_productname, 
            kd_productquantity: kd_productquantity, 
            kd_productprice: kd_productprice,
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
                                name="kd_productid" 
                                id="kd_productid" 
                                value={this.state.kd_productid} 
                                onChange={this.handleChange}  
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Product Name</th>
                            <td>
                                <input 
                                name="kd_productname" 
                                id="kd_productname" 
                                value={this.state.kd_productname} 
                                onChange={this.handleChange}  
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Product Quantity</th>
                            <td>
                                <input 
                                name="kd_productquantity" 
                                id="kd_productquantity" 
                                value={this.state.kd_productquantity} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>    
                        <tr>
                            <th>Product Price</th>
                            <td>
                                <input 
                                name="kd_productprice" 
                                id="kd_productprice" 
                                value={this.state.kd_productprice}
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
            kd_upproductid: "",
            kd_upproductname: "",
            kd_upproductprice: "",
            kd_upproductquantity: "",
        };
    },

    handleUpSubmit: function (e) {
        e.preventDefault();

        var kd_upproductid = kd_upprodid.value;
        var kd_upproductname = kd_upprodname.value;
        var kd_upproductprice = kd_upprodprice.value;
        var kd_upproductquantity = kd_upprodquantity.value;

        this.props.onUpdateSubmit({ 
            kd_upproductid: kd_upproductid, 
            kd_upproductname: kd_upproductname, 
            kd_upproductprice: kd_upproductprice,
            kd_upproductquantity: kd_upproductquantity, 
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
                                name="kd_upprodname" 
                                id="kd_upprodname" 
                                value={this.state.kd_upprodname} 
                                onChange={this.handleUpChange}  
                                />
                            </td>
                        </tr>   
                        <tr>
                            <th>Product Price</th>
                            <td>
                                <input 
                                name="kd_upprodprice" 
                                id="kd_upprodprice" 
                                value={this.state.kd_upprodprice}
                                onChange={this.handleUpChange} 
                                />
                            </td>
                        </tr>  
                        <tr>
                            <th>Product Quantity</th>
                            <td>
                                <input 
                                name="kd_upprodquantity" 
                                id="kd_upprodquantity" 
                                value={this.state.kd_upprodquantity} 
                                onChange={this.handleUpChange} 
                                />
                            </td>
                        </tr>
                    </tbody>
                </table><br/>
                <input type="hidden" name="kd_upprodid" id="kd_upprodid" onChange={this.handleUpChange} />
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
            kd_upprodid: "",
            kd_singledata: []
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
                'kd_upprodid': theupprodid
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ kd_singledata: data });
                console.log(this.state.kd_singledata);
                var populateProd = this.state.kd_singledata.map(function (product) {
                    kd_upprodid.value = theupprodid;
                    kd_upprodname.value = product.productName;
                    kd_upprodprice.value = product.productPrice; 
                    kd_upprodquantity.value = product.productQuantity;
                    
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