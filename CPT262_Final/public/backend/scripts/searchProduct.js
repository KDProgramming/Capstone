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
                    <h1>Products</h1>
                    <Productform2 onProductSubmit={this.loadProductFromServer} />
                    <br />
                    <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Quanity</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <ProductList data={this.state.data} />
                        </table>
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

    render: function () {
        //display an individual product
        return (
            <tr>
                            <td>
                                {this.props.prodid} 
                            </td>
                            <td>
                                {this.props.prodname}
                            </td>
                            <td>
                                {this.props.prodquantity}
                            </td>
                            <td>
                                {this.props.prodprice}
                            </td>
                </tr>
        );
    }
});


ReactDOM.render(
    <ProductBox />,
    document.getElementById('content')
);

