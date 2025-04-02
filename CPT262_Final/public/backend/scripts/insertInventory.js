var ususer = 0;
var InventoryBox = React.createClass({
    getInitialState: function() {
        return { viewthepage: 0 };
    },
    loadAllowLogin: function () {
        $.ajax({
            url: '/getloggedinback/',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ viewthepage: data });
                ususer = this.state.viewthepage;
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadAllowLogin();
    }, 
    handleInventorySubmit: function (inventory) {
        $.ajax({ 
            url: '/inventory/',
            dataType: 'json',
            type: 'POST',
            data: inventory,
            success: function (data) {
                this.setState({ data: data}); 
            }.bind(this), 
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
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
                <div className="InventoryBox">
                    <h1>Insert Inventory</h1>
                    <Inventoryform2 onInventorySubmit={this.handleInventorySubmit}/>
                </div>
            );
        }
    }
});

var Inventoryform2 = React.createClass({
    getInitialState: function () {
        return {
            kd_inventorylevel: "",
            kd_inventorylastupdated: "",
            kd_productdata: []
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

        var kd_inventorylevel = this.state.kd_inventorylevel.trim();
        var kd_inventorylastupdated = this.state.kd_inventorylastupdated.trim();
        var kd_inventoryproduct = invproduct.value;

        if (isNaN(kd_inventorylevel)) {
            console.log("Inventory Level NaN");
            return;
        }
        if (!kd_inventorylevel || !kd_inventorylastupdated) {
            console.log("Field Missing");
            return;
        }
        this.props.onInventorySubmit({ 
            kd_inventorylevel: kd_inventorylevel,
            kd_inventorylastupdated: kd_inventorylastupdated,
            kd_inventoryproduct: kd_inventoryproduct
        });
    },

    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
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
            <form className="InventoryForm" onSubmit={this.handleSubmit}>
                <h2>Inventory Details</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Level</th>
                            <td>
                                <TextInput
                                    value={this.state.kd_inventorylevel}
                                    uniqueName="kd_inventorylevel"
                                    textArea={false}
                                    required={true}
                                    minCharacters={2}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'kd_inventorylevel')}
                                    errorMessage="Inventory Level is invalid"
                                    emptyMessage="Inventory Level is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Last Inventory Update</th>
                            <td>
                            <input 
                                type = "datetime-local" 
                                name="kd_inventorylastupdated" 
                                id="kd_inventorylastupdated" 
                                value={this.state.kd_inventorylastupdated} 
                                onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                Inventory Product
                            </th>
                            <td>
                                <ProductList data={this.state.kd_productdata} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Insert Inventory" />
               
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
            <select name="invproduct" id="invproduct">
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
    <InventoryBox />,
    document.getElementById('content')
);
