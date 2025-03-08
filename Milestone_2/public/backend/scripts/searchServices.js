var ServicesBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadServicesFromServer: function () {
        $.ajax({
            url: '/getservices/',
            data: {
                'serviceid': serviceid.value,
                'servicename': servicename.value,
                'serviceblocks': serviceblocks.value,
                'serviceprice': serviceprice.value,          
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
        this.loadServicesFromServer();
    },

    render: function () {
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
});

var Servicesform2 = React.createClass({
    getInitialState: function () {
        return {
            serviceid: "",
            servicename: "",
            serviceblocks: "",
            serviceprice: "",
        };
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var serviceid = this.state.serviceid.trim();
        var servicename = this.state.servicename.trim();
        var serviceblocks = this.state.serviceblocks.trim();
        var serviceprice = this.state.serviceprice.trim();

        this.props.onServicesSubmit({ 
            serviceid: serviceid, 
            servicename: servicename, 
            serviceblocks: serviceblocks, 
            serviceprice: serviceprice,
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
                                name="serviceid" 
                                id="serviceid" 
                                value={this.state.serviceid} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Service Name</th>
                            <td>
                                <input 
                                name="servicename" 
                                id="servicename" 
                                value={this.state.servicename} 
                                onChange={this.handleChange}  
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Service Blocks</th>
                            <td>
                                <input 
                                name="serviceblocks" 
                                id="serviceblocks" 
                                value={this.state.serviceblocks} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Service Price</th>
                            <td>
                                <input 
                                name="serviceprice" 
                                id="serviceprice" 
                                value={this.state.serviceprice} 
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

