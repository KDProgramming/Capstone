var PurchaseDetsBox = React.createClass({
    handlePurchaseDetsSubmit: function (purchasedets) {
        $.ajax({
            url: '/purchasedets/',
            dataType: 'json',
            type: 'POST',
            data: purchasedets,
            success: function (data) {
                this.setState({ data: data}); 
            }.bind(this), 
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        return (
            <div className="PurchaseDetsBox">
                <h1>Purchase Details</h1>
                <PurchaseDetsform2 onPurchaseDetsSubmit={this.handlePurchaseDetsSubmit}/>
            </div>
        );
    }
});

var PurchaseDetsform2 = React.createClass({
    getInitialState: function () {
        return {
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
        

        var purchasedetpurchaseid = this.state.purchasedetpurchaseid.trim();
        var purchasedetproductid = purdetproduct.value;
        var purchasedetquantity = this.state.purchasedetquantity.trim();
        var purchasedettotal = this.state.purchasedettotal.trim();

        if (isNaN(purchasedetquantity)) {
            console.log("Purchase Quantity NaN");
            return;
        }
        if (isNaN(purchasedetpurchaseid)) {
            console.log("Purchase Quantity NaN");
            return;
        }
        if (!purchasedetpurchaseid || !purchasedettotal) {
            console.log("Field Missing");
            return;
        }

        this.props.onPurchaseDetsSubmit({ 
            purchasedetpurchaseid: purchasedetpurchaseid,
            purchasedetproductid: purchasedetproductid,
            purchasedetquantity: purchasedetquantity,
            purchasedettotal: purchasedettotal
        });
    },

    validateDollars: function (value) {
        var regex = /^\$?[0-9]+(\.[0-9][0-9])?$/;
        return regex.test(value);
    },
    commonValidate: function () {
        return true;
    },
    setValue: function (field, event) {
        var object = {};
        object[field] = event.target.value;
        this.setState(object);
    },
    render: function () {

        return (
            <form className="PurchaseDetsForm" onSubmit={this.handleSubmit}>
                <h2>Purchase Details</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Purchase ID</th>
                            <td>
                                <TextInput
                                    value={this.state.purchasedetpurchaseid}
                                    uniqueName="purchasedetpurchaseid"
                                    textArea={false}
                                    required={true}
                                    minCharacters={1}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'purchasedetpurchaseid')}
                                    errorMessage="Purchase ID is invalid"
                                    emptyMessage="Purchase ID is required" />
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
                                <TextInput
                                    value={this.state.purchasedetquantity}
                                    uniqueName="purchasedetquantity"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'purchasedetquantity')}
                                    errorMessage="Quantity is invalid"
                                    emptyMessage="Quantity is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Total</th>
                            <td>
                                <TextInput
                                    value={this.state.purchasedettotal}
                                    uniqueName="purchasedettotal"
                                    textArea={false}
                                    required={true}
                                    minCharacters={1}
                                    validate={this.validateDollars}
                                    onChange={this.setValue.bind(this, 'purchasedettotal')}
                                    errorMessage="Total is invalid"
                                    emptyMessage="Total is required" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Insert Perchase Details" />
               
            </form>
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
                {optionNodes}
            </select>
        );
    }
});

var InputError = React.createClass({
    getInitialState: function () {
        return {
            message: 'Input is invalid'
        };
    },
    render: function () {
        var errorClass = classNames(this.props.className, {
            'error_container': true,
            'visible': this.props.visible,
            'invisible': !this.props.visible
        });

        return (
                <td> {this.props.errorMessage} </td>
        )
    }
});

var TextInput = React.createClass({
    getInitialState: function () {
        return {
            isEmpty: true,
            value: null,
            valid: false,
            errorMessage: "",
            errorVisible: false
        };
    },

    handleChange: function (event) {
        this.validation(event.target.value);

        if (this.props.onChange) {
            this.props.onChange(event);
        }
    },

    validation: function (value, valid) {
        if (typeof valid === 'undefined') {
            valid = true;
        }

        var message = "";
        var errorVisible = false;

        if (!valid) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }
        else if (this.props.required && jQuery.isEmptyObject(value)) {
            message = this.props.emptyMessage;
            valid = false;
            errorVisible = true;
        }
        else if (value.length < this.props.minCharacters) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }

        this.setState({
            value: value,
            isEmpty: jQuery.isEmptyObject(value),
            valid: valid,
            errorMessage: message,
            errorVisible: errorVisible
        });

    },

    handleBlur: function (event) {
        var valid = this.props.validate(event.target.value);
        this.validation(event.target.value, valid);
    },
    render: function () {
        if (this.props.textArea) {
            return (
                <div className={this.props.uniqueName}>
                    <textarea
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        } else {
            return (
                <div className={this.props.uniqueName}>
                    <input
                        name={this.props.uniqueName}
                        id={this.props.uniqueName}
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        }
    }
});

ReactDOM.render(
    <PurchaseDetsBox />,
    document.getElementById('content')
);
