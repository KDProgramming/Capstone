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
    componentDidMount: function () {
        this.loadProductFromServer();
    },

    render: function () {
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
                <option value ="0"></option>
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

