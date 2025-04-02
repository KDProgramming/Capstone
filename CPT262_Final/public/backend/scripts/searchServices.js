var ususer = 0;
var ServicesBox = React.createClass({
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
                    this.loadServicesFromServer();
                }
                ususer = this.state.viewthepage;
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadServicesFromServer: function () {
        $.ajax({
            url: '/getservices/',
            data: {
                'kd_serviceid': kd_serviceid.value,
                'kd_servicename': kd_servicename.value,
                'kd_serviceblocks': kd_serviceblocks.value,
                'kd_serviceprice': kd_serviceprice.value,          
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
        this.loadAllowLogin();
        this.loadServicesFromServer();
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
                    <h1>Services</h1>
                    <Servicesform2 onServicesSubmit={this.loadServicesFromServer} />
                    <br />
                    <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Blocks</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <ServicesList data={this.state.data} />
                        </table>
                    
                </div>
            );
        }
    }
});

var Servicesform2 = React.createClass({
    getInitialState: function () {
        return {
            kd_serviceid: "",
            kd_servicename: "",
            kd_serviceblocks: "",
            kd_serviceprice: "",
        };
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var kd_serviceid = this.state.kd_serviceid.trim();
        var kd_servicename = this.state.kd_servicename.trim();
        var kd_serviceblocks = this.state.kd_serviceblocks.trim();
        var kd_serviceprice = this.state.kd_serviceprice.trim();

        this.props.onServicesSubmit({ 
            kd_serviceid: kd_serviceid, 
            kd_servicename: kd_servicename, 
            kd_serviceblocks: kd_serviceblocks, 
            kd_serviceprice: kd_serviceprice,
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
                <h2>Services</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Service ID</th>
                            <td>
                                <input 
                                type="text" 
                                name="kd_serviceid" 
                                id="kd_serviceid" 
                                value={this.state.kd_serviceid} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Service Name</th>
                            <td>
                                <input 
                                name="kd_servicename" 
                                id="kd_servicename" 
                                value={this.state.kd_servicename} 
                                onChange={this.handleChange}  
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Service Blocks</th>
                            <td>
                                <input 
                                name="kd_serviceblocks" 
                                id="kd_serviceblocks" 
                                value={this.state.kd_serviceblocks} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Service Price</th>
                            <td>
                                <input 
                                name="kd_serviceprice" 
                                id="kd_serviceprice" 
                                value={this.state.kd_serviceprice} 
                                onChange={this.handleChange}  
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Search Services" />

            </form>
        );
    }
});

var ServicesList = React.createClass({
    render: function () {
        var servicesNodes = this.props.data.map(function (services) {
            return (
                <Services
                    key={services.serviceID} // never forget this line!
                    servid={services.serviceID}
                    servname={services.serviceName}
                    servblocks={services.serviceBlocks}
                    servprice={services.servicePrice}
                >
                </Services>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {servicesNodes}
            </tbody>
        );
    }
});



var Services = React.createClass({

    render: function () {
        return (

            <tr>
                            <td>
                                {this.props.servid} 
                            </td>
                            <td>
                                {this.props.servname}
                            </td>
                            <td>
                                {this.props.servblocks}
                            </td>
                            <td>
                                {this.props.servprice}
                            </td>
                </tr>
        );
    }
});

ReactDOM.render(
    <ServicesBox />,
    document.getElementById('content')
);

